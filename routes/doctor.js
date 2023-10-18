import {
  adminAuth,
  authenticate,
  doctorAuth,
  restrict,
} from "../auth/verifyToken.js";
import {
  approveDoctor,
  deleteDoctor,
  getAllDoctor,
  getAllDoctors,
  getDoctorProfile,
  getSingleDoctor,
  updateDoctor,
} from "../controllers/doctorController.js";
import express from "express";
// import { createReview } from "../controllers/reviewController.js";
import reviewRouter from "../routes/review.js";

const router = express.Router();

router.use("/:doctorId/reviews", reviewRouter);

// get all doctors
router.get("/", getAllDoctor);
router.get("/all", getAllDoctors);
router.put("/isApprove/:id", approveDoctor);
router.get("/:id", getSingleDoctor);
router.put("/:id", authenticate, doctorAuth, updateDoctor);
router.delete("/:id",deleteDoctor);
router.get("/profile/me", authenticate, restrict(["doctor"]), getDoctorProfile);

export default router;
