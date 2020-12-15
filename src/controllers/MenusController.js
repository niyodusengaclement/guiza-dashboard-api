import { onError, onServerError, onSuccess } from "../utils/response";
import db from "../database/models";
import { Op } from "sequelize";
import iterator from "../utils/iterator";

class MenusController {
  static async findAll(req, res) {
    try {
      const menus = await db.vnd_ussd_states.findAndCountAll({
        order: ["state_id"],
        include: [
          {
            model: db.vnd_ussd_choices,
            as: "choices",
          },
        ],
      });
      if (menus.rows.length < 1) return onError(res, 404, "menus not found");
      return onSuccess(res, 200, "Menus Successfully found", menus);
    } catch (err) {
      return onServerError(res);
    }
  }

  static async create(req, res) {
    try {
      const menu = await db.vnd_ussd_states.create(req.body);
      if (!menu) return onServerError(res);
      return onSuccess(res, 201, "Created Successfully", menu);
    } catch (err) {
      return onServerError(res);
    }
  }

  static async createChild(req, res) {
    try {
      const {
        ussd_state,
        ussd_choice,
        ussd_name,
        choiceStatus,
        state_type,
        state_title,
        state_indicator,
        input_type,
        input_field_name,
        text_en,
        text_fr,
        text_kin,
        fxn_call_flag,
        call_fxn_name,
        api_call_flag,
        api_endpoint,
        request_method,
        request_params,
        code,
        fxn_type,
        default_resp_code,
        referenced_fields,
        status,
      } = req.body;
      const menu = await db.vnd_ussd_states.create({
        state_type,
        state_title,
        state_indicator,
        input_type,
        input_field_name,
        text_en,
        text_fr,
        text_kin,
        fxn_call_flag,
        call_fxn_name,
        api_call_flag,
        api_endpoint,
        request_method,
        request_params,
        code,
        fxn_type,
        default_resp_code,
        referenced_fields,
        status,
      });
      if (!menu) return onServerError(res);
      const choice = await db.vnd_ussd_choices.create({
        ussd_state,
        ussd_choice,
        ussd_name,
        ussd_new_state: menu.state_id,
        status: choiceStatus,
        lastupdated: new Date(),
      });
      if (!choice) return onServerError(res);
      return onSuccess(res, 201, "Created Successfully", menu);
    } catch (err) {
      return onServerError(res);
    }
  }

  static async findOne(req, res) {
    try {
      const { state_id } = req.params;
      const menu = await db.vnd_ussd_states.findOne({
        where: { state_id },
        include: [
          {
            model: db.vnd_ussd_choices,
            as: "choices",
          },
        ],
      });
      if (!menu) return onError(res, 404, "menu not found");
      return onSuccess(res, 200, "Menu Successfully found", menu);
    } catch (err) {
      return onServerError(res);
    }
  }

  static async update(req, res) {
    try {
      const { state_id } = req.params;
      const menu = await db.vnd_ussd_states.findOne({
        where: { state_id },
        include: [
          {
            model: db.vnd_ussd_choices,
            as: "choices",
          },
        ],
      });
      if (!menu) return onError(res, 404, "menu not found");
      menu.update(req.body);
      return onSuccess(res, 200, "Menu updated Successfully", menu);
    } catch (err) {
      return onServerError(res);
    }
  }

  static async delete(req, res) {
    try {
      const { state_id } = req.params;
      const menu = await db.vnd_ussd_states.findOne({
        where: { state_id },
      });
      if (!menu) return onError(res, 404, "menu not found");
      menu.destroy();
      return onSuccess(res, 200, "Menu Successfully deleted");
    } catch (err) {
      return onServerError(res);
    }
  }
}
export default MenusController;
