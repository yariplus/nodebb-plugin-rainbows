if (config.rainbows.postsEnabled) {
  var rainbowModalBody = String() +
	'<label>Selected Text</label><br>' +
	'<div class="panel panel-default">' +
	'<div class="panel-body">' +
	'<span id="rainbowsPreview"><span>' +
	'</div></div>' +

	'<label>Add a Color</label><br>' +
	'<button class="btn btn-default color-preset"><div style="background-color:red;width:20px;height:20px;" data-color="red"></div></button>' +
	'<button class="btn btn-default color-preset"><div style="background-color:orange;width:20px;height:20px;" data-color="orange"></div></button>' +
	'<button class="btn btn-default color-preset"><div style="background-color:yellow;width:20px;height:20px;" data-color="yellow"></div></button>' +
	'<button class="btn btn-default color-preset"><div style="background-color:lime;width:20px;height:20px;" data-color="lime"></div></button>' +
	'<button class="btn btn-default color-preset"><div style="background-color:cyan;width:20px;height:20px;" data-color="cyan"></div></button>' +
	'<button class="btn btn-default color-preset"><div style="background-color:blue;width:20px;height:20px;" data-color="blue"></div></button>' +
	'<button class="btn btn-default color-preset"><div style="background-color:blueviolet;width:20px;height:20px;" data-color="blueviolet"></div></button>' +
	'<button class="btn btn-default color-preset"><div style="background-color:violet;width:20px;height:20px;" data-color="violet"></div></button>' +
	'<button class="btn btn-default color-preset"><div style="background-color:magenta;width:20px;height:20px;" data-color="magenta"></div></button>' +

	'<button class="btn btn-default color-preset"><div style="background-color:maroon;width:20px;height:20px;" data-color="maroon"></div></button>' +
	'<button class="btn btn-default color-preset"><div style="background-color:sienna;width:20px;height:20px;" data-color="sienna"></div></button>' +
	'<button class="btn btn-default color-preset"><div style="background-color:olive;width:20px;height:20px;" data-color="olive"></div></button>' +
	'<button class="btn btn-default color-preset"><div style="background-color:green;width:20px;height:20px;" data-color="green"></div></button>' +
	'<button class="btn btn-default color-preset"><div style="background-color:teal;width:20px;height:20px;" data-color="teal"></div></button>' +
	'<button class="btn btn-default color-preset"><div style="background-color:navy;width:20px;height:20px;" data-color="navy"></div></button>' +
	'<button class="btn btn-default color-preset"><div style="background-color:purple;width:20px;height:20px;" data-color="purple"></div></button>' +

	'<button class="btn btn-default color-preset"><div style="background-color:white;width:20px;height:20px;" data-color="white"></div></button>' +
	'<button class="btn btn-default color-preset"><div style="background-color:silver;width:20px;height:20px;" data-color="silver"></div></button>' +
	'<button class="btn btn-default color-preset"><div style="background-color:gray;width:20px;height:20px;" data-color="gray"></div></button>' +
	'<button class="btn btn-default color-preset"><div style="background-color:black;width:20px;height:20px;" data-color="black"></div></button>' +

	'<br>' +
	'<button class="btn btn-default" id="picker-button"><div style="height:20px;">&nbsp;<i class="fa fa-cog"></i>&nbsp;Custom&nbsp;Color&nbsp;</div></button>' +
	'<button class="btn btn-default" id="color-custom"><div style="background-color:pink;width:20px;height:20px;" data-color="pink"></div></button>' +

	'<br><br>' +
	'<label>Remove a Color</label><br>' +
	'<button class="btn btn-default" id="rainbows-remove-one"><div style="height:20px;">&nbsp;<i class="fa fa-minus"></i>&nbsp;One&nbsp;</div></button>' +
	'<button class="btn btn-default" id="rainbows-remove-all"><div style="height:20px;">&nbsp;<i class="fa fa-minus"></i>&nbsp;All&nbsp;</div></button>'

  var rainbowsComposerModal = String() +
	'<div class="modal fade" tabindex="-1" id="rainbows-modal" role="dialog">' +
	'<div class="modal-dialog">' +
	'<div class="modal-content">' +
	'<div class="modal-header">' +
	'<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>' +
	'<h4 class="modal-title">Rainbows</h4>' +
	'</div>' +
	'<div class="modal-body">' +
	rainbowModalBody +
	'</div>' +
	'<div class="modal-footer">' +
	'<button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>' +
	'<button type="button" class="btn btn-primary" data-dismiss="modal" id="rainbows-insert">Insert</button>' +
	'</div>' +
	'</div><!-- /.modal-content -->' +
	'</div><!-- /.modal-dialog -->' +
	'</div>'

  // Composer
  $('body').append(rainbowsComposerModal)

  $('#rainbows-insert').on('click', function (e) {
    require(['composer/controls', 'composer/preview'], function (controls, preview) {
      const selectionStart = $('#rainbowsPreview').data('start')
      const selectionEnd = $('#rainbowsPreview').data('end')
      const textarea = $('#rainbowsPreview').data('el')

      let colors = $('#rainbowsPreview').data('colors') || ''
      if (colors) colors = `(${colors})`

      if (selectionStart === selectionEnd) {
        controls.insertIntoTextarea(textarea, '~[Some Example Text]~' + colors)
        controls.updateTextareaSelection(textarea, selectionStart + 2, selectionEnd + 19)
      } else {
        controls.wrapSelectionInTextareaWith(textarea, '~[', ']~' + colors)
        controls.updateTextareaSelection(textarea, selectionStart + 2, selectionEnd + 2)
      }

      preview.render($(textarea).parent().parent().parent())
    })
  })

  require(['composer'], function (composer) {
    composer.addButton('rainbows', function (textarea, selectionStart, selectionEnd) {
      $('#rainbows-modal').modal()
      $('#rainbowsPreview').data('selection', $(textarea).val().slice(selectionStart, selectionEnd) || 'Some Example Text')
      $('#rainbowsPreview').data('colors', null)
      $('#rainbowsPreview').data('el', textarea)
      $('#rainbowsPreview').data('start', selectionStart)
      $('#rainbowsPreview').data('end', selectionEnd)
      rainbowsPreview()
    })
  })

  rainbowsModalEvents()

  $(window).on('action:ajaxify.contentLoaded', function (e, data) {
    if (data.tpl.slice(0, 5) === 'admin') return

    if (config.rainbows.tagsEnabled) {
      var letters = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z']

      $('[data-tag], .tag').each(function () {
        var $tag = $(this)
        var tag = $tag.attr('data-tag') || $tag.text()
        var x = tag.charAt(0) || 'm'
        var y = tag.charAt(1) || 'm'
        var z = tag.charAt(2) || 'm'
        x = x.toLowerCase()
        y = y.toLowerCase()
        z = z.toLowerCase()
        x = letters.indexOf(x)
        y = letters.indexOf(y)
        z = letters.indexOf(z)
        x = x === -1 ? 12 : x
        y = y === -1 ? 12 : y
        z = z === -1 ? 12 : z
        var hue = (x * 14 + z * 28 + config.rainbows.hueModifier) % 360
        var sat = 100 - z
        var lum = 95 - y / 6 - (config.rainbows.lumModifier > 80 || config.rainbows.lumModifier < 0 ? 40 : config.rainbows.lumModifier)
        var color = 'hsl(' + hue + ',' + sat + '%,' + lum + '%)'
        $tag.css('color', color)
      })
    }
  })

  function getRandomColorStyle () {
    var	hue = Math.round(Math.random() * 360) + config.rainbows.hueModifier
    var	sat = Math.round(90 - Math.random() * 20)
    var	lum = Math.round(90 - Math.random() * 20)

    hue = hue > 360 ? hue - 360 : hue

    return 'hsl(' + hue + ',' + sat + '%,' + lum + '%)'
  }

  function rainbowsModalEvents () {
    require(['vendor/colorpicker/colorpicker'], function () {
      $('#picker-button').ColorPicker({
        onBeforeShow: function () {
          $(this).ColorPickerSetColor($('#color-custom').find('div').first().css('background-color'))
        },
        onChange: function (hsb, hex, rgb) {
          $('#color-custom').find('div').first().css('background-color', '#' + hex).data('color', '#' + hex)
        }
      })
    })

    $('.color-preset, #color-custom').on('click', function () {
      if (!$('#rainbowsPreview').data('colors')) {
        $('#rainbowsPreview').data('colors', $(this).find('div').data('color'))
      } else {
        $('#rainbowsPreview').data('colors', $('#rainbowsPreview').data('colors') + ',' + $(this).find('div').data('color'))
      }
      rainbowsPreview()
    })

    $('#rainbows-remove-one').on('click', function () {
      let colors = $('#rainbowsPreview').data('colors')
      let clip = colors ? colors.lastIndexOf(',') : false

      if (colors && ~clip) {
        $('#rainbowsPreview').data('colors', colors.slice(0, clip))
      } else {
        $('#rainbowsPreview').data('colors', null)
      }
      rainbowsPreview()
    })

    $('#rainbows-remove-all').on('click', function () {
      $('#rainbowsPreview').data('colors', null)
      rainbowsPreview()
    })
  }

  function rainbowsPreview () {
    require(['composer'], function (composer) {
      socket.emit('plugins.rainbows.colorPost', '~[' + $('#rainbowsPreview').data('selection') + ']~(' + ($('#rainbowsPreview').data('colors') || '') + ')', function (err, data) {
        if (err) console.log(err)
        $('#rainbowsPreview').html(data)
      })
    })
  }
}

