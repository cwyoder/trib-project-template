const express = require('express');
const path = require('path');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const context = require('./context');

const app = express();

app.use(morgan('dev')); //logging middleware
app.use('/', express.static(path.join(__dirname, '..', 'public'))); //static path

nunjucks.configure('views', {
  autoescape: true,
  express: app
})

app.get('/', async (req, res, next) => {
  res.render('index.njk', context);
})

//404 handler
app.use((req, res, next) => {
  const error = Error(`Page not found: ${req.url}`);
  error.status = 404;
  next(error);
})

//500 handler
app.use((err, req, res, next) => {
  console.log(err, err.stack);
  res.status(err.status || 500).send(`
  <html>
    <body>
      <h1>${err}</h1>
      <p>${err.stack}</p>
    </body>
  </html>`)
})

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`

Now listening on port ${port}
http://localhost:${port}/

`));
