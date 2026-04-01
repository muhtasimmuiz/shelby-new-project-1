type Stream = {
  name: string;
  detail: string;
  progress: number;
  size: string;
  icon: string;
};

const streams: Stream[] = [
  {
    name: "production_master_8k.mxf",
    detail: "VERIFICATION ON APTOS... 100%",
    progress: 100,
    size: "3.2 GB / 3.2 GB",
    icon: "file",
  },
  {
    name: "neural_training_weights_v4.bin",
    detail: "SYNCING TO NODE #08... 61%",
    progress: 61,
    size: "25.1 GB / 41.2 GB",
    icon: "sync",
  },
];

const logs = [
  "[14:22:01]  AUTH_SUCCESS: Wallet session verified via Aptos Protocol.",
  "[14:22:05]  NODE_LINK: Established secure handshake with node-us-east-01.",
  "[14:23:44]  ENCRYPT_STREAM: AES-256-GCM cipher initialized for current sync.",
  "[14:25:12]  SYNC_UPDATE: Transferred 4.2GB to node cluster #44.",
];

function StreamIcon({ icon }: { icon: string }) {
  return (
    <div className={`stream-icon ${icon === "sync" ? "is-sync" : ""}`} aria-hidden="true">
      {icon === "sync" ? "//" : "[]"}
    </div>
  );
}

export default function HomePage() {
  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div className="hero-frame">
          <p className="hero-kicker">DEPLOY DATA TO VAULT</p>
          <h1>Drag and drop large datasets or connect a peer-to-peer remote node.</h1>
          <div className="hero-actions">
            <button type="button" className="primary-action">
              BROWSE LOCAL NODE
            </button>
            <button type="button" className="ghost-action">
              CONNECT S3 BUCKET
            </button>
          </div>
        </div>
      </section>

      <section className="panel">
        <div className="section-header">
          <p className="section-title">ACTIVE SYNC STREAMS</p>
          <span>2 TOTAL PROCESSES</span>
        </div>

        <div className="stream-list">
          {streams.map((stream) => (
            <article key={stream.name} className="stream-card">
              <div className="stream-header">
                <div className="stream-title-wrap">
                  <StreamIcon icon={stream.icon} />
                  <div>
                    <h2>{stream.name}</h2>
                    <p>{stream.detail}</p>
                  </div>
                </div>

                <div className="stream-meta">
                  <strong>{stream.progress}%</strong>
                  <span>{stream.size}</span>
                </div>
              </div>

              <div className="progress-track" aria-hidden="true">
                <span style={{ width: `${stream.progress}%` }} />
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="dual-grid">
        <article className="panel">
          <div className="section-header">
            <p className="section-title">SYSTEM LOGS</p>
            <span>LIVE</span>
          </div>
          <div className="log-list">
            {logs.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </article>

        <article className="panel metric-panel">
          <div className="section-header">
            <p className="section-title">VAULT HEALTH</p>
            <span>UPLINK VERIFIED</span>
          </div>
          <div className="health-metric">
            <strong>99.99%</strong>
            <p>UPTIME ACROSS 12,042 NODES</p>
          </div>
          <div className="health-bars" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span className="is-hot" />
          </div>
        </article>
      </section>
    </div>
  );
}
