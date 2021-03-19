import express from "express";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";
import cookieParser from "cookie-parser";
import routes from "./routes";
import env from "dotenv";
import morgan from "morgan";
import fileupload from "express-fileupload";

const app = express();
env.config();

app.use(helmet());
app.use(compression());
app.use(cors());
app.use(morgan("combined"));
app.use(cookieParser());
app.use(express.urlencoded({ limit: "50mb", extended: true,  parameterLimit:50000 }));
app.use(express.json({ limit: "50mb" }));
app.use(
  fileupload({
    createParentPath: true,
    useTempFiles: true,
  })
);

app.get("/", (req, res) => {
  res.send("Welcome to GWIZA API");
});

app.use("/api", routes);

app.use((req, res, next) => {
  const err = new Error("Endpoint not found");
  err.status = 404;
  next(err);
});

app.use((error, req, res, next) => {
  const status = error.status || 500;
  res.status(status).json({
    status,
    error: error.message,
  });
});

export default app;
