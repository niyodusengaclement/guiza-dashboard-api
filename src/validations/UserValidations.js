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
      return onServerError(res);
    }
  }

  register(req, res, next) {
    try {
      const validateSchema = joi.object({
        username: joi.string().required().min(4),
        password: joi.string().required().min(6),
        role: joi.string().required().max(4),
        status: joi.string().required().valid("Active", "Suspended", "Closed"),
        full_name: joi.string().required(),
      });
      const { error } = validateSchema.validate(req.body);
      if (error)
        return onError(res, 400, error.details[0].message.split('"').join(""));
      return next();
    } catch (err) {
      return onServerError(res);
    }
  }
}
export default new Validations();
