// app/controller/Comments.js
const Controller = require('egg').Controller;

function toInt(str) {
  if (typeof str === 'number') return str;
  if (!str) return str;
  return parseInt(str, 10) || 0;
}

class CommentController extends Controller {
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
    const data = await ctx.model.Comment.findAll(query);
    ctx.body = this.ServerResponse.createBySuccessMsgAndData('获取评论成功', data);
  }

  async show() {
    const ctx = this.ctx;
    const data = await ctx.model.Comment.findByPk(toInt(ctx.params.id));
    ctx.body = this.ServerResponse.createBySuccessMsgAndData(`获取评论id:${toInt(ctx.params.id)}成功`, data);
  }

  async create() {
    const ctx = this.ctx;
    const { content, user_id, reply_to_comment_id, article_id } = ctx.request.body;
    if (!content) {
      ctx.body = this.ServerResponse.createByErrorMsg('请输入内容');
      return;
    }
    if (!article_id) {
      ctx.body = this.ServerResponse.createByErrorMsg('请输入文章id');
      return;
    }
    const data = await ctx.model.Comment.create({ content, user_id, reply_to_comment_id, article_id });
    ctx.body = this.ServerResponse.createBySuccessMsgAndData('新增评论成功', data);
  }

  async update() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const data = await ctx.model.Comment.findByPk(id);
    if (!data) {
      ctx.body = this.ServerResponse.createByErrorMsg(`没有找到该评论, id: ${id}`);
      return;
    }

    const { content } = ctx.request.body;
    await data.update({ content });
    ctx.body = this.ServerResponse.createBySuccessMsgAndData('评论更新成功', data);
  }

  async destroy() {
    const ctx = this.ctx;
    const id = toInt(ctx.params.id);
    const data = await ctx.model.Comment.findByPk(id);
    if (!data) {
      ctx.body = this.ServerResponse.createByErrorMsg(`没有找到该评论, id: ${id}`);
      return;
    }

    await data.destroy();
    ctx.body = this.ServerResponse.createBySuccessMsgAndData('删除成功', data);
  }
}

module.exports = CommentController;
