import { Schema, inferSchema } from "./ast";

const isISODate = (v: string) =>
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/.test(v);

const mapType = (val: Schema): string => {
  switch (val.type) {
    case "number":
      return "DOUBLE PRECISION";
    case "boolean":
      return "BOOLEAN";
    case "string":
      return "TEXT";
    case "object":
    case "array":
      return "JSONB"; // preserve structure safely
    default:
      return "TEXT";
  }
};

const safeKey = (k: string) =>
  `"${k.replace(/"/g, "")}"`;

export const jsonToSql = (json: string) => {
  try {
    const data = JSON.parse(json);
    const schema = inferSchema(data);

    if (schema.type !== "object" && (schema.type !== "array" || schema.items.type !== "object")) {
      return "-- SQL requires an object or array of objects";
    }

    const target = schema.type === "array" ? schema.items : schema;
    if (target.type !== "object") return "-- Invalid structure";

    const lines = Object.entries(target.properties).map(([key, val]) => {
      const nullable = target.required.has(key) ? "NOT NULL" : "";
      return `  ${safeKey(key)} ${mapType(val)} ${nullable}`.trim();
    });

    return `CREATE TABLE export (
  id BIGSERIAL PRIMARY KEY,
${lines.join(",\n")}
);`;
  } catch {
    return "-- Invalid JSON";
  }
};
