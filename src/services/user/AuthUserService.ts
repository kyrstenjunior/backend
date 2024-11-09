import prismaClient from "../../prisma";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

interface AuthRequest {
    email: string,
    password: string
}

class AuthUserService {
    async execute({ email, password }: AuthRequest) {

        // Verificar se o email existe
        const user = await prismaClient.user.findFirst({
            where: {
                email: email
            }
        })

        if(!user) {
            throw new Error("User or password incorrect");
        }

        // Verificar se a senha está correta
        const passwordMath = await compare(password, user.password);

        if(!passwordMath) {
            throw new Error("User or password incorrect");
        }

        // Caso tenha dado tudo certo, gerar token JWT (JSON Web Token) e devolver os dados do usuário como id, name e email
        const token = sign(
            {
                // Payload
                name: user.name,
                email: user.email
            },
            // Chave que vem do .env (variável de ambiente)
            process.env.JWT_SECRET,
            {
                // Options
                subject: user.id,
                expiresIn: '30d'
            }

        )

        // Para verificar o token gerado com as informações do return abaixo, acessar: https://jwt.io/
        return { 
            id: user.id,
            name: user.name,
            email: user.email,
            token: token
         }
    }
}

export { AuthUserService }