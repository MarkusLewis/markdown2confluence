let marked = require('marked');
let _ = require('min-util');
let qs = require('min-qs');

module.exports = exports = markdown2confluence;

let MAX_CODE_LINE = 20;

function Renderer() {
}

//Configure Marked
marked.setOptions({
	renderer: new marked.Renderer(),
	gfm: true,
	tables: true,
	breaks: false,
	pedantic: false,
	sanitize: false,
	smartLists: true,
	smartypants: false
});

//Build Renderer
let rawRenderer = new marked.Renderer();

let langArr = 'actionscript3 bash csharp coldfusion cpp css delphi diff erlang groovy java javafx javascript perl php none powershell python ruby scala sql vb html/xml'.split(/\s+/)
let langMap = {
	shell: 'bash'
};

for (let i = 0, x; x = langArr[i++];) {
	langMap[x] = x
}

_.extend(Renderer.prototype, rawRenderer.prototype, {
	paragraph(text) {
		return text + '\n\n';
	},
	html(html) {
		return html;
	},
	heading(text, level, raw) {
		return 'h' + level + '. ' + text + '\n\n';
	},
	strong(text) {
		return '*' + text + '*';
	},
	em(text) {
		return '_' + text + '_';
	},
	del(text) {
		return '-' + text + '-';
	},
	codespan(text) {
		return '{{' + text + '}}';
	},
	blockquote(quote) {
		return '{quote}' + quote + '{quote}';
	},
	br() {
		return '\n';
	},
	hr() {
		return '----';
	},
	link(href, title, text) {
		if (text !== null) {
			return '[' + text + '|' + href + ']';
		}

		return '[' + href + ']';
	},
	list(body, ordered) {
		let arr = _.filter(_.trim(body).split('\n'), function (line) {
			return line
		});
		let type = ordered ? '#' : '*';
		return _.map(arr, line => type + ' ' + line).join('\n') + '\n\n';

	},
	listitem(body, ordered) {
		return body + '\n';
	},
	image(href, title, text) {
		return '!' + href + '!';
	},
	table(header, body) {
		return header + body + '\n';
	},
	tablerow(content, flags) {
		return content + '\n';
	},
	tablecell(content, flags) {
		let type = flags.header ? '||' : '|';

		return type + content;
	},
	code(code, lang) {
		lang = langMap[lang] || '';
		let param = {
			language: lang,
			borderStyle: 'solid',
			theme: 'RDark',
			linenumbers: true,
			collapse: false
		};

		let lineCount = _.split(code, '\n').length;
		if (lineCount > MAX_CODE_LINE) {
			param.collapse = true;
		}

		param = qs.stringify(param, '|', '=');

		return '{code:' + param + '}\n' + code + '\n{code}\n\n';
	},
	text(text) {
		return text;
	}
});

let renderer = new Renderer();

function markdown2confluence(markdown) {
	return marked(markdown, {
		renderer: renderer
	});
}
