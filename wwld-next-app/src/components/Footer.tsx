import Link from "next/link";

export default function Footer() {
  return (
    <footer className="iris-footer">
      <div className="container py-5 text-center">
        <h2 className="iris-footer__title">Liên hệ với chúng tôi</h2>

        <div className="iris-social">
          <a href="https://facebook.com/" target="_blank" rel="noopener noreferrer" aria-label="Facebook" className="iris-social__link iris-social--fb">
            <i className="bi bi-facebook"></i>
          </a>
          <a href="https://twitter.com/" target="_blank" rel="noopener noreferrer" aria-label="Twitter/X" className="iris-social__link iris-social--tw">
            <i className="bi bi-twitter"></i>
          </a>
          <a href="https://tiktok.com/" target="_blank" rel="noopener noreferrer" aria-label="TikTok" className="iris-social__link iris-social--tt">
            <i className="bi bi-tiktok"></i>
          </a>
          <a href="https://discord.com/" target="_blank" rel="noopener noreferrer" aria-label="Discord" className="iris-social__link iris-social--dc">
            <i className="bi bi-discord"></i>
          </a>
        </div>

        <h3 className="iris-muted mt-4 mb-2">Hoặc</h3>
        <Link href="/feedback" className="iris-btn iris-btn--primary iris-btn--pill">
          Gửi phản hồi
        </Link>

        <p className="iris-copy mt-4 mb-0">© {new Date().getFullYear()} WWLD</p>
      </div>
    </footer>
  );
}
