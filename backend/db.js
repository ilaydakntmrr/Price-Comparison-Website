const sql = require('mssql/msnodesqlv8');

const config = {
  server: 'DESKTOP-EKS3DIU\\SQLEXPRESS',
  database: 'MagazaDb',
  driver: 'msnodesqlv8',
  options: {
    trustedConnection: true,
  },
};

async function connectToDatabase() {
  try {
    await sql.connect(config);
    console.log('db bağlandı')
  } catch (err) {
    console.log(err);
  }
}

async function closeDatabaseConnection() {
  try {
    await sql.close();
  } catch (err) {
    throw err;
  }
}

async function executeQuery(query, params = []) {
  try {
    const result = await sql.query(query, ...params);
    return result.recordset;
  } catch (err) {
    throw err;
  }
}


module.exports = {
  connectToDatabase,
  closeDatabaseConnection,
  executeQuery,
};
