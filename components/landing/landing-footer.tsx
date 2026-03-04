import Link from "next/link"

export function LandingFooter() {
  return (
    <footer className="border-t border-border/50 py-12">
      <div className="mx-auto max-w-7xl px-6">
        <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[oklch(0.45_0.12_170)] text-[oklch(0.98_0_0)]">
              <svg
                width="14"
                height="14"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 20h9" />
                <path d="M16.376 3.622a1 1 0 0 1 3.002 3.002L7.368 18.635a2 2 0 0 1-.855.506l-2.872.838a.5.5 0 0 1-.62-.62l.838-2.872a2 2 0 0 1 .506-.855z" />
              </svg>
            </div>
            <span className="text-sm font-semibold text-foreground">
              AwwScribe
            </span>
          </div>

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
