import Image from "@/components/common/image";
import { API_URL } from "@/constants";
import { useFetchProtectedURL } from "@/hooks/use-fetch-protected-url";

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

          return <ProtectedSource src={child.props.src} />;
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

// eslint-disable-next-line react-refresh/only-export-components
function ProtectedSource({ src }: { src: string }) {
  const { data } = useFetchProtectedURL(src);

  return <source key={data} src={data} />;
}
