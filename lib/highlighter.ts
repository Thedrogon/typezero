type Lang = "json" | "ts" | "sql" | "py";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;")
   .replace(/</g, "&lt;")
   .replace(/>/g, "&gt;");

const span = (cls: string, text: string) =>
  `<span class="${cls}">${text}</span>`;

/*
  Tuned VS Code Dark+ palette.
  We intentionally boost contrast vs your background.
*/
const COLORS = {
  key: "text-[#9cdcfe]",          // object keys / fields
  string: "text-[#ce9178]",
  number: "text-[#b5cea8]",
  keyword: "text-[#c586c0]",
  type: "text-[#4ec9b0]",
  func: "text-[#dcdcaa]",
  boolean: "text-[#569cd6]",
  punctuation: "text-[#808080]"
};

export const highlightCode = (code: string, lang: Lang): string => {
  if (!code) return "";

  let html = escapeHtml(code);

  /* ---------- JSON ---------- */
  if (lang === "json") {
    return html.replace(
      /("(?:\\.|[^"])*")(\s*:)?|\b(true|false|null)\b|-?\d+(\.\d+)?/g,
      (match, str, colon, bool) => {
        if (colon) return span(COLORS.key, match);
        if (bool) return span(COLORS.boolean, match);
        if (/^-?\d/.test(match)) return span(COLORS.number, match);
        return span(COLORS.string, match);
      }
    );
  }

  /* ---------- TYPESCRIPT ---------- */
  if (lang === "ts") {
    html = html
      .replace(/\b(export|interface|type|extends|readonly)\b/g, span(COLORS.keyword, "$1"))
      .replace(/\b(string|number|boolean|null|any)\b/g, span(COLORS.keyword, "$1"))
      .replace(/(interface\s+)([A-Z]\w*)/g, `$1${span(COLORS.type, "$2")}`)
      .replace(/(\w+)(:)/g, `${span(COLORS.key, "$1")}$2`)
      .replace(/\b([A-Z][A-Za-z0-9_]+)\b/g, span(COLORS.type, "$1")); // types

    return html;
  }

  /* ---------- SQL ---------- */
  if (lang === "sql") {
    html = html
      .replace(
        /\b(CREATE|TABLE|PRIMARY|KEY|BOOLEAN|TEXT|DOUBLE|PRECISION|SERIAL|NOT|NULL|JSONB|SELECT|FROM|WHERE)\b/gi,
        span(COLORS.keyword, "$1")
      )
      .replace(/\b([a-z_][a-z0-9_]*)\b(?=\s+\()/gi, span(COLORS.func, "$1")) // functions
      .replace(/"[^"]+"/g, span(COLORS.string, "$&"));

    return html;
  }

  /* ---------- PYTHON / PYDANTIC ---------- */
  if (lang === "py") {
    html = html
      // imports / keywords
      .replace(/\b(class|from|import|as|return|pass)\b/g, span(COLORS.keyword, "$1"))

      // typing constructs
      .replace(/\b(List|Optional|Dict|Any|Union)\b/g, span(COLORS.type, "$1"))

      // BaseModel / Field / validator / etc
      .replace(/\b(BaseModel|Field|validator)\b/g, span(COLORS.type, "$1"))

      // class names
      .replace(/(class\s+)([A-Z]\w*)/g, `$1${span(COLORS.type, "$2")}`)

      // function calls
      .replace(/\b([a-z_][a-z0-9_]*)\(/gi, `${span(COLORS.func, "$1")}(`)

      // field names
      .replace(/^\s*([a-z_][a-z0-9_]*)\s*:/gim, (_, name) =>
        `    ${span(COLORS.key, name)}:`
      )

      // strings
      .replace(/"[^"]*"|'[^']*'/g, span(COLORS.string, "$&"))

      // numbers
      .replace(/\b\d+(\.\d+)?\b/g, span(COLORS.number, "$&"));

    return html;
  }

  return html;
};
