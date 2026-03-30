import { supabase } from "../../config/supabaseClient";

interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}
export interface CreateUserDTO {
  email: string;
  name: string;
}

export const getUsers = async (): Promise<User[]> => {
  const { data, error } = await supabase.from<User>("users").select("*");

  if (error) {
    throw new Error(error.message);
  }

  return data || [];
};

export const createUser = async (userData: CreateUserDTO): Promise<User> => {
  const { data, error } = await supabase
    .from("users")
    .insert([userData])
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};
