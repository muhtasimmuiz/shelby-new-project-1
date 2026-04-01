import type { Metadata } from "next";
import type { ReactNode } from "react";
import { SideNavigation, TopNavigation } from "./navigation";
import "./globals.css";

export const metadata: Metadata = {
  title: "Shelby Protocol",
  description: "A neon vault dashboard inspired by the provided reference image.",
};

export default function RootLayout({ children }: Readonly<{ children: ReactNode }>) {
  return (
    <html lang="en">
      <body>
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
              <p className="panel-microcopy">v.2.0.4-STABLE</p>
            </div>

            <SideNavigation />

            <div className="left-rail-footer">
              <a href="/">SUPPORT</a>
              <a href="/">API DOCS</a>
            </div>
          </aside>

          <div className="content-shell">
            <header className="top-bar">
              <TopNavigation />

              <div className="wallet-zone">
                <div className="wallet-copy">
                  <span>0x4f...a3e2</span>
                  <small>APTOS VERIFIED</small>
                </div>
                <button className="signal-button" type="button" aria-label="Notifications">
                  <span />
                </button>
                <button className="wallet-button" type="button">
                  CONNECT WALLET
                </button>
              </div>
            </header>

            <div className="content-grid">
              <main className="main-panel">{children}</main>

              <aside className="stats-rail">
                <section className="rail-card storage-card">
                  <div className="gauge-frame">
                    <div className="gauge-value">
                      <strong>42%</strong>
                      <span>USED</span>
                    </div>
                  </div>
                  <p className="storage-copy">420.69 TB / 1.0 PB Used</p>
                  <p className="status-copy">STORAGE STATUS: OPTIMAL</p>
                </section>

                <section className="rail-card mini-chart-card">
                  <div className="chart-caption">
                    <span>READ B/W</span>
                    <strong>18.4 GBPS</strong>
                  </div>
                  <div className="line-chart line-chart-strong" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>

                  <div className="chart-caption">
                    <span>WRITE B/W</span>
                    <strong>4.2 GBPS</strong>
                  </div>
                  <div className="line-chart" aria-hidden="true">
                    <span />
                    <span />
                    <span />
                    <span />
                    <span />
                  </div>
                </section>

                <section className="rail-card latency-card">
                  <div className="chart-caption">
                    <span>GLOBAL LATENCY</span>
                    <strong>84ms AVG</strong>
                  </div>

                  <div className="map-card" aria-hidden="true">
                    <div className="map-dots">
                      <span />
                      <span />
                      <span />
                    </div>
                    <div className="map-bars">
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                      <span />
                    </div>
                  </div>
                </section>
              </aside>
            </div>

            <footer className="app-footer">
              <span>Network Status</span>
              <div>
                <a href="/">Terms</a>
                <span>(c) 2026 Shelby.xyz</span>
              </div>
            </footer>
          </div>
        </div>
      </body>
    </html>
  );
}
