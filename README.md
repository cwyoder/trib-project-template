# Dataviz dev template

A template for creating dataviz projects for the Chicago Tribune. Version 0.1.

## Requirements

* Node.js
* gulp-cli (See https://gulpjs.com/docs/en/getting-started/quick-start/)

### Serving contents of public folder on localhost

TKTKTKTKTK

### Building front-end assets

This template creates a configuration to use [Gulp](https://gulpjs.com/) to build front-end JS and CSS assets.

After forking the template, run:

    npm install

to install the build dependencies for front-end assets.

When you run:

    gulp
    npm run build

Gulp will compile `sass/styles.scss` into `public/build/styles.css` and bundle/minify `js/app.js` into `public/js/app.js`.

If you want to recompile as you develop, run:

    gulp && gulp watch
    npm run watch

To add `app.js` to your template file, inside the public folder:

    <script src="js/app.js"></script>

## How to use the public folder

This workflow replicates large portions of the previous workflow for "blurbs." This involves using iframes to port content into html containers inside Arc stories. This lets us have our elements and content on an S3 server, outside of Arc. This makes it easier to update changes and allows us to keep a code repository outside of Arc.

Use the `index.html` file inside the public folder to design and develop your graphic.

The `/public` folder is what will eventually be deployed to S3. All public facing files, images, etc should be in this folder. **If you don't want the file uploaded to S3 and available live, on the internet, then don't put it inside the public folder.** Examples of things that should go in the public folder are images (preferably inside a `/img` folder) or ai2html resizer scripts. An example of something that shouldn't go inside the public folder are Adobe Illustrator .ai files.

We use Pym.js, a JavaScript library developed by NPR that allows the parent and child pages to talk to each other. It redraws the iframe on the parent to fit the content of the child. [Pym.js documentation is located here.](http://blog.apps.npr.org/pym.js/)

## Embed code for graphics

This is the embed code that should be pasted into an HTML block inside Arc.

`<style> .dataviz-blurb iframe {min-width:100%; width:280px;}</style>
<div class='dataviz-blurb' id="blurb-gfx"></div>
<script src="https://pym.nprapps.org/pym.v1.min.js"></script>
<script>
    var pymParent = new pym.Parent('blurb-gfx', 'https://graphics.chicagotribune.com/SLUG/PATH', {});
</script>`

## Roadmap

0.1: Gulp to compile SCSS and Browserify-ed Javascript.
0.2: Local express development server and Nunjucks templating.
0.3: Google sheet connected to Nunjucks templating