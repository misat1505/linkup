import { Post } from "@/types/Post";
import { timeDifference } from "@/utils/timeDifference";
import Avatar from "../common/Avatar";
import { buildFileURL } from "@/utils/buildFileURL";
import { getInitials } from "@/utils/getInitials";
import { createFullName } from "@/utils/createFullName";

export default function PostHeader({ post }: { post: Post }) {
  const getTimeText = (): string => {
    const timeDiff = timeDifference(post.createdAt);

    if (timeDiff.days) return `${timeDiff.days} days ago`;
    else if (timeDiff.hours) return `${timeDiff.hours} hours ago`;
    else if (timeDiff.minutes > 5) return `${timeDiff.minutes} minutes ago`;
    else return "Just now";
  };

  const { author } = post;

  return (
    <div className="flex items-center gap-x-4 py-4">
      <Avatar
        className="border"
        src={buildFileURL(author.photoURL, { type: "avatar" })}
        alt={getInitials(author)}
      />
      <div>
        <h2 className="text-lg font-semibold">{createFullName(author)}</h2>
        <p className="text-md">{getTimeText()}</p>
      </div>
    </div>
  );
}
