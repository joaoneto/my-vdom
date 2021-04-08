export default function deepEqualObject(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;

  if (typeof a === "object" && typeof b === "object") {
    if (a.constructor !== b.constructor) return false;

    const aKeys = Object.keys(a);
    const bKeys = Object.keys(b);

    if (aKeys.length !== bKeys.length) return false;

    for (const key in a) {
      const val = a[key];
      if (typeof b[key] !== typeof val) return false;
      if (typeof val === "object") return deepEqualObject(val, b[key]);
      if (Array.isArray(val)) {
        return val.some((v, i) => {
          if (typeof v === "object") return deepEqualObject(v, b[key][i]);
          if (Array.isArray(val)) return deepEqualObject(v, b[key][i]);
          return v === b[i];
        });
      }
      if (b[key] !== val) return false;
    }
  }

  return true;
}
