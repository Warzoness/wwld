"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import styles from "./MentionTextArea.module.css";

export type EntityType = "character" | "concept" | "note";

export interface Suggestion {
  id: number;
  name: string;
  type: EntityType;
}

export interface MentionTextAreaProps {
  value: string;
  onChange: (next: string) => void;

  /** Tìm kiếm suggestion theo từ khoá không dấu cách ngay sau @ */
  fetchSuggestions: (keyword: string) => Promise<Suggestion[]>;

  /** Xây link cho entity đã chọn */
  buildEntityUrl: (s: Suggestion) => string;

  /** placeholder & rows tuỳ chọn */
  placeholder?: string;
  rows?: number;

  /** label hiển thị (nếu muốn) */
  ariaLabel?: string;
}

export default function MentionTextArea({
  value,
  onChange,
  fetchSuggestions,
  buildEntityUrl,
  placeholder,
  rows = 6,
  ariaLabel = "mention textarea",
}: MentionTextAreaProps) {
  const [query, setQuery] = useState<string>("");          // phần text sau "@"
  const [open, setOpen] = useState<boolean>(false);        // dropdown mở/đóng
  const [loading, setLoading] = useState<boolean>(false);
  const [items, setItems] = useState<Suggestion[]>([]);
  const [activeIndex, setActiveIndex] = useState<number>(0);

  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const lastTriggerPos = useRef<number | null>(null);       // vị trí ký tự '@' trong value

  // debounce query
  useEffect(() => {
    let timer: number | undefined;
    if (open && query.length >= 0) {
      timer = window.setTimeout(async () => {
        setLoading(true);
        try {
          const list = await fetchSuggestions(query);
          setItems(list);
          setActiveIndex(0);
        } finally {
          setLoading(false);
        }
      }, 150);
    }
    return () => {
      if (timer) window.clearTimeout(timer);
    };
  }, [open, query, fetchSuggestions]);

  // tìm token hiện tại kể từ caret để biết có đang ở sau '@' không
  const detectMentionContext = (text: string, caret: number) => {
    // tìm ký tự '@' gần nhất bên trái caret, dừng lại nếu gặp khoảng trắng hoặc xuống dòng
    for (let i = caret - 1; i >= 0; i--) {
      const ch = text[i];
      if (ch === "@") {
        return { triggerIndex: i };
      }
      if (ch === " " || ch === "\n" || ch === "\t") break;
    }
    return null;
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const next = e.target.value;
    onChange(next);

    const caret = e.target.selectionStart ?? next.length;
    const ctx = detectMentionContext(next, caret);

    if (ctx) {
      lastTriggerPos.current = ctx.triggerIndex;
      const after = next.slice(ctx.triggerIndex + 1, caret);
      // chỉ mở dropdown nếu sau @ không có khoảng trắng
      if (!/\s/.test(after)) {
        setQuery(after);
        setOpen(true);
        return;
      }
    }

    // không còn ở ngữ cảnh mention
    lastTriggerPos.current = null;
    setOpen(false);
    setQuery("");
  };

  const closeDropdown = () => {
    setOpen(false);
    setQuery("");
    lastTriggerPos.current = null;
  };

  const insertSelection = (s: Suggestion) => {
    if (taRef.current == null) return;

    const ta = taRef.current;
    const caret = ta.selectionStart ?? value.length;
    const trigger = lastTriggerPos.current;
    if (trigger == null) {
      // fallback: chèn ở caret hiện tại
      const link = `[${s.name}](${buildEntityUrl(s)})`;
      const merged = value.slice(0, caret) + link + value.slice(caret);
      onChange(merged);
      // đặt lại caret sau link
      const newPos = caret + link.length;
      requestAnimationFrame(() => {
        ta.setSelectionRange(newPos, newPos);
        ta.focus();
      });
      closeDropdown();
      return;
    }

    // thay thế từ @... tới caret bằng link
    const before = value.slice(0, trigger);
    const after = value.slice(caret);
    const link = `[${s.name}](${buildEntityUrl(s)})`;

    const merged = before + link + after;
    onChange(merged);

    const newPos = (before + link).length;
    requestAnimationFrame(() => {
      ta.setSelectionRange(newPos, newPos);
      ta.focus();
    });
    closeDropdown();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (!open) return;

    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIndex((i) => (i + 1 < items.length ? i + 1 : i));
      return;
    }
    if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIndex((i) => (i - 1 >= 0 ? i - 1 : i));
      return;
    }
    if (e.key === "Enter" || e.key === "Tab") {
      if (items[activeIndex]) {
        e.preventDefault();
        insertSelection(items[activeIndex]);
      }
      return;
    }
    if (e.key === "Escape") {
      e.preventDefault();
      closeDropdown();
      return;
    }
  };

  // đóng dropdown khi blur textarea
  const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
    // trễ nhẹ để click item không bị mất
    setTimeout(() => {
      if (!document.activeElement || document.activeElement.tagName !== "LI") {
        closeDropdown();
      }
    }, 120);
  };

  const showList = open && (loading || items.length > 0);

  // icon theo type
  const iconFor = (t: EntityType): string => {
    switch (t) {
      case "character":
        return "👤";
      case "concept":
        return "📚";
      case "note":
        return "📝";
      default:
        return "🔗";
    }
  };

  return (
    <div className={styles.wrap}>
      <textarea
        ref={taRef}
        className={styles.textarea}
        value={value}
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        onBlur={handleBlur}
        placeholder={placeholder}
        rows={rows}
        aria-label={ariaLabel}
      />

      {showList && (
        <div className={styles.dropdown} role="listbox" aria-label="mention list">
          {loading ? (
            <div className={styles.loading}>Đang tìm…</div>
          ) : (
            <ul className={styles.list}>
              {items.map((s, idx) => (
                <li
                  key={`${s.type}-${s.id}`}
                  className={`${styles.item} ${idx === activeIndex ? styles.active : ""}`}
                  onMouseDown={(e) => {
                    e.preventDefault(); // để không mất focus textarea
                    insertSelection(s);
                  }}
                >
                  <span className={styles.icon}>{iconFor(s.type)}</span>
                  <span className={styles.name}>{s.name}</span>
                  <span className={styles.typeBadge}>{s.type}</span>
                </li>
              ))}
              {items.length === 0 && <li className={styles.empty}>Không có kết quả</li>}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
