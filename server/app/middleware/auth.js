module.exports = () => {
  return async function errorHandler(ctx, next) {
    await ctx.service.user.checkUserAuth();
    await next();
  };
};
