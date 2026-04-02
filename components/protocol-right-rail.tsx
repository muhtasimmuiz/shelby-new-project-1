"use client";

import { formatBlobDisplayName, formatMicros } from "../lib/shelby-runtime";
import { useShelbySummary } from "../app/providers";

function rpcLabel(url: string) {
  try {
    return new URL(url).host;
  } catch {
    return url;
  }
}

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
  const endpointLabel = rpcLabel(config.rpcBaseUrl);

  return (
    <aside className="stats-rail">
      <section className="rail-card storage-card">
        <div className="chart-caption">
          <span>Storage Health</span>
          <strong>{accountAddress ? "LIVE" : "STANDBY"}</strong>
        </div>
        <div className="gauge-frame">
          <div className="gauge-value">
            <strong>{usedPercent}%</strong>
            <span>PROJECTED LOAD</span>
          </div>
        </div>
        <p className="storage-copy">{formattedBytes} stored for this wallet</p>
        <p className="status-copy">
          {accountAddress
            ? `${totalFiles} BLOBS INDEXED`
            : "CONNECT A WALLET TO START INDEXING"}
        </p>
      </section>

      <section className="rail-card mini-chart-card">
        <div className="chart-caption">
          <span>NETWORK</span>
          <strong>{config.networkLabel}</strong>
        </div>
        <div className="sdk-status-grid">
          <div>
            <span>CLIENT KEY</span>
            <strong>{config.shelbyApiKey ? "READY" : "MISSING"}</strong>
          </div>
          <div>
            <span>APTOS KEY</span>
            <strong>{config.aptosApiKey ? "READY" : "OPTIONAL"}</strong>
          </div>
          <div>
            <span>WALLET</span>
            <strong>{accountAddress ? "CONNECTED" : "NOT LINKED"}</strong>
          </div>
          <div>
            <span>LEDGER EST.</span>
            <strong>{estimatedShelbyUsd}.00 sUSD</strong>
          </div>
          <div>
            <span>RPC HOST</span>
            <strong>{endpointLabel}</strong>
          </div>
          <div>
            <span>DOCS</span>
            <a href={config.docsUrl} target="_blank" rel="noreferrer">
              OPEN DOCS
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
            <h3 title={activeBlob.name}>{formatBlobDisplayName(activeBlob.name)}</h3>
            <p>{activeBlob.isWritten ? "Written to Shelby RPC" : "Awaiting confirmation"}</p>
            <div className="blob-summary-meta">
              <span>{activeBlob.size.toLocaleString()} bytes</span>
              <span>{formatMicros(activeBlob.creationMicros)}</span>
              <span>{activeBlob.encoding?.variant ?? "clay"} encoding</span>
            </div>
          </div>
        ) : (
          <div className="blob-summary-card is-empty">
            <h3>No blob selected</h3>
            <p>Upload or inspect a file to surface live metadata and network details here.</p>
          </div>
        )}
      </section>
    </aside>
  );
}
