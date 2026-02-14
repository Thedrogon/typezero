import { Schema, inferSchema } from "./ast";

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

export const generateTs = (json: string, rootName: string = "Root"): string => {
  try {
    const data = JSON.parse(json);
    const schema = inferSchema(data);
    const interfaces = new Map<string, string>();

    const render = (node: Schema, name: string): string => {
      if (node.type === "array") {
        if (node.items.type === "object") {
          const itemName = name.endsWith("s") ? name.slice(0, -1) : name + "Item";
          return `${render(node.items, itemName)}[]`;
        }
        return `${render(node.items, name)}[]`;
      }

      if (node.type === "object") {
        const interfaceName = capitalize(name);
        // Avoid re-creating if exists (simple dedup)
        if (interfaces.has(interfaceName)) return interfaceName;

        const props = Object.entries(node.properties).map(([key, val]) => {
          const isOptional = !node.required.has(key);
          return `  ${key}${isOptional ? "?" : ""}: ${render(val, key)};`;
        }).join("\n");

        interfaces.set(interfaceName, `export interface ${interfaceName} {\n${props}\n}`);
        return interfaceName;
      }

      if (node.type === "null") return "null";
      if (node.type === "any") return "any";
      return node.type;
    };

    render(schema, rootName);
    return Array.from(interfaces.values()).reverse().join("\n\n");
  } catch (e) {
    return "// Invalid JSON";
  }
};