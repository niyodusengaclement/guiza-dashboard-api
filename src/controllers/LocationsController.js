import { onError, onServerError, onSuccess } from "../utils/response";
import db from "../database/models";

class LocationsController {
  static async findProvinces(req, res) {
    try {
      const locations = await db.sm_geolocation.findAll({
        group: ["province_id"],
        attributes: ["province_name", "province_id"],
      });
      if (!locations) return onError(res, 404, "Location not found");
      return onSuccess(res, 200, "locations Successfully found", locations);
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async findDistricts(req, res) {
    try {
      const { province_id } = req.params;
      const locations = await db.sm_geolocation.findAll({
        where: { province_id },
        group: ["district_id"],
        attributes: ["district_name", "district_id"],
      });
      if (!locations) return onError(res, 404, "Location not found");
      return onSuccess(res, 200, "locations Successfully found", locations);
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async findSectors(req, res) {
    try {
      const { district_id } = req.params;
      const locations = await db.sm_geolocation.findAll({
        where: { district_id },
        group: ["sector_id"],
        attributes: ["sector_id", "sector_name"],
      });
      if (!locations) return onError(res, 404, "Location not found");
      return onSuccess(res, 200, "locations Successfully found", locations);
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async findCells(req, res) {
    try {
      const { sector_id } = req.params;
      const locations = await db.sm_geolocation.findAll({
        where: { sector_id },
        group: ["cell_id"],
        attributes: ["cell_id", "cell_name"],
      });
      if (!locations) return onError(res, 404, "Location not found");
      return onSuccess(res, 200, "locations Successfully found", locations);
    } catch (err) {
      return onServerError(res, err);
    }
  }

  static async findVillages(req, res) {
    try {
      const { cell_id } = req.params;
      const locations = await db.sm_geolocation.findAll({
        where: { cell_id },
        group: ["village_id"],
        attributes: ["village_id", "village_name"],
      });
      if (!locations) return onError(res, 404, "Location not found");
      return onSuccess(res, 200, "locations Successfully found", locations);
    } catch (err) {
      return onServerError(res, err);
    }
  }
}
export default LocationsController;
