const request = require('request')
const ElasticSearchClient = require('elasticsearchclient');
const _ = require('lodash')
const fs = require('fs')
const util = require('util');
const redis = require('../lib/redis')

const mysqlConfig = require('../config/mysql')
const dbConnection = require('../lib/dbconnection')
const elkModel = require('../models/elk')

var serverOptions = {
  hosts:[
      {
          host: 'localhost',
          port: 9200
      }]
}
exports.insertIndex = async (ctx) => {
  console.log('insertIndex Access')
  let { query } = ctx.request
  let result
  
  const elasticSearchClient = new ElasticSearchClient(serverOptions)
  const connection = await dbConnection()

  result = await elkModel.selectDepartmentInfo(connection)
  result = await redis.scanRedis();

  const commands = []
  _.forEach(result, v => {
    commands.push({ "index" : { "_index" :'mocam', "_type" : `${query.type}`} })
    commands.push({
      'dept_id': v.dept_id,
      'dept_name': v.dept_name,
    })
  })
  
  result = await new Promise((resolve, reject) => { 
    elasticSearchClient.bulk(commands, {})
      .on('data', (data) => {
        resolve(data)
      })
      .on('done', done => {
        resolve(done)
      })
      .on('error', error => {
        resolve(error)
      })
      .exec();
  })
  ctx.body = result
}

exports.selectIndex = async (ctx) => {
  console.log('GetIndex Access')
  const elasticSearchClient = new ElasticSearchClient(serverOptions)
  const { query } = ctx.request 

  const qryObj = {
    "_source": ["dept_name"],
    "query": {
      "multi_match": {
        "query": "경제",
        "fields":  [ "dept_name"],
        "fuzziness": "AUTO"
      }
    }
  }

  result = await new Promise((resolve, reject) => {
    elasticSearchClient.search('mocam', query.type, qryObj, function(err, data){
      resolve(data)
    })   
  })

  ctx.body = JSON.parse(result)
}

exports.testFunc = async (ctx) => {
  const { url } = ctx
  let result
  const connection = await dbConnection()
  result = await elkModel.selectDepartmentInfo(connection)
  result = { 'dept_info' : result }
  result = await redis.setRedis(url, result)
  ctx.body = {
    code: 200,
    status: 'success',
    message: 'department list',
    result,
  }
}
