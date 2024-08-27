export type TypeGuardOptions = {
  allowStringifiedDates?: boolean;
};

export const defaultOptions: TypeGuardOptions = {
  allowStringifiedDates: false,
};

export function hasOnlyKeys(obj: any, allowedKeys: string[]): boolean {
  const objKeys = Object.keys(obj);
  return (
    objKeys.every((key) => allowedKeys.includes(key)) &&
    objKeys.length === allowedKeys.length
  );
}
