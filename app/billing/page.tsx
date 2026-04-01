const invoices = [
  { name: "APRIL RETAINER", amount: "$14,800", status: "PAID" },
  { name: "NODE SURGE CAPACITY", amount: "$4,260", status: "PENDING" },
  { name: "ARCHIVE EGRESS", amount: "$1,190", status: "PROCESSING" },
];

const walletEvents = [
  "APTOS settlement confirmed for invoice block #0491.",
  "Treasury allocation moved 28% into uptime reserve.",
  "Bandwidth threshold alert triggered on cluster delta.",
];

export default function BillingPage() {
  return (
    <div className="page-stack">
      <section className="hero-panel">
        <div className="hero-frame billing-hero">
          <p className="hero-kicker">TREASURY + USAGE LEDGER</p>
          <h1>Track protocol spend, invoice bandwidth bursts, and keep every sync contract wallet-ready.</h1>
          <div className="hero-actions">
            <button type="button" className="primary-action">
              REVIEW INVOICES
            </button>
            <button type="button" className="ghost-action">
              DOWNLOAD LEDGER
            </button>
          </div>
        </div>
      </section>

      <section className="dual-grid">
        <article className="panel metric-panel">
          <div className="section-header">
            <p className="section-title">MONTHLY RUNWAY</p>
            <span>APR 2026</span>
          </div>
          <div className="health-metric">
            <strong>$82.4K</strong>
            <p>AVAILABLE ACROSS TREASURY, RESERVE, AND BURST BUDGETS</p>
          </div>
          <div className="budget-stack" aria-hidden="true">
            <span />
            <span />
            <span className="is-wide" />
          </div>
        </article>

        <article className="panel">
          <div className="section-header">
            <p className="section-title">WALLET EVENTS</p>
            <span>3 NEW</span>
          </div>
          <div className="log-list">
            {walletEvents.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
        </article>
      </section>

      <section className="panel">
        <div className="section-header">
          <p className="section-title">INVOICE QUEUE</p>
          <span>FINANCE OPS</span>
        </div>

        <div className="invoice-list">
          {invoices.map((invoice) => (
            <div key={invoice.name} className="invoice-card">
              <div>
                <h2>{invoice.name}</h2>
                <p>APTOS CONTRACT SETTLEMENT READY</p>
              </div>
              <strong>{invoice.amount}</strong>
              <span>{invoice.status}</span>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
