"use client";

import React, { forwardRef } from "react";
import { Editor } from "@tinymce/tinymce-react";

const ExactEditor = forwardRef(function ExactEditor(
  { value = "", onChange },
  ref
) {
  const apiKey = process.env.NEXT_PUBLIC_TINYMCE;

  return (
    <Editor
      apiKey={apiKey}
      onInit={(_, editor) => {
        if (typeof ref === "function") {
          ref(editor);
        } else if (ref) {
          ref.current = editor;
        }
      }}
      value={value}
      onEditorChange={(content) => onChange?.(content)}
      init={{
        height: 520,
        menubar: true,
        branding: false,
        promotion: false,
        plugins: "image link lists table code fullscreen",
        toolbar:
          "undo redo | bold italic | bullist numlist | link image table | code fullscreen",

        automatic_uploads: true,
        paste_data_images: true,
        images_upload_tab: true,
        images_file_types: "jpg,jpeg,png,webp,gif",

        images_upload_handler: async (blobInfo) => {
          try {
            const fd = new FormData();
            fd.append("file", blobInfo.blob(), blobInfo.filename());

            const res = await fetch("/api/upload", {
              method: "POST",
              body: fd,
            });

            const ct = res.headers.get("content-type") || "";
            if (!ct.includes("application/json")) {
              const text = await res.text();
              console.error("TinyMCE upload non-JSON response:", text);
              throw new Error("Upload API is not returning JSON");
            }

            const data = await res.json();
            console.log("TinyMCE upload response:", data);

            if (!res.ok) {
              throw new Error(data?.error || "Upload failed");
            }

            if (!data?.url) {
              throw new Error("Upload succeeded but URL is missing");
            }

            return data.url;
          } catch (error) {
            console.error("TinyMCE image upload failed:", error);
            throw error;
          }
        },

        content_style: `
          body {
            font-family: Arial, sans-serif;
            font-size: 16px;
            line-height: 1.6;
          }
          img {
            max-width: 100%;
            height: auto;
            display: block;
          }
        `,
      }}
    />
  );
});

export default ExactEditor;