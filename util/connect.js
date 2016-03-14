var connect = require('connect');
var serveStatic = require('serve-static');
var modRewrite = require('connect-modrewrite');
var path = require('path');

var app = connect();
app.use(modRewrite([
  "!\\.html|\\.js|\\.css|\\.svg|\\.jp(e?)g|\\.png|\\.woff|\\.tiff|\\.gif$ /index.html"
]));
app.use(serveStatic(path.resolve(__dirname, '../dist')));
app.listen(8080);
console.log('listening on 8080');