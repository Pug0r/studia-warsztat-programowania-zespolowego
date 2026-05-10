import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createVolunteerRequest,
  deleteVolunteerRequest,
  getVolunteersRequest,
  updateVolunteerRequest,
} from "../api/volunteersApi";
import type {
  CreateVolunteerDTO,
  UpdateVolunteerDTO,
  Volunteer,
} from "../types/Volunteers";

const QUERY_KEY = ["volunteers"];

export const useVolunteers = () => {
  return useQuery<Volunteer[], Error>({
    queryKey: QUERY_KEY,
    queryFn: getVolunteersRequest,
    staleTime: 30 * 1000,
  });
};

export const useCreateVolunteer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreateVolunteerDTO) =>
      createVolunteerRequest(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useUpdateVolunteer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: number;
      payload: UpdateVolunteerDTO;
    }) => updateVolunteerRequest(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};

export const useDeleteVolunteer = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => deleteVolunteerRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
