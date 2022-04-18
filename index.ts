import * as express from 'express';
import "express-async-errors";
import {handleError} from "./utils/error";
import { childRouter, giftRouter  } from "./routers";

import * as cors from "cors";
import "./utils/db";

const app = express();
const port: number = 3001;

app.use(express.json());
app.use(cors({
  origin: "http://localhost:3000",
}))

app.use("/child", childRouter);
app.use("/gift", giftRouter);

app.use(handleError);

app.listen(port, "localhost", () => {
  console.log(`Listening on http://localhost:${port}`);
});
