import { auth } from "#middleware/auth.js";

import AuditTrailModel from "./audit-trail.model.js";
import asyncHandler from "express-async-handler";
import express from "express";
const router = express.Router();

router
  .route("/")
  .get(auth('Admin'), asyncHandler(async (req, res) => {

    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 50;
    const [auditTrails, totalCount] = await Promise.all([
      AuditTrailModel.find({})
        .sort({ createdAt: 1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      AuditTrailModel.countDocuments({})
    ]);
    return res.status(200).json({
      auditTrails,
      totalCount
    });

  }))
  .delete(auth('Admin'), asyncHandler(async (req, res) => {
    const auditTrails = await AuditTrailModel.deleteMany({});
    return res.status(200).send("All audit trail records deleted");
  }))

export default router
