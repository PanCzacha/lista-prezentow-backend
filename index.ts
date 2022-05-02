import express from 'express';
import "express-async-errors";
import {handleError} from "./utils/error";
import { childRouter, giftRouter  } from "./routers";
import cors from "cors";
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

app.listen(port, "0.0.0.0", () => {
  console.log(`Listening on http://0.0.0.0:${port}`);
});
