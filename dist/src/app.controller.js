"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bootstrap = bootstrap;
const module_1 = require("./module");
const DB_1 = require("./DB");
function bootstrap(app, express) {
    // parsing raw data
    app.use(express.json());
    // connect DB
    (0, DB_1.connectdb)();
    // auth
    app.use("/auth", module_1.authRouter);
    // user
    app.use("/user", module_1.userRouter);
    // message
    // comments
    // posts
    app.use("/{*dummy}", (req, res, next) => {
        return res.status(404).json({
            message: "invalid router",
            success: false
        });
    });
    // global error handler
    // MUST Error then req, res, next
    app.use((error, req, res, next) => {
        return res.status(error.statusCode).json({
            message: error.message,
            success: false,
            errDetails: error.errorDetails
        });
    });
}
