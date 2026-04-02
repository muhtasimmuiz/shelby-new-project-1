import { IBM_Plex_Mono, Space_Grotesk } from "next/font/google";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ProtocolRightRail } from "../components/protocol-right-rail";
import { WalletControl } from "../components/wallet-control";
import { SideNavigation, TopNavigation } from "./navigation";
import { Providers } from "./providers";
import "./globals.css";

const displayFont = Space_Grotesk({
  subsets: ["latin"],
  variable: "--font-display",
});

const monoFont = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-mono",
});

export const metadata: Metadata = {
  title: {
    default: "Shelby Control Room",
    template: "%s | Shelby Control Room",
  },
  description:
    "A polished Shelby Protocol dashboard for Aptos-backed uploads, blob inspection, and billing visibility.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body
        suppressHydrationWarning
        className={`${displayFont.variable} ${monoFont.variable}`}
      >
        <Providers>
          <div className="app-shell">
            <aside className="left-rail">
              <div className="brand-block">
                <div className="brand-mark" aria-hidden="true" />
                <div>
                  <p className="brand-name">SHELBY</p>
                  <p className="brand-subtitle">CONTROL ROOM</p>
                </div>
              </div>

              <div className="version-block">
                <p className="panel-label">SHELBY PROTOCOL</p>
                <p className="panel-microcopy">
                  Wallet-aware upload console for Shelbynet storage operations.
                </p>
              </div>

              <SideNavigation />

              <div className="left-rail-footer">
                <a href="https://discord.com/invite/shelbyserves" target="_blank" rel="noreferrer">
                  SUPPORT
                </a>
                <a href="https://docs.shelby.xyz" target="_blank" rel="noreferrer">
                  API DOCS
                </a>
              </div>
            </aside>

            <div className="content-shell">
              <header className="top-bar">
                <TopNavigation />
                <WalletControl />
              </header>

              <div className="content-grid">
                <main className="main-panel">{children}</main>
                <ProtocolRightRail />
              </div>

              <footer className="app-footer">
                <span>Ready for Shelby upload flows</span>
                <div>
                  <a
                    href="https://docs.shelby.xyz/protocol/architecture/networks"
                    target="_blank"
                    rel="noreferrer"
                  >
                    Terms
                  </a>
                  <span>(c) {new Date().getFullYear()} Shelby.xyz</span>
                </div>
              </footer>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
