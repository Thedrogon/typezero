import { Schema, inferSchema } from "./ast";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

// ensure valid TS identifiers
const safeKey = (key: string) =>
  /^[a-zA-Z_][a-zA-Z0-9_]*$/.test(key) ? key : `"${key}"`;

// create a structural signature so identical shapes reuse interfaces
const signatureOf = (node: Schema): string => {
  if (node.type !== "object") return node.type;
  return JSON.stringify(
    Object.entries(node.properties)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([k, v]) => [k, signatureOf(v)])
  );
};

export const generateTs = (json: string, rootName = "Root"): string => {
  try {
    const data = JSON.parse(json);
    const schema = inferSchema(data);

    const interfaces = new Map<string, string>();
    const signatureMap = new Map<string, string>(); // signature → interface name
    const order: string[] = [];

    const render = (node: Schema, name: string): string => {
      if (node.type === "array") {
        return `${render(node.items, name)}[]`;
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
            return `  ${safeKey(key)}${optional ? "?" : ""}: ${render(val, key)};`;
          })
          .join("\n");

        interfaces.set(interfaceName, `export interface ${interfaceName} {\n${props}\n}`);
        order.push(interfaceName);

        return interfaceName;
      }

      if (node.type === "number") return "number";
      if (node.type === "boolean") return "boolean";
      if (node.type === "string") return "string";
      if (node.type === "null") return "null";
      return "any";
    };

    render(schema, rootName);

    return order.reverse().map(name => interfaces.get(name)).join("\n\n");
  } catch {
    return "// Invalid JSON";
  }
};
