const request = require('request')
const ElasticSearchClient = require('elasticsearchclient');
const _ = require('lodash')
const redis = require('../lib/redis')

const mysqlConfig = require('../../config/mysql')
const dbConnection = require('../lib/dbconnection')
const elkModel = require('../models/elk')
const elk = require('../lib/elk')
const serverOptions = require('../../config/server')

const client = new ElasticSearchClient(serverOptions)

exports.insertIndex = async (ctx) => {
  const connection = await dbConnection()
  try {
    const result = await elkModel.selectDepartmentInfo(connection)
    const commands = []
    _.forEach(result, v => {
      commands.push({ "index" : { "_index" :'College', "_type" : `Department`}})
      commands.push({
        'dept_id': v.dept_id,
        'dept_name': v.dept_name,
      })
    })
    await elk.insertElk(client, commands)
  } catch (e) {
    console.log(e)
  } finally {
    connection.release()
  }
}

exports.selectIndex = async (ctx) => {
  const qryObj = {
    '_source': ['dept_name', 'dept_id'],
    'query': {
      'multi_match': {
        'query': "경제",
        'fields':  [ 'dept_name'],
        'fuzziness': 'AUTO'
      }
    }
  }
  try {
    await elk.searchElk(client, 'index', 'type', qryObj)
  } catch (e) {
    console.log(e)
  }
}