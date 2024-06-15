// app/controller/Diaries.js
const Controller = require('egg').Controller;

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class MhxyItemTypesController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.ServerResponse = ctx.response.ServerResponse;
  }

  async index() {
    const ctx = this.ctx;
    const res = await ctx.service.user.checkUserAuth();
    if (res.status === 401) {
      ctx.body = this.ServerResponse.createByErrorMsg('获取物品分类失败');
      return ctx.body;
    }
    const data = await ctx.model.MhxyItemTypes.findAll();
    ctx.body = this.ServerResponse.createBySuccessMsgAndData('获取物品分类成功', data);
  }

  async create() {
    const ctx = this.ctx;
    const res = await ctx.service.user.checkUserAuth();
    if (res.status === 401) {
      ctx.body = this.ServerResponse.createByErrorMsg('获取物品分类失败');
      return ctx.body;
    }
    const {
      type_name,
    } = ctx.request.body;
    if (!type_name) {
      ctx.body = this.ServerResponse.createByErrorMsg('请输入type_name');
      return ctx.body;
    }
    const isExist = await ctx.model.MhxyItemTypes.findAll({
      where: {
        type_name,
      },
    });
    if (isExist.length) {
      ctx.body = this.ServerResponse.createByErrorMsg('该物品分类已存在');
      return ctx.body;
    }
    const data = await ctx.model.MhxyItemTypes.create({
      type_name,
    });
    ctx.body = this.ServerResponse.createBySuccessMsgAndData('新增物品分类成功', data);
  }

  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const data = await ctx.model.MhxyItemTypes.findByPk(id);
    if (!data) {
      ctx.body = this.ServerResponse.createByErrorMsg(`没有找到该物品分类, id: ${id}`);
      return;
    }

    await data.destroy();
    ctx.body = this.ServerResponse.createBySuccessMsgAndData('删除成功', data);
  }
}

module.exports = MhxyItemTypesController;
