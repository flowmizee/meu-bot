const { GoogleSpreadsheet } = require('google-spreadsheet');

const creds = JSON.parse(process.env.GOOGLE_CREDS || '{}'); // Pegando credenciais da variável

const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID);

async function accessSpreadsheet() {
  if (!creds.client_email || !creds.private_key) {
    throw new Error('Credenciais do Google não configuradas corretamente.');
  }
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
}

async function getSheetData(sheetName) {
  await accessSpreadsheet();
  const sheet = doc.sheetsByTitle[sheetName];
  return sheet.getRows();
}

async function updateSheetData(sheetName, data) {
  await accessSpreadsheet();
  const sheet = doc.sheetsByTitle[sheetName];
  await sheet.addRow(data);
}

module.exports = { getSheetData, updateSheetData };
