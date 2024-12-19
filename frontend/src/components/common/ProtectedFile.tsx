import React from "react";
import { FaFileAlt } from "react-icons/fa";
import { getAccessToken } from "../../lib/token";

export default function ProtectedFile({ src }: { src: string }) {
  const handleClick = async () => {
    try {
      const response = await fetch(src, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch the file");
      }

      const blob = await response.blob();
      const blobUrl = URL.createObjectURL(blob);
      window.open(blobUrl, "_blank");
    } catch (error) {
      console.error("Error fetching the file:", error);
    }
  };

  return (
    <div
      onClick={handleClick}
      className="h-40 w-40 cursor-pointer overflow-hidden bg-slate-200 px-4 py-8 dark:bg-slate-800"
    >
      <FaFileAlt size={20} />
      <p className="mt-2 text-sm font-semibold">{src}</p>
    </div>
  );
}
