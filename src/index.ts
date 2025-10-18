import { log } from "console";
import express from "express"; // @types
import {bootstrap} from "./app.controller";
import{config} from "dotenv";
config();
const app = express();
const port = 3000;
bootstrap(app, express)
app.listen(port, ()=>{
    log(`App is running on port ${port}`);
});

//  Route → Controller → Service → Repository → Model → Database
//            ↓          ⬆    ↓
//         Middleware    ⬆   Utils
//            ↓          ⬆    ↓
//         DTO / Validation  Hash / Email / OTP helpers