const { GoogleSpreadsheet } = require("google-spreadsheet");

// Pega o JSON do service account das variáveis de ambiente
const creds = JSON.parse(
  process.env.GOOGLE_CREDS.replace(/\n/g, "\\n") // Corrige quebras de linha na chave privada
);

// Pega o ID da planilha das variáveis de ambiente
const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID);

async function accessSheet() {
  try {
    await doc.useServiceAccountAuth(creds);
    await doc.loadInfo();
    return doc.sheetsByIndex[0]; // seleciona a primeira aba
  } catch (err) {
    console.error("Erro ao acessar planilha:", err);
    throw err;
  }
}

async function getSheetData() {
  try {
    const sheet = await accessSheet();
    const rows = await sheet.getRows();
    return rows.map((row) => row._rawData); // Retorna os dados brutos (array de arrays)
    // Ou, se preferir em formato objeto:
    // return rows.map((row) => row.toObject());
  } catch (err) {
    console.error("Erro ao ler dados da planilha:", err);
    return [];
  }
}

async function addSheetData(data) {
  try {
    const sheet = await accessSheet();
    await sheet.addRow(data);
    console.log("✅ Linha adicionada com sucesso!");
  } catch (err) {
    console.error("Erro ao adicionar dados na planilha:", err);
  }
}

module.exports = { getSheetData, addSheetData };
