import DOMPurify from "dompurify";

const HTML_TAG = /<\/?[a-z][\s\S]*>/i;

const ALLOWED_TAGS = [
  "p",
  "br",
  "strong",
  "b",
  "em",
  "i",
  "u",
  "s",
  "h2",
  "h3",
  "ul",
  "ol",
  "li",
  "blockquote",
  "hr",
  "a",
];

const ALLOWED_ATTR = ["href", "target", "rel"];

export function looksLikeHtml(value: string): boolean {
  return HTML_TAG.test(value);
}

export function legalHtmlHasText(html: string): boolean {
  const text = html
    .replace(/<[^>]*>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > 0;
}

export function sanitizeLegalHtml(html: string): string {
  return DOMPurify.sanitize(html, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
  });
}

export function toEditorHtml(value: string): string {
  if (!value.trim()) return "";
  if (looksLikeHtml(value)) return sanitizeLegalHtml(value);

  return value
    .split(/\n{2,}/)
    .map((block) => {
      const escaped = block
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll("\n", "<br>");
      return `<p>${escaped}</p>`;
    })
    .join("");
}
