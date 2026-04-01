import type { Metadata } from "next";
import type { ReactNode } from "react";
import { ProtocolRightRail } from "../components/protocol-right-rail";
import { WalletControl } from "../components/wallet-control";
import { SideNavigation, TopNavigation } from "./navigation";
import { Providers } from "./providers";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shelby Protocol",
  description: "A neon vault dashboard inspired by the provided reference image.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body suppressHydrationWarning>
        <Providers>
          <div className="app-shell">
            <aside className="left-rail">
              <div className="brand-block">
                <div className="brand-mark" aria-hidden="true" />
                <div>
                  <p className="brand-name">SHELBY</p>
                  <p className="brand-subtitle">SHELBY PROTOCOL</p>
                </div>
              </div>

              <div className="version-block">
                <p className="panel-label">SHELBY PROTOCOL</p>
                <p className="panel-microcopy">SDK-ENABLED CONTROL ROOM</p>
              </div>

              <SideNavigation />

              <div className="left-rail-footer">
                <a href="https://docs.shelby.xyz" target="_blank" rel="noreferrer">
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
                <span>Network Status</span>
                <div>
                  <a href="https://docs.shelby.xyz/protocol/architecture/networks" target="_blank" rel="noreferrer">
                    Terms
                  </a>
                  <span>(c) 2026 Shelby.xyz</span>
                </div>
              </footer>
            </div>
          </div>
        </Providers>
      </body>
    </html>
  );
}
