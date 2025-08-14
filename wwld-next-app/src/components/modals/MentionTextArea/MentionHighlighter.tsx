"use client";

import Link from "next/link";
import { useMemo } from "react";
import styles from "./MentionHighlighter.module.css";

type MentionKind = "character" | "concept" | "note" | "other";

interface TokenText { type: "text"; value: string }
interface TokenLink { type: "link"; value: string; href: string; kind: MentionKind }
type Token = TokenText | TokenLink;

export interface MentionHighlighterProps {
  text: string;            // nội dung thoại gốc
  className?: string;      // thêm class ngoài nếu cần
}

/** Quy ước: link dạng [Tên](/admin/{character-detail|concept-detail|note-detail}/{id}) */
function kindFromHref(href: string): MentionKind {
  const m = href.match(/^\/admin\/(character-detail|concept-detail|note-detail)\/\d+/);
  if (!m) return "other";
  switch (m[1]) {
    case "character-detail": return "character";
    case "concept-detail":   return "concept";
    case "note-detail":      return "note";
    default: return "other";
  }
}

function tokenize(text: string): Token[] {
  const tokens: Token[] = [];
  const re = /\[([^\]]+)\]\((\/[^)\s]+)\)/g; // [label](/path)
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = re.exec(text)) !== null) {
    if (match.index > lastIndex) {
      tokens.push({ type: "text", value: text.slice(lastIndex, match.index) });
    }
    tokens.push({
      type: "link",
      value: match[1],
      href: match[2],
      kind: kindFromHref(match[2]),
    });
    lastIndex = re.lastIndex;
  }
  if (lastIndex < text.length) {
    tokens.push({ type: "text", value: text.slice(lastIndex) });
  }
  return tokens;
}

export default function MentionHighlighter({ text, className }: MentionHighlighterProps) {
  const parts = useMemo(() => tokenize(text), [text]);

  return (
    <span className={`${styles.container} ${className ?? ""}`}>
      {parts.map((p, i) => {
        if (p.type === "text") return <span key={i}>{p.value}</span>;
        return (
          <Link
            key={i}
            href={p.href}
            className={`${styles.mention} ${styles[p.kind]}`}
            title={p.value}
          >
            {p.value}
          </Link>
        );
      })}
    </span>
  );
}
