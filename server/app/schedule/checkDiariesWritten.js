const dayjs = require('dayjs');

module.exports = {
  schedule: {
    cron: '1 0 0 * * *',
    type: 'worker',
  },
  async task(ctx) {
    const user_one_diaries = await ctx.model.Diaries.findAll({
      where: {
        img_3_url: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        user_id: 1,
      },
    });

    const user_two_diaries = await ctx.model.Diaries.findAll({
      where: {
        img_3_url: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        user_id: 2,
      },
    });

    if (user_one_diaries.length === user_two_diaries.length) {
      return;
    }

    const params = {
      amount: 10,
      settle_user_id: '',
      settle_user_name: '',
      is_clearify: 0,
      photo_url: '',
      date: dayjs().format('YYYY-MM-DD HH:mm:ss'),
    };
    const user_one = await ctx.service.user.findIdByUsers({ user_id: [ 1 ] });
    const user_two = await ctx.service.user.findIdByUsers({ user_id: [ 2 ] });
    if (user_one_diaries.length > user_two_diaries.length) {
      params.payee_id = user_one[0].user_id;
      params.payee_name = user_one[0].user_name;
      params.share_with_user_id = user_two[0].user_id;
      params.share_with_user_name = user_two[0].user_name;
      params.comment = user_two[0].user_name + dayjs().subtract(1, 'day').format('YYYY-MM-DD') + '没写日记';
    } else {
      params.payee_id = user_two[0].user_id;
      params.payee_name = user_two[0].user_name;
      params.share_with_user_id = user_one[0].user_id;
      params.share_with_user_name = user_one[0].user_name;
      params.comment = user_one[0].user_name + dayjs().subtract(1, 'day').format('YYYY-MM-DD') + '没写日记';
    }
    const data = await ctx.model.SplitBills.create(params);
    return data;
  },
};
