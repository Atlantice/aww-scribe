import Image from "next/image"
import Link from "next/link"

const footerLinks = [
  { label: "Home", href: "/landing" },
  { label: "App", href: "/" },
  { label: "Devpost", href: "https://devpost.com/software/awwscribe", external: true },
]

export function LandingFooter() {
  return (
    <footer className="border-t border-border/50 py-16">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center gap-8 md:flex-row md:justify-between">
          {/* Logo */}
          <Link href="/landing" className="flex items-center gap-2.5">
            <Image
              src="/images/aww-logo.png"
              alt="AwwScribe logo"
              width={28}
              height={28}
              className="rounded-lg"
            />
            <span className="text-sm font-semibold text-foreground">AwwScribe</span>
          </Link>

          {/* Links */}
          <div className="flex items-center gap-8">
            {footerLinks.map((link) =>
              link.external ? (
                <a
                  key={link.label}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </a>
              ) : (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                >
                  {link.label}
                </Link>
              )
            )}
          </div>

          {/* Copyright */}
          <p className="text-xs text-muted-foreground">
            {new Date().getFullYear()} AwwScribe
          </p>
        </div>
      </div>
    </footer>
  )
}
