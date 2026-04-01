"use client";

import { formatMicros } from "../lib/shelby-runtime";
import { useShelbySummary } from "../app/providers";

export function ProtocolRightRail() {
  const {
    accountAddress,
    activeBlob,
    config,
    estimatedShelbyUsd,
    formattedBytes,
    totalFiles,
    usedPercent,
  } = useShelbySummary();

  return (
    <aside className="stats-rail">
      <section className="rail-card storage-card">
        <div className="gauge-frame">
          <div className="gauge-value">
            <strong>{usedPercent}%</strong>
            <span>USED</span>
          </div>
        </div>
        <p className="storage-copy">{formattedBytes} stored for this wallet</p>
        <p className="status-copy">
          {accountAddress ? `${totalFiles} BLOBS INDEXED` : "CONNECT TO START INDEXING"}
        </p>
      </section>

      <section className="rail-card mini-chart-card">
        <div className="chart-caption">
          <span>NETWORK</span>
          <strong>{config.networkLabel}</strong>
        </div>
        <div className="sdk-status-grid">
          <div>
            <span>API KEY</span>
            <strong>{config.shelbyApiKey ? "READY" : "MISSING"}</strong>
          </div>
          <div>
            <span>SHELBYUSD</span>
            <strong>{estimatedShelbyUsd}.00</strong>
          </div>
          <div>
            <span>RPC</span>
            <strong>ONLINE</strong>
          </div>
          <div>
            <span>SDK MODE</span>
            <strong>REACT</strong>
          </div>
          <div>
            <span>DOCS</span>
            <a href={config.docsUrl} target="_blank" rel="noreferrer">
              OPEN
            </a>
          </div>
        </div>
      </section>

      <section className="rail-card latency-card">
        <div className="chart-caption">
          <span>ACTIVE BLOB</span>
          <strong>{activeBlob ? "LIVE" : "IDLE"}</strong>
        </div>

        {activeBlob ? (
          <div className="blob-summary-card">
            <h3>{activeBlob.name}</h3>
            <p>{activeBlob.isWritten ? "Written to Shelby RPC" : "Awaiting confirmation"}</p>
            <div className="blob-summary-meta">
              <span>{activeBlob.size.toLocaleString()} bytes</span>
              <span>{formatMicros(activeBlob.creationMicros)}</span>
            </div>
          </div>
        ) : (
          <div className="blob-summary-card is-empty">
            <h3>No blob selected</h3>
            <p>Upload or inspect a file to see live Shelby metadata here.</p>
          </div>
        )}
      </section>
    </aside>
  );
}
