const { GoogleSpreadsheet } = require('google-spreadsheet');

// Pega o JSON do service account das variáveis de ambiente
const creds = JSON.parse(process.env.GOOGLE_CREDS);

// Pega o ID da planilha das variáveis de ambiente
const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID);

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
