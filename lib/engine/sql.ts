import { Schema, inferSchema } from "./ast";

export const jsonToSql = (json: string) => {
  try {
    const data = JSON.parse(json);
    const schema = inferSchema(data);
    
    if (schema.type !== "object" && (schema.type !== "array" || schema.items.type !== "object")) {
      return "-- SQL requires an Object or Array of Objects";
    }

    // Heuristic: If array, use first item definition
    const target = schema.type === "array" ? schema.items : schema;
    if (target.type !== "object") return "-- Invalid Structure";

    const lines = Object.entries(target.properties).map(([key, val]) => {
      let type = "TEXT";
      if (val.type === "number") type = "INT";
      if (val.type === "boolean") type = "BOOLEAN";
      return `  ${key} ${type}`;
    });

    return `CREATE TABLE export (\n  id SERIAL PRIMARY KEY,\n${lines.join(",\n")}\n);`;
  } catch (e) { return "-- Invalid JSON"; }
};