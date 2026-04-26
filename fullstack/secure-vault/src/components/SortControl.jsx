export default function SortControl({ direction, onDirectionChange, criterion, onCriterionChange, criteria }) {
  const hasCriteria = criteria && criteria.length > 0;
  return (
    <div className="sort-ctrl">
      {hasCriteria && (
        <div className="sort-pills">
          {criteria.map(c => (
            <button
              key={c.value}
              className={`sort-pill${criterion === c.value ? " active" : ""}`}
              onClick={() => onCriterionChange(c.value)}
            >
              {c.label}
            </button>
          ))}
        </div>
      )}
      <button
        className="sort-dir-btn"
        onClick={() => onDirectionChange(d => d === "asc" ? "desc" : "asc")}
        title={direction === "asc" ? "Sort ascending" : "Sort descending"}
      >
        <span className="sort-dir-icon">⇅</span>
        <span className="sort-dir-label">Sort</span>
        <span className="sort-dir-arrow">{direction === "asc" ? "↑" : "↓"}</span>
      </button>
    </div>
  );
}
