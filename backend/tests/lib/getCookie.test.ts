import { getCookie } from "../../src/lib/getCookie";

describe("getCookie", () => {
  it("should return null if the cookie string is undefined", () => {
    const result = getCookie(undefined, "session");
    expect(result).toBeNull();
  });

  it("should return the cookie value if the cookie is present", () => {
    const cookieString = "session=abc123; userId=456; theme=dark";
    const result = getCookie(cookieString, "session");
    expect(result).toBe("abc123");
  });

  it("should return null if the cookie is not present", () => {
    const cookieString = "userId=456; theme=dark";
    const result = getCookie(cookieString, "session");
    expect(result).toBeNull();
  });

  it("should return the correct value even if there are extra spaces around the cookies", () => {
    const cookieString = "  session  = abc123  ; userId=  456 ; theme =dark  ";
    const result = getCookie(cookieString, "session");
    expect(result).toBe("abc123");
  });

  it("should handle cookie names with special characters correctly", () => {
    const cookieString = "session-id=abc123; user@id=456; theme=dark";
    const result = getCookie(cookieString, "user@id");
    expect(result).toBe("456");
  });

  it("should return null if the cookie name matches but has a different case", () => {
    const cookieString = "Session=abc123; userId=456";
    const result = getCookie(cookieString, "session");
    expect(result).toBeNull();
  });

  it("should return null if the cookie string is empty", () => {
    const result = getCookie("", "session");
    expect(result).toBeNull();
  });

  it('should handle cookies with no value (empty string after "=")', () => {
    const cookieString = "session=; userId=456";
    const result = getCookie(cookieString, "session");
    expect(result).toBe("");
  });
});
