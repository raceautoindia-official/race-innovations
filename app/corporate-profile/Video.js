"use client";

import React, { useState } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { IoMdDownload } from "react-icons/io";
import { FaArrowLeft, FaArrowRight } from "react-icons/fa";
import "react-pdf/dist/Page/TextLayer.css";
import "react-pdf/dist/Page/AnnotationLayer.css";
import "./video.css"; 
import 'core-js/full/promise/with-resolvers';

// Set PDF worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const StaticPDFViewer = () => {
  const [numPages, setNumPages] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const pdfUrl = "/pdf/corporate.pdf";

  const onDocumentLoadSuccess = ({ numPages }) => {
    setNumPages(numPages);
    setPageNumber(1);
  };

  // Show two pages at a time: pageNumber (even or odd) and pageNumber + 1
  const renderPages = () => {
    const secondPage = pageNumber + 1 <= numPages ? pageNumber + 1 : null;

    return (
      <div className="d-flex justify-content-center mt-5 flex-wrap gap-3">
        <Page
          pageNumber={pageNumber}
          width={600}
          renderTextLayer={false}
          renderAnnotationLayer={false}
        />
        {secondPage && (
          <Page
            pageNumber={secondPage}
            width={600}
            renderTextLayer={false}
            renderAnnotationLayer={false}
          />
        )}
      </div>
    );
  };

  const goPrev = () => {
    setPageNumber((prev) => Math.max(1, prev - 2));
  };

  const goNext = () => {
    setPageNumber((prev) =>
      prev + 2 <= numPages ? prev + 2 : prev
    );
  };

  return (
    <div className="text-center mt-4">
      <Document file={pdfUrl} onLoadSuccess={onDocumentLoadSuccess}>
        {renderPages()}
      </Document>

      <div className="d-flex justify-content-center align-items-center gap-4 mt-4">
        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={goPrev}
          disabled={pageNumber <= 1}
        >
          <FaArrowLeft /> Previous
        </button>

        <span className="fw-bold">
          Pages {pageNumber}
          {pageNumber + 1 <= numPages ? ` - ${pageNumber + 1}` : ""}
          {" "}of {numPages}
        </span>

        <button
          className="btn btn-primary d-flex align-items-center gap-2"
          onClick={goNext}
          disabled={pageNumber + 1 >= numPages}
        >
          Next <FaArrowRight />
        </button>

        <a
          href={pdfUrl}
          download
          title="Download PDF"
          className="btn btn-outline-secondary d-flex align-items-center gap-2"
        >
          <IoMdDownload size={20} />
          Download
        </a>
      </div>
    </div>
  );
};

export default StaticPDFViewer;
