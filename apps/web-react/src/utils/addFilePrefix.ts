import { API_URL } from "@/constants";

type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
interface JSONObject {
  [key: string]: JSONValue;
}
type JSONArray = Array<JSONValue>;

export function addFilePrefix(
  obj: JSONValue,
  urlKeys: string[] = ["photoURL", "url"],
  prefix: string = `${API_URL}/files/`,
): JSONValue {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((t) => addFilePrefix(t, urlKeys, prefix));
  }

  const newObj: JSONObject = { ...obj };

  for (const key in newObj) {
    if (!Object.prototype.hasOwnProperty.call(newObj, key)) continue;

    if (urlKeys.includes(key) && typeof newObj[key] === "string") {
      newObj[key] = prefix + newObj[key];
    } else if (typeof newObj[key] === "object") {
      newObj[key] = addFilePrefix(newObj[key], urlKeys, prefix);
    }
  }

  return newObj;
}
