import { Request, Response, NextFunction } from 'express';

export const allowRoles = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const userRole = req.user.role; // Ganti dengan mekanisme otentikasi Anda

    if (!roles.includes(userRole)) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};
