"use client";

import { User } from "@packages/schemas";
import { buildFileURL } from "../../../utils/build-file-url";
import { getInitials } from "../../../utils/get-initials";
import { Avatar } from "../../misc";

type PostAuthorAvatarProps = { author: User };

const PostAuthorAvatar = ({ author }: PostAuthorAvatarProps) => {
  return (
    <Avatar
      className="border"
      src={buildFileURL(author.photoURL, { type: "avatar" })}
      alt={getInitials(author)}
    />
  );
};

export default PostAuthorAvatar;
