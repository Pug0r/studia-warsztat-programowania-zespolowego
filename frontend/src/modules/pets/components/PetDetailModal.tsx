import React from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import "./PetDetailModal.css";
import { usePet } from "../hooks/usePet";
import type { Pet } from "../types/Pets";
import { deletePetPhotoRequest, setPetMainPhotoRequest } from "../api/petsApi";
import { useNavigate } from "react-router-dom";
import { useUserProfile } from "@/modules/auth/hooks/useUserProfile";
import Masonry from "react-masonry-css";

type Props = {
  petId: number;
  initialData?: Pet;
  isOpen: boolean;
  onClose: () => void;
};

export const PetDetailModal: React.FC<Props> = ({
  petId,
  initialData,
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { role } = useUserProfile();
  const isAdmin = role === "admin";
  const { data: pet } = usePet(petId, { initialData });

  //   const getStatusLabel = (status: string) => {
  //     switch (status) {
  //       case "available":
  //         return "Available";
  //       case "quarantine":
  //         return "In Quarantine";
  //       default:
  //         return status;
  //     }
  //   };

  //   const statusClass =
  //     (pet?.status || "available") === "quarantine"
  //       ? "pet-detail__status pet-detail__status--quarantine"
  //       : "pet-detail__status pet-detail__status--available";

  const setMainPhotoMutation = useMutation({
    mutationFn: ({ imageUrl }: { imageUrl: string }) =>
      setPetMainPhotoRequest(petId, imageUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_pet", petId] });
      queryClient.invalidateQueries({ queryKey: ["get_pet_list"] });
    },
  });

  const deletePhotoMutation = useMutation({
    mutationFn: ({ imageUrl }: { imageUrl: string }) =>
      deletePetPhotoRequest(petId, imageUrl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["get_pet", petId] });
      queryClient.invalidateQueries({ queryKey: ["get_pet_list"] });
    },
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      {/* Tailwind for the MAX WIDTH and MAX HEIGHT only */}
      <DialogContent
        aria-describedby={undefined}
        className="shelter-public pet-detail-dialog p-5 pt-1 pb-2 max-h-[90vh] pr-2 max-w-4xl w-full overflow-hidden"
      >
        {/* Scrollable content area */}
        <div className="overflow-y-auto pr-3">
          <DialogHeader className="pb-6 mt-2">
            <DialogTitle className="pet-detail__title">
              Meet {pet?.name}!
            </DialogTitle>
          </DialogHeader>

          <DialogClose />

          {pet && (
            <div className="pt-5 pr-4">
              <div className="pet-detail__layout pb-5">
                <div className="pet-detail__left">
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
                    onClick={() => navigate(`/adopt?petId=${petId}`)}
                  >
                    Start Adoption Process
                  </button>
                </div>

                {/* Right — Info */}
                <div className="pet-detail__info">
                  <div className="pet-detail__header">
                    <p className="pet-detail__breed">{pet.breed}</p>
                    {/* <span className={statusClass}>
                      <span className="pet-detail__status-dot" />
                      {getStatusLabel(pet.status || "available")}
                    </span> */}
                  </div>

                  {/* Stats */}
                  <div className="pet-detail__stats">
                    {pet.breed !== null && (
                      <div className="pet-detail__stat">
                        <p className="pet-detail__stat-label">Breed</p>
                        <p className="pet-detail__stat-value">{pet.breed}</p>
                      </div>
                    )}
                    {pet.age !== null && (
                      <div className="pet-detail__stat">
                        <p className="pet-detail__stat-label">Age</p>
                        <p className="pet-detail__stat-value">
                          {pet.age} year{pet.age === 1 ? "" : "s"}
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

              {/* Photo Gallery */}

              <div className="pet-detail__gallery pt-2">
                <h3 className="pet-detail__gallery-title">Photo Gallery</h3>
                <Masonry
                  breakpointCols={3}
                  className="pet-detail__gallery-grid"
                  columnClassName="pet-detail__gallery-column"
                >
                  {[pet.image_url, ...(pet.image_urls || [])]
                    .filter(Boolean)
                    .map((url) => {
                      const imageUrl = String(url);
                      const isMain = pet.image_url === imageUrl;

                      return (
                        <div
                          key={imageUrl}
                          className="pet-detail__gallery-item max-h-100"
                        >
                          <img src={imageUrl} alt={pet.name} />
                          {isAdmin && (
                            <div className="pet-detail__gallery-actions">
                              <button
                                type="button"
                                className="hp-btn hp-btn--secondary pet-detail__gallery-button hover:bg-slate-300!"
                                disabled={
                                  setMainPhotoMutation.isPending || isMain
                                }
                                onClick={() =>
                                  setMainPhotoMutation.mutate({ imageUrl })
                                }
                              >
                                {isMain ? "Is profile" : "Set profile"}
                              </button>
                              <button
                                type="button"
                                className="hp-btn hp-btn--primary bg-red-600! hover:bg-red-700! disabled:bg-red-400!"
                                disabled={deletePhotoMutation.isPending}
                                onClick={() =>
                                  deletePhotoMutation.mutate({ imageUrl })
                                }
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      );
                    })}
                </Masonry>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
