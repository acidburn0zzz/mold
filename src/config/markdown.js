let hljs = require('highlight.js');
let markdownIt = require('markdown-it');
let markdown = require('markdown-it')({
  html: true,
  highlight: function(string, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return '<pre class="hljs"><code>' + hljs.highlight(lang, string, true).value + '</code></pre>';
      } catch (__) {}
    }
    return '<pre class="hljs"><code>' + markdown.utils.escapeHtml(string) + '</code></pre>';
  }
});

markdown.use(require('markdown-it-attrs'));
let container = require('markdown-it-container');
markdown.use(container, 'col-md-8');
markdown.use(container, 'row');
markdown.use(container, 'col-md-4');

module.exports = markdown;
