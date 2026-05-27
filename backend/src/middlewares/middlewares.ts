// middlewares.ts
import { RequestHandler as ExpressRequestHandler } from "express";
import { createClient } from "@supabase/supabase-js";
import { supabase } from "#config/supabaseClient.js";

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing SUPABASE_URL or SUPABASE_ANON_KEY");
}

const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);

declare module "express-serve-static-core" {
  interface Request {
    user?: {
      id: string;
      email?: string;
    };
  }
}

export const middleware: ExpressRequestHandler = (req, res, next) => {
  console.log("Middleware works!");
  next();
};

export const authMiddleware: ExpressRequestHandler = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    console.log("Auth header:", authHeader ? "present" : "missing");

    if (!authHeader?.startsWith("Bearer ")) {
      console.log("No Bearer token found");
      return res
        .status(401)
        .json({ error: "Missing or invalid authorization header" });
    }

    const token = authHeader.slice(7);
    console.log("Token length:", token.length);

    const { data, error } = await supabaseAuth.auth.getUser(token);

    console.log("Supabase getUser result:", {
      user: data.user?.id,
      error: error?.message,
    });

    if (error) {
      console.log("Invalid token or no user");
      return res.status(401).json({ error: "Invalid token" });
    }

    req.user = {
      id: data.user.id,
      email: data.user.email,
    };

    console.log("User authenticated:", req.user.id);
    next();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Auth error";
    console.error("Auth middleware error:", message);
    return res.status(500).json({ error: message });
  }
};

export const adminMiddleware: ExpressRequestHandler = async (
  req,
  res,
  next,
) => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        error: "Unauthorized",
      });
    }
    const { data, error } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (error || !data) {
      return res.status(403).json({
        error: "Forbidden",
      });
    }

    if (data.role !== "admin") {
      return res.status(403).json({
        error: "Forbidden",
      });
    }

    next();
  } catch (error) {
    const message = error instanceof Error ? error.message : "Auth error";
    console.error("Auth middleware error:", message);
    return res.status(500).json({ error: message });
  }
};
