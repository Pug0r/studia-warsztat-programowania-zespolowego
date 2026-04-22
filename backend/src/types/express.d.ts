declare global {
  namespace Express {
    interface Request {
      auditContext?: {
        actorUserId?: string | null;
        actorEmail?: string | null;
        ipAddress?: string | null;
        userAgent?: string | null;
        method?: string;
        route?: string;
      };
    }
  }
}

export {};
