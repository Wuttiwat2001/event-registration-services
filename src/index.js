import express from "express";
import morgan from "morgan";
import cors from "cors";
import { PORT } from "./secrets.js";
import connectDB from "./config/mongodb.js";
import rootRouter from "./routes/index.js";
import errorMiddleware from "./middlewares/error.middleware.js";


const app = express();

app.use(cors());
app.use(express.json());
app.use(morgan("dev"));

connectDB();

app.use("/api", rootRouter);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
