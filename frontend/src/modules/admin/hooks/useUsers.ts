import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  deleteUserRequest,
  getAllUsersRequest,
  updateUserRoleRequest,
} from "../api/administrationApi";
import type { UpdateUserRoleDTO, UserProfile } from "../types/Users";

const QUERY_KEY = ["administration", "users"];

export const useUsers = () => {
  return useQuery<UserProfile[], Error>({
    queryKey: QUERY_KEY,
    queryFn: getAllUsersRequest,
    staleTime: 30 * 1000,
  });
};

export const useUpdateUserRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ id, payload }: { id: string; payload: UpdateUserRoleDTO }) =>
      updateUserRoleRequest(id, payload),
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
      queryClient.invalidateQueries({
        queryKey: ["administration", "user", variables.id],
      });
    },
  });
};

export const useDeleteUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => deleteUserRequest(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QUERY_KEY });
    },
  });
};
