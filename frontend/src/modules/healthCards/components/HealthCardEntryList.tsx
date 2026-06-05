import {
  HEALTH_CARD_ENTRY_TYPE_LABELS,
  type HealthCardEntry,
} from "../types/HealthCard";

type Props = {
  entries: HealthCardEntry[];
  onEdit?: (entry: HealthCardEntry) => void;
  onDelete?: (entry: HealthCardEntry) => void;
};

const formatDate = (iso: string): string => {
  try {
    return new Date(iso).toLocaleDateString("en-GB", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return iso;
  }
};

export const HealthCardEntryList = ({ entries, onEdit, onDelete }: Props) => {
  if (entries.length === 0) {
    return (
      <p className="hc-empty">No entries in this animal's health card yet.</p>
    );
  }

  return (
    <ul className="hc-entry-list">
      {entries.map((entry) => (
        <li key={entry.id} className="hc-entry">
          <div className="hc-entry__head">
            <span className="hc-entry__date">
              {formatDate(entry.treatment_date)}
            </span>
            <span className="hc-entry__type">
              {HEALTH_CARD_ENTRY_TYPE_LABELS[entry.entry_type]}
            </span>
            {onEdit && (
              <button
                type="button"
                className="hp-btn hp-btn--secondary hc-entry__edit"
                onClick={() => onEdit(entry)}
              >
                Edit
              </button>
            )}
            {onDelete && (
              <button
                type="button"
                className="hp-btn hp-btn--secondary hc-entry__delete"
                onClick={() => onDelete(entry)}
              >
                Delete
              </button>
            )}
          </div>

          <h3 className="hc-entry__title">{entry.title}</h3>

          {entry.medication && (
            <p className="hc-entry__field">
              <strong>Medication:</strong> {entry.medication}
            </p>
          )}

          {entry.description && (
            <p className="hc-entry__field hc-entry__description">
              {entry.description}
            </p>
          )}

          {entry.vet_email && (
            <p className="hc-entry__meta">Recorded by: {entry.vet_email}</p>
          )}
        </li>
      ))}
    </ul>
  );
};
