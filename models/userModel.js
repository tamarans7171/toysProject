const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken")
const {config} = require("../config/secret")

const userSchema = new mongoose.Schema({
  fullName: {
    firstName: String,
    lastName: String
  },
  email: String,
  password: String,
  date_created: {
    type: Date, default: Date.now()
  },
  role: {
    type: String, default: "user"
  }
})


exports.UserModel = mongoose.model("users", userSchema);

exports.genToken = (_userId) => {
  let token = jwt.sign({_id:_userId}, config.tokenSecret, {expiresIn:"60mins"})
  return token
}

exports.validateUser = (_reqBody) => {
  let joiSchema = Joi.object({
    fullName: Joi.object().keys({
      firstName: Joi.string().min(2).max(30).required(),
      lastName: Joi.string().min(2).max(30).required().allow('')
  }),
    email: Joi.string().min(5).max(30).required(),
    password: Joi.string().min(5).max(30).required()
  })

  return joiSchema.validate(_reqBody);
}

exports.validateLogin = (_reqBody) => {
  let joiSchema = Joi.object({
    email: Joi.string().min(5).max(30).required(),
    password: Joi.string().min(5).max(30).required()
  })

  return joiSchema.validate(_reqBody);
}

