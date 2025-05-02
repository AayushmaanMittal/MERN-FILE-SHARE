import Link from "next/link"
import { Github } from "lucide-react"

export default function Footer() {
  return (
    <footer className="border-t py-6 md:py-0">
      <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
        <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
          &copy; {new Date().getFullYear()} Secure File Sharing. All rights reserved.
        </p>
        <div className="flex items-center gap-4">
          <Link
            href="https://github.com"
            target="_blank"
            rel="noreferrer"
            className="text-sm font-medium underline underline-offset-4"
          >
            <Github className="h-4 w-4" />
            <span className="sr-only">GitHub</span>
          </Link>
          <Link href="/privacy" className="text-sm font-medium text-muted-foreground underline underline-offset-4">
            Privacy
          </Link>
          <Link href="/terms" className="text-sm font-medium text-muted-foreground underline underline-offset-4">
            Terms
          </Link>
          <Link href="/contact" className="text-sm font-medium text-muted-foreground underline underline-offset-4">
            Contact
          </Link>
        </div>
      </div>
    </footer>
  )
}
