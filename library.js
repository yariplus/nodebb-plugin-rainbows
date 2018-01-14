// Smile! With the power of smiles, the world becomes connected.

"use strict"

var plugin = module.exports

var RainbowVis    = require('./lib/rainbowvis.js')
var async         = require('async')

var NodeBB        = module.parent
var meta          = NodeBB.require('./meta')
var user          = NodeBB.require('./user')
var topics        = NodeBB.require('./topics')
var plugins       = NodeBB.require('./plugins')
var Settings      = NodeBB.require('./settings')
var emitter       = NodeBB.require('./emitter')
var SocketAdmin   = NodeBB.require('./socket.io/admin')
var SocketPlugins = NodeBB.require('./socket.io/plugins')

var themes = { }

var defaultSettings = {
	themes: [
		{ name: 'flutter', value: 'magenta,yellow' },
		{ name: 'dashie',  value: 'red,orange,yellow,green,blue,purple' },
		{ name: 'sunbutt', value: 'lightblue,lightpink,lightgreen' }
	],
	postsEnabled   : 1,
	tagsEnabled    : 1,
	topicsEnabled  : 1,
	postsModsOnly  : 0,
	topicsModsOnly : 0,
	hueModifier : 0,
	lumModifier : 40
}

// Best. Regex. Ever.
var regex = /-=((?:\([^\)]*\))?)([^\0]*?)=-/g;

// Remove color from all widgets for now.
emitter.on('nodebb:ready', function(){
	var hooked = {};
	Object.keys(plugins.loadedHooks).filter(function(hook){
        return hooked.hasOwnProperty(hook) ? false : (hooked[hook] = true);
	}).forEach(function(hook){
		if (hook.match('filter:widget.render:')) {
			plugins.loadedHooks[hook].push({
				id: 'nodebb-plugin-rainbows',
				method: plugin.parseController
			});
		}
	});
});

plugin.onLoad = function (params, cb) {
	var router     = params.router;
	var middleware = params.middleware;

	plugin.settings = new Settings('rainbows', '1.2.0', defaultSettings, loadSettings);

	function renderAdmin(req, res, next) {
		res.render('admin/plugins/rainbows', {});
	}

	router.get('/admin/plugins/rainbows', middleware.admin.buildHeader, renderAdmin);
	router.get('/api/admin/plugins/rainbows', renderAdmin);

	SocketAdmin.settings.syncRainbows = function () {
		plugin.settings.sync(loadSettings);
	};

	SocketPlugins.rainbows = {
		colorPost: function (socket, data, next) {
			topics.getTopicField(data.tid, 'cid', function(err, cid) {
				parsePost(socket.uid, cid, data.content, next);
			});
		},
		colorTopic: function (socket, data, next) {
			if (data.uid === -1) next(null, plugin.remove(data.title));
			if (data.uid === -2) next(null, plugin.parse(data.title));
			parseTopicTitle(data.uid, data.cid, data.title, next);
		},
		colorTopics: function (socket, data, next) {
			parseTopics(data.topics, next);
		}
	};

	function loadSettings() {
		themes = {};
		plugin.settings.get('themes').forEach(function(theme){
			themes[theme.name] = theme.value;
		});
		plugin.settings.set('themes', themes);
	}

	cb();
}

function hasPerms(uid, cid, cb) {
	async.parallel({
		isAdminOrGlobalMod : async.apply(user.isAdminOrGlobalMod, uid),
		isModerator        : async.apply(user.isModerator, uid, cid)
	}, function(err, results) {
		cb(err, results ? (results.isAdminOrGlobalMod || results.isModerator) : false);
	});
}

var readOption = function (options, option) {
	option = option.split(':');
	if (option.length > 1 && option[0] !== '' && option[1] !== '') {
		switch (option[0]) {
			case 'range':
				options.range = Math.floor(parseInt(option[1]));
				options.range = options.range > -1 && options.range < 9000 ? options.range : 0;
				break;
			case 'theme':
				if (themes.hasOwnProperty(option[1]) && !!themes[option[1]]) {
					themes[option[1]].replace(/ */g, '').split(',').forEach(function(val){
						if (val !== '') {
							readOption(options, val);
						}
					});
				}
				break;
			case 'bg':
			case 'bgcolor':
				options.bgcolor = option[1];
				break;
			default:
				break;
		}
	}else{
		if (option[0] === 'mirror') {
			options.mirror = true;
		}else{
			options.colors.push(option[0]);
		}
	}
};

