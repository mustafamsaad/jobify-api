const express = require("express");
const router = express.Router();

const {
  createJob,
  getAllJobs,
  showStats,
  deleteJob,
  updateJob,
} = require("../controllers/jobsController");

router.route("/").post(createJob).get(getAllJobs);
router.route("/stats").get(showStats);
router.route("/:jobId").delete(deleteJob).patch(updateJob);

module.exports = router;
