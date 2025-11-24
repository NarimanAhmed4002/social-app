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
    // posts
    app.use("/post", module_1.postRouter);
    // comments
    app.use("/comment", module_1.commentRouter);
    app.use("/{*dummy}", (req, res, next) => {
        return res.status(404).json({
            message: "invalid router",
            success: false,
        });
    });
    // global error handler
    // MUST Error then req, res, next
    app.use((error, req, res, next) => {
        return res.status(error.statusCode || 500).json({
            message: error.message,
            success: false,
            errDetails: error.errorDetails,
            stack: error.stack
        });
    });
}
// Sets up the Express app with middleware, routes, DB connection, and error handling.
// Central place to configure app components.
// Initializes routes for different modules (auth, user, etc.).
// Connects to the database when the app starts.
// Also includes a global error handler to catch and format errors consistently.
// Typically called from the main server file (e.g., server.ts).
// This acts like a global or root controller, possibly handling:
//     1-App health check routes (e.g., /api/health)
//     2-Global request logging.
//     3-Root-level API grouping.
