/*
 * Title: Task Management
 * Description: A Backend Application for Task Management on Express
 * Author: Md Naim Uddin
 * Github: naimuddin94
 * Date: 04/07/2025
 *
 */

/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-unused-vars */
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { Application, NextFunction, Request, Response } from "express";
import routes from "./app/routes";
import { globalErrorHandler, notFound } from "./app/utils";

const app: Application = express();

const allowedOrigins = [
  "http://localhost:3000",
  "http://16.16.190.238:3000",
  "http://16.16.190.238",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.options("*", cors());

app.use(cookieParser());

// static files
app.use("/public", express.static("public"));

//parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api", routes);

//Testing
app.get("/", (req: Request, res: Response, next: NextFunction) => {
  res.send({ message: "Express server is running :(" });
});

//global error handler
app.use(globalErrorHandler as unknown as express.ErrorRequestHandler);

//handle not found
app.use(notFound);

export default app;
