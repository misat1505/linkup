import Image from "@/components/shared/Image";
import { useFetchProtectedURL } from "@/hooks/useFetchProtectedURL";
import { API_URL } from "@/utils/constants";

export const markdownPreviewOptions = {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
  video({ node, ...props }: any) {
    if (typeof props.children === "string") return null;
    return (
      <video {...props} key={props.src} controls>
        {/*eslint-disable-next-line @typescript-eslint/no-explicit-any*/}
        {(props?.children as any)?.map((child: any, index: number) => {
          if (child.type !== "source") return null;
          if (!child.props.src.startsWith(API_URL))
            return <div key={index}>Given source is unavailable</div>;

          return <ProtectedSource key={index} src={child.props.src} />;
        })}
        Your browser does not support the video tag.
      </video>
    );
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
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
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ul(props: any) {
    return <ul {...props} style={{ listStyle: "disc" }}></ul>;
  },
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ol(props: any) {
    return <ol {...props} style={{ listStyle: "decimal" }}></ol>;
  },
};

function ProtectedSource({ src }: { src: string }) {
  const { data } = useFetchProtectedURL(src);

  return <source key={data} src={data} />;
}
