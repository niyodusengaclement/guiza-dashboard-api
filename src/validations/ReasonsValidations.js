import joi from "joi";
import { onError, onServerError } from "../utils/response";

class ReasonsValidations {
  reason(req, res, next) {
    try {
      const validateSchema = joi.object({
        group_id: joi.number().required(),
        reason_type: joi.string().valid("fine", "social fund").required(),
        reason_description: joi.string().required(),
        reason_amount: joi.number().required().min(0),
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

export default new ReasonsValidations();
