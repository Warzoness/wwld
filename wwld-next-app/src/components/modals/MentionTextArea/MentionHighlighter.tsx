"use client";

import Link from "next/link";
import { useMemo } from "react";
import styles from "./MentionHighlighter.module.css";

type MentionKind = "character" | "concept" | "note" | "other";

interface TokenText { type: "text"; value: string }
interface TokenLink { type: "link"; value: string; href: string; kind: MentionKind; id?: number }
type Token = TokenText | TokenLink;

export interface MentionHighlighterProps {
  text: string;
  className?: string;
  /** Nếu truyền hàm này, click vào note sẽ mở modal thay vì điều hướng */
  onNoteOpen?: (id: number) => void;
}

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

function extractIdFromHref(href: string): number | undefined {
  const m = href.match(/^\/admin\/(?:character-detail|concept-detail|note-detail)\/(\d+)/);
  return m ? Number(m[1]) : undefined;
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
    const href = match[2];
    const kind = kindFromHref(href);
    tokens.push({
      type: "link",
      value: match[1],
      href,
      kind,
      id: extractIdFromHref(href),
    });
    lastIndex = re.lastIndex;
  }
  if (lastIndex < text.length) tokens.push({ type: "text", value: text.slice(lastIndex) });
  return tokens;
}

export default function MentionHighlighter({ text, className, onNoteOpen }: MentionHighlighterProps) {
  const parts = useMemo(() => tokenize(text), [text]);

  return (
    <span className={`${styles.container} ${className ?? ""}`}>
      {parts.map((p, i) => {
        if (p.type === "text") return <span key={i}>{p.value}</span>;

        // Nếu là note và có callback -> dùng button để mở modal
        if (p.kind === "note" && onNoteOpen && typeof p.id === "number") {
          return (
            <button
            style={{color: "#ffff"}}
              key={i}
              type="button"
              className={`${styles.mention} ${styles.note} ${styles.buttonReset}`}
              title={p.value}
              onClick={() => onNoteOpen(p.id!)}
            >
              {p.value}
            </button>
          );
        }

        // Mặc định: vẫn là Link bình thường
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
