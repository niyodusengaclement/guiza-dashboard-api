import joi from "joi";
import { onError, onServerError } from "../utils/response";

class Validations {
  menu(req, res, next) {
    try {
      const validateSchema = joi.object({
        state_type: joi.string().required().valid("menuchoice", "input"),
        state_title: joi.string().required(),
        state_indicator: joi.string().required().valid("FC", "FB"),
        input_type: joi
          .string()
          .required()
          .valid("numeric", "alphanumeric", "alphabetic"),
        input_field_name: joi.string().required(),
        text_en: joi.string().required(),
        text_fr: joi.string().required(),
        text_kin: joi.string().required(),
        fxn_call_flag: joi.number().required(),
        call_fxn_name: joi.string().required(),
        api_call_flag: joi.string().required(),
        api_endpoint: joi.string().required(),
        request_method: joi.string().required().valid("GET", "POST"),
        request_params: joi.string().required(),
        code: joi.number().required(),
        fxn_type: joi
          .string()
          .required()
          .valid("api_triggering", "non_referencing", "referencing"),
        default_resp_code: joi.number().required(),
        referenced_fields: joi.string().required(),
        status: joi.string().required().valid("failed", "successful"),
      });
      const { error } = validateSchema.validate(req.body);
      if (error)
        return onError(res, 400, error.details[0].message.split('"').join(""));
      return next();
    } catch (err) {
      return onServerError(res);
    }
  }

  child(req, res, next) {
    try {
      const validateSchema = joi.object({
        state_type: joi.string().required().valid("menuchoice", "input"),
        state_title: joi.string().required(),
        ussd_name: joi.string().required(),
        state_indicator: joi.string().required().valid("FC", "FB"),
        input_type: joi
          .string()
          .required()
          .valid("numeric", "alphanumeric", "alphabetic"),
        input_field_name: joi.string().required(),
        text_en: joi.string().required(),
        text_fr: joi.string().required(),
        text_kin: joi.string().required(),
        fxn_call_flag: joi.number().required(),
        call_fxn_name: joi.string().required(),
        api_call_flag: joi.string().required(),
        api_endpoint: joi.string().required(),
        request_method: joi.string().required().valid("GET", "POST"),
        request_params: joi.string().required(),
        code: joi.number().required(),
        fxn_type: joi
          .string()
          .required()
          .valid("api_triggering", "non_referencing", "referencing"),
        default_resp_code: joi.number().required(),
        referenced_fields: joi.string().required(),
        status: joi.string().required().valid("failed", "successful"),

        ussd_state: joi.string().required(),
        ussd_choice: joi.string().required(),
        choiceStatus: joi.string().required().valid("Active", "Inactive"),
      });
      const { error } = validateSchema.validate(req.body);
      if (error)
        return onError(res, 400, error.details[0].message.split('"').join(""));
      return next();
    } catch (err) {
      return onServerError(res);
    }
  }
  choice(req, res, next) {
    try {
      const validateSchema = joi.object({
        ussd_state: joi.string().required(),
        ussd_choice: joi.string().required(),
        ussd_name: joi.string().required(),
        ussd_new_state: joi.string().required(),
        status: joi.string().required().valid("Active", "Inactive"),
        lastupdated: joi.date().required(),
      });
      const { error } = validateSchema.validate(req.body);
      if (error)
        return onError(res, 400, error.details[0].message.split('"').join(""));
      return next();
    } catch (err) {
      return onServerError(res);
    }
  }

  drop(req, res, next) {
    try {
      const validateSchema = joi.object({
        state_id: joi.number().required(),
        child_state_id: joi.number().required(),
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
