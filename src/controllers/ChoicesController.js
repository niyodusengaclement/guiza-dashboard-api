import { onError, onServerError, onSuccess } from "../utils/response";
import db from "../database/models";
import { Op } from "sequelize";

class ChoicesController {
  static async findAll(req, res) {
    try {
      const choices = await db.vnd_ussd_choices.findAll({
        where: { status: "Active", ussd_choice: { [Op.not]: 0 } },
        include: [
          {
            model: db.vnd_ussd_states,
            as: "current_state",
          },
        ],
      });
      if (choices.length < 1) return onError(res, 404, "Choices not found");
      return onSuccess(res, 200, "Choices Successfully found", choices);
    } catch (err) {
      return onServerError(res);
    }
  }

  static async create(req, res) {
    try {
      const choice = await db.vnd_ussd_choices.create(req.body);
      if (!choice) return onServerError(res);
      return onSuccess(res, 201, "Choice Created Successfully", choice);
    } catch (err) {
      return onServerError(res);
    }
  }

  static async findOne(req, res) {
    try {
      const { record_id } = req.params;
      let submenu = await db.vnd_ussd_choices.findOne({
        where: { record_id },
        include: [
          {
            model: db.vnd_ussd_states,
            as: "current_state",
          },
        ],
      });
      const next_state = await db.vnd_ussd_states.findOne({
        where: { state_id: submenu.ussd_new_state },
      });
      const choice = {
        submenu,
        next_state,
      };

      if (!submenu) return onError(res, 404, "Sub menu not found");
      return onSuccess(res, 200, "SubMenu Successfully found", choice);
    } catch (err) {
      return onServerError(res);
    }
  }

  static async update(req, res) {
    try {
      const { record_id } = req.params;
      const submenu = await db.vnd_ussd_choices.findOne({
        where: { record_id },
      });
      if (!submenu) return onError(res, 404, "submenu not found");
      submenu.update(req.body);
      return onSuccess(res, 200, "Submenu updated Successfully", submenu);
    } catch (err) {
      return onServerError(res);
    }
  }

  static async delete(req, res) {
    try {
      const { record_id } = req.params;
      const submenu = await db.vnd_ussd_choices.findOne({
        where: { record_id },
      });
      if (!submenu) return onError(res, 404, "Submenu not found");
      submenu.destroy();
      return onSuccess(res, 200, "Submenu Successfully deleted");
    } catch (err) {
      return onServerError(res);
    }
  }

  static async updateOnDrop(req, res) {
    try {
      const { changes } = req.body;
      const { ussd_new_state } = req.params;
      for (const change of changes) {
        db.vnd_ussd_choices.update(
          {
            ussd_state: ussd_new_state,
            lastupdated: new Date(),
          },
          {
            where: {
              record_id: change.record_id,
            },
          }
        );
      }
      return onSuccess(res, 200, "Updated Successfully");
    } catch (err) {
      console.log(err);
      return onServerError(res);
    }
  }
}
export default ChoicesController;
