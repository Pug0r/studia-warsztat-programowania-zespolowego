import React from "react";
import type { Pet } from "@/modules/pets/types/Pets";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import "./PetDetailModal.css";

type Props = {
  petId: number;
  isOpen: boolean;
  onClose: () => void;
  mockPet?: any; // For use with mock data
};

export const PetDetailModal: React.FC<Props> = ({
  petId,
  isOpen,
  onClose,
  mockPet,
}) => {
  const pet = mockPet;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "available":
        return "Available";
      case "quarantine":
        return "In Quarantine";
      default:
        return status;
    }
  };

  const statusClass =
    (pet?.status || "available") === "quarantine"
      ? "pet-detail__status pet-detail__status--quarantine"
      : "pet-detail__status pet-detail__status--available";

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="pet-detail-dialog max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="pet-detail__title">
            Meet {pet?.name}!
          </DialogTitle>
          <DialogClose />
        </DialogHeader>

        {pet && (
          <>
            <div className="pet-detail__layout">
              {/* Left — Photo */}
              <div className="pet-detail__photo">
                {pet.photo_url ? (
                  <img src={pet.photo_url} alt={pet.name} />
                ) : (
                  <span className="pet-detail__photo-placeholder">
                    No photo available
                  </span>
                )}



              </div>

              {/* Right — Info */}
              <div className="pet-detail__info">
                <div className="pet-detail__header">
                  <p className="pet-detail__breed">{pet.breed}</p>
                  <span className={statusClass}>
                    <span className="pet-detail__status-dot" />
                    {getStatusLabel(pet.status || "available")}
                  </span>
                </div>

                {/* Stats */}
                <div className="pet-detail__stats">
                  <div className="pet-detail__stat">
                    <p className="pet-detail__stat-label">Species</p>
                    <p className="pet-detail__stat-value">{pet.species}</p>
                  </div>
                  {pet.age !== null && (
                    <div className="pet-detail__stat">
                      <p className="pet-detail__stat-label">Age</p>
                      <p className="pet-detail__stat-value">
                        {pet.age} year{pet.age !== 1 ? "s" : ""}
                      </p>
                    </div>
                  )}
                  {pet.weight !== null && (
                    <div className="pet-detail__stat">
                      <p className="pet-detail__stat-label">Weight</p>
                      <p className="pet-detail__stat-value">{pet.weight} kg</p>
                    </div>
                  )}
                  {pet.size && (
                    <div className="pet-detail__stat">
                      <p className="pet-detail__stat-label">Size</p>
                      <p className="pet-detail__stat-value">{pet.size}</p>
                    </div>
                  )}
                </div>

                {/* Colorful extra info */}
                <div className="pet-detail__extras">
                  <h3 className="pet-detail__extras-title">More Information</h3>
                  <div className="pet-detail__extra pet-detail__extra--personality">
                    <p className="pet-detail__extra-label">Personality</p>
                    <p className="pet-detail__extra-value">
                      {pet.personality ||
                        "Friendly and well-behaved. Adapts well to new environments."}
                    </p>
                  </div>
                  <div className="pet-detail__extra pet-detail__extra--home">
                    <p className="pet-detail__extra-label">Ideal Home</p>
                    <p className="pet-detail__extra-value">
                      {pet.ideal_home ||
                        "Looking for a loving family with a secure home environment."}
                    </p>
                  </div>
                  <div className="pet-detail__extra pet-detail__extra--needs">
                    <p className="pet-detail__extra-label">Special Needs</p>
                    <p className="pet-detail__extra-value">
                      {pet.special_needs ||
                        "No special requirements. Regular care and attention needed."}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* About section — full width below photo + info */}
            <div className="pet-detail__about">
              <h3 className="pet-detail__about-title">About {pet.name}</h3>
              <p className="pet-detail__desc">
                "{pet.long_description || pet.description}"
              </p>
            </div>

            {/* CTA — reuses hp-btn from HomePage.css */}
            <button
              className="hp-btn hp-btn--primary"
              style={{ width: "100%", marginTop: "0.5rem" }}
            >
              Start Adoption Process
            </button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};
