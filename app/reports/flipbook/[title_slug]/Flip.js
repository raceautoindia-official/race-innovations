"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import HTMLFlipBook from "react-pageflip";
import { pdfjs, Document, Page as ReactPdfPage } from "react-pdf";
import {
  IoChevronBack,
  IoChevronForward,
  IoDownloadOutline,
  IoLockClosedOutline,
  IoClose,
  IoAddOutline,
  IoRemoveOutline,
  IoSearchOutline,
  IoExpandOutline,
  IoContractOutline,
  IoBookOutline,
  IoDocumentOutline,
  IoGridOutline,
  IoShareSocialOutline,
} from "react-icons/io5";
import { MdOutlineZoomIn } from "react-icons/md";
import { toast } from "react-toastify";
import axios from "axios";
import PageViewTracker from "../../../components/PageViewTracker";
import { s3Url } from "../../../../lib/s3url";
import "./flip.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

// Bundled with the app (the same pdfjs-dist version react-pdf uses) instead
// of being fetched from a CDN at runtime.
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

// Page shape until the PDF itself says otherwise (admin's page_format).
const FORMAT_ASPECT = {
  "a4-portrait": 210 / 297,
  "a4-landscape": 297 / 210,
};
const ZOOM_LEVELS = [1, 1.5, 2, 3, 4];
// Keeps zoomed canvases under iOS Safari's ~16.7 MP canvas limit.
const MAX_CANVAS_PIXELS = 16_000_000;

