import Image from "next/image";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="footer">
      <div className="footer-grid">
        <div>
          <Image className="footer-logo" src="/seoul-foods-logo.png" alt="Seoul Foods" width={280} height={99} />
          <p>Good snacks. Real ingredients.<br />A little closer to home.</p>
        </div>
        <div>
          <p className="footer-label">Come through</p>
          <p>410 Belgrade Ave<br />North Mankato, MN 56003</p>
          <a href="https://maps.google.com/?q=410+Belgrade+Ave+North+Mankato+MN+56003" target="_blank" rel="noreferrer">Get directions ↗</a>
        </div>
        <div>
          <p className="footer-label">Keep in touch</p>
          <a href="tel:+15077205306">(507) 720-5306</a>
          <a href="mailto:mankatoseoulfoods@gmail.com">Email the store</a>
          <a href="https://www.instagram.com/katoseoulfoods" target="_blank" rel="noreferrer">@katoseoulfoods ↗</a>
        </div>
        <div>
          <p className="footer-label">Demo notice</p>
          <p>Products, prices and pickup requests are for demonstration. Payment happens in store.</p>
        </div>
      </div>
      <div className="footer-bottom"><span>© {new Date().getFullYear()} Seoul Foods</span><span>서울 푸드 • North Mankato</span></div>
    </footer>
  );
}
