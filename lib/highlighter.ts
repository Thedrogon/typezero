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

export const highlightCode = (code: string, lang: Lang): string => {
  if (!code) return "";
  const lines = code.split("\n");

  const highlightLine = (line: string): string => {
    const text = escapeHtml(line);

    /* ---------- JSON ---------- */
    // Combined regex for Keys, Strings, Booleans, Numbers
    if (lang === "json") {
      return text.replace(
        /("(?:\\.|[^"])*")(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d+)?/g,
        (match, str, colon, bool) => {
          if (colon) return span(COLORS.key, match); // "key":
          if (bool) return span(COLORS.boolean, match); // true/false
          if (/^-?\d/.test(match)) return span(COLORS.number, match); // 123
          return span(COLORS.string, match); // "value"
        }
      );
    }

    /* ---------- TYPESCRIPT ---------- */
    // Order: Strings -> Keywords -> Types (Capitalized) -> Keys (prop:)
    if (lang === "ts") {
      const rx = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*'|`(?:[^`\\]|\\.)*`)|(\b(?:export|interface|type|extends|readonly|string|number|boolean|null|any|void|object|return|const|let|var|function)\b)|(\b[A-Z][a-zA-Z0-9_]*\b)|(\w+\s*:)/g;
      
      return text.replace(rx, (match, str, keyword, type, key) => {
        if (str) return span(COLORS.string, str);
        if (keyword) return span(COLORS.keyword, match);
        if (type) return span(COLORS.type, match);
        if (key) {
           // Color the identifier, keep the colon plain
           return match.replace(/(\w+)(\s*:)/, (_, k, c) => `${span(COLORS.key, k)}${c}`);
        }
        return match;
      });
    }

    /* ---------- SQL ---------- */
    // Order: Strings/Identifiers -> Keywords -> Numbers
    if (lang === "sql") {
      const rx = /("[^"]*"|'[^']*')|(\b(?:CREATE|TABLE|PRIMARY|KEY|BOOLEAN|TEXT|DOUBLE|PRECISION|SERIAL|NOT|NULL|JSONB|BIGSERIAL|INSERT|INTO|VALUES|SELECT|FROM|WHERE|AND|OR|LIMIT|OFFSET)\b)|(\b\d+\b)/gi;

      return text.replace(rx, (match, str, keyword, number) => {
        if (str) return span(COLORS.string, str); // Identifiers like "id"
        if (keyword) return span(COLORS.keyword, match); // Keywords
        if (number) return span(COLORS.number, match);
        return match;
      });
    }

    /* ---------- PYDANTIC (PYTHON) ---------- */
    // Order: Strings -> Keywords -> Known Types -> Capitalized Types -> Keys
    if (lang === "py") {
      const rx = /("(?:[^"\\]|\\.)*"|'(?:[^'\\]|\\.)*')|(\b(?:class|from|import|pass|def|return|if|else|elif)\b)|(\b(?:BaseModel|Field|List|Optional|Any|str|int|float|bool|None)\b)|(\b[A-Z][a-zA-Z0-9_]*\b)|(^\s*\w+\s*:)/g;

      return text.replace(rx, (match, str, keyword, knownType, capType, keyPair) => {
        if (str) return span(COLORS.string, str);
        if (keyword) return span(COLORS.keyword, match);
        if (knownType) return span(COLORS.type, match);
        if (capType) return span(COLORS.type, match);
        if (keyPair) {
           // Handle "    name:" at start of line
           return match.replace(/(\w+)(\s*:)/, (_, k, c) => `${span(COLORS.key, k)}${c}`);
        }
        return match;
      });
    }

    return text;
  };

  return lines.map(highlightLine).join("\n");
};