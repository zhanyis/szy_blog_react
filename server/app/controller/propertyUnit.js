// app/controller/Comments.js
const Controller = require('egg').Controller;

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class PropertyUnitController extends Controller {

  constructor(ctx) {
    super(ctx);
    this.ServerResponse = ctx.response.ServerResponse;
  }

  async index() {
    const ctx = this.ctx;
    const query = {
      limit: toInt(ctx.query.limit),
      offset: toInt(ctx.query.offset),
    };
    // console.log(ctx.model.PropertyUnits)
    const data = await ctx.model.PropertyUnit.findAll(query);
    ctx.body = this.ServerResponse.createBySuccessMsgAndData('获取所有单位成功', data);
  }

  async show() {
    const ctx = this.ctx;
    const data = await ctx.model.PropertyUnit.findByPk(toInt(ctx.params.id));
    ctx.body = this.ServerResponse.createBySuccessMsgAndData(`获取单位id:${toInt(ctx.params.id)}成功`, data);
  }

  async create() {
    const ctx = this.ctx;
    const {
      property_name,
      property_location,
      watch_time,
      floor,
      unit,
      towards,
      video_link,
      review_score,
      feet,
      price,
      ages,
      outerLink,
      backupString1,
      backupString2,
      remarks,
    } = ctx.request.body;
    if (!property_name) {
      ctx.body = this.ServerResponse.createByErrorMsg('请输入楼盘名称');
      return;
    }
    if (!watch_time) {
      ctx.body = this.ServerResponse.createByErrorMsg('请输入看房时间');
      return;
    }
    const data = await ctx.model.PropertyUnit.create({
      property_name,
      property_location,
      watch_time,
      floor,
      unit,
      towards,
      video_link,
      review_score,
      feet,
      price,
      ages,
      outerLink,
      backupString1,
      backupString2,
      remarks,
    });
    ctx.body = this.ServerResponse.createBySuccessMsgAndData('新增楼盘成功', data);
  }

  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const data = await ctx.model.PropertyUnit.findByPk(id);
    if (!data) {
      ctx.body = this.ServerResponse.createByErrorMsg(`没有找到该楼盘单位, id: ${id}`);
      return;
    }

    const {
      property_name,
      property_location,
      watch_time,
      floor,
      unit,
      towards,
      video_link,
      review_score,
      feet,
      price,
      ages,
      outerLink,
      backupString1,
      backupString2,
      remarks,
    } = ctx.request.body;
    await data.update({
      property_name,
      property_location,
      watch_time,
      floor,
      unit,
      towards,
      video_link,
      review_score,
      feet,
      price,
      ages,
      outerLink,
      backupString1,
      backupString2,
      remarks,
    });
    ctx.body = this.ServerResponse.createBySuccessMsgAndData('单位信息更新成功', data);
  }

  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const data = await ctx.model.PropertyUnit.findByPk(id);
    if (!data) {
      ctx.body = this.ServerResponse.createByErrorMsg(`没有找到该楼盘单位, id: ${id}`);
      return;
    }

    await data.destroy();
    ctx.body = this.ServerResponse.createBySuccessMsgAndData('删除成功', data);
  }
}

module.exports = PropertyUnitController;
