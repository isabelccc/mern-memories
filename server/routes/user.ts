import express from "express";
const router = express.Router();

import { signin, signup, googleSignIn } from "../controllers/user.js";

router.post("/signin", signin);
router.post("/signup", signup);
router.post("/google", googleSignIn);

export default router;