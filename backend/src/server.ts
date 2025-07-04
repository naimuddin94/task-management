/*
 * Title: Task Management
 * Description: A Backend Application for Task Management on Express
 * Author: Md Naim Uddin
 * Github: naimuddin94
 * Date: 04/07/2025
 *
 */
import { Server } from "http";
import mongoose from "mongoose";
import app from "./app";
import config from "./app/config";
import seedingAdmin from "./app/utils/seeding";
import { Logger } from "./app/utils";

let server: Server;

process.on("uncaughtException", (error) => {
  console.error("Uncaught Exception:", error);
  Logger.error("Uncaught Exception:", error);
  process.exit(1);
});

process.on("unhandledRejection", (error) => {
  console.error("Unhandled Rejection:", error);
  if (server) {
    server.close((error) => {
      console.error("Server closed due to unhandled rejection");
      Logger.error("Server closed due to unhandled rejection", error);
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

async function bootstrap() {
  try {
    await mongoose.connect(config.db_url as string);
    console.log("🛢 Database connected successfully");
    await seedingAdmin();
    server = app.listen(config.port, () => {
      console.log(`🚀 Application is running on port ${config.port}`);
    });
  } catch (err: any) {
    Logger.error("Failed to connect to database:", err);
    process.exit(1);
  }
}

bootstrap();

process.on("SIGTERM", () => {
  console.log("SIGTERM received");
  if (server) {
    server.close((error) => {
      Logger.error("Server closed due to SIGTERM", error);
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});

process.on("SIGINT", () => {
  console.log("SIGINT received");
  if (server) {
    server.close((error) => {
      console.log("Server closed due to SIGINT");
      Logger.error("Server closed due to SIGINT", error);
      process.exit(0);
    });
  } else {
    process.exit(0);
  }
});