// Tall, thin chevron of classic flipbook readers (phone layout).
function ThinChevron({ direction }) {
  return (
    <svg viewBox="0 0 24 48" width="24" height="48" aria-hidden="true">
      <path
        d={direction === "left" ? "M19 4 4 24l15 20" : "M5 4l15 20L5 44"}
        fill="none"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

// "|<" / ">|": jump to the first or last page (phone layout).
function EdgeIcon({ direction }) {
  const left = direction === "left";
  return (
    <svg viewBox="0 0 24 24" width="22" height="22" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
        <path d={left ? "M6 5v14" : "M18 5v14"} />
        <path d={left ? "M17 5l-7 7 7 7" : "M7 5l7 7-7 7"} />
      </g>
    </svg>
  );
}

// Phones (either orientation) get the classic flipbook look: the book on
// plain gray with thin arrows in the side margins and a slim page bar.
const isPhone = (vp) => vp.touch && Math.min(vp.w, vp.h) <= 600;

// Picks one page or a two-page spread and sizes the page to fill the space
// between the top and bottom bars.
function computeLayout(vp, aspect, viewMode) {
  if (isPhone(vp)) {
    const bottom = 50 + vp.safeBottom;
    // Nearly edge to edge: when the page fills the width, the arrows sit
    // over its edges instead of taking space beside it.
    const side = 8;
    const availW = Math.max(160, vp.w - side * 2);
    const availH = Math.max(160, vp.h - bottom - 24);
    const fit = (cols) => {
      const w = Math.floor(Math.min(availW / cols, availH * aspect));
      return { w, h: Math.floor(w / aspect) };
    };
    const single = fit(1);
    const double = fit(2);
    // Below this a spread is too small to make out even with zoom at hand.
    const canDouble = double.w >= 110;
    // Two pages side by side after the cover, as on desktop, in either
    // orientation. Readers can switch to one bigger page from the menu.
    const spread = canDouble && viewMode !== "single";
    const page = spread ? double : single;
    return {
      phone: true,
      top: 0,
      bottom,
      side,
      compact: false,
      spread,
      canToggle: canDouble,
      pageW: page.w,
      pageH: page.h,
    };
  }

  const compact = vp.h < 520; // phone in landscape: no top bar
  const top = compact ? 0 : vp.w < 640 ? 48 : 56;
  const bottom = (vp.w < 640 || compact ? 56 : 64) + vp.safeBottom;
  const side = !vp.touch && vp.w >= 900 ? 76 : 8;
  const gap = compact ? 8 : 20;

  const availW = Math.max(160, vp.w - side * 2);
  const availH = Math.max(160, vp.h - top - bottom - gap * 2);
  const fit = (cols) => {
    const w = Math.floor(Math.min(availW / cols, availH * aspect));
    return { w, h: Math.floor(w / aspect) };
  };
  const single = fit(1);
  const double = fit(2);
  const canDouble = double.w >= 220;

  // Like the Humans of EV reader: two pages side by side on a screen wider
  // than tall, even when one page alone could be drawn bigger.
  let spread;
  if (viewMode === "single" || !canDouble) spread = false;
  else if (viewMode === "double") spread = true;
  else spread = vp.w > vp.h || double.w >= single.w * 0.75;

  const page = spread ? double : single;
  return {
    phone: false,
    top,
    bottom,
    side,
    compact,
    spread,
    canToggle: canDouble,
    pageW: page.w,
    pageH: page.h,
  };
}

// Works around page-flip quirks that make single-page (portrait) mode feel
// broken. Patched once per PageFlip instance.
function enhancePageFlip(pf) {
  if (pf.__fbEnhanced) return;
  pf.__fbEnhanced = true;
  const settings = pf.getSettings();

  // disableFlipByClick stops a tap on the page from turning it, but it also
  // blocks page-flip's own flipPrev() in portrait mode, and with it the
  // back button, the left arrow key and swiping back.
  for (const name of ["flipNext", "flipPrev"]) {
    const original = pf[name].bind(pf);
    pf[name] = (corner) => {
      const before = settings.disableFlipByClick;
      settings.disableFlipByClick = false;
      try {
        original(corner);
      } finally {
        settings.disableFlipByClick = before;
      }
    };
  }

  // In portrait mode a dragged page only turns once it crosses the page's
  // far edge; turn it once it has been dragged across half the page.
  const controller = pf.getFlipController();
  const stopMove = controller.stopMove.bind(controller);
  controller.stopMove = function () {
    if (this.calc && pf.getOrientation() === "portrait") {
      const pos = this.calc.getPosition();
      const rect = this.getBoundsRect();
      if (pos.x > 0 && pos.x <= rect.pageWidth * 0.5) {
        const y = this.calc.getCorner() === "bottom" ? rect.height : 0;
        this.animateFlippingTo(pos, { x: -rect.pageWidth, y }, true);
        return;
      }
    }
    stopMove();
  };

  // On touch, page-flip only starts the drag after the swipe timeout and
  // then picks forward/back from where the finger is by then, so a slow
  // drag back could turn forward. Decide from where the finger went down.
  const startUserTouch = pf.startUserTouch.bind(pf);
  pf.startUserTouch = (pos) => {
    pf.__fbTouchStart = pos;
    startUserTouch(pos);
  };
  const fold = controller.fold.bind(controller);
  controller.fold = function (globalPos) {
    const downAt = pf.__fbTouchStart;
    pf.__fbTouchStart = null;
    if (this.calc === null && downAt) fold(downAt);
    fold(globalPos);
  };

  // Count slightly slower flicks as swipes (page-flip's default is 250 ms).
  const ui = pf.getUI();
  if (ui) ui.swipeTimeout = 450;
}

// With a cover, spreads are [0], [1,2], [3,4]... Returns the left page.
function spreadStart(index) {
  if (index <= 0) return 0;
  return index % 2 === 1 ? index : index - 1;
}

function useViewport(safeProbeRef) {
  const [vp, setVp] = useState(null);
  useEffect(() => {
    let timer;
    const read = () =>
      setVp({
        w: window.innerWidth,
        h: window.innerHeight,
        touch: window.matchMedia("(pointer: coarse)").matches,
        safeBottom: safeProbeRef.current?.offsetHeight || 0,
      });
    // Debounced: the flipbook is rebuilt when its size changes.
    const onResize = () => {
      clearTimeout(timer);
      timer = setTimeout(read, 150);
    };
    read();
    window.addEventListener("resize", onResize);
    window.addEventListener("orientationchange", onResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("orientationchange", onResize);
    };
  }, [safeProbeRef]);
  return vp;
}

// Which pages get a canvas. Only pages near the open one are drawn, so a
// 400-page report doesn't render 400 canvases up front.
const RenderWindow = createContext({ from: 0, to: -1, width: 0, dpr: 1, last: 0 });

const BookPage = forwardRef(function BookPage({ index }, ref) {
  const { from, to, width, dpr, last } = useContext(RenderWindow);
  const near = index >= from && index <= to;
  const hard = index === 0 || index === last;
  return (
    <div ref={ref} className="fb-page" data-density={hard ? "hard" : "soft"}>
      <div className="fb-page-inner">
        {near && width > 0 ? (
          <ReactPdfPage
            pageNumber={index + 1}
            width={width}
            devicePixelRatio={dpr}
            renderTextLayer={false}
            renderAnnotationLayer={false}
            loading={<span className="fb-spinner fb-spinner-dark" />}
          />
        ) : null}
      </div>
    </div>
  );
});

function ZoomView({ indices, aspect, vp, level, onLevel, onClose }) {
  const scrollRef = useRef(null);
  const centerRef = useRef(null);
  const cols = indices.length;
  const baseW = Math.max(
    120,
    Math.floor(Math.min((vp.w - 24) / cols - (cols - 1) * 6, (vp.h - 80) * aspect))
  );
  const width = Math.round(baseW * level);
  const height = width / aspect;
  const dpr = Math.max(
    1,
    Math.min(window.devicePixelRatio || 1, Math.sqrt(MAX_CANVAS_PIXELS / (width * height)))
  );

  const changeLevel = (next) => {
    const el = scrollRef.current;
    if (el) {
      centerRef.current = {
        x: (el.scrollLeft + el.clientWidth / 2) / el.scrollWidth,
        y: (el.scrollTop + el.clientHeight / 2) / el.scrollHeight,
      };
    }
    onLevel(next);
  };
  const levelIndex = ZOOM_LEVELS.indexOf(level);

  // Keep the same spot centred after zooming in or out.
  useEffect(() => {
    const el = scrollRef.current;
    const c = centerRef.current;
    if (!el || !c) return;
    requestAnimationFrame(() => {
      el.scrollLeft = c.x * el.scrollWidth - el.clientWidth / 2;
      el.scrollTop = c.y * el.scrollHeight - el.clientHeight / 2;
    });
  }, [level]);

  const label =
    cols > 1 ? `Pages ${indices[0] + 1}–${indices[1] + 1}` : `Page ${indices[0] + 1}`;

  return (
    <div className="fb-zoom" role="dialog" aria-label={`${label}, zoomed`}>
      <div className="fb-zoom-bar">
        <span className="fb-zoom-label">{label}</span>
        <div className="fb-zoom-controls">
          <button
            type="button"
            className="fb-icon-btn"
            onClick={() => changeLevel(ZOOM_LEVELS[levelIndex - 1])}
            disabled={levelIndex <= 0}
            aria-label="Zoom out"
          >
            <IoRemoveOutline />
          </button>
          <span className="fb-zoom-level">{Math.round(level * 100)}%</span>
          <button
            type="button"
            className="fb-icon-btn"
            onClick={() => changeLevel(ZOOM_LEVELS[levelIndex + 1])}
            disabled={levelIndex >= ZOOM_LEVELS.length - 1}
            aria-label="Zoom in"
          >
            <IoAddOutline />
          </button>
          <button
            type="button"
            className="fb-icon-btn"
            onClick={onClose}
            aria-label="Close zoom"
          >
            <IoClose />
          </button>
        </div>
      </div>
      <div className="fb-zoom-scroll" ref={scrollRef}>
        <div className="fb-zoom-pages">
          {indices.map((i) => (
            <ReactPdfPage
              key={i}
              pageNumber={i + 1}
              width={width}
              devicePixelRatio={dpr}
              renderTextLayer={false}
              renderAnnotationLayer
              className="fb-zoom-page"
              loading={
                <div className="fb-zoom-placeholder" style={{ width, height }}>
                  <span className="fb-spinner fb-spinner-dark" />
                </div>
              }
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// Grid of page thumbnails. Only thumbnails near the visible part of the grid
// get a canvas, so a 400-page report stays light.
function ThumbnailSheet({ numPages, activeIndices, aspect, vpW, onPick, onClose }) {
  const scrollRef = useRef(null);
  const firstActive = useRef(activeIndices[0]);
  const [visible, setVisible] = useState(() => new Set());
  const cols = vpW < 520 ? 3 : vpW < 900 ? 4 : 6;
  const gridW = Math.min(vpW, 1100) - 32;
  const thumbW = Math.floor((gridW - (cols - 1) * 14) / cols);
  const thumbH = Math.round(thumbW / aspect);
  const dpr = Math.min(window.devicePixelRatio || 1, 2);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return undefined;
    const io = new IntersectionObserver(
      (entries) =>
        setVisible((prev) => {
          const next = new Set(prev);
          for (const e of entries) {
            const i = Number(e.target.dataset.index);
            if (e.isIntersecting) next.add(i);
            else next.delete(i);
          }
          return next;
        }),
      { root, rootMargin: "400px 0px" }
    );
    root.querySelectorAll("[data-index]").forEach((el) => io.observe(el));
    root
      .querySelector(`[data-index="${firstActive.current}"]`)
      ?.scrollIntoView({ block: "center" });
    return () => io.disconnect();
  }, [numPages]);

  return (
    <div className="fb-thumbs" role="dialog" aria-label="Pages">
      <div className="fb-thumbs-bar">
        <span className="fb-thumbs-title">Pages</span>
        <button type="button" className="fb-icon-btn" onClick={onClose} aria-label="Close pages">
          <IoClose />
        </button>
      </div>
      <div className="fb-thumbs-scroll" ref={scrollRef}>
        <div
          className="fb-thumbs-grid"
          style={{ gridTemplateColumns: `repeat(${cols}, ${thumbW}px)` }}
        >
          {Array.from({ length: numPages }, (_, i) => (
            <button
              key={i}
              type="button"
              data-index={i}
              className={`fb-thumb ${activeIndices.includes(i) ? "is-current" : ""}`}
              onClick={() => onPick(i)}
              aria-label={`Page ${i + 1}`}
            >
              <span className="fb-thumb-page" style={{ width: thumbW, height: thumbH }}>
                {visible.has(i) ? (
                  <ReactPdfPage
                    pageNumber={i + 1}
                    width={thumbW}
                    devicePixelRatio={dpr}
                    renderTextLayer={false}
                    renderAnnotationLayer={false}
                    loading={null}
                  />
                ) : null}
              </span>
              <span className="fb-thumb-num">{i + 1}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function Flip() {
  const { title_slug } = useParams();

  const [pdfUrl, setPdfUrl] = useState("");
  const [title, setTitle] = useState("");
  const [showDownload, setShowDownload] = useState(false);
  const [fallbackAspect, setFallbackAspect] = useState(FORMAT_ASPECT["a4-landscape"]);
  const [notFound, setNotFound] = useState(false);

  const [numPages, setNumPages] = useState(0);
  const [aspect, setAspect] = useState(null);
  const [loadPercent, setLoadPercent] = useState(0);
  const [loadError, setLoadError] = useState(false);

  const [currentIndex, setCurrentIndex] = useState(0);
  const currentIndexRef = useRef(0);
  const [sliderDraft, setSliderDraft] = useState(null);
  const [viewMode, setViewMode] = useState("auto");
  const [zoomOpen, setZoomOpen] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(2);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [canFullscreen, setCanFullscreen] = useState(false);
  const [thumbsOpen, setThumbsOpen] = useState(false);
  // Phone layout: the "•••" menu, and the page number turned into an input.
  const [moreOpen, setMoreOpen] = useState(false);
  const [pageInput, setPageInput] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isVerifyPassword, setIsVerifyPassword] = useState(false);
  // "" when idle, otherwise the button label while the PDF is being fetched.
  const [downloadProgress, setDownloadProgress] = useState("");

  const book = useRef(null);
  const shellRef = useRef(null);
  const safeProbeRef = useRef(null);
  const tapRef = useRef({ x: 0, y: 0, at: 0, last: 0 });
  const vp = useViewport(safeProbeRef);

  useEffect(() => {
    const fetchFlipbook = async () => {
      try {
        const res = await axios.get(`/api/flipbook/${title_slug}`);
        const data = res.data?.[0];

        if (!data || !data.content) {
          setNotFound(true);
          return;
        }

        setPdfUrl(s3Url(data.content));
        setTitle(data.title || "");
        setShowDownload(data.download !== 0);
        setFallbackAspect(
          FORMAT_ASPECT[data.page_format] || FORMAT_ASPECT["a4-landscape"]
        );
      } catch (err) {
        console.error("Error fetching flipbook data:", err);
        setNotFound(true);
      }
    };

    if (title_slug) fetchFlipbook();
  }, [title_slug]);

  // While the reader is open: no page scrolling behind it, and no browser
  // swipe-to-go-back/forward, which a page-turn swipe near the screen edge
  // would otherwise trigger.
  useEffect(() => {
    const html = document.documentElement;
    const body = document.body;
    const saved = [html.style.overscrollBehavior, body.style.overscrollBehavior, body.style.overflow];
    html.style.overscrollBehavior = "none";
    body.style.overscrollBehavior = "none";
    body.style.overflow = "hidden";
    return () => {
      [html.style.overscrollBehavior, body.style.overscrollBehavior, body.style.overflow] = saved;
    };
  }, []);

  useEffect(() => {
    setCanFullscreen(!!document.fullscreenEnabled);
    const onChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener("fullscreenchange", onChange);
    return () => document.removeEventListener("fullscreenchange", onChange);
  }, []);

  const pageAspect = aspect || fallbackAspect;
  const layout = useMemo(
    () => (vp ? computeLayout(vp, pageAspect, viewMode) : null),
    [vp, pageAspect, viewMode]
  );
  const spread = !!layout?.spread;
  const lastIndex = Math.max(0, numPages - 1);
  const start = spread ? spreadStart(currentIndex) : currentIndex;
  const atStart = start <= 0;
  const atEnd = spread ? start + (start === 0 ? 1 : 2) > lastIndex : start >= lastIndex;

  const visibleIndices = useMemo(() => {
    if (!spread) return [currentIndex];
    if (start === 0) return [0];
    return start + 1 <= lastIndex ? [start, start + 1] : [start];
  }, [spread, start, currentIndex, lastIndex]);

  const pageLabel = numPages
    ? visibleIndices.length > 1
      ? `${visibleIndices[0] + 1}–${visibleIndices[1] + 1}`
      : `${visibleIndices[0] + 1}`
    : "";

  // The cover (and a lone back page) sits on one half of the spread, so
  // slide the book to keep whatever is showing centred.
  let bookShift = 0;
  if (spread && layout) {
    if (start === 0) bookShift = -layout.pageW / 2;
    else if (start === lastIndex && numPages % 2 === 0) bookShift = layout.pageW / 2;
  }

  const renderWindow = useMemo(
    () => ({
      from: Math.max(0, start - 2),
      to: Math.min(lastIndex, start + 3),
      width: layout?.pageW || 0,
      dpr: typeof window === "undefined" ? 1 : Math.min(window.devicePixelRatio || 1, 2),
      last: lastIndex,
    }),
    [start, lastIndex, layout?.pageW]
  );

  const bookKey = layout
    ? `${spread ? "d" : "s"}-${layout.pageW}-${layout.pageH}-${numPages}`
    : "";

  // react-pageflip never tears down its PageFlip instance: it keeps window
  // listeners and an endless requestAnimationFrame loop. Stop both once the
  // book has been rebuilt for a new size, or they pile up on every resize.
  // Only when its element is really gone: React's dev double-mount check runs
  // this cleanup on a book that is still on screen.
  useEffect(() => {
    const handle = book.current;
    // The PageFlip instance is created a render after the book mounts.
    let frame;
    const enhance = () => {
      const pf = handle?.pageFlip?.();
      if (pf) enhancePageFlip(pf);
      else if (handle) frame = requestAnimationFrame(enhance);
    };
    enhance();
    return () => {
      cancelAnimationFrame(frame);
      const pf = handle?.pageFlip?.();
      if (!pf || pf.block?.isConnected) return;
      pf.getUI?.()?.removeHandlers?.();
      const render = pf.getRender?.();
      if (render) render.render = () => {};
    };
  }, [bookKey]);

  const pages = useMemo(
    () => Array.from({ length: numPages }, (_, i) => <BookPage key={i} index={i} />),
    [numPages]
  );

  const onFlip = useCallback((e) => {
    currentIndexRef.current = e.data;
    setCurrentIndex(e.data);
  }, []);

  const pageFlip = () => book.current?.pageFlip?.();
  const nextPage = useCallback(() => book.current?.pageFlip?.()?.flipNext(), []);
  const prevPage = useCallback(() => book.current?.pageFlip?.()?.flipPrev(), []);
  const goToIndex = (index) => {
    const target = Math.min(Math.max(0, index), lastIndex);
    pageFlip()?.turnToPage(target);
    currentIndexRef.current = target;
    setCurrentIndex(target);
  };

  const commitSlider = () => {
    if (sliderDraft === null) return;
    goToIndex(sliderDraft - 1);
    setSliderDraft(null);
  };

  const openZoom = useCallback(() => {
    if (!numPages) return;
    setZoomLevel(window.innerWidth < 768 ? 2 : 1.5);
    setZoomOpen(true);
  }, [numPages]);

  const toggleFullscreen = () => {
    if (document.fullscreenElement) document.exitFullscreen?.();
    else document.documentElement.requestFullscreen?.().catch(() => {});
  };

  // Double-tap (touch) or double-click opens the zoom view.
  // Zoom and thumbnails are portalled out of the stage, but React still
  // bubbles their events through it.
  const fromOverlay = (e) => !!e.target.closest?.(".fb-zoom, .fb-thumbs");
  const onStageDoubleClick = (e) => {
    if (!fromOverlay(e)) openZoom();
  };
  const onStageTouchStart = (e) => {
    if (e.touches.length !== 1 || fromOverlay(e)) return;
    const t = e.touches[0];
    tapRef.current = { ...tapRef.current, x: t.clientX, y: t.clientY, at: Date.now() };
  };
  const onStageTouchEnd = (e) => {
    if (fromOverlay(e)) return;
    const t = e.changedTouches[0];
    const tap = tapRef.current;
    const moved = Math.hypot(t.clientX - tap.x, t.clientY - tap.y);
    const now = Date.now();
    if (moved > 12 || now - tap.at > 300) return;
    if (now - tap.last < 320) {
      tapRef.current.last = 0;
      openZoom();
    } else {
      tapRef.current.last = now;
    }
  };

  const sharePage = async () => {
    const url = window.location.href;
    try {
      if (navigator.share) {
        await navigator.share({ title: title || "RACE Innovations", url });
      } else {
        await navigator.clipboard.writeText(url);
        toast.success("Link copied");
      }
    } catch (err) {
      if (err?.name !== "AbortError") toast.error("Couldn't share this link");
    }
  };

  const submitPageInput = (e) => {
    e.preventDefault();
    const n = parseInt(pageInput, 10);
    if (n >= 1 && n <= numPages) goToIndex(n - 1);
    setPageInput(null);
  };

  const openModal = () => {
    setPassword("");
    setPasswordError("");
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setPassword("");
    setPasswordError("");
    setIsModalOpen(false);
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.target instanceof HTMLInputElement && e.target.type !== "range") return;
      if (e.key === "Escape") {
        if (zoomOpen) setZoomOpen(false);
        else if (thumbsOpen) setThumbsOpen(false);
        else if (isModalOpen) closeModal();
        return;
      }
      if (zoomOpen || thumbsOpen || isModalOpen) return;
      if (e.key === "ArrowRight") nextPage();
      if (e.key === "ArrowLeft") prevPage();
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [zoomOpen, thumbsOpen, isModalOpen, nextPage, prevPage]);

  const onDocumentLoadSuccess = (pdf) => {
    setNumPages(pdf.numPages);
    pdf
      .getPage(1)
      .then((page) => {
        const v = page.getViewport({ scale: 1 });
        setAspect(v.width / v.height);
      })
      .catch(() => setAspect(fallbackAspect));
  };

  const handlePasswordSubmit = async () => {
    try {
      const response = await axios.post("/api/flipbook/verify-password", {
        title_slug,
        password,
      });

      if (response.status === 201) {
        setIsVerifyPassword(true);
        toast.success("Password verified successfully");
        closeModal();
      } else {
        setPasswordError("Incorrect password, please try again.");
      }
    } catch (error) {
      console.error("Password verification error:", error);
      setPasswordError("Incorrect password, please try again.");
    }
  };

  // Downloads the uploaded PDF as-is. (It used to re-render every page as an
  // image, which produced ~500 MB files for 400+ page reports and never
  // finished.) Fetched as a blob because <a download> is ignored for
  // cross-origin S3 URLs and would just open the PDF in a tab.
  const downloadPdf = async () => {
    setDownloadProgress("Preparing...");
    try {
      // no-store: the viewer has already cached parts of this file via range
      // requests, and Chrome's cache can refuse a full read of such an entry
      // (net::ERR_CACHE_OPERATION_NOT_SUPPORTED).
      const res = await fetch(pdfUrl, { cache: "no-store" });
      if (!res.ok || !res.body) throw new Error(`HTTP ${res.status}`);

      const total = Number(res.headers.get("Content-Length")) || 0;
      const reader = res.body.getReader();
      const chunks = [];
      let received = 0;
      let lastPercent = -1;
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        const percent = total ? Math.floor((received / total) * 100) : -1;
        if (percent !== lastPercent) {
          lastPercent = percent;
          setDownloadProgress(`Downloading ${percent}%`);
        }
      }

      const blob = new Blob(chunks, { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = `${title_slug || "flipbook"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // Revoking straight after click() cancels the download in Safari
      // (WebKitBlobResource error), so give the browser time to read the blob.
      setTimeout(() => URL.revokeObjectURL(url), 60000);

      toast.success("PDF downloaded successfully");
    } catch (err) {
      console.error("PDF download error:", err);
      toast.error("Failed to download PDF");
    } finally {
      setDownloadProgress("");
    }
  };

  useEffect(() => {
    if (isVerifyPassword && showDownload && pdfUrl) {
      downloadPdf();
      setIsVerifyPassword(false);
    }
  }, [isVerifyPassword, showDownload, pdfUrl]);

  const ready = !!(layout && numPages && aspect);
  const sliderValue = sliderDraft ?? start + 1;
  const phone = !!layout?.phone;
  const counterText = numPages ? `${sliderDraft ?? pageLabel}/${numPages}` : "–";

  const slider = (className) => (
    <input
      type="range"
      className={className}
      min={1}
      max={Math.max(1, numPages)}
      value={sliderValue}
      disabled={!ready || numPages < 2}
      onChange={(e) => setSliderDraft(Number(e.target.value))}
      onPointerUp={commitSlider}
      onTouchEnd={commitSlider}
      onKeyUp={commitSlider}
      onBlur={commitSlider}
      aria-label="Go to page"
      style={{
        "--fb-progress": `${numPages > 1 ? ((sliderValue - 1) / (numPages - 1)) * 100 : 0}%`,
      }}
    />
  );

  return (
    <div
      ref={shellRef}
      className={`fb-shell${phone ? " fb-phone" : ""}${vp?.touch ? " fb-touch" : ""}`}
    >
      {title_slug ? (
        <PageViewTracker contentType="flipbook" slug={String(title_slug)} />
      ) : null}
      <div ref={safeProbeRef} className="fb-safe-probe" aria-hidden="true" />

      {layout && !layout.compact && !phone ? (
        <header className="fb-topbar" style={{ height: layout.top }}>
          <Link href="/" className="fb-brand" aria-label="RACE Innovations home">
            <Image
              src="/images/logo_v2.png"
              alt="RACE Innovations"
              width={150}
              height={28}
              priority
            />
          </Link>
          <h1 className="fb-title" title={title}>
            {title}
          </h1>
        </header>
      ) : null}

      <main
        className="fb-stage"
        style={layout ? { top: layout.top, bottom: layout.bottom } : undefined}
        onDoubleClick={onStageDoubleClick}
        onTouchStart={onStageTouchStart}
        onTouchEnd={onStageTouchEnd}
      >
        {pdfUrl ? (
          <Document
            file={pdfUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            onLoadProgress={({ loaded, total }) =>
              total && setLoadPercent(Math.min(99, Math.round((loaded / total) * 100)))
            }
            onLoadError={(err) => {
              console.error("Flipbook load error:", err);
              setLoadError(true);
            }}
            loading={null}
            error={null}
            className="fb-document"
          >
            {ready ? (
              <RenderWindow.Provider value={renderWindow}>
                <div
                  className={`fb-book${spread ? "" : " is-single"}`}
                  style={{
                    width: spread ? layout.pageW * 2 : layout.pageW,
                    height: layout.pageH,
                    transform: `translateX(${bookShift}px)`,
                  }}
                >
                  <HTMLFlipBook
                    key={bookKey}
                    ref={book}
                    width={layout.pageW}
                    height={layout.pageH}
                    minWidth={layout.pageW}
                    maxWidth={layout.pageW}
                    minHeight={layout.pageH}
                    maxHeight={layout.pageH}
                    size="fixed"
                    usePortrait={!spread}
                    showCover={true}
                    startPage={currentIndexRef.current}
                    drawShadow={true}
                    maxShadowOpacity={0.3}
                    flippingTime={700}
                    mobileScrollSupport={false}
                    useMouseEvents={true}
                    swipeDistance={30}
                    showPageCorners={!vp.touch}
                    disableFlipByClick={true}
                    clickEventForward={true}
                    startZIndex={0}
                    autoSize={false}
                    renderOnlyPageLengthChange={true}
                    onFlip={onFlip}
                    className="fb-flipbook"
                  >
                    {pages}
                  </HTMLFlipBook>
                </div>
              </RenderWindow.Provider>
            ) : null}

            {/* Portalled out of the stage so its touch-action: none doesn't
                block scrolling and pinch-zoom inside these views. */}
            {zoomOpen && ready && shellRef.current
              ? createPortal(
                  <ZoomView
                    indices={visibleIndices}
                    aspect={pageAspect}
                    vp={vp}
                    level={zoomLevel}
                    onLevel={setZoomLevel}
                    onClose={() => setZoomOpen(false)}
                  />,
                  shellRef.current
                )
              : null}

            {thumbsOpen && ready && shellRef.current
              ? createPortal(
                  <ThumbnailSheet
                    numPages={numPages}
                    activeIndices={visibleIndices}
                    aspect={pageAspect}
                    vpW={vp.w}
                    onPick={(i) => {
                      goToIndex(i);
                      setThumbsOpen(false);
                    }}
                    onClose={() => setThumbsOpen(false)}
                  />,
                  shellRef.current
                )
              : null}
          </Document>
        ) : null}


        {!ready && !loadError && !notFound ? (
          <div className="fb-status">
            <span className="fb-spinner" />
            <span>{loadPercent > 0 ? `Loading ${loadPercent}%` : "Loading flipbook…"}</span>
          </div>
        ) : null}
        {loadError || notFound ? (
          <div className="fb-status">
            <span>
              {notFound
                ? "This flipbook isn't available."
                : "Couldn't load this flipbook. Please check your connection."}
            </span>
            {loadError ? (
              <button
                type="button"
                className="fb-text-btn"
                onClick={() => window.location.reload()}
              >
                Try again
              </button>
            ) : null}
          </div>
        ) : null}

        {ready && phone ? (
          <>
            {!atStart ? (
              <button
                type="button"
                className="fbp-arrow fbp-arrow-left"
                onClick={prevPage}
                aria-label="Previous page"
              >
                <ThinChevron direction="left" />
              </button>
            ) : null}
            {!atEnd ? (
              <button
                type="button"
                className="fbp-arrow fbp-arrow-right"
                onClick={nextPage}
                aria-label="Next page"
              >
                <ThinChevron direction="right" />
              </button>
            ) : null}
            {!atStart ? (
              <button
                type="button"
                className="fbp-jump fbp-jump-left"
                onClick={() => goToIndex(0)}
                aria-label="First page"
              >
                <EdgeIcon direction="left" />
              </button>
            ) : null}
            {!atEnd ? (
              <button
                type="button"
                className="fbp-jump fbp-jump-right"
                onClick={() => goToIndex(lastIndex)}
                aria-label="Last page"
              >
                <EdgeIcon direction="right" />
              </button>
            ) : null}
          </>
        ) : null}

        {ready && !phone && layout.side > 8 ? (
          <>
            <button
              type="button"
              className="fb-side-btn fb-side-btn-left"
              onClick={prevPage}
              disabled={atStart}
              aria-label="Previous page"
            >
              <IoChevronBack />
            </button>
            <button
              type="button"
              className="fb-side-btn fb-side-btn-right"
              onClick={nextPage}
              disabled={atEnd}
              aria-label="Next page"
            >
              <IoChevronForward />
            </button>
          </>
        ) : null}
      </main>

      {phone ? (
        <nav
          className="fbp-bar"
          style={{ height: layout.bottom }}
          aria-label="Flipbook controls"
        >
          {pageInput === null ? (
            <button
              type="button"
              className="fbp-page"
              onClick={() => setPageInput("")}
              disabled={!ready}
              aria-label={`Page ${counterText}. Go to page`}
            >
              {counterText}
            </button>
          ) : (
            <form className="fbp-page fbp-page-edit" onSubmit={submitPageInput}>
              <input
                autoFocus
                inputMode="numeric"
                pattern="[0-9]*"
                value={pageInput}
                onChange={(e) => setPageInput(e.target.value.replace(/\D/g, ""))}
                onBlur={() => setPageInput(null)}
                placeholder={`1–${numPages}`}
                aria-label="Page number"
              />
            </form>
          )}

          {slider("fbp-slider")}

          <button
            type="button"
            className="fbp-more"
            onClick={() => setMoreOpen((open) => !open)}
            disabled={!ready}
            aria-label="More options"
            aria-expanded={moreOpen}
          >
            <span />
            <span />
            <span />
          </button>

          {downloadProgress ? <div className="fbp-progress">{downloadProgress}</div> : null}
        </nav>
      ) : null}

      {phone && moreOpen ? (
        <>
          <div className="fbp-menu-backdrop" onClick={() => setMoreOpen(false)} />
          <div className="fbp-menu" role="menu" style={{ bottom: layout.bottom + 6 }}>
            {[
              { label: "Pages", icon: <IoGridOutline />, run: () => setThumbsOpen(true) },
              { label: "Zoom", icon: <MdOutlineZoomIn />, run: openZoom },
              layout.canToggle
                ? spread
                  ? { label: "Single page", icon: <IoDocumentOutline />, run: () => setViewMode("single") }
                  : { label: "Two pages", icon: <IoBookOutline />, run: () => setViewMode("double") }
                : null,
              showDownload
                ? {
                    label: downloadProgress || "Download PDF",
                    icon: <IoDownloadOutline />,
                    run: openModal,
                    disabled: !!downloadProgress,
                  }
                : { label: "Download locked", icon: <IoLockClosedOutline />, disabled: true },
              { label: "Share", icon: <IoShareSocialOutline />, run: sharePage },
              canFullscreen
                ? {
                    label: isFullscreen ? "Exit full screen" : "Full screen",
                    icon: isFullscreen ? <IoContractOutline /> : <IoExpandOutline />,
                    run: toggleFullscreen,
                  }
                : null,
            ]
              .filter(Boolean)
              .map((item) => (
                <button
                  key={item.label}
                  type="button"
                  role="menuitem"
                  className="fbp-menu-item"
                  disabled={item.disabled}
                  onClick={() => {
                    setMoreOpen(false);
                    item.run?.();
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
          </div>
        </>
      ) : null}

      {!phone ? (
      <nav
        className="fb-toolbar"
        style={layout ? { height: layout.bottom } : undefined}
        aria-label="Flipbook controls"
      >
        <div className="fb-toolbar-inner">
          <button
            type="button"
            className="fb-icon-btn"
            onClick={prevPage}
            disabled={!ready || atStart}
            aria-label="Previous page"
          >
            <IoChevronBack />
          </button>

          <span className="fb-counter" aria-live="polite">
            {numPages ? `${sliderDraft ?? pageLabel} / ${numPages}` : "– / –"}
          </span>

          {slider("fb-slider")}

          <button
            type="button"
            className="fb-icon-btn"
            onClick={nextPage}
            disabled={!ready || atEnd}
            aria-label="Next page"
          >
            <IoChevronForward />
          </button>

          <span className="fb-toolbar-divider" />

          <button
            type="button"
            className="fb-icon-btn"
            onClick={openZoom}
            disabled={!ready}
            aria-label="Zoom"
            title="Zoom (or double-tap the page)"
          >
            <IoSearchOutline />
          </button>

          <button
            type="button"
            className="fb-icon-btn"
            onClick={() => setThumbsOpen(true)}
            disabled={!ready}
            aria-label="Pages"
            title="Pages"
          >
            <IoGridOutline />
          </button>

          {layout?.canToggle ? (
            <button
              type="button"
              className="fb-icon-btn fb-hide-xs"
              onClick={() => setViewMode(spread ? "single" : "double")}
              disabled={!ready}
              aria-label={spread ? "Show one page" : "Show two pages"}
              title={spread ? "Show one page" : "Show two pages"}
            >
              {spread ? <IoDocumentOutline /> : <IoBookOutline />}
            </button>
          ) : null}

          {canFullscreen ? (
            <button
              type="button"
              className="fb-icon-btn fb-hide-xs"
              onClick={toggleFullscreen}
              aria-label={isFullscreen ? "Exit full screen" : "Full screen"}
              title={isFullscreen ? "Exit full screen" : "Full screen"}
            >
              {isFullscreen ? <IoContractOutline /> : <IoExpandOutline />}
            </button>
          ) : null}

          {showDownload ? (
            <button
              type="button"
              onClick={openModal}
              className={`fb-download-btn ${downloadProgress ? "disabled" : ""}`}
              disabled={!!downloadProgress}
              title="Download PDF"
            >
              <IoDownloadOutline />
              <span className="fb-download-label">{downloadProgress || "Download"}</span>
            </button>
          ) : (
            <button
              type="button"
              className="fb-download-btn disabled"
              disabled
              title="Download locked"
            >
              <IoLockClosedOutline />
              <span className="fb-download-label">Locked</span>
            </button>
          )}
        </div>
      </nav>
      ) : null}

      {isModalOpen && (
        <div className="flipbook-modal-overlay" onClick={closeModal}>
          <div className="flipbook-modal" onClick={(e) => e.stopPropagation()}>
            <button
              className="flipbook-modal-close"
              onClick={closeModal}
              type="button"
              aria-label="Close"
            >
              <IoClose />
            </button>

            <div className="flipbook-modal-header">
              <div className="flipbook-modal-icon">
                <IoLockClosedOutline />
              </div>
              <h2>Enter Password</h2>
              <p>Enter the download password to access this PDF.</p>
            </div>

            <div className="flipbook-modal-body">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handlePasswordSubmit()}
                placeholder="Enter password"
                className="flipbook-password-input"
                autoFocus
              />

              {passwordError ? (
                <p className="flipbook-password-error">{passwordError}</p>
              ) : null}

              <div className="flipbook-modal-actions">
                <button
                  className="flipbook-secondary-btn"
                  onClick={closeModal}
                  type="button"
                >
                  Cancel
                </button>
                <button
                  className="flipbook-primary-btn"
                  onClick={handlePasswordSubmit}
                  type="button"
                >
                  Verify & Download
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
