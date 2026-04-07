// import mysql from 'mysql2/promise';
// const db = mysql.createPool({
//   host: process.env.DB_HOST,
//   user: process.env.DB_USER,
//   password:process.env.DB_PASSWORD,
//   database: process.env.DB_NAME,
//   waitForConnections: true,
//   connectionLimit: 500,
//   maxIdle: 10, 
//   idleTimeout: 60000, 
//   queueLimit: 0,
//   enableKeepAlive: true,
//   keepAliveInitialDelay: 0,
// });
// export default db;


import mysql from 'mysql2/promise';
const db = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password:'race@123',
  database: 'race_innovations',
  waitForConnections: true,
  connectionLimit: 500,
  maxIdle: 10, 
  idleTimeout: 60000, 
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});
export default db;
