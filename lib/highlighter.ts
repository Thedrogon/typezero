type Lang = "json" | "ts" | "sql" | "py";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;")
   .replace(/</g, "&lt;")
   .replace(/>/g, "&gt;");

const span = (cls: string, text: string) =>
  `<span class="${cls}">${text}</span>`;

const COLORS = {
  key: "text-[#9cdcfe]",
  string: "text-[#ce9178]",
  number: "text-[#b5cea8]",
  keyword: "text-[#c586c0]",
  type: "text-[#4ec9b0]",
  func: "text-[#dcdcaa]",
  boolean: "text-[#569cd6]"
};

/**
 * IMPORTANT:
 * We highlight line-by-line and never re-process injected HTML.
 */
export const highlightCode = (code: string, lang: Lang): string => {
  if (!code) return "";

  const lines = code.split("\n");

  const highlightLine = (line: string): string => {
    let text = escapeHtml(line);

    /* ---------- JSON ---------- */
    if (lang === "json") {
      return text.replace(
        /("(?:\\.|[^"])*")(\s*:)?|\b(true|false|null)\b|-?\d+(\.\d+)?/g,
        (match, _, colon, bool) => {
          if (colon) return span(COLORS.key, match);
          if (bool) return span(COLORS.boolean, match);
          if (/^-?\d/.test(match)) return span(COLORS.number, match);
          return span(COLORS.string, match);
        }
      );
    }

    /* ---------- TS ---------- */
    if (lang === "ts") {
      text = text.replace(/\b(export|interface|type|extends|readonly)\b/g, span(COLORS.keyword, "$1"));
      text = text.replace(/\b(string|number|boolean|null|any)\b/g, span(COLORS.keyword, "$1"));
      text = text.replace(/\b([A-Z][A-Za-z0-9_]*)\b/g, span(COLORS.type, "$1"));
      text = text.replace(/(\w+)(:)/g, `${span(COLORS.key, "$1")}$2`);
      return text;
    }

    /* ---------- SQL ---------- */
    if (lang === "sql") {
      text = text.replace(
        /\b(CREATE|TABLE|PRIMARY|KEY|BOOLEAN|TEXT|DOUBLE|PRECISION|SERIAL|NOT|NULL|JSONB)\b/gi,
        span(COLORS.keyword, "$1")
      );

      text = text.replace(/"[^"]+"/g, span(COLORS.string, "$&"));

      text = text.replace(/\b\d+\b/g, span(COLORS.number, "$&"));

      return text;
    }

    /* ---------- PYDANTIC ---------- */
    if (lang === "py") {
      text = text.replace(/\b(class|from|import|pass)\b/g, span(COLORS.keyword, "$1"));
      text = text.replace(/\b(BaseModel|Field|List|Optional|Any)\b/g, span(COLORS.type, "$1"));
      text = text.replace(/\b([A-Z][A-Za-z0-9_]*)\b/g, span(COLORS.type, "$1"));
      text = text.replace(/^(\s*)([a-z_][a-z0-9_]*)(:)/i,
        (_, ws, name, colon) => `${ws}${span(COLORS.key, name)}${colon}`
      );
      text = text.replace(/"[^"]*"|'[^']*'/g, span(COLORS.string, "$&"));
      text = text.replace(/\b\d+\b/g, span(COLORS.number, "$&"));
      return text;
    }

    return text;
  };

  return lines.map(highlightLine).join("\n");
};
