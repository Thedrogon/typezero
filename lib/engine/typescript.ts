import { Schema, inferSchema } from "./ast";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

const safeKey = (key: string) =>
  /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key) ? key : `"${key}"`;

// Collect candidate literal values by path
type Stats = Map<string, Set<string | number>>;

const collectStats = (data: any, path = "", stats: Stats, limit = 200) => {
  if (limit <= 0) return;

  if (Array.isArray(data)) {
    for (const item of data.slice(0, 25)) {
      collectStats(item, path, stats, limit - 1);
    }
    return;
  }

  if (typeof data === "object" && data !== null) {
    for (const [k, v] of Object.entries(data)) {
      const next = path ? `${path}.${k}` : k;
      collectStats(v, next, stats, limit - 1);
    }
    return;
  }

  if (typeof data === "string" || typeof data === "number") {
    if (!stats.has(path)) stats.set(path, new Set());
    stats.get(path)!.add(data);
  }
};

const isEnumCandidate = (values: Set<any>) =>
  values.size > 1 && values.size <= 8;

/* ---------------- Helpers ---------------- */

const signatureOf = (node: Schema): string => {
  if (node.type !== "object") return node.type;
  return JSON.stringify(
    Object.entries(node.properties)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => [k, signatureOf(v)])
  );
};

const isoDate = (s: string) =>
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(s);

/* ---------------- Main Generator ---------------- */

export const generateTs = (json: string, rootName = "Root"): string => {
  try {
    const data = JSON.parse(json);
    const schema = inferSchema(data);

    // collect literal statistics once
    const stats: Stats = new Map();
    collectStats(data, "", stats);

    const interfaces = new Map<string, string>();
    const signatureMap = new Map<string, string>();
    const order: string[] = [];

    const render = (node: Schema, name: string, path: string): string => {
      if (node.type === "array") {
        return `ReadonlyArray<${render(node.items, name, path)}>`;
      }

      if (node.type === "object") {
        const sig = signatureOf(node);

        if (signatureMap.has(sig)) {
          return signatureMap.get(sig)!;
        }

        const interfaceName = capitalize(name);
        signatureMap.set(sig, interfaceName);

        const props = Object.entries(node.properties)
          .map(([key, val]) => {
            const optional = !node.required.has(key);
            const childPath = path ? `${path}.${key}` : key;

            const typeStr = render(val, key, childPath);

            return `  ${safeKey(key)}${optional ? "?" : ""}: ${typeStr};`;
          })
          .join("\n");

        interfaces.set(
          interfaceName,
          `export interface ${interfaceName} {\n${props}\n}`
        );

        order.push(interfaceName);
        return interfaceName;
      }

      /* ---------- Enum Detection ---------- */

      const values = stats.get(path);
      if (values && isEnumCandidate(values)) {
        const literals = Array.from(values)
          .map(v => (typeof v === "string" ? `"${v}"` : v))
          .join(" | ");
        return literals;
      }

      if (node.type === "string") {
        const v = values?.values().next().value;
        if (typeof v === "string" && isoDate(v)) {
          return `string /* ISO Date */`;
        }
        return "string";
      }

      if (node.type === "number") return "number";
      if (node.type === "boolean") return "boolean";
      if (node.type === "null") return "null";
      return "any";
    };

    render(schema, rootName, "");

    return order.reverse().map(name => interfaces.get(name)).join("\n\n");
  } catch {
    return "// Invalid JSON";
  }
};
