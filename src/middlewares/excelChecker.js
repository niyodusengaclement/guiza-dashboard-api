import { onError, onServerError } from "../utils/response";

export default (req, res, next) => {
  try {
    const fileName =
      req.baseUrl === "/api/groups"
        ? "group_file"
        : req.baseUrl === "/api/members"
        ? "members_file"
        : "members";

    if (!req.files || !req.files) return onError(res, 400, "No file selected");
    const arr = req.files[fileName].name.split(".");
    const lastIndex = arr.length - 1;
    const extension = arr[lastIndex];
    if (extension !== "xlsx" && extension !== "xlsm")
      return onError(
        res,
        400,
        "File should be an excel with [xlsx or xlsm] extension"
      );
    next();
  } catch (err) {
    return onServerError(res, err);
  }
};
