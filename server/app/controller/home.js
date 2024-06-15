'use strict';

const Controller = require('egg').Controller;
const crypto = require('crypto')

class HomeController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.ServerResponse = ctx.response.ServerResponse;
  }

  async index() {
    const { ctx } = this;
    ctx.body = this.ServerResponse.createBySuccessMsg('hi egg');
  }

  async wx() {
    const { ctx } = this;
    let {signature = '', timestamp = '', nonce = '', echostr = ''} = ctx.query
    let token = ''

    const sha1method = (s) => crypto.createHash('sha1').update(s).digest('hex')

    // 验证token
    let str = [token, timestamp, nonce].sort().join('')
    let sha1 = sha1method(str)
    if (sha1 !== signature) {
      ctx.body = 'token验证失败'
      return
    } else {
      ctx.body = echostr
    }
  }
}

module.exports = HomeController;
