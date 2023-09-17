const express = require("express");
const app = express();
const path = require("path");

const cors = require("cors");
const morgan = require("morgan");
const dotenv = require("dotenv");
dotenv.config();

require("express-async-errors");

// db and authentication
const connectDB = require("./db/connect");

// routes
const authRouter = require("./routes/authRoutes");
const jobsRouter = require("./routes/jobsRoutes");

// security
const helmet = require("helmet");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");

// middleware
const isAuth = require("./middleware/is-auth");
const notFoundMiddleware = require("./middleware/not-found");
const errorHandlerMIddleware = require("./middleware/error-handler");

if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}

app.use(cors());
app.use(express.json());
app.use(helmet());
app.use(xss());
app.use(mongoSanitize());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/jobs", isAuth, jobsRouter);

app.use(notFoundMiddleware);
app.use(errorHandlerMIddleware);

const port = process.env.PORT || 5000;

const start = async () => {
  try {
    await connectDB(process.env.MONGODB_URL);
    app.listen(port, () => {
      console.log(`Sever is listening on ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
};

start();
