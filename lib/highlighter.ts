export const highlightCode = (code: string, lang: "json" | "ts" | "sql" | "py"): string => {
  if (!code) return "";
  let html = code
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");

  // Helper to wrap text in spans
  const span = (cls: string, text: string) => `<span class="${cls}">${text}</span>`;

  if (lang === "json") {
    html = html.replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      (match) => {
        let cls = "text-[#ce9178]"; // String (Orange)
        if (/^"/.test(match)) {
          if (/:$/.test(match)) cls = "text-[#9cdcfe]"; // Key (Light Blue)
        } else if (/true|false/.test(match)) {
          cls = "text-[#569cd6]"; // Boolean (Blue)
        } else if (/null/.test(match)) {
          cls = "text-[#569cd6]"; // Null (Blue)
        } else {
          cls = "text-[#b5cea8]"; // Number (Light Green)
        }
        return span(cls, match);
      }
    );
  } 
  else if (lang === "ts") {
    // Keywords
    html = html.replace(/\b(export|interface|type|string|number|boolean|null|any)\b/g, span("text-[#c586c0]", "$1"));
    // Interface Names
    html = html.replace(/(interface\s+)([A-Z][a-zA-Z0-9_]*)/g, `$1${span("text-[#4ec9b0]", "$2")}`);
    // Keys
    html = html.replace(/([a-zA-Z0-9_?]+)(:)/g, `${span("text-[#9cdcfe]", "$1")}$2`);
  }
  else if (lang === "sql") {
    // Keywords
    html = html.replace(/\b(CREATE|TABLE|INT|TEXT|BOOLEAN|PRIMARY|KEY|SERIAL)\b/g, span("text-[#c586c0]", "$1"));
  }
  else if (lang === "py") {
    // Keywords & Decorators
    html = html.replace(/\b(class|from|import|typing)\b/g, span("text-[#c586c0]", "$1"));
    html = html.replace(/(@[a-zA-Z_]+)/g, span("text-[#dcdcaa]", "$1")); // Decorator
    html = html.replace(/(class\s+)([A-Z][a-zA-Z0-9_]*)/g, `$1${span("text-[#4ec9b0]", "$2")}`); // Class Name
  }

  return html;
};