plugin.adminHeader = function (custom_header, cb) {
	custom_header.plugins.push({
		"route": '/plugins/rainbows',
		"icon": '',
		"name": '<div class="rb-nav"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAj5JREFUeNqkVEtrE1EYPZM7j7ya2KaJSW3AWgxiMUWCgojaaLNy4cKVIP0D1a1QUNSfYf+AuBBx3YURdGOTjRu1SogNmATa0OadzON6JtRFi7aKA2eymHse3+NGkVLifx5FZjL/ct4gNMJ1HaJQMNW/IHmIyT04UNFGAh0ch+l+PEpggjg/cp7GLq6giXMQiEBx0x8lME9cQhgD3CL5IvodTWjrCKlrGPeU4FWeHyJwnVjEWUZdwk5nXAxfItp7gZhehyagTwj4p/+YYIG4iwvo8+0peX3WI8yYX5RAH+G5LmI5HfqsQFv9rcAp4h6dBcmdojeEFczYDT1qI3lnADHfRRltveqo0VpLwdLYPgF3PCuseYqx+3QWJCsNX5Ky921UIwP/Z6uXLtZaqa/bmrdnebCU2Sdwg7jKhg1Ys8bYKp1VkgXKEZz40LIX8uX+se6weTIA43SCKQ+UsMxR+dltjQ0zWLPB2DqddZLF4loJcWmZ2Sm0J3U0Do4xTVzmnB2OSme3LYTmDNZsMLZBZ51k7WYC8Ats8ewmsfNry9wnRymDS+LlnH0cVQDxXBDfEU4X6xHGjmdjSJIc4tnXbyvF2tP3q6NLpGY3NvAmlbrG9dS4YZJLIjlntnTW0X84Dhtms+YAYwdJfPjk3Wo9v1kcuT7GM6j5VitSMc0zSlAKpwZ8dCwM/AZk55sMFZrYqpXkMCLletWs3H714NN2b9dd7+7oMvFuuI3wE2OEOGStHcIizD2i+2vzr0D+FGAARenLmDXrT3oAAAAASUVORK5CYII="><b style="color:#ff0000">R</b><b style="color:#ff6000">a</b><b style="color:#ffbf00">i</b><b style="color:#dfff00">n</b><b style="color:#7fff00">b</b><b style="color:#20ff00">o</b><b style="color:#00bf40">w</b><b style="color:#00609f">s</b></div>'
	});
	// Image is rainbow-icon.png from:
	// http://p.yusukekamiyamane.com/
	// CC-BY

	cb(null, custom_header);
}

plugin.parse = function (text) {
	if (!text) return text;

	var pattern = /-=[^\0]+?=-/g;
	var matches = text.match(pattern) || [];

	if (matches.length === 0) return text;

	matches.forEach(function (match) {

		var sliced = match.slice(2, match.length-2),
			trimmed = sliced,
			characters,
			rainbow = new RainbowVis(),
			html = {},
			options = {
				range: 0,
				colors: [],
				bgcolor: '',
				mirror: false
			};

		var postOptions = sliced.match(/^\([^\)]*\)/);

		if (postOptions) {
			sliced = sliced.replace(postOptions[0], '');
			trimmed = sliced;

			postOptions = postOptions[0].slice(1, postOptions[0].length-1).replace(/ */g, '').split(',');

			postOptions.forEach(function (option) {
				if (option !== '') {
					readOption(options, option);
				}
			});
		}

		characters = sliced.replace(/<[^>]*>/gm, '').replace(/(\r\n|\n|\r| |\t)*/gm,'').length;

		if (!characters) return;

		if (options.colors.length > 0) {
			if (options.colors.length === 1) options.colors[1] = options.colors[0];

			if (options.range === 0) {
				options.range = characters > 1 ? characters : 2;
			}else{
				options.range = options.range > options.colors.length ? options.range : options.colors.length;
			}
		}else{
			options.colors = [ 'red', 'orange', 'gold', 'lime', 'deepskyblue', 'blue', 'blueviolet', 'magenta'];

			if (options.range === 0) {
				options.range = characters > 8 ? characters : 8;
			}else{
				options.range = options.range > 8 ? options.range : 8;
			}
		}

		try {
			rainbow.setSpectrumByArray(options.colors);
		} catch (e) {
			text = text.replace(match, sliced);
			return;
		}

		rainbow.setNumberRange(0, options.range - 1);

		var parsed = "",
			offset = 0;

		while (trimmed.length) {
			var c = trimmed.charAt(0);

			if (c.match(/(\n|\r)/)) {
				parsed += '<br>';
				trimmed = trimmed.substr(1);
			}else if (c.match(/ /)) {
				parsed += ' ';
				trimmed = trimmed.substr(1);
			}else if (trimmed.match(/^<\/p><p>/)) {
				parsed += '<br /><br />';
				trimmed = trimmed.replace(/^<\/p><p>/, '');
			}else if (trimmed.match(/^<[^>]*>/)) {
				parsed += trimmed.match(/^<[^>]*>/)[0];
				trimmed = trimmed.replace(/^<[^>]*>/, '');
			}else{
				parsed += '<span style="color:#' + rainbow.colourAt(offset % options.range) + '">' + trimmed.charAt(0) + '</span>';
				trimmed = trimmed.substr(1);
				offset++;
			}
		}

		if (options.bgcolor) parsed = '<span style="background-color:' + options.bgcolor + '">' + parsed + '</span>';

		parsed = '<span class="rainbowified">' + parsed + '</span>';

		text = text.replace(match, parsed);
	});

	return text;
};

