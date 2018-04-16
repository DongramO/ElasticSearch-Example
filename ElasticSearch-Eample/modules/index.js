const Router = require('koa-router')
const elkCtrl = require('./elk.ctrl.js')

const moduels = new Router()

moduels.get('/example/insert', elkCtrl.insertIndex)
moduels.get('/example/select', elkCtrl.selectIndex)

module.exports = moduels
