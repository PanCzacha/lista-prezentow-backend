import {NextFunction, Request, Response} from "express";

export class ValidationError extends Error {}

export function handleError(err: Error, req: Request, res: Response, next: NextFunction): void {
 console.error(err);
 res
   .status(err instanceof ValidationError ? 400 : 500)
   .json({
     message: err instanceof ValidationError ? err.message : "Sorry, please try again later. We are working on solution of this problem"
   })
}
