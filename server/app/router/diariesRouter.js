module.exports = app => {
  // 根据日期获取日记
  app.router.get('/getDiaryByDate', app.controller.diaries.getDiaryByDate);
  // 获取写了日记的日期
  app.router.get('/getDateDairyWritten', app.controller.diaries.getDateDairyWritten);
};
