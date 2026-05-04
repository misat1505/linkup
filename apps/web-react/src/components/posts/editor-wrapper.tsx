"use client";

import { useEditorContext } from "@/contexts/editor-provider";
import { useThemeContext } from "@/contexts/theme-provider";
import { queryKeys } from "@/lib/query-keys";
import { FileService } from "@/services/file.service";
import { Editor } from "@packages/ui/features/editor";
import { useQuery, useQueryClient } from "react-query";

function useGetCache() {
  return useQuery({
    queryKey: queryKeys.cache(),
    queryFn: FileService.getCache,
  });
}

const EditorWrapper = () => {
  const queryClient = useQueryClient();
  const { markdown, handleSafeChange, handleSave, variant } =
    useEditorContext();
  const { theme } = useThemeContext();

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
      insertToCacheAction={FileService.insertFileToCache}
      insertToCacheCb={insertToCacheCb}
      removeFromCacheAction={FileService.removeFromCache}
      removeFromCacheCb={removeFromCacheCb}
      // @ts-expect-error it's fine to pass it like this
      useGetCache={useGetCache}
    />
  );
};

export default EditorWrapper;
