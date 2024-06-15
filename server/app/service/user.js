const bcrypt = require('bcryptjs');
const { Op } = require('sequelize');

const Service = require('egg').Service;
class UserService extends Service {
  // 检查用户名
  async checkUserName(query) {
    const { user_name } = query;
    const users = await this.ctx.model.User.findAll({
      attributes: [ 'user_name' ],
      where: { user_name },
    });
    return users;
  }

  // 用户注册
  async register(body) {
    const { user_name, user_password } = body;
    // 对密码加密
    const hash = bcrypt.hashSync(user_password, this.config.bcrypt.saltRounds);
    const user = await this.ctx.model.User.create({
      user_name,
      user_password: hash,
      user_auth_type: 0,
    });
    return user;
  }

  // 用户登陆
  async Login(body) {
    const { user_name, user_password } = body;
    const user = await this.ctx.model.User.findOne({
      where: { user_name },
    });
    if (!user) return false;

    const match = await bcrypt.compare(user_password, user.user_password);
    if (match) {
      const { id, user_name, user_id, user_auth_type } = user;
      // 获取jwt配置
      const {
        jwt: { secret, expiresIn },
      } = this.app.config;
      // 生成token
      const token = this.app.jwt.sign(
        {
          id,
          user_name,
          user_id,
          user_auth_type,
        },
        secret,
        { expiresIn }
      );
      return { user_name, user_id, token, user_auth_type };
    }
  }

  async checkUserAuth() {
    const {
      jwt: { secret },
    } = this.app.config;
    const token = this.ctx.get('Authorization');
    if (!token) return { msg: 'Token 校验失败', status: 401 };
    const jwtToken = token.split(' ')[1];
    if (!jwtToken) return { msg: 'Token 校验失败', status: 401 };
    try {
      const data = await this.app.jwt.verify(jwtToken, secret);
      return {
        data: {
          ...data,
          token: jwtToken,
        },
      };
    } catch (err) {
      return { msg: 'Token 校验失败', status: 401 };
    }
  }

  async findIdByUsers(body) {
    const { user_id } = body;
    const data = await this.ctx.model.User.findAll({
      where: {
        user_id: {
          [Op.in]: user_id,
        },
      },
    });
    return data;
  }

  async allUserList() {
    const { ctx } = this;
    const res = await ctx.service.user.checkUserAuth();
    if (res.status === 401) {
      ctx.body = this.ServerResponse.createByErrorMsg('查找用户失败');
      return ctx.body;
    }
    const data = await ctx.model.User.findAll({
      attributes: [ 'user_name', 'user_id' ],
      where: {
        user_auth_type: {
          [Op.lte]: 1,
        },
      },
    });
    return data;
  }
}

module.exports = UserService;
