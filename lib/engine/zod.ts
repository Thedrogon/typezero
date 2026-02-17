import { Schema, inferSchema } from "./ast";

const safeKey = (k: string) =>
  /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(k) ? k : `"${k}"`;

const capitalize = (s: string) =>
  s.charAt(0).toUpperCase() + s.slice(1);

// Create a structural signature so identical shapes reuse schemas
const signatureOf = (node: Schema): string => {
  if (node.type !== "object") return node.type;
  return JSON.stringify(
    Object.entries(node.properties)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => [k, signatureOf(v)])
  );
};

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

export const jsonToZod = (json: string) => {
  try {
    const data = JSON.parse(json);
    const root = inferSchema(data);

    // collect literal stats once
    const stats: Stats = new Map();
    collectStats(data, "", stats);

    const registry = new Map<string, string>(); // signature → schema name
    const definitions: string[] = [];
    let counter = 1;

    const render = (schema: Schema, hint = "Schema", path = ""): string => {
      /* ---------- Primitive ---------- */

      if (schema.type === "string") {
        const values = stats.get(path);
        if (values && isEnumCandidate(values)) {
          const literals = Array.from(values)
            .map(v => `"${v}"`)
            .join(", ");
          return `z.enum([${literals}])`;
        }
        return "z.string()";
      }

      if (schema.type === "number") {
        const values = stats.get(path);
        if (values && isEnumCandidate(values)) {
          const literals = Array.from(values)
            .map(v => `z.literal(${v})`)
            .join(", ");
          return `z.union([${literals}])`;
        }
        return "z.number()";
      }

      if (schema.type === "boolean") return "z.boolean()";
      if (schema.type === "null") return "z.null()";
      if (schema.type === "any") return "z.any()";

      /* ---------- Array ---------- */

      if (schema.type === "array") {
        return `z.array(${render(schema.items, hint + "Item", path)})`;
      }

      /* ---------- Object ---------- */

      if (schema.type === "object") {
        const sig = signatureOf(schema);

        if (registry.has(sig)) return registry.get(sig)!;

        const name = `${hint}${counter++}`;
        registry.set(sig, name);

        const props = Object.entries(schema.properties)
          .map(([k, v]) => {
            const childPath = path ? `${path}.${k}` : k;

            const base = render(v, capitalize(k), childPath);
            const optional = !schema.required.has(k)
              ? `${base}.optional()`
              : base;

            return `  ${safeKey(k)}: ${optional}`;
          })
          .join(",\n");

        definitions.push(`const ${name} = z.object({\n${props}\n});`);
        return name;
      }

      return "z.any()";
    };

    const rootRef = render(root, "Root", "");

    return `import { z } from "zod";

${definitions.join("\n\n")}

export const schema = ${rootRef};`;
  } catch {
    return "// Invalid JSON";
  }
};
