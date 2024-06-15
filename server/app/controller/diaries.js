// app/controller/Diaries.js
const Controller = require('egg').Controller;

const { Op } = require('sequelize');

const dayjs = require('dayjs');

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class DiariesController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.ServerResponse = ctx.response.ServerResponse;
  }

  async index() {
    const ctx = this.ctx;
    const res = await ctx.service.user.checkUserAuth();
    if (res.status === 401) {
      ctx.body = this.ServerResponse.createByErrorMsg('获取日记失败');
      return ctx.body;
    }
    const user_id = ctx.query.user_id || res.data.user_id;
    const query = {
      user_id,
    };
    const data = await ctx.model.Diaries.findAll({ where: query });
    ctx.body = this.ServerResponse.createBySuccessMsgAndData('获取日记成功', data);
  }

  async show() {
    const ctx = this.ctx;
    const data = await ctx.model.Diaries.findByPk(toInt(ctx.params.id));
    ctx.body = this.ServerResponse.createBySuccessMsgAndData(`获取日记id:${toInt(ctx.params.id)}成功`, data);
  }

  async create() {
    const ctx = this.ctx;
    const res = await ctx.service.user.checkUserAuth();
    if (res.status === 401) {
      ctx.body = this.ServerResponse.createByErrorMsg('获取日记失败');
      return ctx.body;
    }
    const {
      first_content,
      second_content,
      third_content,
      img_1_url,
      img_2_url,
      img_3_url,
      user_name,
      user_id,
      date,
    } = ctx.request.body;
    const data = await ctx.model.Diaries.create({
      first_content,
      second_content,
      third_content,
      img_1_url,
      img_2_url,
      img_3_url: dayjs(date).format('YYYY-MM-DD'),
      user_name,
      user_id,
      date,
    });
    ctx.body = this.ServerResponse.createBySuccessMsgAndData('新增日记成功', data);
  }

  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const data = await ctx.model.Diaries.findByPk(id);
    const {
      first_content,
      second_content,
      third_content,
      img_1_url,
      img_2_url,
      // img_3_url,
      user_name,
      user_id,
      // date,
    } = ctx.request.body;
    await data.update({
      first_content,
      second_content,
      third_content,
      img_1_url,
      img_2_url,
      // img_3_url: dayjs(date).format('YYYY-MM-DD'),
      user_name,
      user_id,
      // date,
    });
    ctx.body = this.ServerResponse.createBySuccessMsgAndData('日记更新成功', data);
  }

  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const data = await ctx.model.Diaries.findByPk(id);
    if (!data) {
      ctx.body = this.ServerResponse.createByErrorMsg(`没有找到该日记, id: ${id}`);
      return;
    }

    await data.destroy();
    ctx.body = this.ServerResponse.createBySuccessMsgAndData('删除成功', data);
  }

  async getDiaryByDate() {
    const ctx = this.ctx;
    const res = await ctx.service.user.checkUserAuth();
    if (res.status === 401) {
      ctx.body = this.ServerResponse.createByErrorMsg('获取日记失败');
      return ctx.body;
    }
    const query_user_id = ctx.query.user_id || res.data.user_id
    const date = dayjs(ctx.query.date).format('YYYY-MM-DD') || dayjs.format('YYYY-MM-DD');
    const data = await ctx.model.Diaries.findAll({
      where: {
        img_3_url: date,
        user_id: query_user_id
      },
    });
    ctx.body = this.ServerResponse.createBySuccessMsgAndData('根据日期获取日记成功', data);
  }

  async getDateDairyWritten() {
    const ctx = this.ctx;
    const res = await ctx.service.user.checkUserAuth();
    if (res.status === 401) {
      ctx.body = this.ServerResponse.createByErrorMsg('获取日记失败');
      return ctx.body;
    }
    const user_id = res.data.user_id;
    const query = {
      user_id,
    };
    const data = await this.ctx.model.Diaries.findAll({ where: query });
    const dateArr = [];
    const yearArr = [];
    for (let i = 0; i < data.length; i++) {
      const year = dayjs(data[i].img_3_url).format('YYYY');
      const date = dayjs(data[i].img_3_url).format('YYYY-MM-DD');
      dateArr.push(date);
      yearArr.push(year);
    }
    const dateSet = Array.from(new Set(dateArr));
    const yearSet = Array.from(new Set(yearArr));
    const temp = {
      dateSet,
      yearSet,
    };
    ctx.body = this.ServerResponse.createBySuccessMsgAndData('根据已经有日记的日期成功成功', temp);
  }
}

module.exports = DiariesController;
