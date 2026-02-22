import React, { useState } from "react";
import axios from "axios";
import { Upload, FileText, AlertCircle, Loader2 } from "lucide-react";

const FileUpload = ({ onAnalysisComplete }) => {
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await axios.post("http://localhost:5000/api/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // The backend now returns the full analysis object
      onAnalysisComplete(response.data);
    } catch (err) {
      console.error("Upload error:", err);
      setError(
        err.response?.data?.error || "Error uploading file. Make sure the backend is running."
      );
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="p-10 flex flex-col items-center justify-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-slate-50/50 hover:bg-white hover:border-indigo-300 transition-all group shadow-sm">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFile}
        disabled={isUploading}
      />

      <label
        htmlFor="file-upload"
        className="cursor-pointer flex flex-col items-center gap-6 w-full"
      >
        <div className="p-6 bg-indigo-50 rounded-2xl group-hover:bg-indigo-100 transition-all shadow-inner">
          {isUploading ? (
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin" />
          ) : (
            <Upload className="w-12 h-12 text-indigo-600" />
          )}
        </div>

        <div className="text-center">
          <p className="text-slate-900 font-bold text-xl tracking-tight">
            {isUploading ? "Detection Analysis in Progress..." : "Upload Intelligence Payload"}
          </p>
          <p className="text-slate-400 text-xs mt-2 uppercase tracking-widest font-bold">
            Support for .pcap, .pcapng detection
          </p>
        </div>
      </label>

      {error && (
        <div className="mt-6 flex items-center gap-3 text-rose-700 text-xs bg-rose-50 p-4 rounded-xl border border-rose-100 font-bold">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
