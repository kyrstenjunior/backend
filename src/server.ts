import express, { Request, Response, NextFunction } from "express";
import 'express-async-errors';
import cors from 'cors';
import path from 'path';
import fileUpload from "express-fileupload";

import { router } from "./routes";

// setando express como app
const app = express();

// definindo o tipo de dado que será utilizado
app.use(express.json());

// Libera para qualquer ip fazer as requisições nesta API
app.use(cors());

// Lib de upload para subir as imagens para o serviço externo Cloudinary
app.use(fileUpload({
    limits: { fileSize: 50 * 1024 * 1024} // No máximo 50mb
}))

// usa as rotas definidas no router
app.use(router);

// cria uma rota estatica para verificar se a foto existe
// tenho na minha pasta temp o arquivo: 2e92ab37ceb7a728fceb849a43650bed-pizza-calabresa.jpg
// para acessá-lo via url: http://localhost:3333/files/2e92ab37ceb7a728fceb849a43650bed-pizza-calabresa.jpg
app.use(
    '/files',
    express.static(path.resolve(__dirname, '..', 'tmp'))
);

// Middleware para criar excessões para erros
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {

    // se for uma instancia do tipo Error
    if(err instanceof Error) {
        return res.status(400).json({ error: err.message })
    }

    return res.status(500).json({ status: 'error', message: 'Internal server error' })

})

// inicia o servidor
app.listen(process.env.PORT, () => console.log('Servidor online'));