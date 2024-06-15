'use strict';
const fs = require('fs');
const path = require('path');
const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const Controller = require('egg').Controller;

// app/controller/upload.js
class UploadController extends Controller {
  constructor(ctx) {
    super(ctx);
    this.ServerResponse = ctx.response.ServerResponse;
  }

  async upload() {
    const { ctx } = this;
    try {
      // 遍历处理多个文件
      for (const file of ctx.request.files) {
        // // 读取文件
        const fileRead = fs.readFileSync(file.filepath);
        // files[0]表示获取第一个文件，若前端上传多个文件则可以遍历这个数组对象
        // 将文件存到指定位置
        const _path = path.join(__dirname, '../../uploadFile/' + file.filename);
        fs.writeFileSync(_path, fileRead);
      }
      ctx.body = this.ServerResponse.createBySuccessMsg('上传成功');
    } catch (err) {
      ctx.throw(500, err);
    } finally {
      // 需要删除临时文件
      await ctx.cleanupRequestFiles();
    }
  }

  async uploadVideo() {
    const { ctx } = this;
    try {
      // 遍历处理多个文件
      let name;
      for (const file of ctx.request.files) {
        // console.log('field: ' + file.fieldname);
        // console.log('filename: ' + file.filename);
        // console.log('encoding: ' + file.encoding);
        // console.log('mime: ' + file.mime);
        // console.log('tmp filepath: ' + file.filepath);
        // // 读取文件
        console.log(file);
        const fileRead = fs.readFileSync(file.filepath);
        // files[0]表示获取第一个文件，若前端上传多个文件则可以遍历这个数组对象
        // 将文件存到指定位置
        const _path = path.join(__dirname, '../../video/' + file.filename);
        fs.writeFileSync(_path, fileRead);
        name = 'formatter' + file.filename.split('.')[0] + new Date().valueOf() + '.mp4';
        this.changeToMp4(_path, name);
      }
      ctx.body = this.ServerResponse.createBySuccessMsgAndData('上传成功', name);
    } catch (err) {
      ctx.throw(500, err);
    } finally {
      // 需要删除临时文件
      await ctx.cleanupRequestFiles();
    }
  }

  async changeToMp4(_path, name) {
    const to_path = path.join(__dirname, '../../video/' + name);
    this.ctx.logger.error('转换任务开始~123');
    ffmpeg(_path) // 可以是线上数据源哦，
      .outputOptions([])
      .size('640x?')
      .videoBitrate('800')
      .fps(30)
      .on('error', err => {
        console.log('Cannot process video: ' + err.message);
      })
      .on('start', str => {
        console.log('转换任务开始~', str);
        // this.ctx.logger.error('转换任务开始~');
      })
      .on('progress', progress => {
        console.log('进行中，完成' + progress.percent + '%');
        // this.ctx.logger.error(`进行中，完成${progress.percent}%`);
      })
      .on('end', () => {
        console.log('转换任务完成!');
        // this.ctx.logger.error('完成');
      })
      .save(to_path);
  }

  async postTest() {
    const { ctx } = this;
    ctx.body = this.ServerResponse.createBySuccessMsg('post成功');
  }

  async getVideo() {
    const { ctx } = this;
    const req = ctx.request;
    try {
      this.ctx.logger.error(`${JSON.stringify(req.header)}`);
      const filePath = path.join(__dirname, '../../video/' + req.query.filePath);
      const range = req.headers.range;
      const fileSize = fs.statSync(filePath).size;
      if (range) {

        const chunkSize = 10 ** 6; // 1 mb
        const start = Number(range.replace(/\D/g, ''));
        const end = Math.min(start + chunkSize, fileSize - 1);
        const contentLength = end - start + 1;

        if (start >= fileSize) {
          ctx.status = 416;
          ctx.body =
            'Requested range not satisfiable\n' + start + ' >= ' + fileSize;
          return;
        }

        ctx.status = 206;
        const header = {
          'Accept-Ranges': 'bytes',
          'Content-Type': 'video/mp4',
          // 'Content-Length': chunksize,
          'Content-Length': contentLength,
          'Content-Range': `bytes ${start}-${end}/${fileSize}`,
          'cache-control': 'public,max-age=31536000',
        };
        ctx.set(header);
        // console.log('send', header['Content-Range']);

        ctx.body = fs
          .createReadStream(filePath, {
            start,
            end,
          })
          .on('error', err => {
            // console.log(`[Video Play]: ${req.url}, 'pip stream error`);
            ctx.throw(500, err);
          });
      } else {
        this.ctx.set('Content-Length', fileSize);
        this.ctx.set('Content-Type', 'video/mp4');
        this.ctx.set('Accept-Ranges', 'bytes');

        this.ctx.status = 200;
        this.ctx.body = fs.createReadStream(filePath);
      }
    } catch (err) {
      // console.log('error:', err);
      ctx.throw(500, err);
    }
  }

  async uploadBills() {
    const { ctx } = this;
    const res = await ctx.service.user.checkUserAuth();
    if (res.status === 401) {
      ctx.body = this.ServerResponse.createByErrorMsg('上传失败');
      return ctx.body;
    }
    try {
      // 遍历处理多个文件
      const file = ctx.request.files[0] || ctx.request.files;
      // 读取文件
      const fileRead = fs.readFileSync(file.filepath);
      // files[0]表示获取第一个文件，若前端上传多个文件则可以遍历这个数组对象
      const temp = new Date().valueOf() + res.data.user_id + file.filename
      // 将文件存到指定位置
      const _path = path.join(__dirname, '../public/bill' + temp);
      fs.writeFileSync(_path, fileRead);
      ctx.body = this.ServerResponse.createBySuccessMsgAndData('上传成功', '/bill' + temp);
    } catch (err) {
      ctx.throw(500, err);
    } finally {
      // 需要删除临时文件
      await ctx.cleanupRequestFiles();
    }
  }
}


module.exports = UploadController;
