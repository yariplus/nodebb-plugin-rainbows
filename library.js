"use strict";

(function(Rainbows, NodeBB){

	// Smile! With the power of smiles, the world becomes connected.

	var app, router, middleware,

		RainbowVis    = require('./lib/rainbowvis.js'),
		async         = require('async'),

		meta          = NodeBB.require('./meta'),
		Settings      = NodeBB.require('./settings'),
		SocketAdmin   = NodeBB.require('./socket.io/admin'),
		SocketPlugins = NodeBB.require('./socket.io/plugins'),

		themes = { },

		defaultSettings = {
			themes: [
				'flutter=magenta,yellow',
				'dashie=red,orange,yellow,green,blue,purple',
				'sunbutt=lightblue,lightpink,lightgreen'
			],
			rainbowifyTags: 1,
			hueModifier: 0,
			lumModifier: 40
		};

	Rainbows.onLoad = function (params, callback) {
		app        = params.app;
		router     = params.router;
		middleware = params.middleware;

		function renderAdmin(req, res, next) {
			res.render('admin/plugins/rainbows', {});
		}

		router.get('/admin/plugins/rainbows', middleware.admin.buildHeader, renderAdmin);
		router.get('/api/admin/plugins/rainbows', renderAdmin);

		SocketAdmin.settings.syncRainbows = function () {
			Rainbows.settings.sync(loadSettings);
		};

		SocketPlugins.rainbows = {
			rainbowify: function (socket, data, next) {
				Rainbows.parseRaw(data.text, next);
			}
		};
		callback();
	};

	Rainbows.settings = new Settings('rainbows', '1.2.0', defaultSettings, loadSettings);

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

	function loadSettings() {
		var config = Rainbows.settings.get();

		themes = {};
		if (config && config.themes && Array.isArray(config.themes)) {
			config.themes.forEach(function (value) {
				value = value.split('=');
				if (value.length !== 2 || value[0] === '' || value[1] === '') return;
				themes[value[0]] = value[1];
			});
		}
	}

	Rainbows.adminHeader = function (custom_header, callback) {
		custom_header.plugins.push({
			"route": '/plugins/rainbows',
			"icon": '',
			"name": '<div class="rb-nav"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAj5JREFUeNqkVEtrE1EYPZM7j7ya2KaJSW3AWgxiMUWCgojaaLNy4cKVIP0D1a1QUNSfYf+AuBBx3YURdGOTjRu1SogNmATa0OadzON6JtRFi7aKA2eymHse3+NGkVLifx5FZjL/ct4gNMJ1HaJQMNW/IHmIyT04UNFGAh0ch+l+PEpggjg/cp7GLq6giXMQiEBx0x8lME9cQhgD3CL5IvodTWjrCKlrGPeU4FWeHyJwnVjEWUZdwk5nXAxfItp7gZhehyagTwj4p/+YYIG4iwvo8+0peX3WI8yYX5RAH+G5LmI5HfqsQFv9rcAp4h6dBcmdojeEFczYDT1qI3lnADHfRRltveqo0VpLwdLYPgF3PCuseYqx+3QWJCsNX5Ky921UIwP/Z6uXLtZaqa/bmrdnebCU2Sdwg7jKhg1Ys8bYKp1VkgXKEZz40LIX8uX+se6weTIA43SCKQ+UsMxR+dltjQ0zWLPB2DqddZLF4loJcWmZ2Sm0J3U0Do4xTVzmnB2OSme3LYTmDNZsMLZBZ51k7WYC8Ats8ewmsfNry9wnRymDS+LlnH0cVQDxXBDfEU4X6xHGjmdjSJIc4tnXbyvF2tP3q6NLpGY3NvAmlbrG9dS4YZJLIjlntnTW0X84Dhtms+YAYwdJfPjk3Wo9v1kcuT7GM6j5VitSMc0zSlAKpwZ8dCwM/AZk55sMFZrYqpXkMCLletWs3H714NN2b9dd7+7oMvFuuI3wE2OEOGStHcIizD2i+2vzr0D+FGAARenLmDXrT3oAAAAASUVORK5CYII="><b style="color:#ff0000">R</b><b style="color:#ff6000">a</b><b style="color:#ffbf00">i</b><b style="color:#dfff00">n</b><b style="color:#7fff00">b</b><b style="color:#20ff00">o</b><b style="color:#00bf40">w</b><b style="color:#00609f">s</b></div>'
		});
		// Image is rainbow-icon.png from:
		// http://p.yusukekamiyamane.com/
		// CC-BY

		callback(null, custom_header);
	}

	Rainbows.parseRaw = function (data, callback) {
		if (data) {

			var pattern = /-=[^\0]+?=-/g;

			var matches = data.match(pattern) || [];

			if (matches.length === 0) return callback(null, data);

			async.each(matches, function (match, callback) {

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

				if (!characters) return callback(null, data);

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
					data = data.replace(match, sliced);
					return callback(null, data);
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

				data = data.replace(match, parsed);

				callback();
			}, function(err){
				callback(null, data);
			});
		}else{
			callback(null, data);
		}
	};

	Rainbows.parseSignature = function (data, callback) {
		Rainbows.parseRaw(data.userData.signature, function (err, signature) {
			data.userData.signature = signature;
			callback(err, data);
		});
	};

	Rainbows.parsePost = function (data, callback) {
		Rainbows.parseRaw(data.postData.content, function (err, content) {
			data.postData.content = content;
			callback(err, data);
		});
	}

	Rainbows.configGet = function (data, next) {
		data.rainbowifyTags = parseInt(Rainbows.settings.get('rainbowifyTags'), 10) === 1;
		data.hueModifier = parseInt(Rainbows.settings.get('hueModifier'), 10) || 0;
		data.lumModifier = parseInt(Rainbows.settings.get('lumModifier'), 10) || 40;

		next(null, data);
	};

}(module.exports, module.parent));
