// lib/engine/pydantic.ts

type PydanticType = 
  | { type: "str" | "int" | "float" | "bool" | "None" | "Any" }
  | { type: "List"; item: PydanticType }
  | { type: "Optional"; item: PydanticType }
  | { type: "class"; name: string; fields: Record<string, PydanticType> };

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

//infering
const merge = (a: PydanticType, b: PydanticType): PydanticType => {
  if (a.type === "Any") return b;
  if (b.type === "Any") return a;
  if (a.type !== b.type) return { type: "Any" };

  if (a.type === "List" && b.type === "List") {
    return { type: "List", item: merge(a.item, b.item) };
  }

  if (a.type === "class" && b.type === "class") {
    const fields: Record<string, PydanticType> = {};

    const keys = new Set([...Object.keys(a.fields), ...Object.keys(b.fields)]);
    for (const k of keys) {
      if (a.fields[k] && b.fields[k]) {
        fields[k] = merge(a.fields[k], b.fields[k]);
      } else {
        fields[k] = a.fields[k] ?? b.fields[k];
      }
    }

    return { type: "class", name: a.name, fields };
  }

  return a;
};

const infer = (data: any, name: string): PydanticType => {
  if (data === null) return { type: "None" };

  if (Array.isArray(data)) {
    if (!data.length) return { type: "List", item: { type: "Any" } };

    let merged = infer(data[0], name + "Item");
    for (let i = 1; i < Math.min(data.length, 50); i++) {
      merged = merge(merged, infer(data[i], name + "Item"));
    }

    return { type: "List", item: merged };
  }

  if (typeof data === "object" && data !== null) {
    const fields: Record<string, PydanticType> = {};
    for (const [k, v] of Object.entries(data)) {
      fields[k] = infer(v, capitalize(k));
    }
    return { type: "class", name: capitalize(name), fields };
  }

  if (typeof data === "string") return { type: "str" };
  if (typeof data === "boolean") return { type: "bool" };
  if (typeof data === "number") {
    return Number.isInteger(data) ? { type: "int" } : { type: "float" };
  }

  return { type: "Any" };
};


//GENERATION PHASE
export const jsonToPydantic = (jsonStr: string, rootName: string = "Root"): string => {
  try {
    const data = JSON.parse(jsonStr);
    const schema = infer(data, rootName);
    
    const classes: string[] = [];
    const seenClasses = new Set<string>();

    const renderType = (t: PydanticType): string => {
      if (t.type === "List") return `List[${renderType(t.item)}]`;
      if (t.type === "Optional") return `Optional[${renderType(t.item)}]`;
      if (t.type === "class") return t.name; // Return class name reference
      return t.type;
    };

    // Recursively build class definitions (Bottom-Up)
    const buildClasses = (t: PydanticType) => {
      if (t.type === "List") {
        buildClasses(t.item);
      } else if (t.type === "class") {
        // Build children first
        Object.values(t.fields).forEach(buildClasses);

        // Deduplicate classes
        if (seenClasses.has(t.name)) return;
        seenClasses.add(t.name);

        const fieldsStr = Object.entries(t.fields)
          .map(([key, type]) => {
            const typeName = renderType(type);
            // Handle keywords or pythonic naming if needed (skipping for raw accuracy)
            return `    ${key}: ${typeName}`;
          })
          .join("\n");
        
        classes.push(`class ${t.name}(BaseModel):\n${fieldsStr || "    pass"}`);
      }
    };

    buildClasses(schema);

    const imports = `from typing import List, Optional, Any\nfrom pydantic import BaseModel\n\n`;
    
    // We reverse classes only if we built top-down, but our recursion pushes children first (mostly).
    // However, Python needs children defined BEFORE parents.
    // The current recursion finishes the parent *after* visiting children, 
    // so `classes.push` happens for the parent *last*. 
    // This is exactly what Python wants (dependencies defined first).
    
    return imports + classes.join("\n\n");

  } catch (e) {
    return "# Invalid JSON";
  }
};