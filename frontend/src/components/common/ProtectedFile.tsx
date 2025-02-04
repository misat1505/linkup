import { FaFileAlt } from "react-icons/fa";
import { useFetchProtectedURL } from "@/hooks/useFetchProtectedURL";

export default function ProtectedFile({ src }: { src: string }) {
  const { data } = useFetchProtectedURL(src);

  return (
    <a
      target="_blank"
      href={data}
      className="h-40 w-40 cursor-pointer overflow-hidden bg-slate-200 px-4 py-8 dark:bg-slate-800"
    >
      <FaFileAlt size={20} />
      <p className="mt-2 text-sm font-semibold">{src}</p>
    </a>
  );
}
