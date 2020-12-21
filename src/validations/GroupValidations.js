import joi from "joi";
import { onError, onServerError } from "../utils/response";

class Validations {
  group(req, res, next) {
    try {
      const validateSchema = joi.object({
        group_name: joi.string().required(),
        day_of_meeting: joi.string().required(),
        time_of_meeting: joi.string().required().max(5),
        share_value: joi.number().required(),
        max_weekly_shares: joi.number().required().min(1),
        socialfund_amount: joi.number().required().min(0),
        loan_to_savings_ratio: joi.number().required().min(0),
        interest_rate: joi.number().required().min(1),
        max_loan_duration: joi.number().required().min(1),
        village_id: joi.string().required(),
        group_status: joi
          .string()
          .optional()
          .valid("new", "active", "closed", "suspended"),
        org_id: joi.number().optional(),
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
