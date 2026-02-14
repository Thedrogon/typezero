export type Schema = 
  | { type: "string" | "number" | "boolean" | "null" | "any" }
  | { type: "array"; items: Schema }
  | { type: "object"; properties: Record<string, Schema>; required: Set<string> };

export const inferSchema = (data: any): Schema => {
  if (data === null) return { type: "null" };
  
  if (Array.isArray(data)) {
    if (data.length === 0) return { type: "array", items: { type: "any" } };
    
    // Merge array items to find the "Super Schema"
    const schemas = data.slice(0, 50).map(inferSchema);
    // (Simplified merging logic for brevity - production needs deep merge)
    return { type: "array", items: schemas[0] }; 
  }

  if (typeof data === "object") {
    const properties: Record<string, Schema> = {};
    const required = new Set<string>();
    
    Object.keys(data).forEach(key => {
      properties[key] = inferSchema(data[key]);
      required.add(key);
    });
    
    return { type: "object", properties, required };
  }

  const type = typeof data;
  if (["string", "number", "boolean"].includes(type)) {
    return { type: type as any };
  }
  
  return { type: "any" };
};