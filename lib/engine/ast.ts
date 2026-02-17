export type Schema =
  | { type: "string" | "number" | "boolean" | "null" | "any" }
  | { type: "array"; items: Schema }
  | { type: "object"; properties: Record<string, Schema>; required: Set<string> };

const isPlainObject = (v: any) =>
  typeof v === "object" && v !== null && !Array.isArray(v);

const mergeSchemas = (a: Schema, b: Schema): Schema => {
  if (a.type === "any") return b;
  if (b.type === "any") return a;

  if (a.type !== b.type) return { type: "any" };

  if (a.type === "array" && b.type === "array") {
    return { type: "array", items: mergeSchemas(a.items, b.items) };
  }

  if (a.type === "object" && b.type === "object") {
    const props: Record<string, Schema> = {};
    const required = new Set<string>();

    const keys = new Set([
      ...Object.keys(a.properties),
      ...Object.keys(b.properties)
    ]);

    for (const key of keys) {
      const aVal = a.properties[key];
      const bVal = b.properties[key];

      if (aVal && bVal) {
        props[key] = mergeSchemas(aVal, bVal);
        if (a.required.has(key) && b.required.has(key)) {
          required.add(key);
        }
      } else {
        props[key] = aVal ?? bVal!;
      }
    }

    return { type: "object", properties: props, required };
  }

  return a;
};

export const inferSchema = (data: any): Schema => {
  if (data === null) return { type: "null" };

  if (Array.isArray(data)) {
    if (data.length === 0) {
      return { type: "array", items: { type: "any" } };
    }

    // Sample up to N items for performance
    const SAMPLE_SIZE = 50;
    const sample = data.slice(0, SAMPLE_SIZE);

    let merged = inferSchema(sample[0]);
    for (let i = 1; i < sample.length; i++) {
      merged = mergeSchemas(merged, inferSchema(sample[i]));
    }

    return { type: "array", items: merged };
  }

  if (isPlainObject(data)) {
    const properties: Record<string, Schema> = {};
    const required = new Set<string>();

    for (const [key, value] of Object.entries(data)) {
      properties[key] = inferSchema(value);
      required.add(key);
    }

    return { type: "object", properties, required };
  }

  if (typeof data === "string") return { type: "string" };
  if (typeof data === "boolean") return { type: "boolean" };
  if (typeof data === "number") return { type: "number" };

  return { type: "any" };
};
