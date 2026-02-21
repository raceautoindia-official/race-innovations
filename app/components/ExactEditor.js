"use client";

import { Editor } from "@tinymce/tinymce-react";

export default function ExactEditor({ value, onChange }) {
  const apiKey = process.env.NEXT_PUBLIC_TINYMCE; // ✅ must start with NEXT_PUBLIC_

  return (
    <Editor
      apiKey={apiKey}
      value={value}
      onEditorChange={onChange}
      init={{
        height: 520,
        menubar: true,
        branding: false,
        promotion: false,

        plugins: "image link lists table code fullscreen",
        toolbar:
          "undo redo | bold italic | bullist numlist | link image table | code fullscreen",

        // ✅ enable upload tab & paste images
        automatic_uploads: true,
        paste_data_images: true,
        images_upload_tab: true,

        // ✅ upload to YOUR /api/upload (still free on your server)
        images_upload_handler: async (blobInfo) => {
          const fd = new FormData();
          fd.append("file", blobInfo.blob(), blobInfo.filename());

          const res = await fetch("/api/upload", { method: "POST", body: fd });
          const data = await res.json();

          if (!res.ok) throw new Error(data?.error || "Upload failed");
          return data.url; // must be public URL
        },

        content_style: `img{max-width:100%;height:auto;}`,
      }}
    />
  );
}