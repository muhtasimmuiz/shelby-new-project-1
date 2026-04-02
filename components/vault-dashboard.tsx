"use client";

import { useRef, useState } from "react";
import { formatBytes } from "../lib/shelby-runtime";
import { useShelbySummary } from "../app/providers";

export function VaultDashboard() {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const {
    accountAddress,
    activity,
    blobs,
    clearError,
    clearQueue,
    config,
    error,
    loadingBlobs,
    queue,
    refreshBlobs,
    selectBlob,
    setQueue,
    uploadQueue,
    uploading,
  } = useShelbySummary();
  const queuedBytes = queue.reduce((sum, file) => sum + file.size, 0);
  const walletReady = Boolean(accountAddress);

  function handleFiles(files: File[]) {
    clearError();
    setQueue(files);
  }

  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div className="hero-frame vault-hero">
          <div className="hero-badge-row">
            <p className="hero-kicker">Vault Control</p>
            <span className={`status-badge ${walletReady ? "is-live" : ""}`}>
              {walletReady ? "Wallet Linked" : "Wallet Required"}
            </span>
          </div>
          <h1>
            Upload local files with the Shelby browser flow, confirm the Aptos transaction, and
            monitor indexed blobs from one clean control surface.
          </h1>
          <p className="hero-lead">
            This console is wired for Shelbynet with live queue visibility, fast metadata refresh,
            and wallet-aware upload actions.
          </p>
          <div className="hero-metrics">
            <div className="metric-chip">
              <span>Queued</span>
              <strong>{queue.length}</strong>
              <small>{formatBytes(queuedBytes)}</small>
            </div>
            <div className="metric-chip">
              <span>Indexed</span>
              <strong>{blobs.length}</strong>
              <small>Current wallet blobs</small>
            </div>
            <div className="metric-chip">
              <span>Network</span>
              <strong>{config.networkLabel}</strong>
              <small>RPC ready</small>
            </div>
            <div className="metric-chip">
              <span>Mode</span>
              <strong>{uploading ? "Uploading" : "Ready"}</strong>
              <small>React SDK flow</small>
            </div>
          </div>
          <div className="hero-actions">
            <button
              type="button"
              className="primary-action"
              onClick={() => fileInputRef.current?.click()}
            >
              BROWSE LOCAL NODE
            </button>
            <button
              type="button"
              className="ghost-action"
              onClick={() => {
                clearError();
                void uploadQueue();
              }}
              disabled={uploading || !queue.length}
            >
              {uploading ? "UPLOADING..." : "COMMIT TO SHELBY"}
            </button>
            <a href={`${config.docsUrl}/sdks/react/guides/dapp-example`} target="_blank" rel="noreferrer" className="ghost-action link-action">
              VIEW SOURCE DOCS
            </a>
          </div>

          <input
            ref={fileInputRef}
            className="hidden-input"
            type="file"
            multiple
            onChange={(event) => {
              handleFiles(Array.from(event.target.files ?? []));
            }}
          />
        </div>
      </section>

      <section className="panel onboarding-panel">
        <div className="section-header">
          <p className="section-title">Publish Checklist</p>
          <span>{walletReady ? "LIVE CONFIG" : "ACTION NEEDED"}</span>
        </div>
        <div className="checklist-grid">
          <div className="checklist-card">
            <strong>1. Wallet</strong>
            <p>{walletReady ? "Aptos wallet connected and ready to sign." : "Connect an Aptos wallet to unlock uploads."}</p>
          </div>
          <div className="checklist-card">
            <strong>2. API</strong>
            <p>{config.shelbyApiKey ? "Shelby client key loaded from environment." : "Add NEXT_PUBLIC_SHELBY_API_KEY to continue."}</p>
          </div>
          <div className="checklist-card">
            <strong>3. Files</strong>
            <p>{queue.length ? `${queue.length} file(s) staged for commit.` : "Queue one or more files from your machine."}</p>
          </div>
        </div>
      </section>

      {error ? <div className="alert-banner is-error">{error}</div> : null}
      {!accountAddress ? (
        <div className="alert-banner">
          Connect an Aptos wallet first. Shelby uploads need wallet signing plus ShelbyUSD and APT
          on the selected network.
        </div>
      ) : null}

      <section
        className={`dropzone-panel ${isDragging ? "is-dragging" : ""}`}
        onDragEnter={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragOver={(event) => {
          event.preventDefault();
          setIsDragging(true);
        }}
        onDragLeave={(event) => {
          event.preventDefault();
          if (event.currentTarget === event.target) {
            setIsDragging(false);
          }
        }}
        onDrop={(event) => {
          event.preventDefault();
          setIsDragging(false);
          handleFiles(Array.from(event.dataTransfer.files ?? []));
        }}
      >
        <p className="section-title">DROP FILES HERE</p>
        <p>Drag files into the vault for faster staging, or keep using the browse button above.</p>
      </section>

      <section className="dual-grid">
        <article className="panel">
          <div className="section-header">
            <p className="section-title">QUEUE + TRANSFERS</p>
            <div className="section-actions">
              <span>{queue.length ? `${queue.length} READY / ${formatBytes(queuedBytes)}` : "EMPTY"}</span>
              {queue.length ? (
                <button type="button" className="tiny-button" onClick={clearQueue}>
                  CLEAR
                </button>
              ) : null}
            </div>
          </div>

          <div className="stream-list">
            {queue.length ? (
              queue.map((file) => (
                <article key={file.name} className="stream-card">
                  <div className="stream-header">
                    <div className="stream-title-wrap">
                      <div className="stream-icon" aria-hidden="true">
                        []
                      </div>
                      <div>
                        <h2>{file.name}</h2>
                        <p>Prepared for Shelby commit. Wallet signature will be requested.</p>
                      </div>
                    </div>

                    <div className="stream-meta">
                      <strong>{formatBytes(file.size)}</strong>
                      <span>LOCAL FILE</span>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <div className="empty-panel">
                <p>No files queued yet. Use Browse Local Node to stage data for upload.</p>
              </div>
            )}
          </div>
        </article>

        <article className="panel metric-panel">
          <div className="section-header">
            <p className="section-title">SYSTEM LOGS</p>
            <span>{activity.length} EVENTS</span>
          </div>
          <div className="log-list" aria-live="polite">
            {activity.length ? (
              activity.map((line) => (
                <p key={line.id} className={`log-entry is-${line.level}`}>
                  [{line.timestamp}] {line.message}
                </p>
              ))
            ) : (
              <p>No live events yet. Uploads, downloads, and metadata calls will appear here.</p>
            )}
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="section-header">
          <p className="section-title">ACCOUNT BLOBS</p>
          <div className="section-actions">
            <span>{loadingBlobs ? "SYNCING..." : `${blobs.length} INDEXED`}</span>
            <button type="button" className="tiny-button" onClick={() => void refreshBlobs()}>
              REFRESH
            </button>
          </div>
        </div>

        <div className="blob-list">
          {blobs.length ? (
            blobs.map((blob) => (
              <button
                key={blob.name}
                type="button"
                className="blob-row"
                onClick={() => void selectBlob(blob.name)}
              >
                <div>
                  <h2>{blob.name}</h2>
                  <p>{blob.isWritten ? "Stored on Shelby RPC" : "Awaiting write confirmation"}</p>
                </div>
                <div className="blob-row-meta">
                  <strong>{formatBytes(blob.size)}</strong>
                  <span>{blob.encoding?.variant ?? "clay"}</span>
                </div>
              </button>
            ))
          ) : (
            <div className="empty-panel">
              <p>No blobs indexed for this wallet yet. Upload a file to populate this list.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
