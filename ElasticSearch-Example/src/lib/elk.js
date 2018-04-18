exports.insertElk = (client, commands, params2) => {
  return new Promise((resolve, reject) => {
    client.bulk(commands)
        .on('data', (data) => {
          resolve(data)
        })
        .on('done', done => {
          resolve(done)
        })
        .on('error', error => {
          reject(error)
        })
        .exec();
  })
}

exports.searchElk = (client, _index, _type, qryObj) => {
  return new Promise((resolve, reject) => {
    client.search(_index, _type, qryObj, (err, data) => {
        if (err) reject(err)
        resolve(data)
      })
  })
}
