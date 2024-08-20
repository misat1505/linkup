import { getFileType } from "../../utils/getFileType";
import { File } from "../../models/File";
import React from "react";
import { API_URL } from "../../constants";
import Image from "../common/Image";
import { FaFileAlt } from "react-icons/fa";

export default function MultimediaDisplay({ files }: { files: File[] }) {
  if (files.length === 0) return null;

  return (
    <div className="mt-2 flex">
      {files.map((file) => (
        <MultimediaDisplayItem file={file} key={file.id} />
      ))}
    </div>
  );
}

function MultimediaDisplayItem({ file }: { file: File }) {
  const type = getFileType(file.url);

  if (!type) return null;

  if (type === "image")
    return (
      <Image
        src={`${API_URL}/files/${file.url}`}
        className={{
          common: "h-40 w-40 object-cover",
          error: "bg-slate-200 font-semibold"
        }}
        errorContent="Error loading image."
      />
    );

  if (type === "video")
    return (
      <video className="h-40 w-40 object-cover" controls>
        <source src={`${API_URL}/files/${file.url}`} />
        Your browser does not support the video tag.
      </video>
    );

  return (
    <div className="h-40 w-40 overflow-hidden bg-slate-200 px-4 py-8">
      <FaFileAlt size={20} />
      <p className="mt-2 text-sm font-semibold">{file.url}</p>
    </div>
  );
}