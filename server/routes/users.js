import express from "express";
import { getUser } from ".../controllers/users.js";

import { verifyToken } from ".../middleware/auth.js";
import { register } from "../controllers/auth";

const router = express.Router();

router.get("/:id", verifyToken, getUser);

router.post("/createUser", verifyToken, register);
