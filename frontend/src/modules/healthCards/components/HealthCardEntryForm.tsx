import { useState, type FormEvent } from "react";
import {
  HEALTH_CARD_ENTRY_TYPES,
  HEALTH_CARD_ENTRY_TYPE_LABELS,
  type HealthCardEntry,
  type HealthCardEntryPayload,
  type HealthCardEntryType,
} from "../types/HealthCard";

type Props = {
  entry?: HealthCardEntry;
  isSaving?: boolean;
  onSubmit: (payload: HealthCardEntryPayload) => void;
  onCancel: () => void;
};

const today = () => new Date().toISOString().slice(0, 10);

const toDateInput = (value: string) => value.slice(0, 10);

export const HealthCardEntryForm = ({
  entry,
  isSaving,
  onSubmit,
  onCancel,
}: Props) => {
  const [entryType, setEntryType] = useState<HealthCardEntryType>(
    entry?.entry_type ?? "treatment",
  );
  const [title, setTitle] = useState(entry?.title ?? "");
  const [treatmentDate, setTreatmentDate] = useState(
    entry ? toDateInput(entry.treatment_date) : today(),
  );
  const [medication, setMedication] = useState(entry?.medication ?? "");
  const [description, setDescription] = useState(entry?.description ?? "");
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();

    if (!title.trim()) {
      setError("Title is required.");
      return;
    }
    if (!treatmentDate) {
      setError("Treatment date is required.");
      return;
    }

    setError(null);
    onSubmit({
      entry_type: entryType,
      title: title.trim(),
      treatment_date: treatmentDate,
      medication: medication.trim() || null,
      description: description.trim() || null,
    });
  };

  return (
    <form className="hc-form" onSubmit={handleSubmit}>
      <div className="hc-form__row">
        <div className="hc-form__field">
          <label className="hc-form__label" htmlFor="hc-entry-type">
            Type
          </label>
          <select
            id="hc-entry-type"
            className="hc-form__select"
            value={entryType}
            onChange={(e) => setEntryType(e.target.value as HealthCardEntryType)}
          >
            {HEALTH_CARD_ENTRY_TYPES.map((type) => (
              <option key={type} value={type}>
                {HEALTH_CARD_ENTRY_TYPE_LABELS[type]}
              </option>
            ))}
          </select>
        </div>

        <div className="hc-form__field">
          <label className="hc-form__label" htmlFor="hc-entry-date">
            Treatment date
          </label>
          <input
            id="hc-entry-date"
            type="date"
            className="hc-form__input"
            value={treatmentDate}
            onChange={(e) => setTreatmentDate(e.target.value)}
          />
        </div>
      </div>

      <div className="hc-form__field">
        <label className="hc-form__label" htmlFor="hc-entry-title">
          Title
        </label>
        <input
          id="hc-entry-title"
          className="hc-form__input"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="e.g. Rabies vaccination"
        />
      </div>

      <div className="hc-form__field">
        <label className="hc-form__label" htmlFor="hc-entry-medication">
          Medication
        </label>
        <input
          id="hc-entry-medication"
          className="hc-form__input"
          value={medication}
          onChange={(e) => setMedication(e.target.value)}
          placeholder="Optional"
        />
      </div>

      <div className="hc-form__field">
        <label className="hc-form__label" htmlFor="hc-entry-description">
          Description
        </label>
        <textarea
          id="hc-entry-description"
          className="hc-form__input hc-form__textarea"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Diagnosis, notes, dosage…"
        />
      </div>

      {error && <p className="hc-form__error">{error}</p>}

      <div className="hc-form__actions">
        <button
          type="button"
          className="hp-btn hp-btn--secondary"
          onClick={onCancel}
          disabled={isSaving}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="hp-btn hp-btn--primary"
          disabled={isSaving}
        >
          {isSaving ? "Saving…" : entry ? "Save changes" : "Add entry"}
        </button>
      </div>
    </form>
  );
};
