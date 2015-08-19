var rainbowModalBody = String()
+ '<label>Selected Text</label><br>'
+ '<div class="panel panel-default">'
+ '<div class="panel-body">'
+ '<span id="rainbowsPreview"><span>'
+ '</div></div>'

+ '<label>Add a Color</label><br>'
+ '<button class="btn color-preset"><div style="background-color:red;width:20px;height:20px;" data-color="red"></div></button>'
+ '<button class="btn color-preset"><div style="background-color:orange;width:20px;height:20px;" data-color="orange"></div></button>'
+ '<button class="btn color-preset"><div style="background-color:yellow;width:20px;height:20px;" data-color="yellow"></div></button>'
+ '<button class="btn color-preset"><div style="background-color:lime;width:20px;height:20px;" data-color="lime"></div></button>'
+ '<button class="btn color-preset"><div style="background-color:cyan;width:20px;height:20px;" data-color="cyan"></div></button>'
+ '<button class="btn color-preset"><div style="background-color:blue;width:20px;height:20px;" data-color="blue"></div></button>'
+ '<button class="btn color-preset"><div style="background-color:blueviolet;width:20px;height:20px;" data-color="blueviolet"></div></button>'
+ '<button class="btn color-preset"><div style="background-color:violet;width:20px;height:20px;" data-color="violet"></div></button>'
+ '<button class="btn color-preset"><div style="background-color:magenta;width:20px;height:20px;" data-color="magenta"></div></button>'

+ '<button class="btn color-preset"><div style="background-color:maroon;width:20px;height:20px;" data-color="maroon"></div></button>'
+ '<button class="btn color-preset"><div style="background-color:sienna;width:20px;height:20px;" data-color="sienna"></div></button>'
+ '<button class="btn color-preset"><div style="background-color:olive;width:20px;height:20px;" data-color="olive"></div></button>'
+ '<button class="btn color-preset"><div style="background-color:green;width:20px;height:20px;" data-color="green"></div></button>'
+ '<button class="btn color-preset"><div style="background-color:teal;width:20px;height:20px;" data-color="teal"></div></button>'
+ '<button class="btn color-preset"><div style="background-color:navy;width:20px;height:20px;" data-color="navy"></div></button>'
+ '<button class="btn color-preset"><div style="background-color:purple;width:20px;height:20px;" data-color="purple"></div></button>'

+ '<button class="btn color-preset"><div style="background-color:white;width:20px;height:20px;" data-color="white"></div></button>'
+ '<button class="btn color-preset"><div style="background-color:silver;width:20px;height:20px;" data-color="silver"></div></button>'
+ '<button class="btn color-preset"><div style="background-color:gray;width:20px;height:20px;" data-color="gray"></div></button>'
+ '<button class="btn color-preset"><div style="background-color:black;width:20px;height:20px;" data-color="black"></div></button>'

+ '<br>'
+ '<button class="btn" id="picker-button"><div style="height:20px;background-color:#FBFBFB;">&nbsp;<i class="fa fa-cog"></i>&nbsp;Custom&nbsp;Color&nbsp;</div></button>'
+ '<button class="btn" id="color-custom"><div style="background-color:pink;width:20px;height:20px;" data-color="pink"></div></button>'

+ '<br><br>'
+ '<label>Remove a Color</label><br>'
+ '<button class="btn" id="rainbows-remove-one"><div style="height:20px;background-color:#FBFBFB;">&nbsp;<i class="fa fa-minus"></i>&nbsp;One&nbsp;</div></button>'
+ '<button class="btn" id="rainbows-remove-all"><div style="height:20px;background-color:#FBFBFB;">&nbsp;<i class="fa fa-minus"></i>&nbsp;All&nbsp;</div></button>'

var rainbowsRedactorModal = String()
+ '<section id="redactor-modal-rainbows">'
+ rainbowModalBody
+ '</section>';

var rainbowsComposerModal = String()
+ '<div class="modal fade" tabindex="-1" id="rainbows-modal" role="dialog">'
+ '<div class="modal-dialog">'
+ '<div class="modal-content">'
+ '<div class="modal-header">'
+ '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'
+ '<h4 class="modal-title">Rainbows</h4>'
+ '</div>'
+ '<div class="modal-body">'
+ rainbowModalBody
+ '</div>'
+ '<div class="modal-footer">'
+ '<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>'
+ '<button type="button" class="btn btn-primary" data-dismiss="modal" id="rainbows-insert">Insert</button>'
+ '</div>'
+ '</div><!-- /.modal-content -->'
+ '</div><!-- /.modal-dialog -->'
+ '</div>';

