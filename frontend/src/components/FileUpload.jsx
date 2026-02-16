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
    <div className="p-8 flex flex-col items-center justify-center border-2 border-dashed border-slate-700 rounded-xl bg-slate-800/50 hover:bg-slate-800 transition-all group">
      <input
        type="file"
        id="file-upload"
        className="hidden"
        onChange={handleFile}
        disabled={isUploading}
      />

      <label
        htmlFor="file-upload"
        className="cursor-pointer flex flex-col items-center gap-4 w-full"
      >
        <div className="p-4 bg-blue-500/10 rounded-full group-hover:bg-blue-500/20 transition-all">
          {isUploading ? (
            <Loader2 className="w-10 h-10 text-blue-500 animate-spin" />
          ) : (
            <Upload className="w-10 h-10 text-blue-500" />
          )}
        </div>

        <div className="text-center">
          <p className="text-white font-semibold text-lg">
            {isUploading ? "Analyzing Traffic..." : "Upload Traffic Data"}
          </p>
          <p className="text-slate-400 text-sm mt-1">
            Support for .pcap, .pcapng files
          </p>
        </div>
      </label>

      {error && (
        <div className="mt-4 flex items-center gap-2 text-red-400 text-sm bg-red-400/10 p-3 rounded-lg border border-red-400/20">
          <AlertCircle className="w-4 h-4" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default FileUpload;
