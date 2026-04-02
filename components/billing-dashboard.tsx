"use client";

import { formatBlobDisplayName, formatBytes } from "../lib/shelby-runtime";
import { useShelbySummary } from "../app/providers";

export function BillingDashboard() {
  const {
    accountAddress,
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
          <div className="hero-badge-row">
            <p className="hero-kicker">Treasury Ledger</p>
            <span className={`status-badge ${config.shelbyApiKey ? "is-live" : ""}`}>
              {config.shelbyApiKey ? "API Ready" : "Setup Needed"}
            </span>
          </div>
          <h1>
            Review current storage usage, environment readiness, and estimated ShelbyUSD impact for
            each registered upload.
          </h1>
          <p className="hero-lead">
            The ledger is tuned for quick health checks before demos, client handoff, or public
            launch.
          </p>
          <div className="hero-metrics">
            <div className="metric-chip">
              <span>Wallet</span>
              <strong>{accountAddress ? "Linked" : "Offline"}</strong>
              <small>{accountAddress ? "Ready to audit" : "Connect to sync"}</small>
            </div>
            <div className="metric-chip">
              <span>Uploads</span>
              <strong>{totalFiles}</strong>
              <small>Registered blobs</small>
            </div>
            <div className="metric-chip">
              <span>Stored</span>
              <strong>{formattedBytes}</strong>
              <small>Current wallet total</small>
            </div>
            <div className="metric-chip">
              <span>Estimate</span>
              <strong>{estimatedShelbyUsd}.00</strong>
              <small>ShelbyUSD projected</small>
            </div>
          </div>
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
          <div className="readiness-list">
            <div className="readiness-item">
              <strong>Shelby Key</strong>
              <p>
                {config.shelbyApiKey
                  ? "Shelby API key detected."
                  : "Add NEXT_PUBLIC_SHELBY_API_KEY."}
              </p>
            </div>
            <div className="readiness-item">
              <strong>Aptos Key</strong>
              <p>
                {config.aptosApiKey
                  ? "Aptos API key detected."
                  : "Add NEXT_PUBLIC_APTOS_API_KEY."}
              </p>
            </div>
            <div className="readiness-item">
              <strong>Integration</strong>
              <p>Shelby React SDK + Aptos Wallet Adapter</p>
            </div>
            <div className="readiness-item">
              <strong>RPC URL</strong>
              <p>{config.rpcBaseUrl}</p>
            </div>
            <div className="readiness-item">
              <strong>Docs</strong>
              <p>{config.docsUrl}</p>
            </div>
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
                <div className="invoice-copy" title={blob.name}>
                  <h2>{formatBlobDisplayName(blob.name)}</h2>
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
