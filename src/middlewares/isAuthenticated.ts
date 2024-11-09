import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";

interface Payload {
    sub: string;
}

export function isAuthenticated (req: Request, res: Response, next: NextFunction) {

    // Receber o token para validar se o usuário está logado
    const authToken = req.headers.authorization;

    // se não tiver um token, retorna erro 401 (sem autorização)
    if(!authToken) {
        return res.status(401).end();
    }

    // o item está vindo como Bearer token, uso split para criar um array [Bearer, token], a virgula é para ignorar o primeiro item (Bearer), e pego apenas o token.
    const [, token] = authToken.split(" ");

    try{
        // Validar o token recebido
        const { sub } = verify(token, process.env.JWT_SECRET) as Payload

        // Aqui foi injetada uma tipagem para reconhecer o typescript reconhecer o user_id (@types/express/index.d.ts)
        req.user_id = sub;
        
        return next();
    } catch(err) {
        return res.status(401).end();
    }
}