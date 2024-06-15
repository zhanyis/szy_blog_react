module.exports = () => {
  return async function errorHandler(ctx, next) {
    try {
      await next();
    } catch (err) {
      const { app } = ctx;
      app.emit('error', err, ctx);
      const status = err.status || 500;
      const error = status === 500 && app.config.env === 'prod' ? 'Internal Server Error' + err.message : err.message;
      ctx.body = { error };
      ctx.status = status;
    }
  };
};
