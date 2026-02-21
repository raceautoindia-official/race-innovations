"use client";
import { useParams, useRouter } from "next/navigation";
import { forwardRef, useState, useRef, useEffect } from "react";
import HTMLFlipBook from "react-pageflip";
import { pdfjs, Document, Page as ReactPdfPage } from "react-pdf";
import { IoMdDownload } from "react-icons/io";
import { PDFDocument } from "pdf-lib";
import { toast } from "react-toastify";
import axios from "axios";
import "./flip.css";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const Page = forwardRef(({ pageNumber, width, isProblematic }, ref) => {
  return (
    <div
      ref={ref}
      className="page"
      style={{
        transform: isProblematic ? "scale(1.1)" : "scale(1)",
        transformOrigin: "top center",
        padding: isProblematic ? "20px" : "0",
      }}
    >
      <ReactPdfPage pageNumber={pageNumber} width={width} />
    </div>
  );
});
Page.displayName = "Page";

const Flip = () => {
  const router = useRouter();
  const { title_slug } = useParams();

  const [pdf_url, setPdf_url] = useState("");
  const [numPages, setNumPages] = useState(null);
  const [isReady, setIsReady] = useState(false);
  const [showDownload, setShowDownload] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [password, setPassword] = useState("");
  const [page_format, SetPageFormat] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [isVerifyPassword, setIsVerifyPassword] = useState(false);
  const book = useRef();

  const A4_FORMATS = {
    "a4-portrait": { width: 500, height: 650 },
    "a4-landscape": { width: 620, height: 580 },
  };

  const formatSize = A4_FORMATS[page_format] || A4_FORMATS["a4-landscape"];
  const flipWidth = formatSize.width;
  const flipHeight = formatSize.height;

  const pdfData = async () => {
    try {
      const res = await axios.get(`/api/flipbook/${title_slug}`);
      const data = res.data[0];
      const fullUrl = `${process.env.NEXT_PUBLIC_S3_BUCKET_URL}${data.content}`;
      console.log("PDF URL:", fullUrl);
      setPdf_url(fullUrl);
      setShowDownload(data.download !== 0);
      SetPageFormat(data.page_format || "a4-landscape");
    } catch (err) {
      console.log("Error fetching flipbook data:", err);
    }
  };

  useEffect(() => {
    pdfData();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "ArrowRight") nextPage();
      if (e.key === "ArrowLeft") prevPage();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const nextPage = () => book.current?.pageFlip()?.flipNext();
  const prevPage = () => book.current?.pageFlip()?.flipPrev();

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setIsReady(true);
  };

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setPassword("");
    setPasswordError("");
    setIsModalOpen(false);
  };

  const handlePasswordSubmit = async () => {
    try {
      const response = await axios.post("/api/flipbook/verify-password", {
        title_slug,
        password,
      });

      if (response.status === 201) {
        setIsVerifyPassword(true);
        toast.success("Password verified successfully!");
        closeModal();
      } else if (response.status === 401) {
        toast.error("Invalid password");
        setPasswordError("Incorrect password, please try again.");
      }
    } catch (error) {
      console.error("Password check error:", error);
      toast.error("An error occurred. Please try again.");
    }
  };

  const flattenPdf = async () => {
    try {
      const loadingTask = pdfjs.getDocument(pdf_url);
      const pdf = await loadingTask.promise;

      const pdfDoc = await PDFDocument.create();

      for (let i = 1; i <= pdf.numPages; i++) {
        const page = await pdf.getPage(i);
        const viewport = page.getViewport({ scale: 2 });

        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");
        canvas.width = viewport.width;
        canvas.height = viewport.height;

        await page.render({ canvasContext: context, viewport }).promise;

        const imageDataUrl = canvas.toDataURL("image/jpeg", 1.0);
        const imageBytes = await fetch(imageDataUrl).then((res) =>
          res.arrayBuffer()
        );

        const embeddedImage = await pdfDoc.embedJpg(imageBytes);
        const newPage = pdfDoc.addPage([viewport.width, viewport.height]);
        newPage.drawImage(embeddedImage, {
          x: 0,
          y: 0,
          width: viewport.width,
          height: viewport.height,
        });
      }

      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "flattened_image_pdf.pdf";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      toast.success("Flattened PDF downloaded!");
    } catch (err) {
      console.error("Flatten error:", err);
      toast.error("Failed to flatten PDF.");
    }
  };

  useEffect(() => {
    if (isVerifyPassword && showDownload && pdf_url) {
      flattenPdf();
      setIsVerifyPassword(false);

    }
  }, [isVerifyPassword, showDownload, pdf_url]);

  return (
    <div className="flip-container pt-5">
      <Document file={pdf_url} onLoadSuccess={onDocumentLoadSuccess}>
        {isReady && numPages && (
          <HTMLFlipBook
            key={page_format}
            ref={book}
            showCover={false}
            width={flipWidth}
            height={flipHeight}
            drawShadow={false}
            maxShadowOpacity={0}
            thickness={0}
            mobileScrollSupport={true}
            style={{ margin: "80px auto 0", overflow: "hidden" }}
          >
            {Array.from({ length: numPages }, (_, i) => {
              const pageNumber = i + 1;
              const isProblematic = pageNumber === 2;
              return (
                <Page
                  key={i}
                  pageNumber={pageNumber}
                  width={flipWidth}
                  isProblematic={isProblematic}
                />
              );
            })}
          </HTMLFlipBook>
        )}
      </Document>

      <div className="nav-controls">
        <button onClick={prevPage} className="nav-btn">❮</button>
        <button onClick={nextPage} className="nav-btn">❯</button>

        {showDownload && isVerifyPassword ? (
          <a href={pdf_url} download title="Download PDF">
            <IoMdDownload size={28} className="nav-btn" />
          </a>
        ) : (
          <a onClick={openModal} style={{ cursor: "pointer" }} title="Enter Password to Download">
            <IoMdDownload size={28} className="nav-btn" />
          </a>
        )}
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Enter Password to Download</h2>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
            />
            {passwordError && <p className="error">{passwordError}</p>}
            <button onClick={handlePasswordSubmit}>Submit</button>
            <button onClick={closeModal}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Flip;
