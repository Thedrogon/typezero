type Lang = "json" | "ts" | "sql" | "py";

const escapeHtml = (s: string) =>
  s.replace(/&/g, "&amp;")
   .replace(/</g, "&lt;")
   .replace(/>/g, "&gt;");

const span = (cls: string, text: string) =>
  `<span class="${cls}">${text}</span>`;

// VS Code Dark+ inspired palette (balanced for Tailwind)
const COLORS = {
  key: "text-[#9cdcfe]",
  string: "text-[#ce9178]",
  number: "text-[#b5cea8]",
  keyword: "text-[#c586c0]",
  type: "text-[#4ec9b0]",
  boolean: "text-[#569cd6]",
  decorator: "text-[#dcdcaa]"
};

export const highlightCode = (code: string, lang: Lang): string => {
  if (!code) return "";

  let html = escapeHtml(code);

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

  if (lang === "ts") {
    html = html.replace(/\b(export|interface|type)\b/g, span(COLORS.keyword, "$1"));
    html = html.replace(/\b(string|number|boolean|null|any)\b/g, span(COLORS.keyword, "$1"));
    html = html.replace(/(interface\s+)([A-Z]\w*)/g, `$1${span(COLORS.type, "$2")}`);
    html = html.replace(/(\w+)(:)/g, `${span(COLORS.key, "$1")}$2`);
    return html;
  }

  if (lang === "sql") {
    html = html.replace(
      /\b(CREATE|TABLE|PRIMARY|KEY|BOOLEAN|TEXT|DOUBLE|SERIAL|NOT|NULL)\b/g,
      span(COLORS.keyword, "$1")
    );
    return html;
  }

  if (lang === "py") {
    html = html.replace(/\b(class|from|import|List|Optional)\b/g, span(COLORS.keyword, "$1"));
    html = html.replace(/(class\s+)([A-Z]\w*)/g, `$1${span(COLORS.type, "$2")}`);
    return html;
  }

  return html;
};
