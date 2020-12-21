import joi from "joi";
import { onError, onServerError } from "../utils/response";

const myCustomJoi = joi.extend(require("joi-phone-number"));

class MembersValidations {
  member(req, res, next) {
    try {
      const year = new Date().getFullYear();

      const validateSchema = joi.object({
        group_id: joi.number().required().label("Group ID"),
        first_name: joi.string().required().label("First Name"),
        last_name: joi.string().required().label("Last Name"),
        nid: joi
          .string()
          .required()
          .pattern(/^[0-9]+$/)
          .label("National ID")
          .min(16)
          .max(16)
          .custom((value, helper) => {
            const nidYear = `${value[1]}${value[2]}${value[3]}${value[4]}`;
            if (value[0] !== "1")
              return helper.message("National ID is not valid");
            if (value[1] !== "1" && value[1] !== "2")
              return helper.message("National ID is not valid");
            if (value[1] === "1" && value[2] !== "9")
              return helper.message("National ID is not valid");
            if (value[1] === "2" && +nidYear >= +year - 15)
              return helper.message("National ID is not valid");
            if (value[5] !== "7" && value[5] !== "8")
              return helper.message("National ID is not valid");
            return value;
          }),
        dob: joi.date().required().max("now").label("Date of Birth"),
        phone_number: myCustomJoi
          .string()
          .pattern(/^[0-9]+$/)
          .required()
          .min(12)
          .max(12)
          .phoneNumber({ defaultCountry: "RW", strict: true })
          .label("Phone number"),
        gender: joi.string().required().valid("male", "female"),
        marital_status: joi
          .string()
          .required()
          .valid("married", "single", "divorced", "widowed", "separated")
          .label("Marital status"),
        is_admin: joi.boolean().optional().valid(true, false),
      });
      const { error } = validateSchema.validate(req.body);
      if (error)
        return onError(res, 400, error.details[0].message.split('"').join(""));
      return next();
    } catch (err) {
      return onServerError(res, err);
    }
  }
  fileColumns() {
    const schema = {
      Firstname: {
        prop: "first_name",
        type: String,
        required: true,
      },
      Lastname: {
        prop: "last_name",
        type: String,
        required: true,
      },
      NID: {
        prop: "nid",
        type: Number,
        required: true,
      },
      DOB: {
        prop: "dob",
        type: Date,
        required: true,
      },
      Gender: {
        prop: "gender",
        type: String,
        required: true,
        oneOf: ["Male", "Female", "MALE", "FEMALE", "male", "female"],
      },
      Phone: {
        prop: "phone_number",
        type: Number,
        required: true,
      },
      "Marital status": {
        prop: "marital_status",
        type: String,
        required: true,
        oneOf: [
          "married",
          "single",
          "divorced",
          "widowed",
          "separated",
          //
          "Married",
          "Single",
          "Divorced",
          "Widowed",
          "Separated",
          //
          "MARRIED",
          "SINGLE",
          "DIVORCED",
          "WIDOWED",
          "SEPARATED",
        ],
      },
    };
    return schema;
  }
}

export default new MembersValidations();
