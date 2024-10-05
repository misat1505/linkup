import { queryKeys } from "../../lib/queryKeys";
import { getAccessToken } from "../../lib/token";
import React from "react";
import { useQuery } from "react-query";

export default function ProtectedVideo({ src }: { src: string }) {
  const { data } = useQuery({
    queryKey: queryKeys.file(src),
    queryFn: async () => {
      const result = await fetch(src, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${getAccessToken()}`
        }
      });
      if (!result.ok) throw new Error();
      const blob = await result.blob();
      return URL.createObjectURL(blob);
    }
  });

  return (
    <video className="h-40 w-40 object-cover" controls>
      {data ? <source src={data} /> : null}
      Your browser does not support the video tag.
    </video>
  );
}
