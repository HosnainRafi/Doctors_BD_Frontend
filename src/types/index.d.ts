import "express";

declare global {
  namespace Express {
    interface Request {
      user?: any; // or use a more specific type if you want
    }
  }
}
