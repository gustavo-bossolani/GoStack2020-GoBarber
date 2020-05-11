import 'reflect-metadata';

import express, { Request, Response, NextFunction } from 'express';
import 'express-async-errors';

import routes from './routes';
import uploadConfig from './config/upload';
import AppError from './errors/AppError';

import './database/index';

const app = express();
app.use(express.json());
app.use('/files', express.static(uploadConfig.directory));
app.use(routes);

app.use((err: Error, req: Request, resp: Response, _: NextFunction) => {
    if (err instanceof AppError) {
        return resp.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    console.error(err);

    return resp.status(500).json({
        status: 'error',
        message: 'Erro interno do servidor.',
    });
});

app.listen(3333, () => {
    console.log('🚀️ Listen on 3333');
});