// Redactor
$(document).ready(function(){
	if ($ && $.Redactor) {
		if (!$.Redactor.opts.plugins) $.Redactor.opts.plugins = [];
		$.Redactor.opts.plugins.push('rainbows');
		$.Redactor.prototype.rainbows = function() {
			return {
				getTemplate: function() {
					return rainbowsRedactorModal
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
					rainbowsModalEvents();

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
	}else{
		$('body').append(rainbowsComposerModal);

		$('#rainbows-insert').on('click', function (e) {
			require(['composer/controls', 'composer/preview'], function(controls, preview) {
				var selectionStart = $('#rainbowsPreview').data('start');
				var selectionEnd = $('#rainbowsPreview').data('end');
				var textarea = $('#rainbowsPreview').data('el');

				var sel = $('#rainbowsPreview').data('colors') ? $('#rainbowsPreview').data('colors').length : 0;
				selectionStart += sel;
				selectionEnd += sel;

				if (selectionStart === selectionEnd){
					controls.insertIntoTextarea(textarea, '-=(' + ($('#rainbowsPreview').data('colors') || '') + ')Some Example Text=-');
					controls.updateTextareaSelection(textarea, selectionStart + 4, selectionEnd + 21);
				} else {
					controls.wrapSelectionInTextareaWith(textarea, '-=(' + ($('#rainbowsPreview').data('colors') || '') + ')', '=-');
					controls.updateTextareaSelection(textarea, selectionStart + 4, selectionEnd + 4);
				}

				preview.render($(textarea).parent().parent().parent());
			});
		});

		rainbowsModalEvents();
	}

	require(['composer'], function (composer) {
		composer.addButton('rainbows', function(textarea, selectionStart, selectionEnd) {
			$('#rainbows-modal').modal();
			$('#rainbowsPreview').html($(textarea).val().slice(selectionStart, selectionEnd) || "Some Example Text");
			$('#rainbowsPreview').data('colors', null);
			$('#rainbowsPreview').data('el', textarea);
			$('#rainbowsPreview').data('start', selectionStart);
			$('#rainbowsPreview').data('end', selectionEnd);
		});
	});
});

function rainbowsModalEvents() {
	require(['vendor/colorpicker/colorpicker'], function (){
		$('#picker-button').ColorPicker({
			onBeforeShow: function () {
				$(this).ColorPickerSetColor($('#color-custom').find('div').first().css('background-color'));
			},
			onChange: function (hsb, hex, rgb) {
				$('#color-custom').find('div').first().css('background-color', '#' + hex).data('color', '#' + hex);
			}
		});
	});

	$('.color-preset, #color-custom').on('click', function () {
		if (!$('#rainbowsPreview').data('colors')) {
			$('#rainbowsPreview').data('colors', $(this).find('div').data('color'));
		}else{
			$('#rainbowsPreview').data('colors', $('#rainbowsPreview').data('colors') + ',' + $(this).find('div').data('color'));
		}
		rainbowsPreview();
	});

	$('#rainbows-remove-one').on('click', function () {
		var colors = $('#rainbowsPreview').data('colors'),
			clip = colors.lastIndexOf(",");

		if (~clip) {
			colors = colors.slice(0, clip);
			$('#rainbowsPreview').data('colors', colors);
			rainbowsPreview();
		}else{
			$('#rainbowsPreview').data('colors', null);
			$('#rainbowsPreview').html($('#rainbowsPreview').text());
		}
	});

	$('#rainbows-remove-all').on('click', function () {
		$('#rainbowsPreview').data('colors', null);
		$('#rainbowsPreview').html($('#rainbowsPreview').text());
	});
}

function rainbowsPreview() {
	socket.emit('plugins.rainbows.rainbowify', {text: '-=(' + ($('#rainbowsPreview').data('colors') || '') + ')' + $('#rainbowsPreview').text() + '=-'}, function (err, data) {
		if (err) console.log(err);
		$('#rainbowsPreview').html(data);
	});
}
