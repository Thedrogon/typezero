export const jsonToZod = (jsonStr: string, rootName: string = "schema"): string => {
  const parse = (obj: any): string => {
    if (obj === null) return "z.any()";
    
    const type = typeof obj;

    if (Array.isArray(obj)) {
      if (obj.length === 0) return "z.array(z.any())";
      return `z.array(${parse(obj[0])})`;
    }

    if (type === "object") {
      let props = "";
      Object.keys(obj).forEach((key) => {
        // recursive call for nested objects
        props += `  ${key}: ${parse(obj[key])},\n`; 
      });
      return `z.object({\n${props}})`;
    }

    if (type === "string") return "z.string()";
    if (type === "number") return "z.number()";
    if (type === "boolean") return "z.boolean()";
    
    return "z.any()";
  };

  try {
    const parsed = JSON.parse(jsonStr);
    const schema = parse(parsed);
    return `import { z } from "zod";\n\nexport const ${rootName} = ${schema};`;
  } catch (e) {
    return "";
  }
};