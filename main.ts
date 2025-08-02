import express from "express";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();

app.use(cors({
  origin: process.env.CORS_ORIGIN || "*",
  methods: process.env.CORS_METHODS?.split(",") || ["GET", "POST"],
  credentials: process.env.CORS_CREDENTIALS === "true"
}));

app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "API Evolution Simplificada rodando!" });
});

const port = Number(process.env.SERVER_PORT) || 8080;
app.listen(port, () => {
  console.log(`Servidor rodando na porta ${port}`);
});