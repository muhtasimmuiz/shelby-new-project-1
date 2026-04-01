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
          <p className="hero-kicker">ORCHESTRATE NODE FABRIC</p>
          <h1>
            Inspect registered Shelby blobs, decode the active encoding profile, and keep the
            currently selected object ready for download or audit.
          </h1>
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
