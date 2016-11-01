import express from 'express';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';

import config from './webpack.config.development';

const app = express();
const compiler = webpack(config);
const PORT = 3000;

app.use(webpackDevMiddleware(compiler, {
  publicPath: config.output.publicPath,
  watchOptions: {
    poll: true
  },
  stats: {
    colors: true
  }
}));

app.use(webpackHotMiddleware(compiler));

app.get('/', (req, res) => res.sendFile(`${__dirname}/index.html`));

const server = app.listen(PORT, 'localhost', (err) => {
  if (err) {
    console.error(err);
    return;
  }

  console.log(`Listening at http://localhost:${PORT}`);
});


process.on('SIGTERM', () => {
  console.log('Stopping dev server');
  webpackDevMiddleware.close();
  server.close(() => {
    process.exit(0);
  });
});
