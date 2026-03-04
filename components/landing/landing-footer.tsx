import Image from "next/image"
import Link from "next/link"

export function LandingFooter() {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <Link href="/landing" className="flex items-center gap-2.5">
            <Image
              src="/images/aww-logo.png"
              alt="AwwScribe logo"
              width={24}
              height={24}
              className="rounded-md"
            />
            <span className="text-sm font-semibold text-foreground">
              AwwScribe
            </span>
          </Link>

          <div className="flex items-center gap-6 text-sm text-muted-foreground">
            <a
              href="https://devpost.com/software/awwscribe"
              target="_blank"
              rel="noopener noreferrer"
              className="transition-colors hover:text-foreground"
            >
              Devpost
            </a>
            <Link
              href="/"
              className="transition-colors hover:text-foreground"
            >
              App
            </Link>
          </div>

          <p className="text-xs text-muted-foreground">
            {"Built with ElevenLabs & Google Cloud. \u00A9 "}
            {new Date().getFullYear()}
            {" AwwScribe."}
          </p>
        </div>
      </div>
    </footer>
  )
}
