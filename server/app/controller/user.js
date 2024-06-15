const Controller = require('egg').Controller;

// ...
class UserController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.ServerResponse = ctx.response.ServerResponse;
  }
  // 用户注册
  async register() {
    const { ctx } = this;
    // 判断用户名是否重复
    const users = await ctx.service.user.checkUserName(ctx.request.body);
    if (users[0]) {
      ctx.body = this.ServerResponse.createByErrorMsg('用户名已存在');
      return;
    }
    await ctx.service.user.register(ctx.request.body);
    ctx.body = this.ServerResponse.createBySuccessMsg('注册成功');
  }

  // 用户登陆
  async login() {
    const { ctx } = this;
    // 接收并校验参数
    const data = await ctx.service.user.Login(ctx.request.body);
    if (!data) {
      ctx.body = this.ServerResponse.createByErrorMsg('用户名或密码错误');
      return;
    }
    ctx.set('Authorization', `Bearer ${data.token}`);
    ctx.body = this.ServerResponse.createBySuccessMsgAndData('登陆成功', data);
  }

  async checkLogin() {
    const { ctx } = this;
    const data = await ctx.service.user.checkUserAuth();
    ctx.body = { status: 200, msg: 'token有效', ...data };
  }

  async allUserList() {
    const { ctx } = this;
    const res = await ctx.service.user.allUserList();
    ctx.body = this.ServerResponse.createBySuccessMsgAndData('查询所有用户成功', res);
    return ctx.body;
  }
}

module.exports = UserController;
