export default function Topbar({ onSync }) {
  return (
    <header className="topbar">
      <div className="logo">
        <div className="logo-icon" />
        Secure<span>Vault</span>
      </div>
      <div className="topbar-divider" />
      <span className="topbar-title">Enterprise Vault</span>
      <div className="topbar-right">
        <div className="status-dot" />
        <span className="status-text">Encrypted · AES-256</span>
        <button className="topbar-btn" onClick={onSync}>↻ Sync</button>
      </div>
    </header>
  );
}
