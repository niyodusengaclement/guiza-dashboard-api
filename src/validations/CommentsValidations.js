import joi from "joi";
import { onError, onServerError } from "../utils/response";

class CommentsValidations {
  comment(req, res, next) {
    try {
      const validateSchema = joi.object({
        group_id: joi.number().required(),
        user_id: joi.number().required(),
        comment: joi.string().required(),
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

export default new CommentsValidations();
