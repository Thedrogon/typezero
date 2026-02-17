import { Schema, inferSchema } from "./ast";

const safeKey = (k: string) =>
  /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(k) ? k : `"${k}"`;

// Create a structural signature so identical shapes reuse schemas
const signatureOf = (node: Schema): string => {
  if (node.type !== "object") return node.type;
  return JSON.stringify(
    Object.entries(node.properties)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => [k, signatureOf(v)])
  );
};

export const jsonToZod = (json: string) => {
  try {
    const data = JSON.parse(json);
    const root = inferSchema(data);

    const registry = new Map<string, string>(); // signature → schema name
    const definitions: string[] = [];

    let counter = 1;

    const render = (schema: Schema, hint = "Schema"): string => {
      if (schema.type === "string") return "z.string()";
      if (schema.type === "number") return "z.number()";
      if (schema.type === "boolean") return "z.boolean()";
      if (schema.type === "null") return "z.null()";
      if (schema.type === "any") return "z.any()";

      if (schema.type === "array") {
        return `z.array(${render(schema.items, hint + "Item")})`;
      }

      if (schema.type === "object") {
        const sig = signatureOf(schema);

        if (registry.has(sig)) return registry.get(sig)!;

        const name = `${hint}${counter++}`;
        registry.set(sig, name);

        const props = Object.entries(schema.properties)
          .map(([k, v]) => {
            const base = render(v, capitalize(k));
            const optional = !schema.required.has(k) ? `${base}.optional()` : base;
            return `  ${safeKey(k)}: ${optional}`;
          })
          .join(",\n");

        definitions.push(`const ${name} = z.object({\n${props}\n});`);
        return name;
      }

      return "z.any()";
    };

    const capitalize = (s: string) =>
      s.charAt(0).toUpperCase() + s.slice(1);

    const rootRef = render(root, "Root");

    return `import { z } from "zod";

${definitions.join("\n\n")}

export const schema = ${rootRef};`;

  } catch {
    return "// Invalid JSON";
  }
};
