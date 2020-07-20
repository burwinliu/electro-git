const { parallel, src, dest } = require('gulp');

function copyCss() {
  return src('app/renderer/**/*.css').pipe(dest('build/renderer'));
}

function copyHtml() {
  return src('app/renderer/index.html').pipe(dest('build/renderer'));
}

copyHtml.displayName = 'copy-html';
copyCss.displayName = 'copy-css';

exports.copyAll = parallel(copyCss, copyHtml);
exports.copyHtml = copyHtml;
exports.copyCss = copyCss;
