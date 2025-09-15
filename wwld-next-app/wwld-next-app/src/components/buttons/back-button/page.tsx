"use client";

import { useRouter } from "next/navigation";
import Link from "next/link";
import clsx from "clsx";
import styles from "./BackButton.module.css";

type Variant = "ghost" | "fab";

interface Props {
  href?: string;          // nếu truyền, sẽ push tới URL này; nếu không, router.back()
  label?: string;         // mặc định: "Quay lại"
  variant?: Variant;      // "ghost" | "fab"
  className?: string;     // thêm class ngoài nếu cần
  title?: string;         // tooltip
}

export default function BackButton({
  href,
  label = "Quay lại",
  variant = "ghost",
  className,
  title,
}: Props) {
  const router = useRouter();

  const handleClick = (e: React.MouseEvent) => {
    if (!href) {
      e.preventDefault();
      router.back();
    }
  };

  // ghost: <a> để kế thừa style link; fab: <button>
  if (variant === "fab") {
    return (
      <button
        type="button"
        aria-label={label}
        title={title ?? label}
        className={clsx(styles.fab, className)}
        onClick={() => (href ? router.push(href) : router.back())}
      >
        <i className="bi bi-arrow-left-short" />
      </button>
    );
  }

  return (
    <div className={styles.wapper}>
      <Link
      href={href || "#"}
      onClick={handleClick}
      aria-label={label}
      title={title ?? label}
      className={clsx(styles.ghost, className)}
    >
      <i className="bi bi-arrow-left me-2" />
      {label}
    </Link>
    </div>
  );
}
