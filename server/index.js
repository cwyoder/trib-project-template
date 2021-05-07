const express = require('express');
const path = require('path');
const morgan = require('morgan');
const nunjucks = require('nunjucks');
const context = require('./context');
const fs = require('fs');
const {google} = require('googleapis');
const {authorize, getNewToken} = require('./sheet');
const {spreadsheetKey} = require('../project-config');

const app = express();

app.use(morgan('dev')); //logging middleware
app.use('/', express.static(path.join(__dirname, '..', 'public'))); //static path

//configure nunjucks
const _templates = process.env.NODE_PATH ? process.env.NODE_PATH + '/templates' : 'templates';
nunjucks.configure(_templates, {
  autoescape: true,
  express: app
})

//set nunjucks as rendering engine for template pages with .html suffix
app.engine('html', nunjucks.render);
app.set('view engine', 'html')

//respond to get requests by rendering relevant template page using Nunjucks
app.get('/:page', async (req, res, next) => {

  // Auth
  fs.readFile(path.resolve(__dirname, '../../../.tarbell/client_secrets.json'), (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), scrapeSheet);
  });

  //scrape sheets and res.render with results
  function scrapeSheet(auth) {
    const sheets = google.sheets({version: 'v4', auth});
    sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetKey,
      range: 'values',
    }, (err, response) => {
      if (err) return console.log('The API returned an error: ' + err);
      const rows = response.data.values;
      //add values to obj
      const obj = {};
      if (rows.length) {
        if (rows[0][0] === 'key') {
          rows.slice(1).forEach(row => {
            obj[row[0]] = row[1]
          });
        }
        res.render(req.params.page, obj);
      } else {
        console.log('No data found.');
      }
    });
  }

});

//no req params gives you index from templates
app.get('/', async(req, res, next) => {

  // Auth
  fs.readFile(path.resolve(__dirname, '../../../.tarbell/client_secrets.json'), (err, content) => {
    if (err) return console.log('Error loading client secret file:', err);
    // Authorize a client with credentials, then call the Google Sheets API.
    authorize(JSON.parse(content), scrapeSheet);
  });

  //scrape sheets and res.render with results
  function scrapeSheet(auth) {
    const sheets = google.sheets({version: 'v4', auth});
    sheets.spreadsheets.values.get({
      spreadsheetId: spreadsheetKey,
      range: 'values',
    }, (err, response) => {
      if (err) return console.log('The API returned an error: ' + err);
      const rows = response.data.values;
      //add values to obj
      const obj = {};
      if (rows.length) {
        if (rows[0][0] === 'key') {
          rows.slice(1).forEach(row => {
            obj[row[0]] = row[1]
          });
        }
        res.render('index.html', obj);
      } else {
        console.log('No data found.');
        res.render('index.html', context);
      }
    });
  }
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
