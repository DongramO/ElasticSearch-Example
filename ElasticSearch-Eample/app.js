// Koa Pacakge
const Koa = require('koa')
const Router = require('koa-router')
const bodyParser = require('koa-bodyparser')
const moduels = require('./modules')

const router = new Router()
const app = new Koa()

// Koa Configure
app.use(bodyParser())
router.use('/elk', moduels.routes())

app.use(router.allowedMethods())
app.use(router.routes())

app.listen(3000, () => {
  console.log(`server port 3000, server is running now`)
})

module.exports = app
