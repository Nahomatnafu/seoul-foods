"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { useCart } from "./cart-provider";

const links = [
  { href: "/shop", label: "Shop" },
  { href: "/visit", label: "Visit" },
];

export function Header() {
  const pathname = usePathname();
  const { count } = useCart();
  const [open, setOpen] = useState(false);

  return (
    <>
      <div className="announcement">North Mankato&apos;s neighborhood Asian market <span>•</span> Pay in store at pickup</div>
      <header className="site-header">
        <Link className="brand" href="/" aria-label="Seoul Foods home">
          <Image src="/seoul-foods-logo.png" alt="Seoul Foods" width={315} height={111} priority />
        </Link>
        <button className="menu-button" onClick={() => setOpen(!open)} aria-expanded={open} aria-label="Toggle menu">
          <span /> <span />
        </button>
        <nav className={open ? "nav open" : "nav"} aria-label="Main navigation">
          {links.map((link) => <Link key={link.href} href={link.href} onClick={() => setOpen(false)} className={pathname.startsWith(link.href) ? "active" : ""}>{link.label}</Link>)}
          <Link href="/pickup" onClick={() => setOpen(false)} className={pathname === "/pickup" ? "bag-link active" : "bag-link"}>
            Pickup bag <span>{count}</span>
          </Link>
        </nav>
      </header>
    </>
  );
}
