import joi from "joi";
import { onError, onServerError } from "../utils/response";

class Validations {
  email(req, res, next) {
    try {
      const validateSchema = joi.object({
        email: joi.string().email().required(),
      });
      const { error } = validateSchema.validate(req.body);
      if (error)
        return onError(res, 400, error.details[0].message.split('"').join(""));
      return next();
    } catch (err) {
      return onServerError(res, err);
    }
  }

  register(req, res, next) {
    try {
      const validateSchema = joi.object({
        username: joi.string().required().min(4),
        password: joi.string().required().min(6),
        name: joi.string().required(),
        access_level: joi.string().required(),
        org_id: joi.number().required(),
      });
      const { error } = validateSchema.validate(req.body);
      if (error)
        return onError(res, 400, error.details[0].message.split('"').join(""));
      return next();
    } catch (err) {
      return onServerError(res, err);
    }
  }
  admin(req, res, next) {
    try {
      const validateSchema = joi.object({
        group_id: joi.number().required(),
        phone_number: joi.string().required(),
      });
      const { error } = validateSchema.validate(req.body);
      if (error)
        return onError(res, 400, error.details[0].message.split('"').join(""));
      return next();
    } catch (err) {
      return onServerError(res, err);
    }
  }
}
export default new Validations();
