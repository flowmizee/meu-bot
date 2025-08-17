const { google } = require('googleapis');

const creds = JSON.parse(process.env.GOOGLE_CREDS);

const client = new google.auth.JWT(
  creds.client_email,
  null,
  creds.private_key,
  ['https://www.googleapis.com/auth/spreadsheets']
);

const sheets = google.sheets({ version: 'v4', auth: client });
const SHEET_ID = process.env.SHEET_ID;

// Ler dados
async function getSheetData(range) {
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: SHEET_ID,
    range
  });
  return res.data.values;
}

// Atualizar dados
async function updateSheetData(range, values) {
  await sheets.spreadsheets.values.update({
    spreadsheetId: SHEET_ID,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values }
  });
}

module.exports = { getSheetData, updateSheetData };
