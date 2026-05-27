import { getSupabaseAdmin, supabase } from "#config/supabaseClient.js";

interface AddUserInput {
  email: string;
  password: string;
  role: "user" | "admin" | "vet" | "coordinator" | "volunteer";
}

interface UpdateRoleInput {
  id: string;
  role: AddUserInput["role"];
}

export const getAllUsers = async () => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, role, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const getUserData = async (id: string) => {
  const { data, error } = await supabase
    .from("profiles")
    .select("id, email, role, created_at")
    .eq("id", id)
    .single();

  if (error) {
    if (error.code === "PGRST116") {
      return null; // not found
    }
    throw new Error(error.message);
  }

  return data;
};

export const addUser = async (input: AddUserInput) => {
  const { email, password, role } = input;
  const supabaseAdmin = getSupabaseAdmin();

  const { data: authUser, error: authError } =
    await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
    });

  if (authError) {
    throw new Error(authError.message);
  }

  // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
  if (!authUser.user) {
    throw new Error("User creation failed");
  }

  const userId = authUser.user.id;

  const { data, error } = await supabase
    .from("profiles")
    .insert({
      id: userId,
      email,
      role,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const addRole = async (input: UpdateRoleInput) => {
  const { id, role } = input;

  const { data, error } = await supabase
    .from("profiles")
    .update({
      role,
    })
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const deleteUser = async (id: string) => {
  const supabaseAdmin = getSupabaseAdmin();

  const { error: authError } = await supabaseAdmin.auth.admin.deleteUser(id);
  const { error } = await supabase.from("profiles").delete().eq("id", id);

  if (authError) {
    throw new Error(authError.message);
  }
  if (error) {
    throw new Error(error.message);
  }

  return true;
};
