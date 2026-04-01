const nodes = [
  { id: "NODE-US-EAST-01", latency: "32ms", load: 76, region: "Virginia cluster" },
  { id: "NODE-EU-CENTRAL-08", latency: "47ms", load: 61, region: "Frankfurt edge" },
  { id: "NODE-AP-SOUTH-03", latency: "58ms", load: 84, region: "Dhaka relay" },
  { id: "NODE-SG-MESH-11", latency: "41ms", load: 53, region: "Singapore mesh" },
];

const handshakes = [
  "Cluster A / 14 peers verified",
  "Cluster B / 09 peers verified",
  "Cold archive / 03 standby links",
];

export default function NetworkNodesPage() {
  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div className="hero-frame node-hero">
          <p className="hero-kicker">ORCHESTRATE NODE FABRIC</p>
          <h1>Maintain throughput, rebalance relays, and monitor regional saturation in real time.</h1>
          <div className="hero-actions">
            <button type="button" className="primary-action">
              SPIN UP EDGE NODE
            </button>
            <button type="button" className="ghost-action">
              EXPORT LATENCY MAP
            </button>
          </div>
        </div>
      </section>

      <section className="dual-grid">
        <article className="panel">
          <div className="section-header">
            <p className="section-title">REGIONAL NODE GRID</p>
            <span>12 ACTIVE RELAYS</span>
          </div>
          <div className="node-grid">
            {nodes.map((node) => (
              <div key={node.id} className="node-card">
                <div className="node-card-top">
                  <h2>{node.id}</h2>
                  <strong>{node.latency}</strong>
                </div>
                <p>{node.region}</p>
                <div className="progress-track" aria-hidden="true">
                  <span style={{ width: `${node.load}%` }} />
                </div>
                <div className="node-card-footer">
                  <span>Load</span>
                  <strong>{node.load}%</strong>
                </div>
              </div>
            ))}
          </div>
        </article>

        <article className="panel metric-panel">
          <div className="section-header">
            <p className="section-title">HANDSHAKE STATUS</p>
            <span>SECURE</span>
          </div>
          <div className="status-list">
            {handshakes.map((item) => (
              <div key={item} className="status-row">
                <span className="status-dot" />
                <p>{item}</p>
              </div>
            ))}
          </div>
          <div className="throughput-graph" aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
            <span />
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="section-header">
          <p className="section-title">PEER ROUTING TABLE</p>
          <span>AUTO-BALANCED</span>
        </div>

        <div className="table-shell">
          <div className="table-row table-head">
            <span>Path</span>
            <span>Uplink</span>
            <span>Encryption</span>
            <span>Status</span>
          </div>
          <div className="table-row">
            <span>VAULT / US-EAST / FRANKFURT</span>
            <span>22.4 Gbps</span>
            <span>AES-256-GCM</span>
            <strong>LOCKED</strong>
          </div>
          <div className="table-row">
            <span>VAULT / SINGAPORE / DHAKA</span>
            <span>18.2 Gbps</span>
            <span>XCHACHA20</span>
            <strong>SYNCING</strong>
          </div>
          <div className="table-row">
            <span>COLD STORAGE / TOKYO / SYDNEY</span>
            <span>11.9 Gbps</span>
            <span>TLS 1.3 TUNNEL</span>
            <strong>STABLE</strong>
          </div>
        </div>
      </section>
    </div>
  );
}
