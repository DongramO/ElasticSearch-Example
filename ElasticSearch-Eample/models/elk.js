exports.selectDepartmentInfo = (connection) => {
  return new Promise((resolve, reject) => {
    const Query = `
      SELECT
          dept_id, dept_name
      FROM
          MC_DEPARTMENT_PARENT
    `
    connection.query(Query, (err, result) => {
      if (err) reject(err)
      else resolve(result)
    })
  })
}