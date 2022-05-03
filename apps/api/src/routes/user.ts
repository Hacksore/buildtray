import express from "express";
const router = express.Router();

/**
 * Get the user session data
 */
router.get("/me", async (req: any, res) => {
  res.send(req.session);
});

export default router;
