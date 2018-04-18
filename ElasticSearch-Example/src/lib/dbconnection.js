let mysql = require('mysql')
const mysqlConfig = require('../../config/mysql')

let cluster = ''
const __getPool = () => {
  if (!cluster) {
    cluster = mysql.createPool(mysqlConfig)
    return cluster
  }
  return cluster
}

module.exports = function DBConnection() {
  return new Promise((resolve, reject) => {
    const pool = __getPool()
    pool.getConnection((err, conn) => {
      if (err) {
        reject(err)
      } else {
        resolve(conn)
      }
    })
  })
}
