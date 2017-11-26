'use strict';

const path = require('path');

const Koa = require('koa');
const serve = require('koa-static');
const Router = require('koa-router');

const config = require('./config');

const app = new Koa();
const router = new Router();

router.use('/student', require('./routes/student').routes());
router.use('/pairing', require('./routes/pairing').routes());

app.use(serve(path.join(__dirname, 'static')));
app.use(router.routes());
app.use(router.allowedMethods());

app.listen(config.get('port'));
