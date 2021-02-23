import readXlsxFile from "read-excel-file/node";

export default async (file) => {
  const committee = [];
  try {
    const rows = await readXlsxFile(file, {
      sheet: 3,
    });
    if (rows.length) {
      rows.map((row, index) => {
        if (index >= 1 && row[2] !== null && row[2][0] === "0") {
          const phone_number = row[2][0] === "0" ? `25${row[2]}` : row[2];
          committee.push({ phone_number });
        } else if (
          index >= 1 &&
          row[2] !== null &&
          row[2][0] !== "0" &&
          row[3] !== null
        ) {
          const phone_number = row[3][0] === "0" ? `25${row[3]}` : row[3];
          committee.push({ phone_number });
        }
      });
    }
    return { committee };
  } catch (error) {
    return { error };
  }
};
