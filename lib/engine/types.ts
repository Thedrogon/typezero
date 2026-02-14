// A robust implementation that handles array merging and optional fields

type TypeDefinition = {
  type: string;
  isOptional?: boolean;
  properties?: Record<string, TypeDefinition>;
  items?: TypeDefinition; // for arrays
};

export const generateTs = (jsonStr: string, rootName: string = "Root"): string => {
  try {
    const json = JSON.parse(jsonStr);
    const schema = inferType(json);
    return renderInterfaces(schema, rootName);
  } catch (e) {
    return "// Invalid JSON";
  }
};

// 1. Inference Phase: Analyze the JSON structure
const inferType = (value: any): TypeDefinition => {
  if (value === null) return { type: "null" };
  if (Array.isArray(value)) return inferArray(value);
  if (typeof value === "object") return inferObject(value);
  return { type: typeof value };
};

const inferArray = (arr: any[]): TypeDefinition => {
  if (arr.length === 0) return { type: "any[]" };

  // Advanced: Merge all items in the array to find the superset
  // We limit to first 50 items for performance in case of massive datasets
  const schemas = arr.slice(0, 50).map(inferType);
  
  // Simplify: If all items are same primitive, return that array
  const firstType = schemas[0].type;
  if (schemas.every(s => s.type === firstType && s.type !== "object")) {
    return { type: `${firstType}[]` };
  }

  // If objects, we must merge them
  if (schemas.every(s => s.type === "object" || s.type === "null")) {
    const mergedProps: Record<string, TypeDefinition> = {};
    const allKeys = new Set<string>();

    // Collect all possible keys
    schemas.forEach(s => {
      if (s.properties) Object.keys(s.properties).forEach(k => allKeys.add(k));
    });

    allKeys.forEach(key => {
      // Check which schemas have this key
      const valuesForKey = schemas
        .map(s => s.properties ? s.properties[key] : null)
        .filter(v => v !== undefined && v !== null); // simplistic filtering
      
      if (valuesForKey.length === 0) return;

      // Recursive merge of the field values (simplified to first found for now, 
      // but in full prod we would union them)
      mergedProps[key] = {
        ...valuesForKey[0],
        isOptional: schemas.some(s => s.properties && !s.properties[key]) // Mark optional if missing in some
      };
    });

    return { type: "object[]", items: { type: "object", properties: mergedProps } };
  }

  return { type: "any[]" }; // Fallback for mixed primitives like [1, "a"]
};

const inferObject = (obj: any): TypeDefinition => {
  const props: Record<string, TypeDefinition> = {};
  Object.keys(obj).forEach(key => {
    props[key] = inferType(obj[key]);
  });
  return { type: "object", properties: props };
};

// 2. Render Phase: Turn the Schema into String
const renderInterfaces = (schema: TypeDefinition, rootName: string): string => {
  const interfaces = new Map<string, string>();
  
  const generateName = (base: string) => {
    // Basic deduplication logic could go here
    return base.charAt(0).toUpperCase() + base.slice(1);
  };

  const traverse = (node: TypeDefinition, name: string): string => {
    if (node.type.endsWith("[]")) {
        // Handle Array
        if (node.items && node.items.type === "object") {
            // It's an array of objects
            const itemName = name.endsWith("s") ? name.slice(0, -1) : name + "Item";
            const itemType = traverse(node.items, itemName);
            return `${itemType}[]`;
        }
        return node.type;
    }

    if (node.type === "object" && node.properties) {
      const interfaceName = generateName(name);
      let block = `export interface ${interfaceName} {\n`;
      
      Object.entries(node.properties).forEach(([key, def]) => {
        const propType = traverse(def, key);
        const optionalFlag = def.isOptional ? "?" : "";
        block += `  ${key}${optionalFlag}: ${propType};\n`;
      });
      
      block += "}";
      interfaces.set(interfaceName, block);
      return interfaceName;
    }

    return node.type;
  };

  traverse(schema, rootName);
  return Array.from(interfaces.values()).reverse().join("\n\n");
};