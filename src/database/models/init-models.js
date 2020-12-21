var DataTypes = require("sequelize").DataTypes;
var _group_members = require("./group_members");
var _group_meta = require("./group_meta");
var _group_reasons = require("./group_reasons");
var _mvd_organizations = require("./mvd_organizations");
var _sm_access_rights = require("./sm_access_rights");
var _sm_geolocation = require("./sm_geolocation");
var _sm_user_levels = require("./sm_user_levels");
var _user_accounts = require("./user_accounts");

function initModels(sequelize) {
  var group_members = _group_members(sequelize, DataTypes);
  var group_meta = _group_meta(sequelize, DataTypes);
  var group_reasons = _group_reasons(sequelize, DataTypes);
  var mvd_organizations = _mvd_organizations(sequelize, DataTypes);
  var sm_access_rights = _sm_access_rights(sequelize, DataTypes);
  var sm_geolocation = _sm_geolocation(sequelize, DataTypes);
  var sm_user_levels = _sm_user_levels(sequelize, DataTypes);
  var user_accounts = _user_accounts(sequelize, DataTypes);


  return {
    group_members,
    group_meta,
    group_reasons,
    mvd_organizations,
    sm_access_rights,
    sm_geolocation,
    sm_user_levels,
    user_accounts,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
