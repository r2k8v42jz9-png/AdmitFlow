import { Fragment, type ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Render inline markdown: **bold**, *italic*, `code`. */
function renderInline(text: string): ReactNode[] {
  const tokens = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
  return tokens.map((tok, i) => {
    if (tok.startsWith("**") && tok.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-foreground">
          {tok.slice(2, -2)}
        </strong>
      );
    }
    if (tok.startsWith("`") && tok.endsWith("`")) {
      return (
        <code key={i} className="rounded bg-muted px-1.5 py-0.5 font-mono text-[0.85em] text-foreground">
          {tok.slice(1, -1)}
        </code>
      );
    }
    if (tok.startsWith("*") && tok.endsWith("*") && tok.length > 2) {
      return (
        <em key={i} className="italic">
          {tok.slice(1, -1)}
        </em>
      );
    }
    return <Fragment key={i}>{tok}</Fragment>;
  });
}

type Block =
  | { type: "p"; lines: string[] }
  | { type: "ul"; items: string[] }
  | { type: "ol"; items: string[] }
  | { type: "h"; level: number; text: string }
  | { type: "table"; rows: string[][] };

function parse(md: string): Block[] {
  const lines = md.split("\n");
  const blocks: Block[] = [];
  let i = 0;

  const splitRow = (line: string) =>
    line
      .trim()
      .replace(/^\||\|$/g, "")
      .split("|")
      .map((c) => c.trim());

  while (i < lines.length) {
    const line = lines[i];
    const trimmed = line.trim();

    if (!trimmed) {
      i++;
      continue;
    }

    // Table
    if (trimmed.startsWith("|")) {
      const rows: string[][] = [];
      while (i < lines.length && lines[i].trim().startsWith("|")) {
        const cells = splitRow(lines[i]);
        // skip separator row (---|---)
        if (!cells.every((c) => /^:?-{2,}:?$/.test(c) || c === "")) {
          rows.push(cells);
        }
        i++;
      }
      blocks.push({ type: "table", rows });
      continue;
    }

    // Heading
    const heading = trimmed.match(/^(#{1,4})\s+(.*)$/);
    if (heading) {
      blocks.push({ type: "h", level: heading[1].length, text: heading[2] });
      i++;
      continue;
    }

    // Ordered list
    if (/^\d+\.\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^\d+\.\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^\d+\.\s+/, ""));
        i++;
      }
      blocks.push({ type: "ol", items });
      continue;
    }

    // Unordered list
    if (/^[-*]\s+/.test(trimmed)) {
      const items: string[] = [];
      while (i < lines.length && /^[-*]\s+/.test(lines[i].trim())) {
        items.push(lines[i].trim().replace(/^[-*]\s+/, ""));
        i++;
      }
      blocks.push({ type: "ul", items });
      continue;
    }

    // Paragraph (gather consecutive plain lines)
    const para: string[] = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].trim().startsWith("|") &&
      !/^[-*]\s+/.test(lines[i].trim()) &&
      !/^\d+\.\s+/.test(lines[i].trim()) &&
      !/^#{1,4}\s+/.test(lines[i].trim())
    ) {
      para.push(lines[i].trim());
      i++;
    }
    blocks.push({ type: "p", lines: para });
  }

  return blocks;
}

export function Markdown({ content }: { content: string }) {
  const blocks = parse(content);

  return (
    <div className="space-y-3 text-sm leading-relaxed">
      {blocks.map((block, idx) => {
        switch (block.type) {
          case "h":
            return (
              <p key={idx} className="font-display text-base font-semibold text-foreground">
                {renderInline(block.text)}
              </p>
            );
          case "ul":
            return (
              <ul key={idx} className="space-y-1.5">
                {block.items.map((it, j) => (
                  <li key={j} className="flex gap-2.5">
                    <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary/70" />
                    <span>{renderInline(it)}</span>
                  </li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={idx} className="space-y-1.5">
                {block.items.map((it, j) => (
                  <li key={j} className="flex gap-2.5">
                    <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-md bg-primary/15 text-[11px] font-semibold text-primary">
                      {j + 1}
                    </span>
                    <span className="pt-0.5">{renderInline(it)}</span>
                  </li>
                ))}
              </ol>
            );
          case "table":
            return (
              <div key={idx} className="overflow-x-auto rounded-xl border border-border/60">
                <table className="w-full border-collapse text-left text-xs">
                  <tbody>
                    {block.rows.map((row, r) => (
                      <tr key={r} className={r === 0 ? "border-b border-border/60 bg-muted/40" : "border-b border-border/40 last:border-0"}>
                        {row.map((cell, c) => (
                          <td
                            key={c}
                            className={cn(
                              "px-3 py-2",
                              r === 0 && "font-semibold text-foreground",
                              c === 0 && r > 0 && "font-medium text-foreground",
                            )}
                          >
                            {renderInline(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          default:
            return (
              <p key={idx}>
                {block.lines.map((ln, j) => (
                  <Fragment key={j}>
                    {renderInline(ln)}
                    {j < block.lines.length - 1 && <br />}
                  </Fragment>
                ))}
              </p>
            );
        }
      })}
    </div>
  );
}
