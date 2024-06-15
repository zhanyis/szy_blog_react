const Service = require('egg').Service;
const axios = require('axios');

class WechatComService extends Service {
  constructor(ctx) {
    super(ctx);
    this.ServerResponse = ctx.response.ServerResponse;
  }

  async getAccessToken() {
    const { ctx } = this;
    const corp_id = '';
    const secret = '';
    const { data } = await axios.get(
      `https://qyapi.weixin.qq.com/cgi-bin/gettoken?corpid=${corp_id}&corpsecret=${secret}`
    );
    const { access_token } = data;
    if (access_token) {
      ctx.body = this.ServerResponse.createBySuccessMsgAndData(
        '获取token成功',
        access_token
      );
      return access_token;
    }
    ctx.body = this.ServerResponse.createByErrorMsg('获取token失败');
  }

  async sendMessage({ content, agent_id = '1000002', touser = '@all' }) {
    const { ctx } = this;

    const access_token = await this.getAccessToken();

    const { data } = await axios.post(
      `https://qyapi.weixin.qq.com/cgi-bin/message/send?access_token=${access_token}`,
      {
        touser,
        agentid: agent_id,
        msgtype: 'text',
        text: {
          content,
        },
      }
    );

    console.log(data);

    if (data.errcode) {
      ctx.body = this.ServerResponse.createByErrorMsg('发送消息失败 ' + data.errmsg);
    } else {
      ctx.body = this.ServerResponse.createBySuccessMsg('发送消息成功');
    }
  }
}

module.exports = WechatComService;
