import { getFileType } from "../../utils/getFileType";
import { File } from "../../models/File";
import React from "react";
import { API_URL } from "../../constants";

export default function MultimediaDisplay({ files }: { files: File[] }) {
  return (
    <div className="flex">
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
      <img
        src={`${API_URL}/files/${file.url}`}
        className="h-40 w-40 object-cover"
      />
    );

  if (type === "video")
    return (
      <video className="h-40 w-40 object-cover" controls>
        <source src={`${API_URL}/files/${file.url}`} />
        Your browser does not support the video tag.
      </video>
    );

  return <div className="h-40 w-40 overflow-hidden">{file.url}</div>;
}
