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
const express_1 = __importDefault(require("express"));
const config_1 = require("./utils/config");
const connectToDb_1 = require("./utils/connectToDb");
const auth_1 = __importDefault(require("./routers/auth"));
const customErrorHandler_1 = require("./middlewares/customErrorHandler");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const user_1 = require("./routers/user");
const video_1 = __importDefault(require("./routers/video"));
const customRequestLogger_1 = __importDefault(require("./utils/customRequestLogger"));
const comment_route_1 = __importDefault(require("./routers/comment.route"));
const cors_1 = __importDefault(require("cors"));
const corsOptions_1 = __importDefault(require("./corsConfig/corsOptions"));
const server = (0, express_1.default)();
// middlewares
server.use((0, cors_1.default)(corsOptions_1.default));
server.use(express_1.default.json());
server.use((0, cookie_parser_1.default)());
//custom request logger
server.use(customRequestLogger_1.default);
// Routers
server.use("/api/auth", auth_1.default);
server.use("/api/users", user_1.userRouter);
server.use("/api/videos", video_1.default);
server.use("/api/comments", comment_route_1.default);
// custom error handler
server.use(customErrorHandler_1.customErrorHandler);
const startServer = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, connectToDb_1.connectToDB)();
        console.log("connected to mongoose.");
        server.listen(5000, () => console.log(`server started listening at port ${config_1.PORT}`));
    }
    catch (error) {
        console.log(error.message);
    }
});
startServer();
