import React, { useRef } from "react";
import { usePetPhotoUpload } from "../hooks/usePetPhotoUpload";

type Props = {
  petId: number;
};

export const PetPhotoUpload: React.FC<Props> = ({ petId }) => {
  const inputRef = useRef<HTMLInputElement>(null);
  const { mutate, isPending, isError, error } = usePetPhotoUpload();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    mutate({ petId, file });
    e.target.value = "";
  };

  return (
    <div className="mt-3">
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />
      <button
        type="button"
        disabled={isPending}
        onClick={() => inputRef.current?.click()}
        className="text-sm px-3 py-1 rounded-lg border border-gray-300 hover:bg-gray-50 disabled:opacity-50 transition"
      >
        {isPending ? "Uploading..." : "Upload photo"}
      </button>
      {isError && (
        <p className="text-xs text-red-500 mt-1">
          {error instanceof Error ? error.message : "Upload failed."}
        </p>
      )}
    </div>
  );
};
