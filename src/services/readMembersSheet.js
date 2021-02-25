import moment from "moment";
import readXlsxFile from "read-excel-file/node";

export default async (file) => {
  const uploadedMembers = [];
  const info = [];
  try {
    const rows = await readXlsxFile(file, {
      sheet: 1,
    });

    rows.map((row, index) => {
      if (index >= 5 && row[1] !== null) {
        const m_status = row[7] ? row[7].toLowerCase() : row[7];
        const phone_number =
          row[6] !== null && row[6][0] === "0" ? `25${row[6]}` : row[6];
        const marital_status =
          m_status === "arubatse"
            ? "Married"
            : m_status === "ingaragu"
            ? "Single"
            : m_status;
        const rowFormat = {
          first_name: row[1],
          last_name: row[2],
          nid: row[3],
          dob: moment.isDate(row[4]) ? row[4] : null,
          gender: row[5],
          phone_number,
          marital_status,
        };
        uploadedMembers.push(rowFormat);
      }
    });

    if (rows.length) {
      const g_name = rows[0][0].split(":");
      const time_and_place =
        rows[0][1] !== null ? rows[0][1].split(":") : rows[0][3].split(":");

      const sector_name =
        rows[0][2] !== null ? rows[0][2].split(":") : rows[0][7].split(":");

      const formation_time =
        rows[1] !== null && rows[1][0] !== null ? rows[1][0].split(":") : null;

      const p_name =
        rows[1][1] !== null ? rows[1][1].split(":") : rows[1][3].split(":");

      const cell_name =
        rows[1][1] !== null ? rows[1][2].split(":") : rows[1][7].split(":");

      const frequency = rows[2][0].split(":");
      const district_name =
        rows[2][1] !== null ? rows[2][1].split(":") : rows[2][3].split(":");
      const v_name =
        rows[2][2] !== null ? rows[2][2].split(":") : rows[2][7].split(":");

      const group_Info = {
        group_name: g_name[1],
        meeting_place:
          time_and_place.length > 2
            ? `${time_and_place[1]}:${time_and_place[2]}`
            : time_and_place[1],
        sector: sector_name[1],

        formation_time:
          formation_time !== null ? formation_time[1].trim() : null,
        province: p_name[1],
        cell: cell_name[1],

        meeting_frequency: frequency[1],
        district: district_name[1],
        village: v_name[1],
      };
      info.push(group_Info);
    }
    return { uploadedMembers, groupInfo: info[0] };
  } catch (error) {
    return { error };
  }
};
