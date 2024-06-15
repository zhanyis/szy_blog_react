// app/controller/Diaries.js
const Controller = require('egg').Controller;

const { Op } = require('sequelize');

const dayjs = require('dayjs');

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class SplitBillsController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.ServerResponse = ctx.response.ServerResponse;
  }

  async index() {
    const ctx = this.ctx;
    const res = await ctx.service.user.checkUserAuth();
    if (res.status === 401) {
      ctx.body = this.ServerResponse.createByErrorMsg('获取账单记录失败');
      return ctx.body;
    }
    const data = await ctx.model.SplitBills.findAll();
    ctx.body = this.ServerResponse.createBySuccessMsgAndData('获取账单记录成功', data);
  }

  async show() {
    const ctx = this.ctx;
    const data = await ctx.model.SplitBills.findByPk(toInt(ctx.params.id));
    ctx.body = this.ServerResponse.createBySuccessMsgAndData(`获取账单id:${toInt(ctx.params.id)}成功`, data);
  }

  async create() {
    const ctx = this.ctx;
    const res = await ctx.service.user.checkUserAuth();
    if (res.status === 401) {
      ctx.body = this.ServerResponse.createByErrorMsg('获取账单失败');
      return ctx.body;
    }
    const {
      amount,
      share_with_user_id,
      photo_url,
      comment,
    } = ctx.request.body;
    if (!amount) {
      ctx.body = this.ServerResponse.createByErrorMsg('请输入amount');
      return ctx.body;
    }
    if (!share_with_user_id) {
      ctx.body = this.ServerResponse.createByErrorMsg('请输入要split账单的用户');
      return ctx.body;
    }
    const userListProp = share_with_user_id.split(',').map(Number);
    const users = await ctx.service.user.findIdByUsers({ user_id: userListProp });
    const share_with_user_name = users.map(item => item.user_name).join(',');
    const data = await ctx.model.SplitBills.create({
      payee_id: res.data.user_id,
      payee_name: res.data.user_name,
      amount,
      share_with_user_id,
      share_with_user_name,
      comment,
      settle_user_id: '',
      settle_user_name: '',
      is_clearify: 0,
      photo_url,
      date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    });
    ctx.body = this.ServerResponse.createBySuccessMsgAndData('新增账单记录成功', data);
  }

  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const data = await ctx.model.SplitBills.findByPk(id);
    const {
      amount,
      share_with_user_id,
      share_with_user_name,
      photo_url,
    } = ctx.request.body;
    await data.update({
      amount,
      share_with_user_id,
      share_with_user_name,
      photo_url,
    });
    ctx.body = this.ServerResponse.createBySuccessMsgAndData('日记更新成功', data);
  }

  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const data = await ctx.model.SplitBills.findByPk(id);
    if (!data) {
      ctx.body = this.ServerResponse.createByErrorMsg(`没有找到该账单记录, id: ${id}`);
      return;
    }

    await data.destroy();
    ctx.body = this.ServerResponse.createBySuccessMsgAndData('删除成功', data);
  }

  async getAllListRelated() {
    const ctx = this.ctx;
    const res = await ctx.service.user.checkUserAuth();
    if (res.status === 401) {
      ctx.body = this.ServerResponse.createByErrorMsg('获取账单记录失败');
      return ctx.body;
    }
    const data = await ctx.model.SplitBills.findAll();
    const resData = data.filter((d) => {
      const splitBillsIds = d.share_with_user_id || '';
      // console.log(splitBillsIds, splitBillsIds.split(',').map(Number).includes(res.data.user_id), res.data.user_id);
      return splitBillsIds.split(',').map(Number).includes(res.data.user_id) || d.payee_id === res.data.user_id;
    });
    ctx.body = this.ServerResponse.createBySuccessMsgAndData('获取相关表单成功', resData);
    return ctx.body;
  }
}

module.exports = SplitBillsController;
