"use client";

import { formatBytes } from "../lib/shelby-runtime";
import { useShelbySummary } from "../app/providers";

export function BillingDashboard() {
  const {
    blobs,
    config,
    downloadBlob,
    estimatedShelbyUsd,
    formattedBytes,
    totalFiles,
    uploading,
  } = useShelbySummary();

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div className="hero-frame billing-hero">
          <p className="hero-kicker">TREASURY + USAGE LEDGER</p>
          <h1>
            Monitor Shelby usage with a simple working ledger. Each upload is estimated at 1
            ShelbyUSD based on the official browser upload guide.
          </h1>
        </div>
      </section>

      <section className="dual-grid">
        <article className="panel metric-panel">
          <div className="section-header">
            <p className="section-title">USAGE SUMMARY</p>
            <span>{config.networkLabel}</span>
          </div>
          <div className="health-metric">
            <strong>{estimatedShelbyUsd}.00</strong>
            <p>ESTIMATED SHELBYUSD REQUIRED FOR {totalFiles} REGISTERED UPLOADS</p>
          </div>
          <div className="metadata-grid">
            <div className="metadata-row">
              <span>Total Files</span>
              <strong>{totalFiles}</strong>
            </div>
            <div className="metadata-row">
              <span>Total Stored</span>
              <strong>{formattedBytes}</strong>
            </div>
            <div className="metadata-row">
              <span>API Key</span>
              <strong>{config.shelbyApiKey ? "CONNECTED" : "MISSING"}</strong>
            </div>
            <div className="metadata-row">
              <span>Upload State</span>
              <strong>{uploading ? "PROCESSING" : "READY"}</strong>
            </div>
          </div>
        </article>

        <article className="panel">
          <div className="section-header">
            <p className="section-title">ENV READINESS</p>
            <span>SETUP</span>
          </div>
          <div className="log-list">
            <p>{config.shelbyApiKey ? "Shelby API key detected." : "Add NEXT_PUBLIC_SHELBY_API_KEY."}</p>
            <p>{config.aptosApiKey ? "Aptos API key detected." : "Add NEXT_PUBLIC_APTOS_API_KEY."}</p>
            <p>Integration: Shelby React SDK + Aptos Wallet Adapter</p>
            <p>RPC URL: {config.rpcBaseUrl}</p>
            <p>Docs: {config.docsUrl}</p>
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="section-header">
          <p className="section-title">LEDGER ENTRIES</p>
          <span>DOWNLOAD READY</span>
        </div>

        <div className="invoice-list">
          {blobs.length ? (
            blobs.map((blob) => (
              <div key={blob.name} className="invoice-card">
                <div>
                  <h2>{blob.name}</h2>
                  <p>{formatBytes(blob.size)} stored on Shelby</p>
                </div>
                <strong>1.00 sUSD</strong>
                <button
                  type="button"
                  className="tiny-button"
                  onClick={() => void downloadBlob(blob.name)}
                >
                  DOWNLOAD
                </button>
              </div>
            ))
          ) : (
            <div className="empty-panel">
              <p>No ledger entries yet because this wallet has not uploaded any blobs.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
