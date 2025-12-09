import bcrypt from "bcrypt";
import { personnelRoles } from "#utils/constants.js";
import mongoose from "mongoose";
import { generateId } from "#utils/crypto.js";
const UserSchema = new mongoose.Schema(
  {
    userId: { type: String },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: personnelRoles },
    firstName: { type: String, required: true, trim: true },
    middleName: { type: String, trim: true },
    lastName: { type: String, required: true, trim: true },

    schoolId: [{ type: String, trim: true }],
    schoolName: [{ type: String, trim: true }],
    schoolDistrictDivision: [{ type: String, trim: true }],

    status: { type: String, default: "Pending", enum: ["Approved", "Rejected", "Pending"] },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: Date,
    resetPasswordToken: { type: String, index: true },
    resetPasswordExpires: Date,
    lastLoginAt: { type: Date },
    accountCreated: { type: Date },

    failedLoginAttempts: { type: Number, default: 0 },
    accountLockedUntil: { type: Date },
    lastFailedLoginAt: { type: Date },
  

  },
  {
    timestamps: true,
    collection: "users",
  }
);
UserSchema.pre("save", async function (next) {
  if (!this.isNew) return next();

  try {

    this.userId = generateId('USER')
    next();
  } catch (err) {
    next(err);
  }
}


);
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  if (this.password.startsWith("$2b$")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

UserSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.middleName ? this.middleName + " " : ""}${this.lastName}`;
});
UserSchema.statics.isDuplicateEmail = async function (email) {
  const personnel = await this.findOne({ email });
  if (!personnel) return null;
  if (personnel.email === email) return "email";
  return null;
};
UserSchema.methods.toPersonnelJSON = function () {
  return {
    _id: this._id,
    email: this.email,
    fullName: this.fullName,
    firstName: this.firstName,
    role: this.role,
    lastLoginAt: this.lastLoginAt,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};
UserSchema.methods.isPasswordMatch = async function (password) {
  try {
    return await bcrypt.compare(password, this.password);
  } catch (error) {
    throw new Error("Password comparison failed");
  }
};

UserSchema.methods.isAccountLocked = function () {
  return this.accountLockedUntil && this.accountLockedUntil > Date.now();
};

UserSchema.methods.incrementFailedLogins = async function () {
  this.failedLoginAttempts += 1;
  this.lastFailedLoginAt = Date.now();

  if (this.failedLoginAttempts >= 5) {
    this.accountLockedUntil = Date.now() + 15 * 60 * 1000;
  }

  await this.save();
};

UserSchema.methods.resetFailedLogins = async function () {
  this.failedLoginAttempts = 0;
  this.accountLockedUntil = undefined;
  this.lastFailedLoginAt = undefined;
  await this.save();
};
UserSchema.statics.findByRole = function (role) {
  return this.find({ role, isDeleted: false });
};
UserSchema.methods.softDelete = async function () {
  this.isDeleted = true;
  this.deletedAt = new Date();
  await this.save();
  return true;
};

UserSchema.methods.restoreDeleted = async function () {
  this.isDeleted = false;
  this.deletedAt = null;
  await this.save();
  return true;
};

UserSchema.methods.getAssociatedSchools = function () {
  const schools = [];

  if (this.schoolId && this.schoolId.length > 0) {
    schools.push(...this.schoolId);
  } else if (this.schoolDistrictDivision && this.schoolDistrictDivision.length > 0) {
    return 'district';
  }

  return schools;
};

UserSchema.methods.hasSchoolAccess = function (schoolId) {
  const associatedSchools = this.getAssociatedSchools();

  if (associatedSchools === 'district') {
    return true;
  }

  return associatedSchools.includes(schoolId);
};
const UserModel = mongoose.model("User", UserSchema);
export default UserModel;
