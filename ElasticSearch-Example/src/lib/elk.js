exports.insertElk = (client, commands) => {
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
    elasticSearchClient.index(indexName, typeName, document, id, options)
    .on('data', function(data) {
        console.log(data)
    })
    .exec()

     // 1. Canonical Search
     elasticSearchClient.search('my_index_name', 'my_type_name', qryObj, function(err, data){
      console.log(JSON.parse(data))
    })

    // 2. Search call as a reusable object with a canonical callback
    mySearchCall = client.search('my_index_name', 'my_type_name', qryObj);

    //Do it once 
    mySearchCall.exec(function(err, data){
        console.log(JSON.parse(data))
    })
    //Do it twice 
    mySearchCall.exec(function(err, data){
        console.log(JSON.parse(data))
    })
  
    client.search(_index, _type, qryObj, (err, data) => {
        if (err) reject(err)
        resolve(data)
      })
  })
}
