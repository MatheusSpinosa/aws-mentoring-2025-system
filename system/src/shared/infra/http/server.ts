/* eslint-disable @typescript-eslint/no-unused-vars */
import "reflect-metadata";

import "express-async-errors";

import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import { createServer } from "http";

import { SocketService } from "../socket";
import { mySQLConnection } from "../typeorm";
import { ensureErrorHandler } from "./middlewares/ensureErrorHandler";
import { ensureQueryRunner } from "./middlewares/ensureQueryRunner";
import { router } from "./routes";

dotenv.config();

mySQLConnection
  .initialize()
  .then(async () => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });

const app = express();

const options: cors.CorsOptions = {
  preflightContinue: false,
  allowedHeaders: [
    "Origin",
    "Content-Type",
    "Accept",
    "Authorization",
    "authorization",
  ],
  optionsSuccessStatus: 200,
  methods: "GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE",
  origin: "*",
};

app.use(ensureQueryRunner);

app.use(cors(options));

app.use(
  bodyParser.urlencoded({
    limit: "100mb",
    parameterLimit: 10000000,
    extended: true,
  }),
);
app.use(bodyParser.json({ limit: "100mb" }));

app.use(express.static("public"));

app.use(router);

app.use(ensureErrorHandler);

const httpServer = createServer(app);

httpServer.listen(3333, () => {
  console.log("🚀 Server is running!  ", process.pid);
  SocketService.connection(httpServer);
});

process.on("uncaughtException", (err, origin) => {
  console.log(`\n${origin} error received: ${err}`);
});

process.on("unhandledRejection", (err) => {
  console.log(`\n$unhandledRejection promise rejection received: ${err}`);
});
