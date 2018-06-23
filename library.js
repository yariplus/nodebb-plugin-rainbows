// nodebb-plugin-rainbows
// library.js

const NodeBB = module => require.main.require(module)
const async = NodeBB('async')
const meta = NodeBB('./src/meta')
const user = NodeBB('./src/user')
const topics = NodeBB('./src/topics')
const plugins = NodeBB('./src/plugins')
const Settings = NodeBB('./src/settings')
const emitter = NodeBB('./src/emitter')
const SocketAdmin = NodeBB('./src/socket.io/admin')
const SocketPlugins = NodeBB('./src/socket.io/plugins')

const RainbowVis = require('./lib/rainbowvis.js')

// Themes in use
let themes = { }

// Default settings
const defaultSettings = {
  themes: [
    { name: 'flutter', value: 'magenta,yellow' },
    { name: 'dashie', value: 'red,orange,yellow,green,blue,purple' },
    { name: 'sunbutt', value: 'lightblue,lightpink,lightgreen' }
  ],
  postsEnabled: 1,
  tagsEnabled: 1,
  topicsEnabled: 1,
  postsModsOnly: 0,
  topicsModsOnly: 0,
  hueModifier: 0,
  lumModifier: 40
}

// Settings object
let settings

// Best. Regex. Ever.
let regex = /-=((?:\([^\)]*\))?)([^\0]*?)=-/g

// Remove color from all widgets for now.
emitter.on('nodebb:ready', function () {
  let hooked = {}
  Object.keys(plugins.loadedHooks).filter(function (hook) {
    return hooked.hasOwnProperty(hook) ? false : (hooked[hook] = true)
  }).forEach(function (hook) {
    if (hook.match('filter:widget.render:')) {
      plugins.loadedHooks[hook].push({
        id: 'nodebb-plugin-rainbows',
        method: exports.parseController
      })
    }
  })
})

exports.onLoad = function (params, cb) {
  let router = params.router
  let middleware = params.middleware

  settings = new Settings('rainbows', '1.2.0', defaultSettings, loadSettings)

  function renderAdmin (req, res, next) {
    res.render('admin/plugins/rainbows', {})
  }

  router.get('/admin/plugins/rainbows', middleware.admin.buildHeader, renderAdmin)
  router.get('/api/admin/plugins/rainbows', renderAdmin)

  SocketAdmin.settings.syncRainbows = function () {
    settings.sync(loadSettings)
  }

  SocketPlugins.rainbows = {
    colorPost: function (socket, data, next) {
      topics.getTopicField(data.tid, 'cid', function (err, cid) {
        parsePost(socket.uid, cid, data.content, next)
      })
    },
    colorTopic: function (socket, data, next) {
      if (data.uid === -1) next(null, remove(data.title))
      if (data.uid === -2) next(null, parse(data.title))
      parseTopicTitle(data.uid, data.cid, data.title, next)
    },
    colorTopics: function (socket, data, next) {
      parseTopics(data.topics, next)
    }
  }

  function loadSettings () {
    themes = {}
    settings.get('themes').forEach(function (theme) {
      themes[theme.name] = theme.value
    })
    settings.set('themes', themes)
  }

  cb()
}

function hasPerms (uid, cid, cb) {
  async.parallel({
    isAdminOrGlobalMod: async.apply(user.isAdminOrGlobalMod, uid),
    isModerator: async.apply(user.isModerator, uid, cid)
  }, function (err, results) {
    cb(err, results ? (results.isAdminOrGlobalMod || results.isModerator) : false)
  })
}

function readOption (options, option) {
  option = option.split(':')
  if (option.length > 1 && option[0] !== '' && option[1] !== '') {
    switch (option[0]) {
      case 'range':
        options.range = Math.floor(parseInt(option[1]))
        options.range = options.range > -1 && options.range < 9000 ? options.range : 0
        break
      case 'theme':
        if (themes.hasOwnProperty(option[1]) && !!themes[option[1]]) {
          themes[option[1]].replace(/ */g, '').split(',').forEach(function (val) {
            if (val !== '') {
              readOption(options, val)
            }
          })
        }
        break
      case 'bg':
      case 'bgcolor':
        options.bgcolor = option[1]
        break
      default:
        break
    }
  } else {
    if (option[0] === 'mirror') {
      options.mirror = true
    } else {
      options.colors.push(option[0])
    }
  }
}

