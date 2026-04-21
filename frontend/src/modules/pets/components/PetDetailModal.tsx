import React, { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Pet } from "@/modules/pets/types/Pets";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { getPetById } from "../api/petsApi";

type Props = {
  petId: number;
  isOpen: boolean;
  onClose: () => void;
};

export const PetDetailModal: React.FC<Props> = ({ petId, isOpen, onClose }) => {
  const { data: pet, isLoading, error } = useQuery({
    queryKey: ["pet", petId],
    queryFn: () => getPetById(petId),
    enabled: isOpen,
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case "available":
        return "default";
      case "quarantine":
        return "destructive";
      default:
        return "default";
    }
  };

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

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Pet Details</DialogTitle>
          <DialogClose />
        </DialogHeader>

        {isLoading && (
          <div className="flex justify-center py-8">
            <p className="text-gray-500">Loading pet details...</p>
          </div>
        )}

        {error && (
          <div className="flex justify-center py-8">
            <p className="text-red-500">Error loading pet details</p>
          </div>
        )}

        {pet && (
          <div className="space-y-4">
            {/* Photo */}
            <div className="w-full h-64 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
              {pet.photo_url ? (
                <img
                  src={pet.photo_url}
                  alt={pet.name}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <span>No photo available</span>
                </div>
              )}
            </div>

            {/* Name and Status */}
            <div className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-2xl font-semibold">{pet.name}</h2>
                <Badge variant={getStatusColor(pet.status || "available")}>
                  {getStatusLabel(pet.status || "available")}
                </Badge>
              </div>
            </div>

            {/* Species and basic info */}
            <div className="space-y-2 text-sm text-gray-600">
              <p>
                <span className="font-medium text-gray-900">Species:</span>{" "}
                {pet.species}
              </p>
              {pet.age !== null && (
                <p>
                  <span className="font-medium text-gray-900">Age:</span>{" "}
                  {pet.age} years
                </p>
              )}
              {pet.weight !== null && (
                <p>
                  <span className="font-medium text-gray-900">Weight:</span>{" "}
                  {pet.weight} kg
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-2">
              <h3 className="font-medium text-gray-900">Description</h3>
              <p className="text-sm text-gray-700">{pet.description}</p>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
