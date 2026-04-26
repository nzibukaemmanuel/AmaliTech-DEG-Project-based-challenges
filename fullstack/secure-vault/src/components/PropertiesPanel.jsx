import { getFileIcon, getExt } from "../utils.jsx";

export default function PropertiesPanel({ selectedNode }) {
  return (
    <aside className="panel">
      <div className="panel-header">
        <span style={{
          width: 6, height: 6, borderRadius: "50%",
          background: selectedNode ? "var(--accent)" : "var(--text-dim)",
          display: "inline-block",
          boxShadow: selectedNode ? "0 0 6px var(--accent)" : "none",
        }} />
        <span className="panel-title">Properties</span>
      </div>

      <div className="panel-scroll">
        {!selectedNode ? (
          <div className="panel-empty">
            <div style={{ fontSize: 28 }}>◻</div>
            <div className="panel-empty-text">No file selected.<br />Click a file to inspect.</div>
          </div>
        ) : (
          <>
            {(() => {
              const fi = getFileIcon(selectedNode.name);
              return (
                <div
                  className="prop-file-icon"
                  style={{ background: fi.color + "18", border: `1px solid ${fi.color}33`, color: fi.color }}
                >
                  {fi.icon}
                </div>
              );
            })()}
            <div className="prop-name">{selectedNode.name}</div>
            <div className="prop-divider" />
            <div className="prop-row">
              <span className="prop-key">Name</span>
              <span className="prop-val">{selectedNode.name}</span>
            </div>
            <div className="prop-row">
              <span className="prop-key">Type</span>
              <span className="prop-val accent">{getExt(selectedNode.name).toUpperCase()}</span>
            </div>
            <div className="prop-row">
              <span className="prop-key">Size</span>
              <span className="prop-val">{selectedNode.size}</span>
            </div>
          </>
        )}
      </div>

    </aside>
  );
}