exports.adminHeader = function (custom_header, cb) {
  custom_header.plugins.push({
    'route': '/plugins/rainbows',
    'icon': '',
    'name': '<div class="rb-nav"><img src="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAGXRFWHRTb2Z0d2FyZQBBZG9iZSBJbWFnZVJlYWR5ccllPAAAAj5JREFUeNqkVEtrE1EYPZM7j7ya2KaJSW3AWgxiMUWCgojaaLNy4cKVIP0D1a1QUNSfYf+AuBBx3YURdGOTjRu1SogNmATa0OadzON6JtRFi7aKA2eymHse3+NGkVLifx5FZjL/ct4gNMJ1HaJQMNW/IHmIyT04UNFGAh0ch+l+PEpggjg/cp7GLq6giXMQiEBx0x8lME9cQhgD3CL5IvodTWjrCKlrGPeU4FWeHyJwnVjEWUZdwk5nXAxfItp7gZhehyagTwj4p/+YYIG4iwvo8+0peX3WI8yYX5RAH+G5LmI5HfqsQFv9rcAp4h6dBcmdojeEFczYDT1qI3lnADHfRRltveqo0VpLwdLYPgF3PCuseYqx+3QWJCsNX5Ky921UIwP/Z6uXLtZaqa/bmrdnebCU2Sdwg7jKhg1Ys8bYKp1VkgXKEZz40LIX8uX+se6weTIA43SCKQ+UsMxR+dltjQ0zWLPB2DqddZLF4loJcWmZ2Sm0J3U0Do4xTVzmnB2OSme3LYTmDNZsMLZBZ51k7WYC8Ats8ewmsfNry9wnRymDS+LlnH0cVQDxXBDfEU4X6xHGjmdjSJIc4tnXbyvF2tP3q6NLpGY3NvAmlbrG9dS4YZJLIjlntnTW0X84Dhtms+YAYwdJfPjk3Wo9v1kcuT7GM6j5VitSMc0zSlAKpwZ8dCwM/AZk55sMFZrYqpXkMCLletWs3H714NN2b9dd7+7oMvFuuI3wE2OEOGStHcIizD2i+2vzr0D+FGAARenLmDXrT3oAAAAASUVORK5CYII="><b style="color:#ff0000">R</b><b style="color:#ff6000">a</b><b style="color:#ffbf00">i</b><b style="color:#dfff00">n</b><b style="color:#7fff00">b</b><b style="color:#20ff00">o</b><b style="color:#00bf40">w</b><b style="color:#00609f">s</b></div>'
  })
  // Image is rainbow-icon.png from:
  // http://p.yusukekamiyamane.com/
  // CC-BY

  cb(null, custom_header)
}

function parse (text) {
  if (!text) return text

  let pattern = /-=[^\0]+?=-/g
  let matches = text.match(pattern) || []

  if (matches.length === 0) return text

  matches.forEach(function (match) {
    let sliced = match.slice(2, match.length - 2),
      trimmed = sliced,
      characters,
      rainbow = new RainbowVis(),
      html = {},
      options = {
        range: 0,
        colors: [],
        bgcolor: '',
        mirror: false
      }

    let postOptions = sliced.match(/^\([^\)]*\)/)

    if (postOptions) {
      sliced = sliced.replace(postOptions[0], '')
      trimmed = sliced

      postOptions = postOptions[0].slice(1, postOptions[0].length - 1).replace(/ */g, '').split(',')

      postOptions.forEach(function (option) {
        if (option !== '') {
          readOption(options, option)
        }
      })
    }

    characters = sliced.replace(/<[^>]*>/gm, '').replace(/(\r\n|\n|\r| |\t)*/gm, '').length

    if (!characters) return

    if (options.colors.length > 0) {
      if (options.colors.length === 1) options.colors[1] = options.colors[0]

      if (options.range === 0) {
        options.range = characters > 1 ? characters : 2
      } else {
        options.range = options.range > options.colors.length ? options.range : options.colors.length
      }
    } else {
      options.colors = [ 'red', 'orange', 'gold', 'lime', 'deepskyblue', 'blue', 'blueviolet', 'magenta']

      if (options.range === 0) {
        options.range = characters > 8 ? characters : 8
      } else {
        options.range = options.range > 8 ? options.range : 8
      }
    }

    try {
      rainbow.setSpectrumByArray(options.colors)
    } catch (e) {
      text = text.replace(match, sliced)
      return
    }

    rainbow.setNumberRange(0, options.range - 1)

    let parsed = '',
      offset = 0

    while (trimmed.length) {
      let c = trimmed.charAt(0)

      if (c.match(/(\n|\r)/)) {
        parsed += '<br>'
        trimmed = trimmed.substr(1)
      } else if (c.match(/ /)) {
        parsed += ' '
        trimmed = trimmed.substr(1)
      } else if (trimmed.match(/^<\/p><p>/)) {
        parsed += '<br /><br />'
        trimmed = trimmed.replace(/^<\/p><p>/, '')
      } else if (trimmed.match(/^<[^>]*>/)) {
        parsed += trimmed.match(/^<[^>]*>/)[0]
        trimmed = trimmed.replace(/^<[^>]*>/, '')
      } else {
        parsed += '<span style="color:#' + rainbow.colourAt(offset % options.range) + '">' + trimmed.charAt(0) + '</span>'
        trimmed = trimmed.substr(1)
        offset++
      }
    }

    if (options.bgcolor) parsed = '<span style="background-color:' + options.bgcolor + '">' + parsed + '</span>'

    parsed = '<span class="rainbowified">' + parsed + '</span>'

    text = text.replace(match, parsed)
  })

  return text
}

