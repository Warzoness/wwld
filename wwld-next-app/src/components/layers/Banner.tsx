"use client";

import Image from "next/image";
import clsx from "clsx";

type BannerProps = {
    src?: string;
    alt?: string;
    title?: string;
    subtitle?: string;
    /** left | center | right */
    align?: "left" | "center" | "right";
    /** chiều cao banner (px), mặc định desktop 320 / mobile 220 */
    heightDesktop?: number;
    heightMobile?: number;
    /** object-position cho ảnh: "center", "50% 30%", ... */
    objectPosition?: string;
};

export default function Banner({
    src = "/images/Wuthering-Waves-Lore-Data.png",
    alt = "Banner",
    align = "center",
    heightDesktop = 320,
    heightMobile = 220,
    objectPosition = "center",
}: BannerProps) {
    return (
        <div
            className={clsx("banner position-relative", {
                "banner--left": align === "left",
                "banner--center": align === "center",
                "banner--right": align === "right",
            })}
            style={
                {
                    // chiều cao linh hoạt theo breakpoint (CSS cũng có fallback)
                    "--banner-h-desktop": `${heightDesktop}px`,
                    "--banner-h-mobile": `${heightMobile}px`,
                } as React.CSSProperties
            }
        >
            {/* Ảnh tối ưu bằng next/image */}
            <Image
                src={src}
                alt={alt}
                fill
                priority
                sizes="100vw"
                style={{
                    objectFit: "cover",
                    objectPosition,
                }}
            />
            <div className="gradient-overlay" aria-hidden="true" />
        </div>
    );
}
