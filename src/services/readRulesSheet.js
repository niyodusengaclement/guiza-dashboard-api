import readXlsxFile from "read-excel-file/node";

export default async (file) => {
  try {
    const reasons = [];
    const savingInfo = [];

    const rows = await readXlsxFile(file, {
      sheet: 2,
    });

    if (rows.length) {
      const info = {
        share_value: rows[2][2],
        max_weekly_shares: rows[3][2],
        socialfund_amount: rows[6][2],

        loan_to_savings_ratio: rows[12][2],
        interest_rate: Number.isInteger(rows[13][2])
          ? rows[13][2]
          : rows[13][2] * 100,
        max_loan_duration: rows[14][2],
      };
      savingInfo.push(info);
      rows.map((row, idx) => {
        if (idx >= 7 && idx <= 9) {
          const socialfund_reason = {
            reason_type: "social fund",
            reason_description: row[1],
            reason_amount:
              row[2] !== null && Number.isInteger(row[2]) ? row[2] : 0,
          };

          reasons.push(socialfund_reason);
        } else if (idx >= 17 && idx <= 19 && idx > 16) {
          const fine_reason = {
            reason_type: "fine",
            reason_description: row[1],
            reason_amount:
              row[2] !== null && Number.isInteger(row[2]) ? row[2] : 0,
          };
          reasons.push(fine_reason);
        }
      });
    }
    return { reasons, savingInfo: savingInfo[0] };
  } catch (error) {
    return { error };
  }
};
