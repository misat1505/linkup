import { Post } from "@packages/schemas";
import { TRANSLATION_COMPONENT } from "../../../config";
import { createFullName } from "../../../utils/create-full-name";
import { timeDifference } from "../../../utils/time-difference";
import PostAuthorAvatar from "./post-author-avatar";

export default function MyPostHeader({ post }: { post: Post }) {
	const getTimeText = (): React.ReactNode => {
		const timeDiff = timeDifference(post.createdAt);

		if (timeDiff.days) {
			return (
				<TRANSLATION_COMPONENT
					translationKey="common.time.days"
					values={{ count: String(timeDiff.days) }}
				/>
			);
		} else if (timeDiff.hours) {
			return (
				<TRANSLATION_COMPONENT
					translationKey="common.time.hours"
					values={{ count: String(timeDiff.hours) }}
				/>
			);
		} else if (timeDiff.minutes > 5) {
			return (
				<TRANSLATION_COMPONENT
					translationKey="common.time.minutes"
					values={{ count: String(timeDiff.minutes) }}
				/>
			);
		} else {
			return <TRANSLATION_COMPONENT translationKey="common.time.now" />;
		}
	};

	const { author } = post;

	return (
		<div className="w-full flex items-center justify-between">
			<div className="flex items-center gap-x-4 py-4">
				<PostAuthorAvatar author={author} />
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
