const Service = require('egg').Service;

class PropertyService extends Service {
  // 新增楼盘评论更新评分
  async updateScoreWhenChangeComment(property_id) {
    const allComment = await this.ctx.model.PropertyComment.findAll({
      where: { property_id },
    });

    const len = allComment.length;
    let score = 0;

    allComment.forEach(i => {
      [
        'location_score',
        'investment_value_score',
        'property_facility_score',
        'property_indoor_score',
        'personal_score',
      ].forEach(k => {
        if (i[k]) {
          score += i[k];
        }
      });
    });

    score = score / len;

    const property = await this.ctx.model.Property.findByPk(property_id);
    if (!property) {
      this.ctx.throw(404, 'property not found');
    }

    await property.update({
      review_score: score,
    });
  }

  async deleteAllComment(property_id) {
    await this.ctx.model.PropertyComment.destroy({
      where: { property_id },
    });
  }
}

module.exports = PropertyService;
