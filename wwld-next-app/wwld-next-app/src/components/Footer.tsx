import Link from "next/link";

type SocialLink = {
  href: string;
  iconClass: string; // ví dụ: "bi bi-facebook"
  label: string;     // aria-label
  extraClass?: string; // ví dụ: "iris-social--fb"
};

const SOCIALS: SocialLink[] = [
  { href: "https://facebook.com/", iconClass: "bi bi-facebook", label: "Facebook", extraClass: "iris-social--fb" },
  { href: "https://twitter.com/", iconClass: "bi bi-twitter", label: "Twitter/X", extraClass: "iris-social--tw" },
  { href: "https://tiktok.com/", iconClass: "bi bi-tiktok", label: "TikTok", extraClass: "iris-social--tt" },
  { href: "https://discord.com/", iconClass: "bi bi-discord", label: "Discord", extraClass: "iris-social--dc" },
];

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="iris-footer">
      <div className="container py-5 text-center iris-footer__inner">
        <h2 className="iris-footer__title">Liên hệ với chúng tôi</h2>

        {/* Socials */}
        <nav className="iris-social" aria-label="Kênh mạng xã hội">
          {SOCIALS.map((s) => (
            <a
              key={s.label}
              href={s.href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={s.label}
              className={`iris-social__link ${s.extraClass || ""}`}
              title={s.label}
            >
              <i className={s.iconClass} aria-hidden="true" />
              <span className="visually-hidden">{s.label}</span>
            </a>
          ))}
        </nav>

        {/* CTA */}
        <h3 className="iris-muted mt-4 mb-2">Hoặc</h3>
        <Link href="/feedback" className="iris-btn iris-btn--primary iris-btn--pill">
          Gửi phản hồi
        </Link>

        {/* Copy */}
        <p className="iris-copy mt-4 mb-0">© {year} WWLD</p>
      </div>
    </footer>
  );
}
