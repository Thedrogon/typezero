export const jsonToTs = (jsonStr: string, rootName: string = "Root"): string => {
  let interfaces: string[] = [];
  
  const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);

  const parse = (obj: any, name: string): string => {
    if (typeof obj !== "object" || obj === null) return "any";

    if (Array.isArray(obj)) {
      const firstItem = obj[0];
      const type = typeof firstItem;
      if (type === "object" && firstItem !== null) {
        const singularName = name.endsWith('s') ? name.slice(0, -1) : name + "Item";
        parse(firstItem, singularName);
        return `${singularName}[]`;
      }
      return `${type}[]`;
    }

    let output = `export interface ${name} {\n`;
    Object.keys(obj).forEach((key) => {
      const value = obj[key];
      const type = typeof value;
      if (value === null) {
        output += `  ${key}: null;\n`;
      } else if (type === "object") {
        const nestedName = capitalize(key);
        const nestedType = parse(value, nestedName); 
        output += `  ${key}: ${Array.isArray(value) ? nestedType : nestedName};\n`;
      } else {
        output += `  ${key}: ${type};\n`;
      }
    });
    output += `}`;
    interfaces.push(output);
    return name;
  };

  try {
    const parsed = JSON.parse(jsonStr);
    parse(parsed, rootName);
    return interfaces.reverse().join("\n\n"); 
  } catch (e) {
    return ""; // Return empty on error to prevent flickering
  }
};