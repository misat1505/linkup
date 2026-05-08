import DOMPurify from "dompurify";

export const decodeHTMLEntities = (text: string): string => {
  const textarea = document.createElement("textarea");
  textarea.innerHTML = text;
  return textarea.value;
};

export const sanitizeMarkdownWithCodeBlocks = (text: string): string => {
  const codeBlockRegex = /```[\s\S]*?```/g;

  const codeBlocks: string[] = [];

  const sanitizedText = text.replace(codeBlockRegex, (match) => {
    codeBlocks.push(match);
    return `PLACEHOLDER_CODE_BLOCK_${codeBlocks.length - 1}`;
  });

  const purifiedText = DOMPurify.sanitize(sanitizedText);

  const finalText = purifiedText.replace(
    /PLACEHOLDER_CODE_BLOCK_(\d+)/g,
    (_, index) => {
      return codeBlocks[parseInt(index, 10)];
    }
  );

  return finalText;
};
