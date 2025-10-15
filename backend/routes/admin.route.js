import express from "express";
import { admin, login } from "../controllers/admin.controllers.js";

const router = express.Router();

router.post("/seed-admin", admin);

router.post("/login", login);

export default router;
