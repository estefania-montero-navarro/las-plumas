import { Request, Response, NextFunction } from "express";

export function preventSQLInjection(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let injectionDetected = false;
  let badRequest = false;
  Object.keys(req.params).forEach((key) => {
    injectionDetected = detectSQLInjection(req.params[key]);
    if (injectionDetected) {
      badRequest = true;
      return res.status(400).send({ message: "Bad Request" });
    }
  });
  Object.keys(req.query).forEach((key) => {
    injectionDetected = detectSQLInjection(String(req.query[key]));
    if (injectionDetected) {
      badRequest = true;
      return res.status(400).send({ message: "Bad Request" });
    }
  });
  Object.keys(req.body).forEach((key) => {
    injectionDetected = detectSQLInjection(String(req.body[key]));
    if (injectionDetected) {
      badRequest = true;
      return res.status(400).send({ message: "Bad Request" });
    }
  });
  if (!badRequest) {
    next();
  }
}

function detectSQLInjection(expression: string) {
  const sqlInjectionPatterns = [
    /\b(or|and|union|select|insert|update|delete|drop|exec|exec\(|shutdown|script)\b/i,
    /(--|#|;)/,
    /\/\*.*\*\//,
    /\b\d+\s*=\s*\d+\b/,
    /\s*=\s*--/,
    /('|"|`)/,
  ];
  for (let pattern of sqlInjectionPatterns) {
    if (pattern.test(expression)) {
      return true;
    }
  }
  return false;
}
