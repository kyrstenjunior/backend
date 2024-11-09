"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
require("express-async-errors");
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const express_fileupload_1 = __importDefault(require("express-fileupload"));
const routes_1 = require("./routes");
// setando express como app
const app = (0, express_1.default)();
// definindo o tipo de dado que será utilizado
app.use(express_1.default.json());
// Libera para qualquer ip fazer as requisições nesta API
app.use((0, cors_1.default)());
// Lib de upload para subir as imagens para o serviço externo Cloudinary
app.use((0, express_fileupload_1.default)({
    limits: { fileSize: 50 * 1024 * 1024 } // No máximo 50mb
}));
// usa as rotas definidas no router
app.use(routes_1.router);
// cria uma rota estatica para verificar se a foto existe
// tenho na minha pasta temp o arquivo: 2e92ab37ceb7a728fceb849a43650bed-pizza-calabresa.jpg
// para acessá-lo via url: http://localhost:3333/files/2e92ab37ceb7a728fceb849a43650bed-pizza-calabresa.jpg
app.use('/files', express_1.default.static(path_1.default.resolve(__dirname, '..', 'tmp')));
// Middleware para criar excessões para erros
app.use((err, req, res, next) => {
    // se for uma instancia do tipo Error
    if (err instanceof Error) {
        return res.status(400).json({ error: err.message });
    }
    return res.status(500).json({ status: 'error', message: 'Internal server error' });
});
// inicia o servidor
app.listen(process.env.PORT, () => console.log('Servidor online'));
