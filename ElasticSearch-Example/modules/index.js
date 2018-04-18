const Router = require('koa-router')
const elkCtrl = require('./elk.ctrl.js')
const redisCheck = require('./middleware/redisCheck')

const moduels = new Router()

moduels.get('/example/insert', elkCtrl.insertIndex)
moduels.get('/example/select', elkCtrl.selectIndex)
moduels.get('/redis', redisCheck, elkCtrl.testFunc)

module.exports = moduels
