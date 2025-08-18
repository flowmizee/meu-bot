const { GoogleSpreadsheet } = require('google-spreadsheet');
const creds = require('./creds.json'); // credenciais do Google Service Account

const doc = new GoogleSpreadsheet('SUA_PLANILHA_ID_AQUI');

async function accessSheet() {
  await doc.useServiceAccountAuth(creds);
  await doc.loadInfo();
  return doc.sheetsByIndex[0]; // seleciona a primeira aba
}

async function getSheetData() {
  const sheet = await accessSheet();
  const rows = await sheet.getRows();
  return rows.map(r => r._rawData);
}

async function addSheetData(data) {
  const sheet = await accessSheet();
  await sheet.addRow(data);
}

module.exports = { getSheetData, addSheetData };
