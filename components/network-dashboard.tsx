"use client";

import { formatBytes, formatMicros } from "../lib/shelby-runtime";
import { useShelbySummary } from "../app/providers";

export function NetworkDashboard() {
  const { activeBlob, blobs, busyBlobName, config, selectBlob } = useShelbySummary();

  const encoding = activeBlob?.encoding;

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div className="hero-frame node-hero">
          <div className="hero-badge-row">
            <p className="hero-kicker">Blob Inspector</p>
            <span className={`status-badge ${activeBlob ? "is-live" : ""}`}>
              {activeBlob ? "Blob Selected" : "Idle"}
            </span>
          </div>
          <h1>
            Inspect registered Shelby blobs, review encoding metadata, and keep the current object
            ready for audit or download.
          </h1>
          <p className="hero-lead">
            Use this panel to validate what is actually indexed on the network before sharing the
            app publicly.
          </p>
          <div className="hero-metrics">
            <div className="metric-chip">
              <span>Registered</span>
              <strong>{blobs.length}</strong>
              <small>Available blobs</small>
            </div>
            <div className="metric-chip">
              <span>Network</span>
              <strong>{config.networkLabel}</strong>
              <small>Shelby RPC target</small>
            </div>
            <div className="metric-chip">
              <span>Encoding</span>
              <strong>{encoding?.variant ?? "clay"}</strong>
              <small>{activeBlob ? "Active blob profile" : "Default fallback"}</small>
            </div>
            <div className="metric-chip">
              <span>Status</span>
              <strong>{busyBlobName ? "Loading" : "Ready"}</strong>
              <small>Metadata fetch state</small>
            </div>
          </div>
        </div>
      </section>

      <section className="dual-grid">
        <article className="panel">
          <div className="section-header">
            <p className="section-title">BLOB INDEX</p>
            <span>{blobs.length} REGISTERED</span>
          </div>
          <div className="node-grid">
            {blobs.length ? (
              blobs.map((blob) => (
                <button
                  key={blob.name}
                  type="button"
                  className="node-card node-card-button"
                  onClick={() => void selectBlob(blob.name)}
                >
                  <div className="node-card-top">
                    <h2>{blob.name}</h2>
                    <strong>{formatBytes(blob.size)}</strong>
                  </div>
                  <p>{blob.isDeleted ? "Deleted" : blob.isWritten ? "Written" : "Pending"}</p>
                  <div className="node-card-footer">
                    <span>{blob.encoding?.variant ?? "clay"}</span>
                    <strong>{busyBlobName === blob.name ? "LOADING" : "INSPECT"}</strong>
                  </div>
                </button>
              ))
            ) : (
              <div className="empty-panel">
                <p>No registered blobs yet. Upload from the vault page first.</p>
              </div>
            )}
          </div>
        </article>

        <article className="panel metric-panel">
          <div className="section-header">
            <p className="section-title">ACTIVE METADATA</p>
            <span>{activeBlob ? "LIVE" : "IDLE"}</span>
          </div>

          {activeBlob ? (
            <div className="metadata-grid">
              <div className="metadata-row">
                <span>Name</span>
                <strong>{activeBlob.name}</strong>
              </div>
              <div className="metadata-row">
                <span>Created</span>
                <strong>{formatMicros(activeBlob.creationMicros)}</strong>
              </div>
              <div className="metadata-row">
                <span>Expires</span>
                <strong>{formatMicros(activeBlob.expirationMicros)}</strong>
              </div>
              <div className="metadata-row">
                <span>Chunk Size</span>
                <strong>{encoding?.chunkSizeBytes?.toLocaleString() ?? "Unknown"}</strong>
              </div>
              <div className="metadata-row">
                <span>Erasure</span>
                <strong>
                  {encoding
                    ? `${encoding.erasure_k ?? "?"}/${encoding.erasure_n ?? "?"}/${encoding.erasure_d ?? "?"}`
                    : "Unknown"}
                </strong>
              </div>
              <div className="metadata-row">
                <span>Network</span>
                <strong>{config.networkLabel}</strong>
              </div>
              <div className="metadata-row">
                <span>Owner</span>
                <strong>{activeBlob.owner}</strong>
              </div>
            </div>
          ) : (
            <div className="empty-panel">
              <p>Select any uploaded blob to inspect Shelby metadata here.</p>
            </div>
          )}
        </article>
      </section>
    </div>
  );
}
