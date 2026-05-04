"use client";

import { queryKeys } from "@/lib/query-keys";
import { Loading } from "@packages/ui/misc";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useTheme } from "next-themes";
import dynamic from "next/dynamic";
import { getCache } from "../actions/get-cache";
import { insertFileToCache } from "../actions/insert-file-to-cache";
import { removeFromCache } from "../actions/remove-from-cache";
import { useEditorContext } from "../providers/editor-provider";

const Editor = dynamic(
  () => import("@packages/ui/features/editor").then((m) => m.Editor),
  {
    ssr: false,
    loading: () => (
      <div className="h-[calc(100vh-5rem)]">
        <Loading />
      </div>
    ),
  },
);

function useGetCache() {
  return useQuery({
    queryKey: queryKeys.cache(),
    queryFn: getCache,
  });
}

const EditorWrapper = () => {
  const queryClient = useQueryClient();
  const { markdown, handleSafeChange, handleSave, variant } =
    useEditorContext();
  const { theme } = useTheme();

  function removeFromCacheCb(file: string) {
    queryClient.setQueryData<string[]>(queryKeys.cache(), (oldPaths) => {
      if (!oldPaths) return [];
      return oldPaths.filter((p) => p !== file);
    });
  }

  function insertToCacheCb(file: string) {
    queryClient.setQueryData<string[]>(queryKeys.cache(), (oldPaths) => {
      if (!oldPaths) return [];
      return [...oldPaths, file];
    });
  }

  return (
    <Editor
      markdown={markdown}
      handleSafeChange={handleSafeChange}
      handleSave={handleSave}
      variant={variant}
      theme={theme as "dark" | "light"}
      insertToCacheAction={insertFileToCache}
      insertToCacheCb={insertToCacheCb}
      removeFromCacheAction={removeFromCache}
      removeFromCacheCb={removeFromCacheCb}
      // @ts-expect-error it's fine to pass it like this
      useGetCache={useGetCache}
    />
  );
};

export default EditorWrapper;
