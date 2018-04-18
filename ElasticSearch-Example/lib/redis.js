const redis = require('redis')
const redis_scanner = require('redis-scanner')

const config = require('../config/redis')

let reuse_client

const __getClientScanner = (options) => {
  if (reuse_client) return reuse_client
  reuse_client = redis.createClient(
    options.port,
    options.host,
  )
  redis_scanner.bindScanners(reuse_client);
  return reuse_client
}


const __getClient = (options) => {
  if (reuse_client) return reuse_client
  reuse_client = redis.createClient(
    options.port,
    options.host,
  )
  return reuse_client
}

exports.setRedis = (key, value) => {
  return new Promise((resolve, reject) => {
    const client = __getClient(config.development)
    console.log()
    client.set(key, JSON.stringify(value), (err) => {
      if (err) reject(err)
      client.expire(key, 3600 * 24 * 10)
      resolve(value)
    })
  })
}

exports.getRedis = (key) => {
  return new Promise((resolve, reject) => {
    const client = __getClient(config.development)
    client.get(key, (err, data) => {
      if (err) reject(err)
      client.expire(key, 3600 * 24 * 10)
      if (data) resolve(JSON.parse(data))
      else resolve({})
    })
  })
}

exports.delRedis = (key) => {
  return new Promise((resolve, reject) => {
    const client = __getClient(config.development)
    client.del(key, (err, response) => {
      if (response === 1) {
        resolve(true)
      } else {
        reject(err)
      }
    })
  })
}

exports.scanRedis = () => {
  return new Promise((resolve, reject) => {
    const client = __getClientScanner(config.development)
    var options = {
      args: ['Match','test2'],
      onData: (result) => {
        resolve(result)
      },
      onEnd: (err) => {
        console.log(err)
        resolve(err)
      }
    };
    var scanner = new redis_scanner.Scanner(client, 'SCAN', null, options)
    const cursor = 0
    client.scan()
    resolve([])
  })
}

// const rejson = require('redis-rejson')
// const users = {
//   dongsu: {
//     name: 'dongsu',
//     age: 11,
//     job: 'develop',
//   },
// }
// exports.test = (key, value) => {
//   return new Promise((resolve, reject) => {
//     const client2 = __getClient2(redisConfig)
//     client2.json_set('object', '.', 'foo', (err, result) => {
//       if (err) {
//         console.log(err)
//         resolve([])
//       } else {
//         console.log('success')
//         console.log(result)
//         resolve([])
//       }
//     })
//   })
// }

// exports.test2 = (key, value) => {
//   return new Promise((resolve, reject) => {
//     const client2 = __getClient(redisConfig)
//     client2.get('object', '.', 'dongsu', (err, result) => {
//       if (err) {
//         console.log(err)
//         resolve([])
//       } else {
//         console.log('success')
//         console.log(result)
//         resolve([])
//       }
//     })
//   })
// }
