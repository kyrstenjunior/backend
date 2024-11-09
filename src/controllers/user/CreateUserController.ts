import { Request, Response, response } from "express";
import { CreateUserService } from "../../services/user/CreateUserService";

class CreateUserController {
    async handle(req: Request, res: Response){
        const { name, email, password } = req.body;

        const createUserService = new CreateUserService();

        // Como a função execute() do service createUserService é uma função async, precisa ter um await aqui
        const user = await createUserService.execute({ name, email, password });

        return res.json(user);
    }
}

export { CreateUserController }