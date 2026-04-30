import Avatar from "@/components/shared/avatar";
import { I18nText } from "@/components/shared/i18n-text";
import { buildFileURL } from "@/utils/build-file-url";
import { createFullName } from "@/utils/create-full-name";
import { getInitials } from "@/utils/get-initials";
import { timeDifference } from "@/utils/time-difference";
import { Post } from "@packages/schemas";

export default function MyPostHeader({ post }: { post: Post }) {
  const getTimeText = (): React.ReactNode => {
    const timeDiff = timeDifference(post.createdAt);

    if (timeDiff.days) {
      return (
        <I18nText
          translationKey="common.time.days"
          values={{ count: String(timeDiff.days) }}
        />
      );
    } else if (timeDiff.hours) {
      return (
        <I18nText
          translationKey="common.time.hours"
          values={{ count: String(timeDiff.hours) }}
        />
      );
    } else if (timeDiff.minutes > 5) {
      return (
        <I18nText
          translationKey="common.time.minutes"
          values={{ count: String(timeDiff.minutes) }}
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
