import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import authConfig from '../config/auth';
import AppError from '../errors/AppError';

interface TokenPayload {
    iat: number;
    exp: number;
    sub: string;
}

export default function ensureAuthenticated(
    req: Request,
    resp: Response,
    next: NextFunction,
): void {
    // Validação do token JWT
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        throw new AppError('Token JWT não foi especificado.', 401);
    }

    const [, token] = authHeader.split(' ');

    try {
        const decoded = verify(token, authConfig.jwt.secret);

        const { sub, exp, iat } = decoded as TokenPayload;

        req.user = {
            id: sub,
        };

        return next();
    } catch {
        throw new AppError('Token JTW inválido.', 401);
    }
}
