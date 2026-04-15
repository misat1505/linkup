type JSONValue = string | number | boolean | null | JSONObject | JSONArray;
interface JSONObject {
  [key: string]: JSONValue;
}
type JSONArray = Array<JSONValue>;

export function convertDates(
  obj: JSONValue,
  keys: string[] = ["createdAt", "lastActive"],
): JSONValue {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((t) => convertDates(t, keys));
  }

  const newObj: JSONObject = { ...obj };

  for (const key in newObj) {
    if (!Object.prototype.hasOwnProperty.call(newObj, key)) continue;

    if (keys.includes(key)) {
      const value = newObj[key];
      if (typeof value === "string" || typeof value === "number") {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        newObj[key] = new Date(value) as any;
      }
    } else if (typeof newObj[key] === "object") {
      newObj[key] = convertDates(newObj[key], keys);
    }
  }

  return newObj;
}
