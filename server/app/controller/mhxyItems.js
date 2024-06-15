// app/controller/Diaries.js
const Controller = require('egg').Controller;

const { Op } = require('sequelize');

const dayjs = require('dayjs');

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class MhxyItemsController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.ServerResponse = ctx.response.ServerResponse;
  }

  async index() {
    const ctx = this.ctx;
    const res = await ctx.service.user.checkUserAuth();
    if (res.status === 401) {
      ctx.body = this.ServerResponse.createByErrorMsg('获取物品失败');
      return ctx.body;
    }
    const query = ctx.query;
    if (query.item_name) {
      query.item_name = { [Op.substring]: query.item_name };
    }
    const data = await ctx.model.MhxyItems.findAll({
      where: query,
      order: [[ 'updated_at', 'DESC' ]],
    });
    ctx.body = this.ServerResponse.createBySuccessMsgAndData('获取物品成功', data);
  }

  async show() {
    const ctx = this.ctx;
    const data = await ctx.model.MhxyItems.findByPk(toInt(ctx.params.id));
    ctx.body = this.ServerResponse.createBySuccessMsgAndData(`获取物品id:${toInt(ctx.params.id)}成功`, data);
  }

  async bulkCreate() {
    const ctx = this.ctx;
    const res = await ctx.service.user.checkUserAuth();
    if (res.status === 401) {
      ctx.body = this.ServerResponse.createByErrorMsg('获取物品失败');
      return ctx.body;
    }
    const bulk = ctx.request.body;
    const data = await ctx.model.MhxyItems.bulkCreate(bulk);
    ctx.body = this.ServerResponse.createBySuccessMsgAndData('批量新增物品成功', data);
  }

  async create() {
    const ctx = this.ctx;
    const res = await ctx.service.user.checkUserAuth();
    if (res.status === 401) {
      ctx.body = this.ServerResponse.createByErrorMsg('获取物品失败');
      return ctx.body;
    }
    const {
      item_name,
      type_id,
      price,
      price_from,
    } = ctx.request.body;
    if (!price) {
      ctx.body = this.ServerResponse.createByErrorMsg('请输入price');
      return ctx.body;
    }
    if (!item_name) {
      ctx.body = this.ServerResponse.createByErrorMsg('请输入item_name');
      return ctx.body;
    }
    if (!type_id) {
      ctx.body = this.ServerResponse.createByErrorMsg('请输入type');
      return ctx.body;
    }
    const data = await ctx.model.MhxyItems.create({
      item_name,
      type_id,
      price,
      price_from,
    });
    ctx.body = this.ServerResponse.createBySuccessMsgAndData('新增物品成功', data);
  }

  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const data = await ctx.model.MhxyItems.findByPk(id);
    const {
      item_name,
      type_id,
      price,
      price_from,
    } = ctx.request.body;
    if (!price) {
      ctx.body = this.ServerResponse.createByErrorMsg('请输入price');
      return ctx.body;
    }
    if (!item_name) {
      ctx.body = this.ServerResponse.createByErrorMsg('请输入item_name');
      return ctx.body;
    }
    await data.update({
      item_name,
      type_id,
      price,
      price_from,
    });
    ctx.body = this.ServerResponse.createBySuccessMsgAndData('物品更新成功', data);
  }

  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const data = await ctx.model.MhxyItems.findByPk(id);
    if (!data) {
      ctx.body = this.ServerResponse.createByErrorMsg(`没有找到该物品, id: ${id}`);
      return;
    }

    await data.destroy();
    ctx.body = this.ServerResponse.createBySuccessMsgAndData('删除成功', data);
  }
}

module.exports = MhxyItemsController;
