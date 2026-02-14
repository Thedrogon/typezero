import { Schema, inferSchema } from "./ast";

const render = (schema: Schema): string => {
  switch (schema.type) {
    case "string": return "z.string()";
    case "number": return "z.number()";
    case "boolean": return "z.boolean()";
    case "null": return "z.null()";
    case "array": return `z.array(${render(schema.items)})`;
    case "object":
      const props = Object.entries(schema.properties)
        .map(([k, v]) => `  ${k}: ${render(v)}`)
        .join(",\n");
      return `z.object({\n${props}\n})`;
    default: return "z.any()";
  }
};

export const jsonToZod = (json: string) => {
  try {
    const data = JSON.parse(json);
    const schema = inferSchema(data);
    return `import { z } from "zod";\n\nexport const schema = ${render(schema)};`;
  } catch (e) { return "// Invalid JSON"; }
};