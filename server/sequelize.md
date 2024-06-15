```bash
# 创建一次变更
npx sequelize migration:generate --name=init-users

# 执行变更
npx sequelize db:migrate

# 根据环境执行变更
npx sequelize db:migrate --env=test

# 回滚上一次变更
npx sequelize db:migrate:undo

# 根据环境回滚
NODE_ENV=test npx sequelize db:migrate
```