plugin.remove = function (content) {
	var arr;
	while ((arr = regex.exec(content)) !== null) {
		content = content.replace(arr[0], arr[2]);
	}
	return content;
};

plugin.parseRaw = function (content, cb) {
	cb(null, plugin.parse(content));
};

plugin.parseSignature = function (data, cb) {
	if (plugin.settings.get('postsEnabled')) {
		data.userData.signature = plugin.parse(data.userData.signature);
	}else{
		data.userData.signature = plugin.remove(data.userData.signature);
	}
	cb(null, data);
};

plugin.parsePost = function (data, cb) {
	topics.getTopicField(data.tid, 'cid', function(err, cid) {
		parsePost(data.postData.uid, cid, data.postData.content, function (err, content) {
			data.postData.content = content;
			cb(null, data);
		});
	});
};

function parsePost(uid, cid, content, cb) {
	if (!plugin.settings.get('postsEnabled')) return cb(new Error('Not allowed to post colors.'), plugin.remove(content));
	if (!plugin.settings.get('postsModsOnly')) return cb(null, plugin.parse(content));

	hasPerms(uid, cid, function (err, hasPerms) {
		cb(hasPerms ? null : new Error('Not allowed post colors.'), hasPerms ? plugin.parse(content) : plugin.remove(content));
	});
}

plugin.parseTopic = function (data, cb) {
	parseTopicTitle(data.templateData.uid, data.templateData.cid, data.templateData.title, function (err, title) {
		data.templateData.title = title;
		cb(null, data);
	});
};

// Pass back an array of parsed topics only.
function parseTopics(topicsData, cb) {
	if (!plugin.settings.get('topicsEnabled')) return cb();

	async.map(topicsData, function (topic, next) {
		topics.getTopicFields(topic.tid, ['cid', 'uid'], function (err, fields) {
			parseTopicTitle(fields.uid, fields.cid, topic.title, function (err, title) {
				topic.uid = fields.uid;
				topic.cid = fields.cid;
				topic.title = title;
				next(null, topic);
			});
		});
	}, function (err, topicsData) {
		cb(null, {topics: topicsData});
	});
};
function parseTopicsAll(topicsData, cb) {
	if (!plugin.settings.get('topicsEnabled')) return cb();

	async.map(topicsData, function (topic, next) {
		topics.getTopicFields(topic.tid, ['cid', 'uid'], function (err, fields) {
			parseTopicTitle(fields.uid, fields.cid, topic.title, function (err, title) {
				topic.title = title;
				next(null, topic);
			});
		});
	}, cb);
};

function parseTopicTitle(uid, cid, title, cb) {
	if (!plugin.settings.get('topicsEnabled')) return cb(new Error('Not allowed to use colors in topic titles.'), plugin.remove(title));
	if (!plugin.settings.get('topicsModsOnly')) return cb(null, plugin.parse(title));

	hasPerms(uid, cid, function (err, hasPerms) {
		cb(hasPerms ? null : new Error('Not allowed to use colors in topic titles.'), hasPerms ? plugin.parse(title) : plugin.remove(title));
	});
}

plugin.configGet = function (data, next) {
	data.rainbows = {};
	data.rainbows.postsEnabled   = parseInt(plugin.settings.get('postsEnabled'),   10) === 1;
	data.rainbows.postsModOnly   = parseInt(plugin.settings.get('postsModOnly'),   10) === 1;
	data.rainbows.tagsEnabled    = parseInt(plugin.settings.get('tagsEnabled'),    10) === 1;
	data.rainbows.topicsEnabled  = parseInt(plugin.settings.get('topicsEnabled'),  10) === 1;
	data.rainbows.topicsModsOnly = parseInt(plugin.settings.get('topicsModsOnly'), 10) === 1;
	data.rainbows.hueModifier    = parseInt(plugin.settings.get('hueModifier'),    10) || 0;
	data.rainbows.lumModifier    = parseInt(plugin.settings.get('lumModifier'),    10) || 40;

	next(null, data);
};

plugin.renderHeader = function (data, cb) {
	data.templateValues.browserTitle = plugin.remove(data.templateValues.browserTitle);
	cb(null, data);
};

// Doesn't work.
plugin.getTopic = function (data, cb) {
	//data.topic.title = plugin.remove(data.topic.title);
	cb(null, data);
};

plugin.parseController = function (data, cb) {
	if (!data) return cb(null, data);

	if (data.templateData && data.templateData.topics) {
		async.each(data.templateData.topics, function (topic, next) {
			parseTopicTitle(topic.uid, topic.cid, topic.title, function (err, title) {
				topic.title = title;
				next();
			});
		}, function(){
			cb(null, data);
		});
	}else if (typeof data === 'string') {
		cb(null, plugin.remove(data));
	}else{
		cb(null, data);
	}
};
