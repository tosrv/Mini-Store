"use client";

import { useDropzone } from "react-dropzone";
import { Upload } from "lucide-react";

type Props = {
  value: File | null;
  onChange: (file: File | null) => void;
};

const MAX_SIZE = 2 * 1024 * 1024; // 2MB

export function ImageDropzone({ value, onChange }: Props) {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: { "image/*": [] },
    maxFiles: 1,
    maxSize: MAX_SIZE,
    onDrop: (acceptedFiles) => {
      onChange(acceptedFiles[0] ?? null);
    },
  });

  return (
    <div
      {...getRootProps()}
      className={`
    rounded-lg cursor-pointer transition m-2
    ${
      value
        ? ""
        : `border-2 border-dashed hover:border-primary
         ${
           isDragActive
             ? "border-primary bg-muted"
             : "border-muted-foreground/30"
         }`
    }
  `}
    >
      <input {...getInputProps()} />

      {value ? (
        <img
          src={URL.createObjectURL(value)}
          alt="Preview"
          className="max-h-72 w-full object-contain rounded-md"
        />
      ) : (
        <div className="flex flex-col items-center justify-center gap-2 text-sm text-muted-foreground m-4">
          <Upload className="h-6 w-6" />
          <p>
            <span className="font-medium text-foreground">Click to upload</span>{" "}
            or drag and drop
          </p>
          <p>PNG, JPG up to 2MB</p>
        </div>
      )}
    </div>
  );
}
