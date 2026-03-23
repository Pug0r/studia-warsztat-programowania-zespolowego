import { Request, Response } from "express";

export const getWelcomeMessage = (req: Request, res: Response) => {
  res.json({ 
    items: [
      { id: 1, name: "Setup Docker" },
      { id: 2, name: "Connect Backend" },
      { id: 3, name: "Fix React Keys" }
    ]
  });
};