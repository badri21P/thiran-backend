import cors from "cors";
import express, { type Request, type Response } from "express";
import router from "./routes";
import { errorHandler } from "./utils/middlewares/errorHandler.middleware";

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/v1", router);
app.use(errorHandler);

const PORT = 3000;
app.listen(PORT, () =>
	console.log(`Server is running on http://localhost:${PORT}`),
);
