import express from "express";
// import {} from "../controllers/apiController";
import { uploadSampleDescImg } from "../middlewares";

const apiRouter = express.Router();

apiRouter.post("/create/sample-desc-img", uploadSampleDescImg, (req, res) => {
  res.send(req.file.location);
});

export default apiRouter;
