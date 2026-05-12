import React from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import "./PetDetailModal.css";
import { usePet } from "../hooks/usePet";

type Props = {
  petId: number;
  isOpen: boolean;
  onClose: () => void;
};

export const PetDetailModal: React.FC<Props> = ({ petId, isOpen, onClose }) => {
  const { data: pet } = usePet(petId);

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
      {/* Tailwind for the MAX WIDTH and MAX HEIGHT only */}
      <DialogContent className="shelter-public pet-detail-dialog p-5 pr-2 max-w-4xl w-full">
        <div className="pet-detail-scroll flex-1 pr-3">
          <DialogHeader className="pb-6">
            <DialogTitle className="pet-detail__title">
              Meet {pet?.name}!
            </DialogTitle>
          </DialogHeader>

          <DialogClose />

          {pet && (
            <div className="pt-6 pr-4">
              <div className="pet-detail__layout pb-5">
                <div className="pet-detail__left">
                  {/*<div style={{display: 'flex', flexDirection: 'column', gap: '0.75rem'}}>*/}

                  {/* Left — Photo */}
                  <div className="pet-detail__photo">
                    {pet.image_url ? (
                      <img src={pet.image_url} alt={pet.name} />
                    ) : (
                      <span className="pet-detail__photo-placeholder">
                        {" "}
                        No photo available{" "}
                      </span>
                    )}
                  </div>

                  {/* CTA — reuses hp-btn from HomePage.css */}
                  <button
                    className="hp-btn hp-btn--primary"
                    style={{
                      width: "80%",
                      height: "8rem",
                      marginTop: "auto",
                      marginBottom: "auto",
                    }}
                  >
                    Start Adoption Process
                  </button>
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
                      <p className="pet-detail__stat-label">Breed</p>
                      <p className="pet-detail__stat-value">{pet.breed}</p>
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
                        <p className="pet-detail__stat-value">
                          {pet.weight} kg
                        </p>
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
                    <h3 className="pet-detail__extras-title">
                      More Information
                    </h3>
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

              {/* <div className="pet-detail__about pt-2">
                <h3 className="pet-detail__about-title">About {pet.name}</h3>
                <p className="pet-detail__desc">
                  {pet.long_description || pet.description}
                </p>
              </div> */}

              {/* Photo Gallery - can be commented out if not ready */}
              <div className="pet-detail__gallery pt-2">
                <h3 className="pet-detail__gallery-title">Photo Gallery</h3>
                <div className="pet-detail__gallery-grid">
                  {[pet.image_url, ...(pet.image_urls || [])]
                    .filter(Boolean)
                    .map((url, index) => (
                      <div key={index} className="pet-detail__gallery-item">
                        <img src={url} alt={`${pet.name} photo ${index + 1}`} />
                      </div>
                    ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
