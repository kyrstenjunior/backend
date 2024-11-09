"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthUserService = void 0;
const prisma_1 = __importDefault(require("../../prisma"));
const bcryptjs_1 = require("bcryptjs");
const jsonwebtoken_1 = require("jsonwebtoken");
class AuthUserService {
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password }) {
            // Verificar se o email existe
            const user = yield prisma_1.default.user.findFirst({
                where: {
                    email: email
                }
            });
            if (!user) {
                throw new Error("User or password incorrect");
            }
            // Verificar se a senha está correta
            const passwordMath = yield (0, bcryptjs_1.compare)(password, user.password);
            if (!passwordMath) {
                throw new Error("User or password incorrect");
            }
            // Caso tenha dado tudo certo, gerar token JWT (JSON Web Token) e devolver os dados do usuário como id, name e email
            const token = (0, jsonwebtoken_1.sign)({
                // Payload
                name: user.name,
                email: user.email
            }, 
            // Chave que vem do .env (variável de ambiente)
            process.env.JWT_SECRET, {
                // Options
                subject: user.id,
                expiresIn: '30d'
            });
            // Para verificar o token gerado com as informações do return abaixo, acessar: https://jwt.io/
            return {
                id: user.id,
                name: user.name,
                email: user.email,
                token: token
            };
        });
    }
}
exports.AuthUserService = AuthUserService;
