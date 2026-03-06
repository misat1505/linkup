import { timeDifference } from "@/utils/timeDifference";
import { buildFileURL } from "@/utils/buildFileURL";
import { getInitials } from "@/utils/getInitials";
import { createFullName } from "@/utils/createFullName";
import { I18nText } from "@/components/shared/I18nText";
import { Post } from "../schemas/post";
import Avatar from "@/components/shared/Avatar";

export default function MyPostHeader({ post }: { post: Post }) {
  const getTimeText = (): React.ReactNode => {
    const timeDiff = timeDifference(post.createdAt);

    if (timeDiff.days) {
      return (
        <I18nText
          translationKey="common.time.days"
          values={{ count: timeDiff.days }}
        />
      );
    } else if (timeDiff.hours) {
      return (
        <I18nText
          translationKey="common.time.hours"
          values={{ count: timeDiff.hours }}
        />
      );
    } else if (timeDiff.minutes > 5) {
      return (
        <I18nText
          translationKey="common.time.minutes"
          values={{ count: timeDiff.minutes }}
        />
      );
    } else {
      return <I18nText translationKey="common.time.now" />;
    }
  };

  const { author } = post;

  return (
    <div className="w-full flex items-center justify-between">
      <div className="flex items-center gap-x-4 py-4">
        <Avatar
          className="border"
          src={buildFileURL(author.photoURL, { type: "avatar" })}
          alt={getInitials(author)}
        />
        <div>
          <div className="flex items-center gap-x-4">
            <h2 className="text-lg font-semibold">{createFullName(author)}</h2>
          </div>
          <p className="text-sm text-muted-foreground -mt-1">{getTimeText()}</p>
        </div>
      </div>
    </div>
  );
}