function remove (content) {
  let arr
  while ((arr = regex.exec(content)) !== null) {
    content = content.replace(arr[0], arr[2])
  }
  return content
}

exports.parseRaw = function (content, cb) {
  cb(null, parse(content))
}

exports.parseSignature = function (data, cb) {
  if (settings.get('postsEnabled')) {
    data.userData.signature = parse(data.userData.signature)
  } else {
    data.userData.signature = remove(data.userData.signature)
  }
  cb(null, data)
}

exports.parsePost = function (data, cb) {
  topics.getTopicField(data.tid, 'cid', function (err, cid) {
    parsePost(data.postData.uid, cid, data.postData.content, function (err, content) {
      data.postData.content = content
      cb(null, data)
    })
  })
}

function parsePost (uid, cid, content, cb) {
  if (!settings.get('postsEnabled')) return cb(new Error('Not allowed to post colors.'), remove(content))
  if (!settings.get('postsModsOnly')) return cb(null, parse(content))

  hasPerms(uid, cid, function (err, hasPerms) {
    cb(hasPerms ? null : new Error('Not allowed post colors.'), hasPerms ? parse(content) : remove(content))
  })
}

exports.parseTopic = function (data, cb) {
  parseTopicTitle(data.templateData.uid, data.templateData.cid, data.templateData.title, function (err, title) {
    data.templateData.title = title
    cb(null, data)
  })
}

// Pass back an array of parsed topics only.
function parseTopics (topicsData, cb) {
  if (!settings.get('topicsEnabled')) return cb()

  async.map(topicsData, function (topic, next) {
    topics.getTopicFields(topic.tid, ['cid', 'uid'], function (err, fields) {
      parseTopicTitle(fields.uid, fields.cid, topic.title, function (err, title) {
        topic.uid = fields.uid
        topic.cid = fields.cid
        topic.title = title
        next(null, topic)
      })
    })
  }, function (err, topicsData) {
    cb(null, {topics: topicsData})
  })
};
function parseTopicsAll (topicsData, cb) {
  if (!settings.get('topicsEnabled')) return cb()

  async.map(topicsData, function (topic, next) {
    topics.getTopicFields(topic.tid, ['cid', 'uid'], function (err, fields) {
      parseTopicTitle(fields.uid, fields.cid, topic.title, function (err, title) {
        topic.title = title
        next(null, topic)
      })
    })
  }, cb)
};

function parseTopicTitle (uid, cid, title, cb) {
  if (!settings.get('topicsEnabled')) return cb(new Error('Not allowed to use colors in topic titles.'), remove(title))
  if (!settings.get('topicsModsOnly')) return cb(null, parse(title))

  hasPerms(uid, cid, function (err, hasPerms) {
    cb(hasPerms ? null : new Error('Not allowed to use colors in topic titles.'), hasPerms ? parse(title) : remove(title))
  })
}

exports.configGet = function (data, next) {
  data.rainbows = {}
  data.rainbows.postsEnabled = parseInt(settings.get('postsEnabled'), 10) === 1
  data.rainbows.postsModOnly = parseInt(settings.get('postsModOnly'), 10) === 1
  data.rainbows.tagsEnabled = parseInt(settings.get('tagsEnabled'), 10) === 1
  data.rainbows.topicsEnabled = parseInt(settings.get('topicsEnabled'), 10) === 1
  data.rainbows.topicsModsOnly = parseInt(settings.get('topicsModsOnly'), 10) === 1
  data.rainbows.hueModifier = parseInt(settings.get('hueModifier'), 10) || 0
  data.rainbows.lumModifier = parseInt(settings.get('lumModifier'), 10) || 40

  next(null, data)
}

exports.renderHeader = function (data, cb) {
  data.templateValues.browserTitle = remove(data.templateValues.browserTitle)
  cb(null, data)
}

// Doesn't work.
exports.getTopic = function (data, cb) {
  // data.topic.title = remove(data.topic.title);
  cb(null, data)
}

exports.parseController = function (data, cb) {
  if (!data) return cb(null, data)

  if (data.templateData && data.templateData.topics) {
    async.each(data.templateData.topics, function (topic, next) {
      parseTopicTitle(topic.uid, topic.cid, topic.title, function (err, title) {
        topic.title = title
        next()
      })
    }, function () {
      cb(null, data)
    })
  } else if (typeof data === 'string') {
    cb(null, remove(data))
  } else {
    cb(null, data)
  }
}
