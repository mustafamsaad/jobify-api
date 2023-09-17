const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const jobSchema = new Schema(
  {
    company: {
      type: String,
      required: [true, "Please provide company"],
      maxLength: 50,
    },
    position: {
      type: String,
      required: [true, "Please provide position"],
      maxLength: 100,
    },
    status: {
      type: String,
      enum: ["Pending", "Declined", "Interview"],
      default: "Pending",
    },
    jobType: {
      type: String,
      enum: ["Full time", "Part time", "Remote", "Internship"],
      default: "Full time",
    },
    jobLocation: {
      type: String,
      default: "My city",
      required: [true, "Please provide location"],
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "Please provide user"],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Job", jobSchema);
