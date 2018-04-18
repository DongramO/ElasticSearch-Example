const redis = require('../../lib/redis')

// 토큰 여부를 검사하는 미들웨어
module.exports = async (ctx, next) => {
  const { url } = ctx
  let result
  try {
    result = await redis.getRedis(url)
    if(result) {
      console.log('')
      ctx.body = {
        code: 200,
        status: 'success',
        message: 'Redis Generate',
        result,
      }
    }
  } catch (e) {
    console.log(e)
    return next()
  }
}