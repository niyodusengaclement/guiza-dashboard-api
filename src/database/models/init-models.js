var DataTypes = require("sequelize").DataTypes;
var _sm_access_rights = require("./sm_access_rights");
var _sm_access_token = require("./sm_access_token");
var _sm_user_accounts = require("./sm_user_accounts");
var _sm_user_levels = require("./sm_user_levels");
var _vnd_api_responses = require("./vnd_api_responses");
var _vnd_data_mapper = require("./vnd_data_mapper");
var _vnd_log_current_state = require("./vnd_log_current_state");
var _vnd_log_session_activity = require("./vnd_log_session_activity");
var _vnd_log_session_data = require("./vnd_log_session_data");
var _vnd_log_session_input_values = require("./vnd_log_session_input_values");
var _Vnd_ussd_choice = require("./vnd_ussd_choices");
var _vnd_ussd_states = require("./vnd_ussd_states");
var _vnd_ussd_states_text = require("./vnd_ussd_states_text");

function initModels(sequelize) {
  var sm_access_rights = _sm_access_rights(sequelize, DataTypes);
  var sm_access_token = _sm_access_token(sequelize, DataTypes);
  var sm_user_accounts = _sm_user_accounts(sequelize, DataTypes);
  var sm_user_levels = _sm_user_levels(sequelize, DataTypes);
  var vnd_api_responses = _vnd_api_responses(sequelize, DataTypes);
  var vnd_data_mapper = _vnd_data_mapper(sequelize, DataTypes);
  var vnd_log_current_state = _vnd_log_current_state(sequelize, DataTypes);
  var vnd_log_session_activity = _vnd_log_session_activity(sequelize, DataTypes);
  var vnd_log_session_data = _vnd_log_session_data(sequelize, DataTypes);
  var vnd_log_session_input_values = _vnd_log_session_input_values(sequelize, DataTypes);
  var Vnd_ussd_choice = _Vnd_ussd_choice(sequelize, DataTypes);
  var vnd_ussd_states = _vnd_ussd_states(sequelize, DataTypes);
  var vnd_ussd_states_text = _vnd_ussd_states_text(sequelize, DataTypes);


  return {
    sm_access_rights,
    sm_access_token,
    sm_user_accounts,
    sm_user_levels,
    vnd_api_responses,
    vnd_data_mapper,
    vnd_log_current_state,
    vnd_log_session_activity,
    vnd_log_session_data,
    vnd_log_session_input_values,
    Vnd_ussd_choice,
    vnd_ussd_states,
    vnd_ussd_states_text,
  };
}
module.exports = initModels;
module.exports.initModels = initModels;
module.exports.default = initModels;
