import express from "express";
import morgan from "morgan";
import { PORT } from "./secrets.js";
import connectDB from "./config/mongodb.js";
import rootRouter from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(morgan("dev"));
connectDB();

app.get("/", (req, res) => {
  res.send("Hello World");
});

app.use("/api", rootRouter);


app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
