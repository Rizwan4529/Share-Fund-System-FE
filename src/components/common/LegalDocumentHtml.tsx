import { cn } from "../../lib/utils";
import {
  looksLikeHtml,
  sanitizeLegalHtml,
} from "../../lib/legal/html";

type LegalDocumentHtmlProps = {
  content: string;
  className?: string;
};

export function LegalDocumentHtml({
  content,
  className,
}: LegalDocumentHtmlProps) {
  if (!looksLikeHtml(content)) {
    return (
      <div
        className={cn(
          "whitespace-pre-wrap text-sm leading-relaxed text-ink-heading",
          className,
        )}
      >
        {content}
      </div>
    );
  }

  return (
    <div
      className={cn("legal-document-html", className)}
      dangerouslySetInnerHTML={{ __html: sanitizeLegalHtml(content) }}
    />
  );
}
