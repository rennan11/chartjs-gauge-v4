/* eslint-disable global-require */
/* eslint-disable import/no-extraneous-dependencies */
const fs = require('node:fs');
const hljs = require('highlight.js');
const marked = require('marked');
const pkg = require('../../package.json');

const root = `${__dirname}/../../`;
const input = fs.readFileSync(`${root}/README.md`, 'utf-8');
const content = marked.marked(input, {
  gfm: true,
  langPrefix: 'hljs language-',
  highlight(code, lang) {
    return hljs.highlightAuto(code, [lang]).value;
  },
});
const html = `
<!DOCTYPE html>
<head>
  <meta charset="UTF-8">
  <link rel="stylesheet" type="text/css" href="samples/style.css">
  <link rel="stylesheet" href="//cdnjs.cloudflare.com/ajax/libs/highlight.js/11.6.0/styles/github-dark-dimmed.min.css">
  <title>${pkg.name}</title>
</head>

<body class="content">
  ${content}
</body>

</html>
`;
fs.writeFileSync(`${root}/index.html`, html, 'utf-8');
