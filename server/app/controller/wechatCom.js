const Controller = require('egg').Controller;
class WechatComController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.ServerResponse = ctx.response.ServerResponse;
  }

  async sendMessage() {
    const { ctx } = this;
    await ctx.service.wechatCom.sendMessage({ content: '测试信息' });
  }

  async sendMessagePost() {
    const { ctx } = this;
    const { content, agent_id, touser } = ctx.request.body;

    if (!content) {
      ctx.body = this.ServerResponse.createByErrorMsg('请输入content参数');
      return;
    }
    await ctx.service.wechatCom.sendMessage({ content, agent_id, touser });
  }
}

module.exports = WechatComController;
