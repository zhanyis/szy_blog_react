// app/controller/Comments.js
const Controller = require('egg').Controller;

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class PropertyCommentController extends Controller {
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
    const data = await ctx.model.PropertyComment.findAll({
      ...query,
      include: {
        model: this.app.model.User,
      },
    });
    ctx.body = this.ServerResponse.createBySuccessMsgAndData('获取所有楼盘评论成功', data);
  }

  async show() {
    const ctx = this.ctx;
    const data = await ctx.model.PropertyComment.findByPk(toInt(ctx.params.id));
    ctx.body = this.ServerResponse.createBySuccessMsgAndData(`获取楼盘评论id:${toInt(ctx.params.id)}成功`, data);
  }

  async create() {
    const ctx = this.ctx;
    const {
      property_id,
      user_id,
      location_score,
      investment_value_score,
      property_facility_score,
      property_indoor_score,
      personal_score,
      remark,
    } = ctx.request.body;
    if (!property_id) {
      ctx.body = this.ServerResponse.createByErrorMsg('请输入楼盘id');
      return;
    }
    if (!user_id) {
      ctx.body = this.ServerResponse.createByErrorMsg('请先登录');
      return;
    }
    if (
      location_score === undefined ||
      investment_value_score === undefined ||
      property_facility_score === undefined ||
      property_indoor_score === undefined ||
      personal_score === undefined
    ) {
      ctx.body = this.ServerResponse.createByErrorMsg('请填入楼盘分数');
      return;
    }
    const hasComment = await this.ctx.model.PropertyComment.findOne({
      where: { user_id, property_id },
    });
    if (hasComment) {
      ctx.body = this.ServerResponse.createByErrorMsg('你已经评价过该楼盘了');
      return;
    }
    const data = await ctx.model.PropertyComment.create({
      property_id,
      user_id,
      location_score,
      investment_value_score,
      property_facility_score,
      property_indoor_score,
      personal_score,
      remark,
    });
    ctx.body = this.ServerResponse.createBySuccessMsgAndData('新增楼盘评论成功', data);
    await ctx.service.property.updateScoreWhenChangeComment(property_id);
  }

  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const data = await ctx.model.PropertyComment.findByPk(id);
    if (!data) {
      ctx.body = this.ServerResponse.createByErrorMsg(`没有找到该楼盘评论, id: ${id}`);
      return;
    }

    const {
      property_id,
      user_id,
      location_score,
      investment_value_score,
      property_facility_score,
      property_indoor_score,
      personal_score,
      remark,
    } = ctx.request.body;
    if (
      location_score === undefined ||
      investment_value_score === undefined ||
      property_facility_score === undefined ||
      property_indoor_score === undefined ||
      personal_score === undefined
    ) {
      ctx.body = this.ServerResponse.createByErrorMsg('请填入楼盘分数');
      return;
    }
    await data.update({
      property_id,
      user_id,
      location_score,
      investment_value_score,
      property_facility_score,
      property_indoor_score,
      personal_score,
      remark,
    });
    ctx.body = this.ServerResponse.createBySuccessMsgAndData('楼盘评价更新成功', data);
    await ctx.service.property.updateScoreWhenChangeComment(property_id);
  }

  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const data = await ctx.model.PropertyComment.findByPk(id);
    if (!data) {
      ctx.body = this.ServerResponse.createByErrorMsg(`没有找到该楼盘评论, id: ${id}`);
      return;
    }

    await data.destroy();
    ctx.body = this.ServerResponse.createBySuccessMsgAndData('删除成功', data);
    await ctx.service.property.updateScoreWhenChangeComment(data.property_id);
  }
}

module.exports = PropertyCommentController;
