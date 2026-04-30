import { useFetchProtectedURL } from "@/hooks/use-fetch-protected-url";

export default function ProtectedVideo({ src }: { src: string }) {
  const { data } = useFetchProtectedURL(src);

  return (
    <video className="h-40 w-40 object-cover" controls>
      {data ? <source src={data} /> : null}
      Your browser does not support the video tag.
    </video>
  );
}
