export const getCookie = (
  cookieString: string | undefined,
  name: string
): string | null => {
  if (cookieString === undefined) return null;

  const cookies = cookieString.split(";");
  for (const cookie of cookies) {
    const [key, value] = cookie.split("=").map((part) => part.trim());
    if (key === name) {
      return value;
    }
  }
  return null;
};
