const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./creds.json');

const doc = new GoogleSpreadsheet('SEU_ID_DA_PLANILHA_AQUI');

async function accessSheet() {
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  return doc;
}

async function getSheetData(sheetName) {
  const doc = await accessSheet();
  const sheet = doc.sheetsByTitle[sheetName];
  const rows = await sheet.getRows();
  return rows.map(r => r._rawData);
}

async function updateSheetData(sheetName, data) {
  const doc = await accessSheet();
  const sheet = doc.sheetsByTitle[sheetName];
  await sheet.addRow(data);
}

module.exports = { getSheetData, updateSheetData };
