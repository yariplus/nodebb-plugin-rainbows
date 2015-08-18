// Redactor
$(document).ready(function(){
	if ($ && $.Redactor) {
		require(['vendor/colorpicker/colorpicker'], function (){
			if (!$.Redactor.opts.plugins) $.Redactor.opts.plugins = [];
			$.Redactor.opts.plugins.push('rainbows');
			$.Redactor.prototype.rainbows = function() {
				return {
					getTemplate: function() {
						return String()
						+ '<section id="redactor-modal-rainbows">'
						+ '<div class="panel panel-default">'
						+ '<div class="panel-body">'
						+ '<span id="rainbowsPreview"><span>'
						+ '</div></div>'
						+ '<label>Add Color</label><br>'

						+ '<button class="btn color-preset"><div style="background-color:#FF0000;width:20px;height:20px;" data-color="#FF0000"></div></button>'
						+ '<button class="btn color-preset"><div style="background-color:#FFFF00;width:20px;height:20px;" data-color="#FFFF00"></div></button>'
						+ '<button class="btn color-preset"><div style="background-color:#00FF00;width:20px;height:20px;" data-color="#00FF00"></div></button>'
						+ '<button class="btn color-preset"><div style="background-color:#00FFFF;width:20px;height:20px;" data-color="#00FFFF"></div></button>'
						+ '<button class="btn color-preset"><div style="background-color:#0000FF;width:20px;height:20px;" data-color="#0000FF"></div></button>'
						+ '<button class="btn color-preset"><div style="background-color:#FF00FF;width:20px;height:20px;" data-color="#FF00FF"></div></button>'

						+ '<button class="btn color-preset"><div style="background-color:#800000;width:20px;height:20px;" data-color="#800000"></div></button>'
						+ '<button class="btn color-preset"><div style="background-color:#808000;width:20px;height:20px;" data-color="#808000"></div></button>'
						+ '<button class="btn color-preset"><div style="background-color:#008000;width:20px;height:20px;" data-color="#008000"></div></button>'
						+ '<button class="btn color-preset"><div style="background-color:#008080;width:20px;height:20px;" data-color="#008080"></div></button>'
						+ '<button class="btn color-preset"><div style="background-color:#000080;width:20px;height:20px;" data-color="#000080"></div></button>'
						+ '<button class="btn color-preset"><div style="background-color:#800080;width:20px;height:20px;" data-color="#800080"></div></button>'

						+ '<button class="btn color-preset"><div style="background-color:#FFFFFF;width:20px;height:20px;" data-color="#FFFFFF"></div></button>'
						+ '<button class="btn color-preset"><div style="background-color:#C0C0C0;width:20px;height:20px;" data-color="#C0C0C0"></div></button>'
						+ '<button class="btn color-preset"><div style="background-color:#808080;width:20px;height:20px;" data-color="#808080"></div></button>'
						+ '<button class="btn color-preset"><div style="background-color:#000000;width:20px;height:20px;" data-color="#000000"></div></button>'

						+ '<button class="btn" id="picker"><div style="width:20px;height:20px;"></div></button>'
						+ '</section>';
					},
					init: function() {
						var button = this.button.add('rainbows', 'Rainbows'),
							redactor = this;

						this.button.addCallback(button, this.rainbows.show);
					},
					show: function() {
						this.modal.addTemplate('rainbows', this.rainbows.getTemplate());

						this.modal.load('rainbows', 'Rainbows', 400);

						this.modal.createCancelButton();

						var button = this.modal.createActionButton('Insert');
						button.on('click', this.rainbows.insert);

						$('#rainbowsPreview').html(this.selection.getHtml() || "Some Example Text");

						$('#picker').ColorPicker({
							onBeforeShow: function () {
								$(this).ColorPickerSetColor($('#picker div').css('background-color'));
							},
							onChange: function (hsb, hex, rgb) {
								$('#picker div').css('background-color', '#' + hex);
							}
						}).bind('keyup', function(){
							$(this).ColorPickerSetColor($('#picker div').css('background-color'));
						});

						$('.color-preset').on('click', function () {
							if (!$('#rainbowsPreview').data('colors')) {
								$('#rainbowsPreview').data('colors', $(this).find('div').attr('data-color'));
							}else{
								$('#rainbowsPreview').data('colors', $('#rainbowsPreview').data('colors') + ',' + $(this).find('div').attr('data-color'));
							}
							socket.emit('plugins.rainbows.rainbowify', {text: '-=(' + ($('#rainbowsPreview').data('colors') || '') + ')' + $('#rainbowsPreview').text() + '=-'}, function (err, data) {
								if (err) console.log(err);
								$('#rainbowsPreview').html(data);
							});
						});

						this.selection.save();
						this.modal.show();
					},
					insert: function(buttonName) {
						var redactor = this;
						var sel = this.selection.getHtml();
						var html = '-=(' + ($('#rainbowsPreview').data('colors') || '') + ')' + ( sel || 'Some Example Text') + '=-';

						socket.emit('plugins.rainbows.rainbowify', {text: html}, function (err, data) {
							if (err) console.log(err);

							redactor.selection.restore();
							redactor.insert.html(data);
							redactor.code.sync();
							redactor.modal.close();
						});
					}
				};
			};
		});
	}

	require(['composer', 'composer/controls'], function(composer, controls) {
		composer.addButton('rainbows', function(textarea, selectionStart, selectionEnd) {
			if(selectionStart === selectionEnd){
				controls.insertIntoTextarea(textarea, '-=()Insert Text Here=-');
				controls.updateTextareaSelection(textarea, selectionStart + 4, selectionEnd + 20);
			} else {
				controls.wrapSelectionInTextareaWith(textarea, '-=()', '=-');
				controls.updateTextareaSelection(textarea, selectionStart + 4, selectionEnd + 4);
			}
		});
	});
});

// Custom Redactor Hooks
// $(window).on('action:redactor.init', function(event) {
	// Add plugins here.
	// $.Redactor.prototype.advanced = function() {
		// return {
			// init: function ()
			// {
				// var button = this.button.add('advanced', 'Advanced');
				// this.button.addCallback(button, this.advanced.testButton);
			// },
			// testButton: function(buttonName)
			// {
				// alert(buttonName);
			// }
		// };
	// };
// });

// $(window).on('action:redactor.loading', function(event, redactor) {
	// Modify options here.
	// redactor.opts.plugins.push('advanced');
// });

// $(window).on('action:redactor.loaded', function(event, redactor) {
	// You can access the elements here.
	// console.log(redactor.$textarea);
// });
