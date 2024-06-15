'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
    const { INTEGER, DATE, STRING } = Sequelize;
    await queryInterface.createTable('users', {
      user_id: {
        type: INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      user_name: { type: STRING(20), allowNull: false },
      user_password: { type: STRING, allowNull: false },
      user_avatar_url: { type: STRING(255) },
      user_auth_type: { type: INTEGER },
      created_at: DATE,
      updated_at: DATE,
    });

    await queryInterface.createTable('article', {
      article_id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      article_title: { type: STRING },
      article_content: { type: STRING },
      user_id: { type: INTEGER },
      created_at: DATE,
      updated_at: DATE,
    });

    await queryInterface.createTable('ranks', {
      id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      game_id: { type: INTEGER, allowNull: false },
      user_id: { type: INTEGER, allowNull: false },
      score: { type: INTEGER },
      created_at: DATE,
      updated_at: DATE,
    });

    await queryInterface.createTable('games', {
      game_id: { type: INTEGER, primaryKey: true, autoIncrement: true },
      game_name: { type: STRING },
      game_title: { type: STRING },
      game_url: { type: STRING },
      created_at: DATE,
      updated_at: DATE,
    });

    await queryInterface.addColumn(
      'comments',
      'reply_to_comment_id',
      Sequelize.INTEGER
    );

    await queryInterface.addColumn('comments', 'article_id', {
      type: Sequelize.INTEGER,
      allowNull: false,
    });

    await queryInterface.bulkUpdate('comments', {
      article_id: 1,
    });
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
    await queryInterface.dropTable('users');
    await queryInterface.dropTable('article');
    await queryInterface.dropTable('ranks');
    await queryInterface.dropTable('games');
    await queryInterface.removeColumn(
      'comments',
      'reply_to_comment_id',
      Sequelize.INTEGER
    );
    await queryInterface.removeColumn(
      'comments',
      'article_id',
      Sequelize.INTEGER
    );
  },
};
