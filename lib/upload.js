'use strict';

const fs = require('fs');
const path = require('path');
const {v4: uuid} = require('uuid');

const dir = path.join(__dirname, '..', 'static', 'images');
const TYPES =['image/gif', 'image/jpeg', 'image/png', 'image/svg+xml'];

async function upload(ctx, next) {

  ctx.assert(ctx.file.size <= 1000*1000, 400, 'file must be less than 1 MB');
  ctx.assert(TYPES.includes(ctx.file.type), 400, 'filetype not allowed');

  await next();

  ctx.filename = uuid();
  const reader = fs.createReadStream(ctx.file.path);
  const stream = fs.createWriteStream(path.join(dir, ctx.filename));
  reader.pipe(stream);

}

module.exports = upload;
