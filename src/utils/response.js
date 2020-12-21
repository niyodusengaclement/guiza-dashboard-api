// import logger from "./logger";

export const onSuccess = (res, status_code, message, data) => {
  return res.status(status_code).json({
    status: status_code,
    message,
    data,
  });
};

export const onError = (res, status_code, error) => {
  return res.status(status_code).json({
    status: status_code,
    error,
  });
};

export const onServerError = (res, error) => {
//   if (error) {
//     const { message, name, fileName } = error;
//     logger.error({
//       name,
//       message: `[${fileName}] ${message}`,
//       fileName,
//     });
//   }
  const err =
    error && error.fileName
      ? {
          status: 400,
          msg: "Uploaded file doesn't meet specifications",
        }
      : { status: 500, msg: "Internal Server Error" };

  return res.status(err.status).json({
    status: err.status,
    error: err.msg,
  });
};
