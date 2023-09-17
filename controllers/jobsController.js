const mongoose = require("mongoose");

const moment = require("moment");

const Job = require("../models/Job");
const { BadRequestError, NotFoundError } = require("../errors");
const { StatusCodes } = require("http-status-codes");
const checkPermissions = require("../utils/check-permissions");

exports.createJob = async (req, res, next) => {
  const { position, company, jobLocation } = req.body;

  if (!position || !company) {
    throw new BadRequestError("Please provide all fields");
  }

  req.body.createdBy = req.user.userId;

  const job = await Job.create(req.body);

  res.status(StatusCodes.CREATED).json({ job });
};

exports.getAllJobs = async (req, res, next) => {
  const { sort, status, jobType, search } = req.query;

  const queryParameters = {
    createdBy: req.user.userId,
  };

  if (status && status !== "all") {
    queryParameters.status = status;
  }
  if (jobType && jobType !== "all") {
    queryParameters.jobType = jobType;
  }
  if (search) {
    queryParameters.position = { $regex: search, $options: "i" };
  }

  let result = Job.find(queryParameters);

  if (sort === "latest") {
    result = result.sort("-createdAt");
  }
  if (sort === "oldest") {
    result = result.sort("createdAt");
  }
  if (sort === "a-z") {
    result = result.sort("position");
  }
  if (sort === "z-a") {
    result = result.sort("-position");
  }

  const page = Number(req.query.page) || 1;
  const limit = 10;
  const skip = (page - 1) * limit;

  const totalJobs = await Job.countDocuments(queryParameters);
  const numOfPages = Math.ceil(totalJobs / limit);

  result = result.skip(skip).limit(limit);

  console.log({
    totalJobs,
    numOfPages,
  });

  const jobs = await result;
  res.status(StatusCodes.OK).json({ jobs, totalJobs, numOfPages });
};

exports.updateJob = async (req, res, next) => {
  const jobId = req.params.jobId;

  const { position, company } = req.body;

  if (!position || !company) {
    throw new BadRequestError("Please provide all values");
  }

  const job = await Job.findById(jobId);

  if (!job) {
    throw new NotFoundError(`No job found with id ${jobId}`);
  }

  checkPermissions(req.user, job.createdBy);

  const updatedJob = await Job.findOneAndUpdate({ _id: jobId }, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(StatusCodes.OK).json({ updatedJob });
};

exports.deleteJob = async (req, res, next) => {
  const jobId = req.params.jobId;

  const job = await Job.findById(jobId);

  if (!job) {
    throw new NotFoundError(`No job found with id ${job}`);
  }

  checkPermissions(req.user, job.createdBy);

  await job.deleteOne();

  res.status(StatusCodes.OK).json({ msg: "Job deleted successfully" });
};

exports.showStats = async (req, res, next) => {
  let stats = await Job.aggregate([
    { $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) } },
    { $group: { _id: `$status`, count: { $sum: 1 } } },
  ]);

  stats = stats.reduce((acc, cur) => {
    const { _id: title, count } = cur;

    acc[title] = count;

    return acc;
  }, {});

  const defaultStats = {
    "Pending": stats["Pending"] || 0,
    "Interview": stats["Interview"] || 0,
    "Declined": stats["Declined"] || 0,
  };

  let monthlyApplications = await Job.aggregate([
    {
      $match: { createdBy: new mongoose.Types.ObjectId(req.user.userId) },
    },
    {
      $group: {
        _id: {
          year: {
            $year: `$createdAt`,
          },
          month: {
            $month: `$createdAt`,
          },
        },
        count: { $sum: 1 },
      },
    },
    { $sort: { "_id.year": -1, "_id.month": -1 } },
    { $limit: 6 },
  ]);

  monthlyApplications = monthlyApplications.map((item) => {
    const {
      _id: { year, month },
      count,
    } = item;

    const date = moment()
      .month(month - 1)
      .year(year)
      .format("MMM Y");
    return { date, count };
  });

  res.status(StatusCodes.OK).json({ defaultStats, monthlyApplications });
};
