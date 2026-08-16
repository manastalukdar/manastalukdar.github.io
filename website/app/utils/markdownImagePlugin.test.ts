// Run: node app/utils/markdownImagePlugin.test.ts   (from website/)
import assert from 'node:assert';
import MarkdownIt from 'markdown-it';
import markdownImagePlugin from './markdownImagePlugin.ts';

const md = new MarkdownIt();
markdownImagePlugin(md);
const render = (src: string) => md.render(`![alt](${src})`);

assert.match(render('/x/talk.mp4'), /<video/);
assert.match(render('https://cdn.example.com/talk.MOV?v=2'), /<video/);
assert.match(render('/x/legacy.ogg'), /<video/);
assert.match(render('/x/episode.mp3'), /<audio/);
assert.match(render('/x/episode.m4a#t=30'), /<audio/);
assert.match(render('/x/photo.png'), /<img/);
// extension must be at the end, not anywhere in the path
assert.match(render('/mp3-archive/photo.png'), /<img/);
// relative blogdata paths are rewritten to absolute
assert.match(render('../../../../../blogdata/2019/pic.png'), /src="\/blogdata\/2019\/pic\.png"/);

console.log('markdownImagePlugin: all checks passed');
