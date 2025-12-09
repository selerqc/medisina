import mongoose from "mongoose";

const auditTrail = new mongoose.Schema({
  user: {
    type: String,
  },
  role: {
    type: String,
  },
  url: {
    type: String,
    required: true
  },
  activity: {
    type: String,
    required: true
  },
  method: {
    type: String,
    required: true
  },
  params: {
    type: String,
    required: true
  },
  query: {
    type: String,
    required: true
  },
  payload: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  },
  ipAddress: {
    type: String
  }
}, {
  timestamps: true
});

const AuditTrailModel = mongoose.model('audit_trails', auditTrail)

export default AuditTrailModel
