import Image from "../components/common/Image";
import { API_URL } from "../constants";

export const markdownPreviewOptions = {
  video({ node, ...props }: any) {
    return (
      <video {...props} key={props.src} controls>
        {(props?.children as any)?.map((child: any, index: number) => {
          if (child.type !== "source") return null;
          if (!child.props.src.startsWith(API_URL))
            return <div key={index}>Given source is unavailable</div>;

          return <source key={index} {...child.props} />;
        })}
        Your browser does not support the video tag.
      </video>
    );
  },
  img({ node, ...props }: any) {
    if (!props.src!.startsWith(API_URL)) {
      return <div>{props.alt || "Image not available"}</div>;
    }
    return (
      <Image
        src={props.src!}
        alt={props.alt || "image"}
        unloader={<div>{props.alt}</div>}
      />
    );
  },
  ul(props: any) {
    return <ul {...props} style={{ listStyle: "disc" }}></ul>;
  },
  ol(props: any) {
    return <ol {...props} style={{ listStyle: "decimal" }}></ol>;
  }
};
