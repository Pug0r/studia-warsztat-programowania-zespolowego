import axios from "axios";
import { supabase } from "@/lib/supabaseClient";

const api = axios.create({
  baseURL: "http://localhost:3000/",
});

api.interceptors.request.use(async (config) => {
  const { data, error } = await supabase.auth.getSession();
  if (error) throw new Error("Session error");

  const accessToken = data.session?.access_token;

  if (!accessToken) {
    throw new Error("User not authenticated");
  }

  config.headers.Authorization = `Bearer ${accessToken}`;
  return config;
});

export default api;
