(function() {
	"use strict";

	// Smile! With the power of smiles, the world becomes connected.

	var Rainbow = require('./lib/rainbowvis.js'),
		async = require('async'),
		fs = require('fs'),
		path = require('path'),
		meta = module.parent.require('./meta'),
		Settings = module.parent.require('./settings'),
		user = module.parent.require('./user'),
		plugins = module.parent.require('./plugins'),
		SocketAdmin = module.parent.require('./socket.io/admin'),
		translator = module.parent.require('../public/src/translator'),
		app,
		themes = {},
		Rainbows = {};

	Rainbows.onLoad = function (params, callback, controllers, legacyback) {
		var router = params.router || params;
		var middleware = params.middleware || callback;
		app = params.app || params;
		callback = legacyback || callback;

		function render(req, res, next) {
			res.render('admin/plugins/rainbows', {});
		}

		router.get('/admin/plugins/rainbows', middleware.admin.buildHeader, render);
		router.get('/api/admin/plugins/rainbows', render);
		router.get('/rainbows/config', function (req, res) {
			res.status(200);
		});

		var	defaultSettings = {
			'themes': [
				'flutter=magenta,yellow,range:0',
				'dashie=red,orange,yellow,green,blue,purple,range:0',
				'sunbutt=lightblue,lightpink,lightgreen,range:0'
			]
		};

		Rainbows.settings = new Settings('rainbows', '0.0.1', defaultSettings, function() {
			Rainbows.settings.reset(function(){
				console.log(Rainbows.settings.get());
				
				loadSettings();
			});

			loadSettings();
		});

		SocketAdmin.settings.syncRainbows = function () {
			Rainbows.settings.sync(function(){
				loadSettings();
			});
		};

		callback();
	}
	
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
			"icon": 'fa-edit',
			"name": '<b style="color:#ff0000">R</b><b style="color:#ff6000">a</b><b style="color:#ffbf00">i</b><b style="color:#dfff00">n</b><b style="color:#7fff00">b</b><b style="color:#20ff00">o</b><b style="color:#00bf40">w</b><b style="color:#00609f">s</b>'
		});
		
		callback(null, custom_header);
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
	}

	Rainbows.parsePost = function (data, callback) {
		//console.log("POST: " + data.postData.content);
		if (data && data.postData && data.postData.content) {
			var pattern = /-=[^\0]+?=-/g;

			var matches = data.postData.content.match(pattern) || [];
			if (matches.length === 0) return callback(null, data);

			async.each(matches, function (match, callback) {
				//console.log("IN: " + match); //.replace(/<.*?>/g,'')
				var sliced = match.slice(2, match.length-2),
					trimmed,
					rainbow = new Rainbow(),
					html = {},
					options = {
						range: 0,
						colors: [],
						bgcolor: '',
						mirror: false
					};

				var postOptions = sliced.match(/\(.*?\)/);
				if (postOptions) {
					sliced = sliced.replace(postOptions[0], '');

					postOptions = postOptions[0].slice(1, postOptions[0].length-1).replace(/ */g, '').split(',');
					postOptions.forEach(function (option) {
						if (option !== '') {
							readOption(options, option);
						}
					});
				}

				trimmed = sliced.replace(/(\r\n|\n|\r| |\t)*/gm,'');
				if (trimmed === '') return callback();
				if (options.colors.length > 1) {
					try {
						rainbow.setSpectrumByArray(options.colors);
					} catch (e) {
						data.postData.content = data.postData.content.replace(match, sliced);
						return callback();
					}
					if (options.range === 0) {
						options.range = trimmed.length > 1 ? trimmed.length : 2;
					}else{
						options.range = options.range > options.colors.length ? options.range : options.colors.length;
					}
				}else{
					if (options.range === 0) {
						options.range = trimmed.length > 8 ? trimmed.length : 8;
					}else{
						options.range = options.range > 8 ? options.range : 8;
					}
				}
				rainbow.setNumberRange(0, options.range - 1);

				var parsed = "",
					offset = 0;
				for (var i = 0; i < sliced.length; i++) {
					var c = sliced.charAt(i);
					if (c.match(/\n/)) {
						parsed += '<br>';
						offset++;
					}else if (c.match(/ /)) {
						parsed += ' ';
						offset++;
					}else{
						parsed += '<span style="color:#' + rainbow.colourAt((i - offset) % options.range) + '">' + sliced.charAt(i) + '</span>';
					}
				}
				if (options.bgcolor) parsed = '<span style="background-color:' + options.bgcolor + '">' + parsed + '</span>';

				data.postData.content = data.postData.content.replace(match, parsed);
				//console.log("OUT: " + parsed);
				callback();
			}, function(err){
				callback(null, data);
			});
		}else{
			callback(null, data);
		}
	}

	Rainbows.parseRaw = function (data, callback) {
		Rainbows.parsePost({postData: {content: data}, uid: -1}, function(err, data) {
			callback(err, data.postData.content);
		});
	}

	module.exports = Rainbows;
})();
