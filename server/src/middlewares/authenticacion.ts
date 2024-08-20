import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

interface ExcludedRoute {
  method: string;
  path: string;
}

const excludedRoutes: ExcludedRoute[] = [
  { method: "POST", path: "/api/v1/register" },
  { method: "POST", path: "/api/v1/login" },
  { method: "POST", path: "/api/v1/remember" },

  // Add more exclusions as needed
];

export function verifyToken(req: Request, res: Response, next: NextFunction) {

  
  const isExcluded = excludedRoutes.some(
    (route) => route.method === req.method && route.path === req.path
  );

  if (isExcluded) {
    return next(); // Skip middleware for excluded routes
  }

  const token = req.headers["authorization"];

  if (!token) {
    return res.status(403).send({ message: "No token provided!" });
  }
  if (typeof token !== "string") {
    return res.status(401).send({ message: "Unauthorized" });
  }

  jwt.verify(token, "PIIngebases2024", (err: any) => {
    if (err) {
      if (err.name === "TokenExpiredError") {
        return res.status(401).send({ message: "Token expired!" });
      }
      return res.status(401).send({ message: "Unauthorized!" });
    }
    next();
  });
}
