import cors from "cors";
import cookieParser from "cookie-parser";
import express from "express";

const app = express();

app.use(
  cors({
    origin: "https://flowchat-v3.netlify.app",
    credentials: true,
  })
);

app.use(express.json({ limit: "16kb" }));
app.use(express.urlencoded({ extended: true, limit: "16kb" }));
app.use(express.static("public"));
app.use(cookieParser());

import userRouter from "./routes/user.route.js";
import messageRoute from "./routes/message.route.js";

app.use("/api/v1/users", userRouter);
app.use("/api/v1/message", messageRoute);

export { app };