if (config.rainbows.navbarEnabled) {
  $(window).on('action:ajaxify.end', function (event, data) {
    $('[component="navbar"]').css('background-color', getRandomColorStyle())
  })
}

if (config.rainbows.topicsEnabled) {
  $(window).on('action:posts.edited', function (ev, data) {
    if (data.topic.oldTitle) {
      var title = $('<i>').append(data.topic.title).text()
      socket.emit('plugins.rainbows.colorTopic', {uid: data.topic.uid, cid: data.topic.cid, title: title}, function (err, title) {
        $('[component="topic/title"]').html(title)
        $('[component="breadcrumb/current"]').html(title)
      })
    }
  })

  $(window).on('action:categories.new_topic.loaded', function () {
  })

  $(window).on('action:topic.loaded', function () {
    var title = $('<i>').append(ajaxify.data.title).text()
    socket.emit('plugins.rainbows.colorTopic', {uid: ajaxify.data.uid, cid: ajaxify.data.cid, title: title}, function (err, title) {
      $('[component="topic/title"]').html(title)
      $('[component="breadcrumb/current"]').html(title)
    })
  })

  $(window).on('action:topics.loaded', function (ev, data) {
    socket.emit('plugins.rainbows.colorTopics', data, function (err, result) {
      result.topics.forEach(function (topic) {
        $('[data-tid="' + topic.tid + '"] [itemprop="url"]').html(topic.title)
      })
    })
  })
}

// TODO
// Recent Cards
$(window).on('action:ajaxify.end', function () {
  var regex = /-=((?:\([^\)]*\))?)([^\0]*?)=-/g
  var parse = config.rainbows.topicsEnabled && !config.rainbows.topicsModsOnly
  $('.category-info > a > h4').each(function () {
    var that = $(this)
    var text = $(this).text()
    var html = $(this).html()
    if (text.match(regex)) {
      if (parse) {
        socket.emit('plugins.rainbows.colorTopic', {uid: -2, title: html}, function (err, html) {
          that.html(html)
        })
      } else {
        socket.emit('plugins.rainbows.colorTopic', {uid: -1, title: text}, function (err, text) {
          that.text(text)
        })
      }
    }
  })
})
