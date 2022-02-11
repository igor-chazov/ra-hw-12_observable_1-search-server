const http = require('http');
const path = require('path');
const Koa = require('koa');
const cors = require('koa2-cors');
const koaBody = require('koa-body');
const koaStatic = require('koa-static');
const Router = require('koa-router');

const app = new Koa();

app.use(
  cors({
    origin: '*',
    credentials: true,
    'Access-Control-Allow-Origin': true,
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE'],
  }),
);

app.use(koaBody({
  text: true,
  urlencoded: true,
  multipart: true,
  json: true,
}));

const dirPublic = path.join(__dirname, '/public');
app.use(koaStatic(dirPublic));

let nextId = 1;
const skills = [
  { id: nextId += 1, name: 'React' },
  { id: nextId += 1, name: 'Redux' },
  { id: nextId += 1, name: 'Redux Thunk' },
  { id: nextId += 1, name: 'RxJS' },
  { id: nextId += 1, name: 'Redux Observable' },
  { id: nextId += 1, name: 'Redux Saga' },
];

const router = new Router();
app.use(router.routes()).use(router.allowedMethods());

let isEven = true;
router.get('/api/search', async (ctx) => {
  if (Math.random() > 0.75) {
    ctx.response.status = 500;
    return;
  }

  const { q } = ctx.request.query;

  // eslint-disable-next-line consistent-return
  return new Promise((resolve) => {
    setTimeout(() => {
      const response = skills.filter((o) => o.name.toLowerCase().startsWith(q.toLowerCase()));
      ctx.response.body = response;
      resolve();
    }, isEven ? 1 * 1000 : 5 * 1000);
    isEven = !isEven;
  });
});

const port = process.env.PORT || 7070;
const server = http.createServer(app.callback());

// eslint-disable-next-line no-console
server.listen(port, () => console.log('Server started'));
