// YOUR LIFE IS CURRENCY

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

var DEBUG = false;
var AssetBase = '/jumpcoins/assets';

var config = {
  debug: DEBUG,
  type: Phaser.AUTO,
  parent: 'engine',
  width: 800,
  height: 600,
  input: {
    gamepad: true
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 400 },
      debug: false // will be populated based on dat.gui just in time
    }
  },
  scene: {
    preload: preload_jumpcoins,
    create: create_jumpcoins,
    update: update_jumpcoins
  },
  levels: ['/maps/hello.map', '/maps/doublejump.map', '/maps/doublejump-f.map', '/maps/doublejump-a.map', '/maps/doublejump-b.map', '/maps/doublejump-c.map', '/maps/doublejump-g.map', '/maps/doublejump-d.map', '/maps/doublejump-e.map', '/maps/doublejump-bb.map', '/maps/walljump.map', '/maps/walljump-b.map', '/maps/walljump-c.map', '/maps/walljump-d.map', '/maps/walljump-e.map', '/maps/walljump-f.map', '/maps/walljump-h.map', '/maps/walljump-g.map', '/maps/walljump-a.map', '/maps/stairs.map', '/maps/bye.map'],
  mapWidth: 30,
  mapHeight: 22,
  tileWidth: 24,
  tileHeight: 24,
  tileDefinitions: {
    '.': null, // background
    '#': {
      image: 'tileWall',
      group: 'ground',
      combineVertical: true
    },
    '+': {
      image: 'tileTransparent',
      group: 'exits',
      object: true
    },
    '^': {
      image: 'tileSpikesUp',
      group: 'spikes',
      knockback: true,
      animate: [0, 1]
    },
    'v': {
      image: 'tileSpikesDown',
      group: 'spikes',
      knockback: true,
      animate: [0, -1]
    },
    '<': {
      image: 'tileSpikesLeft',
      group: 'spikes',
      knockback: 'right',
      animate: [1, 0]
    },
    '>': {
      image: 'tileSpikesRight',
      group: 'spikes',
      knockback: 'left',
      animate: [-1, 0]
    },
    '0': {
      image: 'tileEye',
      group: 'eyes',
      object: true
    },
    '_': {
      image: 'tileSemiground',
      group: 'semiground'
    },
    '[': {
      image: 'tileWall',
      group: 'movers',
      object: true,
      dynamic: true,
      speed: 40,
      distance: 3,
      movingLeft: true
    },
    ']': {
      image: 'tileWall',
      group: 'movers',
      object: true,
      dynamic: true,
      speed: 40,
      distance: 3
    },
    '@': null, // player
    '*': {
      image: 'spriteFreebie',
      group: 'freebies',
      object: true
    },
    '?': {
      image: 'tileTransparent',
      group: 'removeHints',
      object: true
    },
    'A': {
      image: 'spriteEnemyA',
      group: 'enemies',
      object: true,
      dynamic: true,
      speed: 30,
      walkAnimation: 'spriteEnemyAWalk',
      killAnimation: 'spriteEnemyADie'
    },
    'a': {
      image: 'spriteEnemyA',
      group: 'enemies',
      object: true,
      dynamic: true,
      startsMovingLeft: true,
      speed: 30,
      walkAnimation: 'spriteEnemyAWalk',
      killAnimation: 'spriteEnemyADie'
    },
    'B': {
      image: 'spriteEnemyB',
      group: 'enemies',
      object: true,
      dynamic: true,
      edgeCareful: true,
      speed: 30,
      walkAnimation: 'spriteEnemyBWalk',
      killAnimation: 'spriteEnemyBDie'
    },
    'b': {
      image: 'spriteEnemyB',
      group: 'enemies',
      object: true,
      dynamic: true,
      edgeCareful: true,
      startsMovingLeft: true,
      speed: 30,
      walkAnimation: 'spriteEnemyBWalk',
      killAnimation: 'spriteEnemyBDie'
    }
  },

  // filled in next
  xBorder: 0,
  yBorder: 0
};

var SaveStateName = 'jumpcoins_save';
var save = {
  created_at: Date.now(),
  current_level: 0,
  levels: config.levels.map(function (levelFile) {
    return {
      temp_time_ms: 0,
      total_time_ms: 0,
      best_time_ms: undefined,
      damage_taken: 0,
      jumps: 0,
      doublejumps: 0,
      walljumps: 0,
      deaths: 0,
      badgeCompleted: false,
      badgeDeathless: false,
      badgeDamageless: false,
      badgeRich: false,
      badgeBirdie: false,
      badgeKiller: false
    };
  })
};

try {
  var storedSave = localStorage.getItem(SaveStateName);
  if (storedSave) {
    save = JSON.parse(storedSave);
  }
} catch (e) {
  // eslint-disable-next-line no-console
  console.log(e);
}

function saveState() {
  save.levels[state.level.index].temp_time_ms = new Date().getTime() - state.level.startedAt.getTime();

  try {
    localStorage.setItem(SaveStateName, JSON.stringify(save));
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
}

var JUMP_NORMAL = 1;
var JUMP_DOUBLE = 2;
var JUMP_WALL = 3;

{
  var width = config.width,
      height = config.height,
      mapWidth = config.mapWidth,
      mapHeight = config.mapHeight,
      tileWidth = config.tileWidth,
      tileHeight = config.tileHeight;

  config.xBorder = (width - mapWidth * tileWidth) / 2;
  config.yBorder = (height - mapHeight * tileHeight) / 2;

  Object.keys(config.tileDefinitions).forEach(function (glyph) {
    if (config.tileDefinitions[glyph]) {
      config.tileDefinitions.glyph = glyph;
    }
  });
}

var state = {
  game: null,
  physics: null,
  cursors: null,
  keys: {},
  debug: null,
  level: {},
  commands: {}
};

var props = {
  invincibility_ms: 2000,
  min_ignore_input_ms: 50,
  'spike_knockback.x': 40,
  'spike_knockback.y': 100,
  'velocityX.walk': 200,
  'velocityX.jump': 200,
  'velocityX.double_jump': 75,
  'velocityX.wall_jump': 600,
  'velocityX.reversed_wall_jump': 100,
  'velocityY.jump': 260,
  'velocityY.double_jump': 350,
  'velocityY.wall_jump': 175,
  wall_jump_ignore_direction_ms: 400,

  time: 0.01,
  frameTime: 0.01,

  'level.name': '',
  'level.index': -1,
  'level.file': '',
  'level.timers': 0,

  'input.upButtonDown': false,
  'input.downButtonDown': false,
  'input.leftButtonDown': false,
  'input.rightButtonDown': false,
  'input.jumpButtonDown': false,

  'keyboard.Z': false,
  'keyboard.X': false,
  'keyboard.C': false,
  'keyboard.up': false,
  'keyboard.down': false,
  'keyboard.left': false,
  'keyboard.right': false,

  'gamepad.A': false,
  'gamepad.B': false,
  'gamepad.X': false,
  'gamepad.Y': false,
  'gamepad.L1': false,
  'gamepad.L2': false,
  'gamepad.R1': false,
  'gamepad.R2': false,
  'gamepad.up': false,
  'gamepad.down': false,
  'gamepad.left': false,
  'gamepad.right': false,
  'gamepad.l_stick.x': 0.01,
  'gamepad.l_stick.y': 0.01,
  'gamepad.r_stick.x': 0.01,
  'gamepad.r_stick.y': 0.01,

  'player.life': 0,
  'player.x': 0.01,
  'player.y': 0.01,
  'player.velocity.x': 0.01,
  'player.velocity.y': 0.01,
  'player.invincible': false,
  'player.ignoreInput': false,
  'player.canCancelIgnoreInput': false,
  'player.canDoubleJump': false,
  'player.isDoubleJumping': false,
  'player.canWallJump': false,
  'player.isWallJumping': false,
  'player.wallJumpIgnoreDirection': false,
  'player.wallJumpContinuing': false,
  'player.wallJumpDirectionLeft': false,
  'player.wallJumpHeld': false,
  'player.wallJumpContra': false,
  'player.touching.up': false,
  'player.touching.down': false,
  'player.touching.left': false,
  'player.touching.right': false,
  'player.freebies': 0,
  'player.squish.max': 0.10,
  'player.squish.speed': 0.2,
  'player.grab.max_y': 50,

  'cheat.hearty': false,
  'cheat.forbidDoubleJump': false,
  'cheat.forbidWallJump': false,

  'effect.damageBlur.amount': 2.5,
  'effect.damageBlur.in_ms': 100,
  'effect.damageBlur.out_ms': 200,

  'effect.shockwave.scale': 10.0,
  'effect.shockwave.range': 0.8,
  'effect.shockwave.thickness': 0.1,
  'effect.shockwave.speed': 3.0,
  'effect.shockwave.inner': 0.09,
  'effect.shockwave.dropoff': 40.0,

  'effect.jumpshake.amount': 0.01,
  'effect.jumpshake.duration_ms': 75,

  'physics.debug': false,

  winLevel: () => window.state.commands.winLevel(),
  restartLevel: () => window.state.commands.restartLevel(),
  previousLevel: () => window.state.commands.previousLevel(),
  damageBlur: () => window.state.commands.damageBlur(),
  deathShockwave: () => window.state.commands.deathShockwave(),
  jumpShake: () => window.state.commands.jumpShake(),
};

function prop(name) {
  if (DEBUG && name in window.props) {
    return window.props[name];
  }

  if (name.match(/^cheat\./)) {
    return false;
  }

  return props[name];
}

function listenProp(name, value) {
  if (!DEBUG) {
    return;
  }

  window.props[name] = value;
}

var Shader = new Phaser.Class({
  Extends: Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline,
  initialize: function Shader(game) {
    Phaser.Renderer.WebGL.Pipelines.TextureTintPipeline.call(this, {
      game: game,
      renderer: game.renderer,
      fragShader: '\n        precision mediump float;\n        uniform vec2      resolution;\n        uniform sampler2D u_texture;\n        varying vec2      outTexCoord;\n\n        uniform float shockwaveTime;\n        uniform vec2  shockwaveCenter;\n\n        uniform float blurEffect;\n\n        void main( void ) {\n          vec2 uv = outTexCoord;\n\n          if (shockwaveTime < 10.0) {\n            float shockwaveScale = 10.0;\n            float shockwaveRange = 0.8;\n            float shockwaveThickness = 0.1;\n            float shockwaveSpeed = 3.0;\n            float shockwaveInner = 0.09;\n            float shockwaveDropoff = 40.0;\n\n            float dist = distance(uv, shockwaveCenter);\n            float t = shockwaveTime * shockwaveSpeed;\n\n            if (dist <= t + shockwaveThickness && dist >= t - shockwaveThickness && dist >= shockwaveInner) {\n              float diff = dist - t;\n              float scaleDiff = 1.0 - pow(abs(diff * shockwaveScale), shockwaveRange);\n              float diffTime = diff * scaleDiff;\n\n              vec2 diffTexCoord = normalize(uv - shockwaveCenter);\n              uv += (diffTexCoord * diffTime) / (t * dist * shockwaveDropoff);\n            }\n          }\n\n          vec4 c = texture2D(u_texture, uv);\n\n          if (blurEffect > 0.0) {\n            float b = blurEffect / resolution.x;\n            c *= 0.2270270270;\n\n            c += texture2D(u_texture, vec2(uv.x - 4.0*b, uv.y - 4.0*b)) * 0.0162162162;\n            c += texture2D(u_texture, vec2(uv.x - 3.0*b, uv.y - 3.0*b)) * 0.0540540541;\n            c += texture2D(u_texture, vec2(uv.x - 2.0*b, uv.y - 2.0*b)) * 0.1216216216;\n            c += texture2D(u_texture, vec2(uv.x - 1.0*b, uv.y - 1.0*b)) * 0.1945945946;\n\n            c += texture2D(u_texture, vec2(uv.x + 1.0*b, uv.y + 1.0*b)) * 0.1945945946;\n            c += texture2D(u_texture, vec2(uv.x + 2.0*b, uv.y + 2.0*b)) * 0.1216216216;\n            c += texture2D(u_texture, vec2(uv.x + 3.0*b, uv.y + 3.0*b)) * 0.0540540541;\n            c += texture2D(u_texture, vec2(uv.x + 4.0*b, uv.y + 4.0*b)) * 0.0162162162;\n          }\n\n          gl_FragColor = vec4(c.r*c.a, c.g*c.a, c.b*c.a, 1.0);\n        }'
    });
  }
});

if (DEBUG) {
  window.state = state;
  window.config = config;
  window.save = save;
}

// function analytics(identifier, progress) {
//   try {
//     if (identifier < 10) {
//       identifier = '0' + identifier;
//     }
//
//     window.gtag('event', identifier + ' ' + progress, { 'event_category': 'progress' });
//   } catch (e) {
//     // eslint-disable-next-line no-console
//     console.log(e);
//   }
// }

function startGame(debug) {
  if (DEBUG) {
    window.props = debug;
  }

  config.physics.arcade.debug = prop('physics.debug');

  var game = new Phaser.Game(config);

  if (DEBUG) {
    window.game = game;

    window.state.commands.winLevel = winLevel;
    window.state.commands.restartLevel = restartLevel;
    window.state.commands.previousLevel = previousLevel;
    window.state.commands.damageBlur = damageBlur;
    window.state.commands.deathShockwave = deathShockwave;
    window.state.commands.jumpShake = jumpShake;

    Object.keys(props).forEach(function (key) {
      debug[key] = props[key];
    });
  }

  // analytics(0, 'started game');

  return game;
}

function preload_jumpcoins() {
  var game = state.game = this;

  if (DEBUG) {
    state.debug = window.props;
  }

  config.levels.forEach((levelFile, i) => {
    game.load.text(`level-${i}`, AssetBase + levelFile);
  });

  game.load.image('tileWall', AssetBase + "/tiles/wall.png");
  game.load.image('tileSpikesUp', AssetBase + "/tiles/spikes-up.png");
  game.load.image('tileSpikesDown', AssetBase + "/tiles/spikes-down.png");
  game.load.image('tileSpikesLeft', AssetBase + "/tiles/spikes-left.png");
  game.load.image('tileSpikesRight', AssetBase + "/tiles/spikes-right.png");
  game.load.image('tileEye', AssetBase + "/tiles/eye.png");
  game.load.image('tileSemiground', AssetBase + "/tiles/semiground.png");
  game.load.image('tileTransparent', AssetBase + "/tiles/transparent.png");

  game.load.spritesheet('spritePlayerDefault', AssetBase + "/sprites/player-default.png", { frameWidth: config.tileWidth, frameHeight: config.tileHeight });
  game.load.spritesheet('spritePlayerShielded', AssetBase + "/sprites/player-shielded.png", { frameWidth: config.tileWidth, frameHeight: config.tileHeight });
  game.load.spritesheet('spriteEnemyA', AssetBase + "/sprites/enemy-a.png", { frameWidth: config.tileWidth, frameHeight: config.tileHeight });
  game.load.spritesheet('spriteEnemyB', AssetBase + "/sprites/enemy-b.png", { frameWidth: config.tileWidth, frameHeight: config.tileHeight });
  game.load.image('spriteHeart', AssetBase + "/sprites/heart.png");
  game.load.spritesheet('spriteFreebie', AssetBase + "/sprites/freebie.png", { frameWidth: config.tileWidth, frameHeight: config.tileHeight });

  game.load.image('effectImagePuff', AssetBase + "/effects/puff.png");
  game.load.image('effectImageSpark', AssetBase + "/effects/spark.png");
  game.load.image('effectImageFloodlight', AssetBase + "/effects/floodlight.png");
  game.load.image('effectBackgroundScreen', AssetBase + "/effects/background-screen.png");
  game.load.image('effectPupil', AssetBase + "/effects/pupil.png");
  game.load.image('effectBlack', AssetBase + "/effects/black.png");

  game.load.image('badgeCompleted', AssetBase + "/badges/completed.png");
  game.load.image('badgeDamageless', AssetBase + "/badges/damageless.png");
  game.load.image('badgeDeathless', AssetBase + "/badges/deathless.png");
  game.load.image('badgeRich', AssetBase + "/badges/rich.png");
  game.load.image('badgeBirdie', AssetBase + "/badges/birdie.png");
  game.load.image('badgeKiller', AssetBase + "/badges/killer.png");
  game.load.image('badgeEmpty', AssetBase + "/badges/empty.png");

  game.load.audio('musicWorld1', AssetBase + "/music/world1.mp3");
  game.load.audio('musicWorld2', AssetBase + "/music/world2.mp3");
  game.load.audio('musicWorld3', AssetBase + "/music/world3.mp3");
  game.load.audio('musicBye', AssetBase + "/music/bye.mp3");

  game.load.audio('soundCoin', AssetBase + "/sounds/coin.wav");
  game.load.audio('soundJump1', AssetBase + "/sounds/jump1.wav");
  game.load.audio('soundJump2', AssetBase + "/sounds/jump2.wav");
  game.load.audio('soundJump3', AssetBase + "/sounds/jump3.wav");
  game.load.audio('soundDoubleJump', AssetBase + "/sounds/doublejump.wav");
  game.load.audio('soundWalljump', AssetBase + "/sounds/walljump.wav");
  game.load.audio('soundKill', AssetBase + "/sounds/kill.wav");
  game.load.audio('soundWin', AssetBase + "/sounds/win.wav");
  game.load.audio('soundDie', AssetBase + "/sounds/die.wav");
  game.load.audio('soundBadge', AssetBase + "/sounds/badge.wav");
}

function range(count) {
  const ret = [];
  var i = 0;

  while (i < count) {
    ret.push(i++);
  }

  return ret;
}

function parseMap(lines, level) {
  var map = range(config.mapHeight).map(function () {
    return range(config.mapWidth).map(function () {
      return null;
    });
  });

  if (lines.length !== config.mapHeight) {
    err('Wrong map height: got ' + lines.length + ' expected ' + config.mapHeight + ' in ' + level.name);
  }

  var locationForTile = {};

  lines.forEach(function (line, y) {
    if (line.length !== config.mapWidth) {
      err('Wrong map width: got ' + line.length + ' expected ' + config.mapWidth + ' in ' + level.name);
    }

    line.split('').forEach(function (tileCharacter, x) {
      var tile = config.tileDefinitions[tileCharacter];
      if (tile === undefined) {
        err('Invalid tile character \'' + tileCharacter + '\' in ' + level.name);
      }

      locationForTile[tileCharacter] = [x, y];

      // background tile
      if (tile === null) {
        return;
      }

      map[y][x] = Object.assign({}, tile, { x: x, y: y });
    });
  });

  var playerLocation = locationForTile['@'];
  if (!playerLocation) {
    err('Missing @ for player location in ' + level.name);
  }

  return {
    map: map,
    playerLocation: playerLocation
  };
}

function parseLevel(levelDefinition) {
  var mapHeight = config.mapHeight;

  var allLines = levelDefinition.split('\n');
  var mapLines = allLines.slice(0, mapHeight);
  var levelJSON = allLines.slice(mapHeight).join('\n');

  var level = JSON.parse(levelJSON);
  level = Object.assign({}, level, parseMap(mapLines, level));

  return level;
}

function createLevel(index) {
  var game = state.game,
      debug = state.debug,
      physics = state.physics;


  var level = parseLevel(game.cache.text.get('level-' + index));
  level.index = index;

  if (DEBUG) {
    window.level = level;
  }

  if (state.level && state.level.index) {
    save.levels[state.level.index].total_time_ms += new Date().getTime() - state.level.startedAt.getTime();
    save.levels[state.level.index].temp_time_ms = 0;
  }

  state.level = level;

  level.startedAt = new Date();

  if (save.levels[level.index].temp_time_ms) {
    save.levels[level.index].total_time_ms += save.levels[level.index].temp_time_ms;
    save.levels[level.index].temp_time_ms = 0;
  }

  save.current_level = level.index;
  saveState();

  listenProp('level.name', level.name);
  listenProp('level.index', index);

  var filename = config.levels[index];
  var match = filename.match(/\/([^/]+)\.\w+\.map$/);
  if (match) {
    listenProp('level.file', match[1] + '.map');
  } else {
    listenProp('level.file', filename);
  }

  level.hud = {};
  level.timers = [];
  level.particles = [];
  level.deaths = 0;
  level.damageTaken = 0;
  level.earnedBadges = {};

  initializeMap();

  createLevelObjects(false);

  createPlayer();

  level.objects.exits.forEach(function (exit) {
    return setupExit(exit);
  });

  if (state.currentMusicName !== level.music) {
    state.currentMusicName = level.music;
    if (state.currentMusicPlayer) {
      state.currentMusicPlayer.destroy();
    }

    try {
      var music = game.sound.add(level.music);
      music.play('', { loop: true });
      music.setVolume(0.25);
      state.currentMusicPlayer = music;
    } catch (e) {
      console.log(e);
    }
  }

  return level;
}

function positionToScreenCoordinate(x, y) {
  var tileWidth = config.tileWidth,
      tileHeight = config.tileHeight,
      xBorder = config.xBorder,
      yBorder = config.yBorder;

  return [x * tileWidth + xBorder, y * tileHeight + yBorder];
}

function initializeMap() {
  var game = state.game,
      level = state.level,
      physics = state.physics;
  var map = level.map;
  var tileWidth = config.tileWidth,
      tileHeight = config.tileHeight;


  var halfWidth = tileWidth / 2;
  var halfHeight = tileHeight / 2;

  var images = [];
  var objectDescriptions = [];
  var statics = {};
  var toCombine = range(config.mapWidth).map(function () {
    return [];
  });

  map.forEach(function (row, r) {
    row.forEach(function (tile, c) {
      if (!tile) {
        return;
      }

      var _positionToScreenCoor = positionToScreenCoordinate(c, r),
          _positionToScreenCoor2 = _slicedToArray(_positionToScreenCoor, 2),
          x = _positionToScreenCoor2[0],
          y = _positionToScreenCoor2[1];

      x += halfWidth;
      y += halfHeight;

      if (tile.combineVertical) {
        toCombine[c].push(tile);
        var image = game.add.image(x, y, tile.image);
        images.push(image);
        image.setDepth(2);
      } else if (tile.object) {
        objectDescriptions.push({
          x: x,
          y: y,
          tile: tile
        });
      } else {
        if (!statics[tile.group]) {
          statics[tile.group] = physics.add.staticGroup();
        }

        var body = statics[tile.group].create(x, y, tile.image);
        body.config = tile;
      }
    });
  });

  toCombine.forEach(function (column) {
    if (!column.length) {
      return;
    }

    column.sort(function (a, b) {
      return a.y - b.y;
    });

    var processGroup = function processGroup(members) {
      var _members = _slicedToArray(members, 1),
          tile = _members[0];

      if (!statics[tile.group]) {
        statics[tile.group] = physics.add.staticGroup();
      }

      var _positionToScreenCoor3 = positionToScreenCoordinate(tile.x, tile.y),
          _positionToScreenCoor4 = _slicedToArray(_positionToScreenCoor3, 2),
          x = _positionToScreenCoor4[0],
          y = _positionToScreenCoor4[1];

      x += halfWidth;
      y += halfHeight;
      var body = statics[tile.group].create(x, y, tile.image);
      body.setSize(tileWidth, tileHeight * members.length);
      body.config = tile;
    };

    var group = [column.shift()];
    while (column.length) {
      var tile = column.shift();
      var prevTile = group[group.length - 1];
      if (tile.y === prevTile.y + 1 && tile.group === prevTile.group) {
        group.push(tile);
      } else {
        processGroup(group);
        group = [tile];
      }
    }
    processGroup(group);
  });

  level.statics = statics;
  level.images = images;
  level.objectDescriptions = objectDescriptions;

  if (statics.spikes) {
    statics.ground.setDepth(2);
    statics.spikes.children.iterate(function (child) {
      var animate = child.config.animate;

      var offset = (child.config.x + child.config.y) % 2;

      game.tweens.add({
        targets: child,
        x: child.x + animate[0] * 4,
        y: child.y + animate[1] * 4,
        duration: 500,
        delay: offset ? 500 : 0,
        yoyo: true,
        loop: -1
      });
    });
  }
}

function scheduleMover(mover, isFirst) {
  var game = state.game,
      level = state.level;


  var speed = mover.config.speed;
  var distance = config.tileWidth * mover.config.distance * (isFirst ? 0.5 : 1);
  var duration = distance / speed;

  var timer = void 0;
  // eslint-disable-next-line prefer-const
  timer = game.time.addEvent({
    delay: duration * 1000,
    callback: function callback() {
      level.timers = level.timers.filter(function (t) {
        return t !== timer;
      });
      mover.movingLeft = !mover.movingLeft;
      if (mover.movingLeft) {
        mover.setVelocityX(-speed);
      } else {
        mover.setVelocityX(speed);
      }

      scheduleMover(mover, false);
    }
  });

  level.timers.push(timer);
}

function setupMover(mover) {
  mover.setImmovable(true);
  mover.body.allowGravity = false;

  mover.initialPosition = [mover.x, mover.y];

  if (mover.config.movingLeft) {
    mover.setVelocityX(-mover.config.speed);
    mover.movingLeft = true;
  } else {
    mover.setVelocityX(mover.config.speed);
    mover.movingLeft = false;
  }

  scheduleMover(mover, true);
}

function setupExit(exit) {
  var game = state.game,
      level = state.level;


  var speed = {};
  if (exit.config.x >= config.mapWidth - 2) {
    speed.speedX = { min: -60, max: -40 };
    speed.x = exit.x + config.tileWidth / 2;
    speed.y = { min: exit.y - config.tileHeight / 2, max: exit.y + config.tileHeight / 2 };
  } else if (exit.config.x <= 1) {
    speed.speedX = { min: 40, max: 60 };
    speed.x = exit.x - config.tileWidth / 2;
    speed.y = { min: exit.y - config.tileHeight / 2, max: exit.y + config.tileHeight / 2 };
  } else if (exit.config.y >= config.mapHeight - 2) {
    speed.speedY = { min: -60, max: -40 };
    speed.x = { min: exit.x - config.tileWidth / 2, max: exit.x + config.tileWidth / 2 };
    speed.y = exit.y + config.tileHeight / 2;
  } else if (exit.config.y <= 1) {
    speed.speedY = { min: 40, max: 60 };
    speed.x = { min: exit.x - config.tileWidth / 2, max: exit.x + config.tileWidth / 2 };
    speed.y = exit.y - config.tileHeight / 2;
  }

  var particles = game.add.particles('effectImageSpark');
  particles.setDepth(5);
  var emitter = particles.createEmitter(Object.assign({}, speed, {
    tint: [0xF6C456, 0xEC5B55, 0x8EEA83, 0x4397F7, 0xCC4BE4],
    alpha: { start: 0, end: 1, ease: function ease(t) {
        return t < 0.1 ? 10 * t : 1 - (t - 0.1);
      } },
    scale: 0.3,
    blendMode: 'SCREEN',
    particleBringToTop: true,
    quantity: 5,
    frequency: 150,
    lifespan: 2000
  }));

  for (var i = 1; i <= 5; i++) {
    var particle = emitter.emitParticle();
    var delta = i * 150;
    particle.update(delta, delta / 1000, []);
  }

  if (!level.exitParticles) {
    level.exitParticles = [];
  }
  level.exitParticles.push(particles);
}

function reactFloodlightsToDie() {
  var game = state.game,
      floodlightEmitter = state.floodlightEmitter,
      level = state.level;
  var player = level.player;


  var x = player.x;
  var y = player.y;

  floodlightEmitter.forEachAlive(function (particle) {
    var dx = particle.x - x;
    var dy = particle.y - y;

    var distance = Math.sqrt(dx * dx + dy * dy);

    if (particle.jumpTween) {
      particle.jumpTween.stop();
    } else {
      particle.originalVelocityX = particle.velocityX;
      particle.originalVelocityY = particle.velocityY;
    }

    var theta = Math.atan2(dy, dx);
    var vx = 200 * Math.cos(theta);
    var vy = 200 * Math.sin(theta);

    game.time.addEvent({
      delay: 500 * distance / config.width,
      callback: function callback() {
        particle.velocityX = vx + particle.originalVelocityX;
        particle.velocityY = vy + particle.originalVelocityY;

        particle.jumpTween = game.tweens.addCounter({
          from: 100,
          to: -30,
          delay: 100,
          duration: 1000,
          ease: 'Quad.easeOut',
          onUpdate: function onUpdate() {
            var v = particle.jumpTween.getValue() / 100;
            particle.velocityX = v * vx + particle.originalVelocityX;
            particle.velocityY = v * vy + particle.originalVelocityY;
          },
          onComplete: function onComplete() {
            particle.velocityX = particle.originalVelocityX;
            particle.velocityY = particle.originalVelocityY;
          }
        });
      }
    });
  });
}

function reactFloodlightsToJump() {
  var game = state.game,
      floodlightEmitter = state.floodlightEmitter,
      level = state.level;
  var player = level.player;


  var x = player.x;
  var y = player.y;

  floodlightEmitter.forEachAlive(function (particle) {
    var dx = particle.x - x;
    var dy = particle.y - y;

    var distance = Math.sqrt(dx * dx + dy * dy);

    if (particle.jumpTween) {
      particle.jumpTween.stop();
    } else {
      particle.originalVelocityX = particle.velocityX;
      particle.originalVelocityY = particle.velocityY;
    }

    /*
    if (particle.moveIn) {
      dx *= -1;
      dy *= -1;
    }
    particle.moveIn = !particle.moveIn;
    */

    var distanceMod = void 0;
    if (distance < 10 * config.tileWidth) {
      distanceMod = 1 - distance / (10 * config.tileWidth);
    } else {
      distanceMod = -distance / (100 * config.tileWidth);
    }

    var theta = Math.atan2(dy, dx);
    var vx = distanceMod * 100 * Math.cos(theta);
    var vy = distanceMod * 100 * Math.sin(theta);
    particle.velocityX = vx + particle.originalVelocityX;
    particle.velocityY = vy + particle.originalVelocityY;

    particle.jumpTween = game.tweens.addCounter({
      from: 100,
      to: 0,
      duration: 2000,
      onUpdate: function onUpdate() {
        var v = particle.jumpTween.getValue() / 100;
        particle.velocityX = v * vx + particle.originalVelocityX;
        particle.velocityY = v * vy + particle.originalVelocityY;
      },
      onComplete: function onComplete() {
        particle.velocityX = particle.originalVelocityX;
        particle.velocityY = particle.originalVelocityY;
      }
    });
  });
}

function setupFloodlights() {
  var game = state.game,
      level = state.level;


  var particles = game.add.particles('effectImageFloodlight');
  var emitter = particles.createEmitter({
    speed: { min: 10, max: 20 },
    x: { min: 0, max: config.width },
    y: { min: 0, max: config.height },
    tint: [0xF6C456, 0xEC5B55, 0x8EEA83, 0x4397F7, 0xCC4BE4],
    alpha: { start: 0, end: 0.5, ease: function ease(t) {
        return t < 0.2 ? 5 * t : 1 - (t - 0.2);
      } },
    scale: { min: 0.5, max: 2.0 },
    blendMode: 'SCREEN',
    particleBringToTop: true,
    quantity: 3,
    frequency: 1500,
    lifespan: 50000
  });

  for (var i = 1; i < 30; i += 3) {
    var particle = emitter.emitParticle();
    var delta = 10000 + i * 1000;
    particle.update(delta, delta / 1000, []);
  }

  state.floodlightParticles = particles;
  state.floodlightEmitter = emitter;
}

function freebieGlow(freebie) {
  var game = state.game,
      level = state.level;


  {
    var particles = game.add.particles('effectImageFloodlight');
    var emitter = particles.createEmitter({
      tint: 0x4397F7,
      alpha: { start: 0, end: 0.4, ease: function ease(t) {
          return t < 0.2 ? 5 * t : 1 - (t - 0.2);
        } },
      scale: { start: 0.4, end: 0.8 },
      blendMode: 'SCREEN',
      particleBringToTop: true,
      quantity: 1,
      frequency: 3000,
      lifespan: 10000
    });
    emitter.startFollow(freebie);
    level.particles.push(particles);
    particles.setDepth(4);

    freebie.glowParticles = particles;
    freebie.glowEmitter = emitter;
  }

  {
    var _particles = game.add.particles('effectImageSpark');
    _particles.setDepth(5);
    var _emitter = _particles.createEmitter({
      speed: 5,
      tint: 0x4397F7,
      alpha: { start: 0, end: 1, ease: function ease(t) {
          return t < 0.1 ? 10 * t : 1 - (t - 0.1);
        } },
      scale: 0.1,
      blendMode: 'SCREEN',
      particleBringToTop: true,
      quantity: 1,
      maxParticles: 6,
      frequency: 150,
      lifespan: 5000
    });

    freebie.sparkParticles = _particles;
    freebie.sparkEmitter = _emitter;
    _emitter.startFollow(freebie);
    level.particles.push(_particles);
    _particles.setDepth(5);
  }
}

function setupEnemy(enemy) {
  enemy.anims.play(enemy.config.walkAnimation, true);
}

function setupFreebie(freebie) {
  var game = state.game;


  freebie.bobTween = game.tweens.add({
    targets: freebie,
    duration: 1000,
    delay: Phaser.Math.Between(0, 500),
    y: freebie.y + 8,
    ease: 'Cubic.easeInOut',
    yoyo: true,
    loop: -1,
    onUpdate: function onUpdate() {
      if (freebie.body) {
        freebie.refreshBody();
      }
    }
  });
  freebieGlow(freebie);
}

function setupEye(eye) {
  var level = state.level,
      physics = state.physics;
  var statics = level.statics,
      objects = level.objects;


  if (!statics.pupils) {
    statics.pupils = physics.add.staticGroup();
  }

  var x = eye.x;
  var y = eye.y;
  var pupil = statics.pupils.create(x, y, 'effectPupil');

  pupil.pupilOriginX = x;
  pupil.pupilOriginY = y;
  pupil.setDepth(2);

  objects.pupils.push(pupil);
}

function createLevelObjects(isRespawn) {
  var level = state.level,
      physics = state.physics;
  var objectDescriptions = level.objectDescriptions,
      statics = level.statics;


  var objects = {
    freebies: [],
    enemies: [],
    movers: [],
    removeHints: [],
    exits: [],
    eyes: [],
    pupils: []
  };

  objectDescriptions.forEach(function (_ref) {
    var x = _ref.x,
        y = _ref.y,
        tile = _ref.tile;
    var group = tile.group,
        dynamic = tile.dynamic,
        glyph = tile.glyph,
        image = tile.image;

    if (isRespawn && (group === 'exits' || group === 'pupils')) {
      return;
    }

    var body = void 0;

    if (dynamic) {
      body = physics.add.sprite(x, y, image);
    } else {
      if (!statics[group]) {
        statics[group] = physics.add.staticGroup();
      }

      body = statics[group].create(x, y, image);
    }

    body.config = tile;
    objects[group].push(body);
  });

  if (isRespawn) {
    objects.exits = level.objects.exits;
    objects.pupils = level.objects.pupils;
  }

  level.enemies = objects.enemies;
  level.livingEnemies = level.enemies.length;
  level.objects = objects;

  objects.movers.forEach(function (mover) {
    return setupMover(mover);
  });
  objects.enemies.forEach(function (enemy) {
    return setupEnemy(enemy);
  });
  objects.freebies.forEach(function (freebie) {
    return setupFreebie(freebie);
  });

  if (!isRespawn) {
    objects.eyes.forEach(function (eye) {
      return setupEye(eye);
    });
  }
}

function createPlayer() {
  var game = state.game,
      physics = state.physics,
      level = state.level;


  var location = level.playerLocation;

  var _positionToScreenCoor5 = positionToScreenCoordinate(location[0], location[1]),
      _positionToScreenCoor6 = _slicedToArray(_positionToScreenCoor5, 2),
      x = _positionToScreenCoor6[0],
      y = _positionToScreenCoor6[1];

  var player = physics.add.sprite(x, y, 'spritePlayerDefault');

  player.x += player.width / 2;
  player.y += player.height / 2;

  player.life = level.baseLife;
  player.freebies = 0;

  player.setSize(player.width * 0.8, player.height * 0.8, true);

  player.framesSinceTouchingDown = 0;

  player.setDepth(4);

  level.player = player;

  level.spawnedAt = new Date();

  return player;
}

function destroyGroup(group) {
  var children = [];
  group.children.iterate(function (child) {
    return children.push(child);
  });
  children.forEach(function (child) {
    return child.destroy();
  });
  group.destroy(true);
}

function removePhysics() {
  var physics = state.physics;

  physics.world.colliders.destroy();
}

function destroyLevel(keepStatics) {
  var level = state.level;
  var statics = level.statics,
      images = level.images,
      player = level.player,
      hud = level.hud;


  level.timers.forEach(function (timer) {
    timer.destroy();
  });

  level.particles.forEach(function (particle) {
    particle.destroy();
  });

  if (!keepStatics) {
    Object.keys(level.statics).forEach(function (name) {
      var group = level.statics[name];
      destroyGroup(group);
    });
    images.forEach(function (image) {
      image.destroy();
    });
    level.exitParticles.forEach(function (particle) {
      particle.destroy();
    });

    state.earnedBadgeKiller = false;
    state.earnedBadgeRich = false;
  }

  Object.keys(level.objects).forEach(function (type) {
    if (keepStatics && (type === 'exits' || type === 'pupils')) {
      return;
    }

    level.objects[type].forEach(function (object) {
      object.destroy();
    });
  });

  hud.hearts.forEach(function (heart) {
    heart.destroy();
  });

  hud.freebies.forEach(function (freebie) {
    freebie.destroy();
  });

  hud.hints.forEach(function (hint) {
    hint.destroy();
  });

  Object.keys(hud.intro).forEach(function (key) {
    if (key !== 'badges') {
      hud.intro[key].destroy();
    } else {
      hud.intro.badges.forEach(function (badge) {
        badge.destroy();
      });
    }
  });

  if (hud.outro) {
    Object.keys(hud.outro).forEach(function (key) {
      if (key !== 'badges') {
        hud.outro[key].destroy();
      } else {
        hud.outro.badges.forEach(function (badge) {
          badge.destroy();
        });
      }
    });
  }

  player.destroy();
}

function winLevelProperly() {
  winLevel(true);
}

function winLevel(isProper) {
  var game = state.game,
      level = state.level;
  var player = level.player;


  if (level.isWinning) {
    return;
  }

  level.isWinning = true;

  // analytics(1 + level.index, 'finished level ' + level.name);

  var time_ms = new Date().getTime() - level.spawnedAt.getTime();
  level.duration_ms = time_ms;

  if (time_ms < (save.levels[level.index].best_time_ms || Number.MAX_VALUE)) {
    level.beatBestTime = save.levels[level.index].best_time_ms;
    save.levels[level.index].best_time_ms = time_ms;
  }

  level.earnedBadges.badgeCompleted = !save.levels[level.index].badgeCompleted;
  save.levels[level.index].badgeCompleted = true;

  if (level.deaths === 0) {
    level.earnedBadges.badgeDeathless = !save.levels[level.index].badgeDeathless;
    save.levels[level.index].badgeDeathless = true;
  }

  if (level.damageTaken === 0) {
    level.earnedBadges.badgeDamageless = !save.levels[level.index].badgeDamageless;
    save.levels[level.index].badgeDamageless = true;
  }

  if (level.player.freebies > 0) {
    level.earnedBadges.badgeBirdie = !save.levels[level.index].badgeBirdie;
    save.levels[level.index].badgeBirdie = true;
  }

  if (state.earnedBadgeKiller) {
    state.earnedBadgeKiller = false;
    level.earnedBadges.badgeKiller = true;
  }

  if (state.earnedBadgeRich) {
    state.earnedBadgeRich = false;
    level.earnedBadges.badgeRich = true;
  }

  saveState();

  playSound('soundWin');

  player.ignoreInput = true;
  player.disableBody(true, false);

  game.tweens.add({
    targets: player,
    alpha: 0,
    duration: 2000
  });

  // start animation
  renderLevelOutro(function () {
    removePhysics();

    // defer this to avoid crashes while removing during collider callback
    game.time.addEvent({
      callback: function callback() {
        destroyLevel(false);

        state.levelIndex++;
        if (state.levelIndex === config.levels.length) {
          state.levelIndex = 0;
        }

        setupLevel(false);
      }
    });
  });
}

function restartLevel() {
  state.levelIndex--;
  winLevel(false);
}

function previousLevel() {
  state.levelIndex -= 2;
  if (state.levelIndex < 0) {
    state.levelIndex += config.levels.length;
  }
  winLevel(false);
}

function setPlayerInvincible() {
  var game = state.game,
      level = state.level;
  var player = level.player;


  player.invincible = true;
  player.fastInvincible = false;
  player.alpha = 1;

  player.invincibleTween = game.tweens.add({
    targets: player,
    alpha: 0.5,
    duration: 300,
    ease: function ease(t) {
      return t < 0.8 ? 0 : 1;
    },
    yoyo: true,
    loop: -1,
    onUpdate: function onUpdate() {
      if (player.fastInvincible && player.alpha >= 1) {
        player.invincibleTween.stop();
        player.invincibleTween = game.tweens.add({
          targets: player,
          alpha: 0.5,
          duration: 100,
          ease: function ease(t) {
            return t < 0.8 ? 0 : 1;
          },
          yoyo: true,
          loop: -1
        });
      }
    }
  });

  game.time.addEvent({
    delay: prop('invincibility_ms') * 0.5,
    callback: function callback() {
      player.fastInvincible = true;
    }
  });

  game.time.addEvent({
    delay: prop('invincibility_ms'),
    callback: function callback() {
      player.invincible = false;
      player.invincibleTween.stop();
      player.alpha = 1;
    }
  });
}

function damageBlur() {
  var game = state.game,
      level = state.level;
  var player = level.player;


  if (!state.shader) {
    return;
  }

  if (player.blurTween) {
    player.blurTween.stop();
  }

  player.blurTween = game.tweens.addCounter({
    from: 0,
    to: 100,
    duration: prop('effect.damageBlur.in_ms'),
    onUpdate: function onUpdate() {
      state.shader.setFloat1('blurEffect', prop('effect.damageBlur.amount') * (player.blurTween.getValue() / 100.0));
    },
    onComplete: function onComplete() {
      player.blurTween = game.tweens.addCounter({
        from: 100,
        to: 0,
        duration: prop('effect.damageBlur.out_ms'),
        onUpdate: function onUpdate() {
          state.shader.setFloat1('blurEffect', prop('effect.damageBlur.amount') * (player.blurTween.getValue() / 100.0));
        }
      });
    }
  });
}

function deathShockwave() {
  var game = state.game,
      level = state.level;
  var player = level.player;


  reactFloodlightsToDie();

  if (!state.shader) {
    return;
  }

  state.shockwaveTime = 0;
  state.shader.setFloat2('shockwaveCenter', player.x / config.width, player.y / config.height);
}

function spendLife(isVoluntary) {
  var game = state.game,
      level = state.level;
  var player = level.player,
      hud = level.hud;


  var spendFreebie = player.freebies > 0;

  if (!isVoluntary) {
    level.damageTaken++;
    save.levels[level.index].damage_taken++;
    damageBlur();
  }

  var image = void 0;

  if (spendFreebie) {
    player.freebies--;
    image = hud.freebies.pop();

    if (player.freebies <= 0) {
      setPlayerAnimation();
    }
  } else if (!prop('cheat.hearty')) {
    player.life--;
    image = hud.hearts.pop();
  }

  if (image) {
    image.setDepth(3);

    if (image.hudTween) {
      image.hudTween.stop();
    }

    image.x = player.x;
    image.y = player.y;

    game.tweens.add({
      targets: image,
      duration: 500,
      y: image.y - config.tileHeight,
      ease: 'Cubic.easeOut',
      onComplete: function onComplete() {
        game.tweens.add({
          targets: image,
          duration: 500,
          y: image.y + config.tileHeight / 2,
          alpha: 0,
          ease: 'Cubic.easeIn',
          onComplete: function onComplete() {
            // this should never happen, but better to not crash…
            if (image) {
              image.destroy();
            }
          }
        });
      }
    });
  }

  if (player.life <= 0) {
    level.deaths++;
    save.levels[level.index].deaths++;
    deathShockwave();
    respawn();

    playSound('soundDie', null, 0.75);

    saveState();
    return true;
  }

  if (!isVoluntary) {
    playSound('soundKill', null, 0.75);
  }

  saveState();
  return false;
}

function takeSpikeDamage(object1, object2) {
  var game = state.game,
      level = state.level;
  var player = level.player;


  if (player.invincible) {
    return;
  }

  var spikes = object1.config && object1.config.group === 'spikes' ? object1 : object2;
  var knockback = spikes.config.knockback;


  var ignore = spendLife(false);

  setPlayerInvincible();

  if (knockback === 'left' || knockback === true && player.facingLeft) {
    player.setVelocityX(prop('spike_knockback.x'));
  } else if (knockback === 'right' || knockback === true && !player.facingLeft) {
    player.setVelocityX(-prop('spike_knockback.x'));
  }

  if (knockback) {
    player.setVelocityY(-prop('spike_knockback.y'));

    player.ignoreInput = true;
    player.canCancelIgnoreInput = false;

    game.time.addEvent({
      delay: prop('min_ignore_input_ms'),
      callback: function callback() {
        player.canCancelIgnoreInput = true;
      }
    });
  }
}

function destroyEnemy(enemy) {
  var game = state.game,
      level = state.level;
  var player = level.player;


  level.livingEnemies--;
  if (level.livingEnemies === 0) {
    level.earnedBadges.badgeKiller = !save.levels[level.index].badgeKiller;
    if (level.earnedBadges.badgeKiller) {
      state.earnedBadgeKiller = true;
    }

    save.levels[level.index].badgeKiller = true;
    saveState();
  }

  playSound('soundKill');
  enemy.anims.play(enemy.config.killAnimation, true);
  enemy.disableBody(true, false);
  level.enemies = level.enemies.filter(function (e) {
    return e !== enemy;
  });

  game.tweens.add({
    targets: enemy,
    duration: 1000,
    y: enemy.y + config.height,
    ease: 'Back.easeIn',
    onComplete: function onComplete() {
      enemy.destroy();
    }
  });

  game.tweens.add({
    targets: enemy,
    duration: 1000,
    alpha: 0,
    ease: 'Quad.easeIn',
    x: player.x < enemy.x ? enemy.x + config.tileWidth * 3 : enemy.x - config.tileWidth * 3,
    rotation: player.x < enemy.x ? 2 : -2
  });

  game.tweens.add({
    targets: enemy,
    duration: 1000,
    scale: 1.5,
    ease: 'Quad.easeIn'
  });
}

function takeEnemyDamage(object1, object2) {
  var game = state.game,
      level = state.level;
  var player = level.player;


  var enemy = object1.config && object1.config.group === 'enemies' ? object1 : object2;

  if (player.invincible) {
    destroyEnemy(enemy);
    return;
  }

  var suppressEnemySound = spendLife(false);
  destroyEnemy(enemy, suppressEnemySound);

  setPlayerInvincible();
}

function playSound(name, variants, volume) {
  var game = state.game;


  if (variants) {
    name += Phaser.Math.Between(1, variants);
  }

  try {
    var sound = game.sound.add(name);

    if (volume === undefined) {
      volume = 0.5;
    }
    sound.setVolume(volume);
    sound.play();
  } catch (e) {
    console.log(e);
  }
}

function acquireFreebie(object1, object2) {
  var game = state.game,
      level = state.level;
  var player = level.player,
      hud = level.hud;


  var freebie = object1.config && object1.config.group === 'freebie' ? object1 : object2;
  if (freebie.spent) {
    return false;
  }

  freebie.spent = true;
  freebie.bobTween.stop();
  freebie.glowEmitter.stop();
  freebie.glowEmitter.stopFollow();
  freebie.sparkEmitter.stop();
  freebie.sparkEmitter.stopFollow();

  game.tweens.add({
    targets: freebie,
    duration: 1000,
    y: freebie.y - 8,
    ease: 'Cubic.easeOut',
    alpha: 0.4
  });

  playSound('soundCoin');

  player.freebies++;
  if (player.freebies === 1) {
    setPlayerAnimation();
  }

  if (level.objects.freebies.filter(function (f) {
    return !f.spent;
  }).length === 0) {
    level.earnedBadges.badgeRich = !save.levels[level.index].badgeRich;
    if (level.earnedBadges.badgeRich) {
      state.earnedBadgeRich = true;
    }
    save.levels[level.index].badgeRich = true;
    saveState();
  }

  var img = game.add.image(freebie.x, freebie.y, 'spriteFreebie');
  hud.freebies.push(img);
  var x = 2 * config.tileWidth + img.width * (player.freebies + player.life - 1) + state.lifeIsText.width;
  var y = config.yBorder / 2;
  img.setDepth(6);

  img.hudTween = game.tweens.add({
    targets: img,
    duration: 800,
    x: x,
    y: y,
    ease: 'Cubic.easeInOut'
  });

  return false;
}

function checkSemiground(object1, object2) {
  var game = state.game,
      level = state.level;
  var player = level.player,
      hud = level.hud;


  var semiground = object1.config && object1.config.group === 'semiground' ? object1 : object2;
  if (player.body.velocity.y < 0 || player.y + player.height / 2 >= semiground.y) {
    return false;
  }
  return true;
}

function removeHints() {
  var game = state.game,
      level = state.level;
  var hud = level.hud;


  if (level.removedHints) {
    return false;
  }
  level.removedHints = true;

  hud.hints.forEach(function (hint, i) {
    game.tweens.add({
      targets: hint,
      delay: 300 * i,
      duration: 500,
      alpha: 0,
      y: hint.y + 20,
      ease: 'Cubic.easeIn',
      onComplete: function onComplete() {
        hint.destroy();
      }
    });
  });

  game.time.addEvent({
    callback: function callback() {
      level.objects.removeHints.forEach(function (removeHint) {
        removeHint.destroy();
      });
      level.objects.removeHints = [];
    }
  });

  return false;
}

function setupLevelPhysics(isInitial) {
  var game = state.game,
      level = state.level,
      physics = state.physics;
  var player = level.player,
      statics = level.statics,
      enemies = level.enemies,
      objects = level.objects;


  physics.add.collider(player, statics.ground);
  physics.add.collider(enemies, statics.ground);

  physics.add.collider(player, statics.semiground, null, checkSemiground);
  physics.add.collider(enemies, statics.semiground);

  physics.add.collider(player, objects.movers);
  physics.add.collider(enemies, objects.movers);

  physics.add.overlap(player, statics.exits, winLevelProperly);
  physics.add.collider(enemies, statics.exits);

  physics.add.collider(player, statics.spikes, takeSpikeDamage);
  physics.add.collider(enemies, statics.spikes);

  physics.add.overlap(player, statics.freebies, null, acquireFreebie);
  physics.add.overlap(player, statics.removeHints, null, removeHints);

  physics.add.collider(player, enemies, takeEnemyDamage);
  physics.add.collider(enemies, enemies);
}

function renderHud(isRespawn) {
  var game = state.game,
      level = state.level;
  var player = level.player,
      hud = level.hud;


  hud.hearts = range(player.life).map(function (i) {
    var x = 2 * config.tileWidth;
    var y = 0;
    var heart = game.add.image(x, y, 'spriteHeart');
    heart.x += state.lifeIsText.width + heart.width * i;
    heart.y += config.yBorder / 2;
    return heart;
  });

  hud.freebies = [];

  hud.hints = [];

  var hintTexts = [];
  if (level.hint) {
    hintTexts.push(level.hint);
  }
  if (level.hint2) {
    hintTexts.push(level.hint2);
  }
  if (level.hint3) {
    hintTexts.push(level.hint3);
  }

  hintTexts.forEach(function (text, i) {
    var x = config.width / 2 + (level.hintXMod || 0);
    var y = config.height * 0.25 + (level.hintYMod || 0);

    // micromanage end scene
    y += config.height * 0.05 * i;
    if (hintTexts.length > 1 && i === 1) {
      y += config.height * 0.015;
    }

    if (level.hintXPosition) {
      x = config.width * level.hintXPosition;
    }
    if (level.hintYPosition) {
      y = config.height * level.hintYPosition;
    }

    var label = game.add.text(x, y, text, {
      fontFamily: '"Avenir Next", "Avenir", "Helvetica Neue", "Helvetica", "Arial"',
      fontSize: i === 0 ? '20px' : '16px',
      color: 'rgb(246, 196, 86)'
    });
    label.setStroke('#000000', 6);
    label.x -= label.width / 2;
    label.y -= label.height / 2;
    label.setDepth(7);
    hud.hints.push(label);

    label.alpha = 0;
    label.y += 20;
    game.tweens.add({
      targets: label,
      delay: isRespawn ? 4000 + 500 * i : 500 * i,
      duration: 500,
      alpha: 1,
      y: label.y - 20,
      ease: 'Cubic.easeOut',
      onComplete: function onComplete() {
        game.tweens.add({
          targets: label,
          delay: 500,
          duration: 2000,
          y: label.y + 8,
          ease: 'Quad.easeInOut',
          yoyo: true,
          loop: -1
        });
      }
    });
  });
}

function spawnPlayer(delay) {
  var game = state.game,
      level = state.level;
  var player = level.player;


  player.alpha = 0;
  player.ignoreInput = true;

  game.tweens.add({
    targets: player,
    alpha: 1,
    delay: delay,
    duration: 500,
    onComplete: function onComplete() {
      player.ignoreInput = false;
    }
  });
}

function respawn() {
  var game = state.game,
      level = state.level;
  var player = level.player;


  if (player.isRespawning) {
    return;
  }

  player.isRespawning = true;

  game.time.addEvent({
    callback: function callback() {
      destroyLevel(true);
      createLevelObjects(true);
      createPlayer();
      renderHud(true);
      setupLevelPhysics(false);
      spawnPlayer(500);
    }
  });
}

function setupLevel(isInitial) {
  var levelIndex = state.levelIndex;

  createLevel(levelIndex);
  renderHud(isInitial);
  setupLevelPhysics(true);
  renderLevelIntro();
  spawnPlayer(3000);
}

function renderLevelIntro() {
  var game = state.game,
      level = state.level;
  var player = level.player,
      hud = level.hud;


  hud.intro = {};

  player.ignoreInput = true;

  var background = game.add.image(config.width * 0.5, config.height * 0.55, 'effectBlack');
  background.setDepth(8);
  var scaleY = config.height / background.height * 0.20;
  background.setScale(config.width / background.width, scaleY / 5);
  background.x = config.width * 1.5;
  hud.intro.background = background;

  game.tweens.add({
    targets: background,
    scaleY: scaleY,
    x: config.width * 0.5,
    ease: 'Cubic.easeIn',
    duration: 500,
    onComplete: function onComplete() {
      var levelName = game.add.text(config.width / 2, config.height / 2, level.name, {
        fontFamily: '"Avenir Next", "Avenir", "Helvetica Neue", "Helvetica", "Arial"',
        fontSize: '20px',
        color: 'rgb(246, 196, 86)'
      });
      levelName.setStroke('#000000', 6);
      levelName.x -= levelName.width / 2;
      levelName.y -= levelName.height / 2;
      levelName.setDepth(8);

      levelName.alpha = 0;
      levelName.y += 20;

      game.tweens.add({
        targets: levelName,
        alpha: 1,
        y: levelName.y - 20,
        ease: 'Cubic.easeOut',
        duration: 500
      });
      hud.intro.levelName = levelName;

      if (save.levels[level.index].best_time_ms) {
        var best_time = save.levels[level.index].best_time_ms;
        var best_duration = renderMillisecondDuration(best_time);

        var bestTime = game.add.text(config.width / 2, config.height / 2 + 60, 'Your personal best: ' + best_duration, {
          fontFamily: '"Avenir Next", "Avenir", "Helvetica Neue", "Helvetica", "Arial"',
          fontSize: '16px',
          color: 'rgb(142, 234, 131)'
        });
        bestTime.setStroke('#000000', 6);
        bestTime.x -= bestTime.width / 2;
        bestTime.y -= bestTime.height / 2;
        bestTime.setDepth(8);

        bestTime.alpha = 0;
        bestTime.y -= 20;

        game.tweens.add({
          targets: bestTime,
          alpha: 1,
          delay: 500,
          y: bestTime.y + 20,
          ease: 'Cubic.easeOut',
          duration: 500
        });

        hud.intro.bestTime = bestTime;
      }

      var badgesToRender = [];
      ['badgeCompleted', 'badgeDeathless', 'badgeDamageless', 'badgeRich', 'badgeBirdie', 'badgeKiller'].forEach(function (badgeName) {
        if ((badgeName === 'badgeBirdie' || badgeName === 'badgeKiller') && !level[badgeName]) {
          return;
        }

        var imageName = 'badgeEmpty';
        if (save.levels[level.index][badgeName]) {
          imageName = badgeName;
        }
        badgesToRender.unshift(imageName);
      });

      var badges = [];
      badgesToRender.forEach(function (badgeName, i) {
        var badge = game.add.image(config.width * 0.5, config.height * 0.5 + 30, badgeName);
        badge.x -= (i + 0.5) * (config.tileWidth + 20);
        badge.x += badgesToRender.length / 2 * (config.tileWidth + 20);
        badge.setDepth(8);
        badges.push(badge);

        var x = badge.x;
        badge.x = config.width * 0.5;
        badge.alpha = 0;
        badge.y -= 20;

        game.tweens.add({
          targets: badge,
          delay: i * 50,
          alpha: badgeName === 'badgeEmpty' ? 0.3 : 1,
          x: x,
          y: badge.y + 20,
          ease: 'Cubic.easeOut',
          duration: 500
        });
      });

      hud.intro.badges = badges;

      var faders = [].concat(badges, [levelName]);
      if (hud.intro.bestTime) {
        faders.push(hud.intro.bestTime);
      }

      faders.forEach(function (fader) {
        game.tweens.add({
          targets: fader,
          delay: 2000,
          duration: 500,
          alpha: 0
        });
      });

      game.tweens.add({
        targets: hud.intro.background,
        delay: 2250,
        duration: 500,
        scaleY: 0
      });

      game.time.addEvent({
        delay: 2750,
        callback: function callback() {
          if (!hud.intro) {
            return;
          }

          player.ignoreInput = false;

          hud.intro.badges.forEach(function (badge) {
            badge.destroy();
          });
          delete hud.intro.badges;

          Object.keys(hud.intro).forEach(function (key) {
            if (key !== 'badges') {
              hud.intro[key].destroy();
            }
          });
        }
      });
    }
  });
}

function renderMillisecondDuration(duration) {
  var m = Math.floor(duration / 1000 / 60);
  var s = duration / 1000 - m * 60;
  if (s < 10) {
    s = '0' + s.toFixed(3);
  } else {
    s = s.toFixed(3);
  }
  if (m > 99) m = '99+';
  return m + ':' + s;
}

function renderLevelOutro(_callback) {
  var game = state.game,
      level = state.level;
  var player = level.player,
      hud = level.hud;


  hud.outro = {};

  player.ignoreInput = true;

  var background = game.add.image(config.width * 0.5, config.height * 0.55, 'effectBlack');
  background.setDepth(8);
  var scaleX = config.width / background.width;
  var scaleY = config.height / background.height * 0.20;
  background.setScale(0, scaleY);
  hud.outro.background = background;

  var encouragements = ['Great job!!', 'Wowee!', 'Holy toledo!', 'My hero!', 'Whoa!!', "You're on fire!!", 'Level clear!!', 'Piece of cake!'];
  var encouragement = encouragements[Phaser.Math.Between(0, encouragements.length - 1)];

  if (level.beatBestTime) {
    encouragement = 'You set a new personal best!!';
  }

  game.tweens.add({
    targets: background,
    scaleX: scaleX,
    ease: 'Cubic.easeIn',
    duration: 500,
    onComplete: function onComplete() {
      var levelName = game.add.text(config.width / 2, config.height / 2, encouragement, {
        fontFamily: '"Avenir Next", "Avenir", "Helvetica Neue", "Helvetica", "Arial"',
        fontSize: '20px',
        color: 'rgb(246, 196, 86)'
      });
      levelName.setStroke('#000000', 6);
      levelName.x -= levelName.width / 2;
      levelName.y -= levelName.height / 2;
      levelName.setDepth(8);

      levelName.alpha = 0;
      levelName.y += 20;

      game.tweens.add({
        targets: levelName,
        alpha: 1,
        y: levelName.y - 20,
        ease: 'Cubic.easeOut',
        duration: 500
      });
      hud.outro.levelName = levelName;

      if (save.levels[level.index].best_time_ms) {
        var best_time = renderMillisecondDuration(save.levels[level.index].best_time_ms);
        var level_time = renderMillisecondDuration(level.duration_ms);
        var timeDescription = void 0;
        if (level.earnedBadges.badgeCompleted) {
          timeDescription = 'Completed in: ' + best_time;
        } else if (level.beatBestTime) {
          timeDescription = 'Your new time: ' + best_time;
        } else {
          timeDescription = 'Completed in: ' + level_time + ' (personal best: ' + best_time + ')';
        }

        var bestTime = game.add.text(config.width / 2, config.height / 2 + 60, timeDescription, {
          fontFamily: '"Avenir Next", "Avenir", "Helvetica Neue", "Helvetica", "Arial"',
          fontSize: '16px',
          color: level.beatBestTime ? 'rgb(246, 196, 86)' : 'rgb(142, 234, 131)'
        });
        bestTime.setStroke('#000000', 6);
        bestTime.x -= bestTime.width / 2;
        bestTime.y -= bestTime.height / 2;
        bestTime.setDepth(8);

        bestTime.alpha = 0;
        bestTime.y -= 20;

        game.tweens.add({
          targets: bestTime,
          alpha: 1,
          delay: 500,
          y: bestTime.y + 20,
          ease: 'Cubic.easeOut',
          duration: 500
        });

        hud.outro.bestTime = bestTime;
      }

      var badgesToRender = [];
      ['badgeCompleted', 'badgeDeathless', 'badgeDamageless', 'badgeRich', 'badgeBirdie', 'badgeKiller'].forEach(function (badgeName) {
        if ((badgeName === 'badgeBirdie' || badgeName === 'badgeKiller') && !level[badgeName]) {
          return;
        }

        var imageName = 'badgeEmpty';
        if (save.levels[level.index][badgeName]) {
          imageName = badgeName;
        }
        badgesToRender.unshift(imageName);
      });

      var earnedBadges = 0;
      var badges = [];
      badgesToRender.forEach(function (badgeName, i) {
        var badge = game.add.image(config.width * 0.5, config.height * 0.5 + 30, badgeName);
        badge.x -= (i + 0.5) * (config.tileWidth + 20);
        badge.x += badgesToRender.length / 2 * (config.tileWidth + 20);
        badge.setDepth(8);
        badges.push(badge);

        var x = badge.x;
        badge.x = config.width * 0.5;
        badge.alpha = 0;
        badge.y -= 20;

        var alpha = 1;
        if (level.earnedBadges[badgeName]) {
          alpha = 0;
        } else if (badgeName === 'badgeEmpty') {
          alpha = 0.3;
        }

        game.tweens.add({
          targets: badge,
          delay: i * 50,
          alpha: alpha,
          x: x,
          y: badge.y + 20,
          ease: 'Cubic.easeOut',
          duration: 500
        });

        if (level.earnedBadges[badgeName]) {
          earnedBadges++;
          var empty = game.add.image(config.width * 0.5, config.height * 0.5 + 30, 'badgeEmpty');
          empty.x = badge.x;
          empty.y = badge.y;
          empty.setDepth(8);
          badges.push(empty);

          empty.x = config.width * 0.5;
          empty.alpha = 0;

          var thisEarnedBadge = earnedBadges;

          game.tweens.add({
            targets: empty,
            delay: i * 50,
            alpha: 0.3,
            x: x,
            y: badge.y + 20,
            ease: 'Cubic.easeOut',
            duration: 500,
            onComplete: function onComplete() {
              game.time.addEvent({
                delay: 250 + (earnedBadges - thisEarnedBadge) * 500,
                callback: function callback() {
                  playSound('soundBadge');
                }
              });

              game.tweens.add({
                targets: empty,
                delay: (earnedBadges - thisEarnedBadge) * 500,
                alpha: 0,
                duration: 500
              });
              game.tweens.add({
                targets: badge,
                delay: (earnedBadges - thisEarnedBadge) * 500,
                alpha: 1,
                duration: 500,
                onComplete: function onComplete() {}
              });
              game.tweens.add({
                targets: [empty, badge],
                ease: 'Cubic.easeOut',
                duration: 300,
                delay: 250 + (earnedBadges - thisEarnedBadge) * 500,
                y: badge.y - 6,
                onComplete: function onComplete() {
                  game.tweens.add({
                    targets: [empty, badge],
                    ease: 'Cubic.easeOut',
                    duration: 300,
                    y: badge.y + 6
                  });
                }
              });
            }
          });
        }
      });

      hud.outro.badges = badges;

      var faders = [].concat(badges, [levelName]);
      if (hud.outro.bestTime) {
        faders.push(hud.outro.bestTime);
      }

      faders.forEach(function (fader) {
        game.tweens.add({
          targets: fader,
          delay: 4000,
          duration: 500,
          alpha: 0
        });
      });

      game.tweens.add({
        targets: hud.outro.background,
        delay: 4250,
        duration: 500,
        scaleY: 0
      });

      game.time.addEvent({
        delay: 4750,
        callback: function callback() {
          if (!hud.outro) {
            return;
          }

          player.ignoreInput = false;

          hud.outro.badges.forEach(function (badge) {
            badge.destroy();
          });
          delete hud.outro.badges;

          Object.keys(hud.outro).forEach(function (key) {
            if (key !== 'badges') {
              hud.outro[key].destroy();
            }
          });

          _callback();
        }
      });
    }
  });
}

function create_jumpcoins() {
  var game = state.game;

  state.physics = game.physics;

  state.cursors = game.input.keyboard.createCursorKeys();

  game.anims.create({
    key: 'spriteEnemyAWalk',
    frames: [{
      key: 'spriteEnemyA',
      frame: 2
    }, {
      key: 'spriteEnemyA',
      frame: 0
    }, {
      key: 'spriteEnemyA',
      frame: 2
    }, {
      key: 'spriteEnemyA',
      frame: 1
    }],
    frameRate: 6,
    repeat: -1
  });

  game.anims.create({
    key: 'spriteEnemyADie',
    frames: [{
      key: 'spriteEnemyA',
      frame: 3
    }]
  });

  game.anims.create({
    key: 'spriteEnemyBWalk',
    frames: [{
      key: 'spriteEnemyB',
      frame: 2
    }, {
      key: 'spriteEnemyB',
      frame: 0
    }, {
      key: 'spriteEnemyB',
      frame: 2
    }, {
      key: 'spriteEnemyB',
      frame: 1
    }],
    frameRate: 6,
    repeat: -1
  });

  game.anims.create({
    key: 'spriteEnemyBDie',
    frames: [{
      key: 'spriteEnemyB',
      frame: 3
    }]
  });

  game.anims.create({
    key: 'spritePlayerDefaultWalk',
    frames: [{
      key: 'spritePlayerDefault',
      frame: 2
    }, {
      key: 'spritePlayerDefault',
      frame: 0
    }, {
      key: 'spritePlayerDefault',
      frame: 2
    }, {
      key: 'spritePlayerDefault',
      frame: 1
    }],
    frameRate: 6,
    repeat: -1
  });

  game.anims.create({
    key: 'spritePlayerDefaultNeutral',
    frames: [{
      key: 'spritePlayerDefault',
      frame: 2
    }]
  });

  game.anims.create({
    key: 'spritePlayerDefaultJumpUp',
    frames: [{
      key: 'spritePlayerDefault',
      frame: 3
    }]
  });

  game.anims.create({
    key: 'spritePlayerDefaultJumpDown',
    frames: [{
      key: 'spritePlayerDefault',
      frame: 4
    }]
  });

  game.anims.create({
    key: 'spritePlayerDefaultDrag',
    frames: [{
      key: 'spritePlayerDefault',
      frame: 5
    }]
  });

  game.anims.create({
    key: 'spritePlayerShieldedWalk',
    frames: [{
      key: 'spritePlayerShielded',
      frame: 2
    }, {
      key: 'spritePlayerShielded',
      frame: 0
    }, {
      key: 'spritePlayerShielded',
      frame: 2
    }, {
      key: 'spritePlayerShielded',
      frame: 1
    }],
    frameRate: 6,
    repeat: -1
  });

  game.anims.create({
    key: 'spritePlayerShieldedNeutral',
    frames: [{
      key: 'spritePlayerShielded',
      frame: 2
    }]
  });

  game.anims.create({
    key: 'spritePlayerShieldedJumpUp',
    frames: [{
      key: 'spritePlayerShielded',
      frame: 3
    }]
  });

  game.anims.create({
    key: 'spritePlayerShieldedJumpDown',
    frames: [{
      key: 'spritePlayerShielded',
      frame: 4
    }]
  });

  game.anims.create({
    key: 'spritePlayerShieldedDrag',
    frames: [{
      key: 'spritePlayerShielded',
      frame: 5
    }]
  });

  ['Z', 'X', 'C'].forEach(function (code) {
    state.keys[code] = game.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[code]);
  });

  if (config.debug) {
    game.input.keyboard.on('keydown_Q', function () {
      game.scene.stop();
      var engine = document.querySelector('#engine canvas');
      if (engine) {
        engine.remove();
      }
    });

    game.input.keyboard.on('keydown_W', function () {
      winLevel(false);
    });

    game.input.keyboard.on('keydown_R', function () {
      restartLevel();
    });

    game.input.keyboard.on('keydown_P', function () {
      previousLevel();
    });
  }

  setupFloodlights();

  setupBackgroundScreen();

  state.levelIndex = save.current_level;
  setupLevel(true);

  if (game.game.renderer.type === Phaser.WEBGL) {
    state.shader = game.game.renderer.addPipeline('Shader', new Shader(game.game));

    state.shader.setFloat2('resolution', config.width, config.height);

    state.shockwaveTime = 1000000;
    state.shockwaveIncrement = 0.005;
    state.shader.setFloat1('shockwaveTime', state.shockwaveTime);

    state.shader.setFloat1('blurEffect', 0.0);

    game.cameras.main.setRenderToTexture(state.shader);
  }

  if (game.game.renderer.type === Phaser.CANVAS) {
    // eslint-disable-next-line no-alert
    alert('It looks like this browser will offer a degraded experience, like background colors being grayscale. For best results, please use Chrome!');
  }
}

function setupBackgroundScreen() {
  var game = state.game;

  var backgroundScreen = game.add.image(config.width / 2, config.height / 2, 'effectBackgroundScreen');
  state.backgroundScreen = backgroundScreen;

  var text = game.add.text(config.xBorder * 2, config.yBorder / 2, 'Your life is ', {
    fontFamily: '"Avenir Next", "Avenir", "Helvetica Neue", "Helvetica", "Arial"',
    fontSize: '16px',
    color: 'rgb(200, 200, 200)'
  });
  state.lifeIsText = text;

  text.setStroke('#000000', 6);
  text.x -= text.width / 2;
  text.y -= text.height / 2;
}

function readInput() {
  var game = state.game,
      keys = state.keys,
      cursors = state.cursors,
      debug = state.debug;


  state.upButtonDown = cursors.up.isDown;
  state.leftButtonDown = cursors.left.isDown;
  state.rightButtonDown = cursors.right.isDown;
  state.downButtonDown = cursors.down.isDown;

  state.jumpButtonDown = keys.Z.isDown;

  listenProp('keyboard.Z', keys.Z.isDown);
  listenProp('keyboard.X', keys.X.isDown);
  listenProp('keyboard.C', keys.C.isDown);
  listenProp('keyboard.up', cursors.up.isDown);
  listenProp('keyboard.down', cursors.down.isDown);
  listenProp('keyboard.left', cursors.left.isDown);
  listenProp('keyboard.right', cursors.right.isDown);

  var rumble = state.rumble;
  state.rumble = null;

  if (game.input.gamepad.total) {
    var pads = game.input.gamepad.gamepads;
    pads.filter(function (pad) {
      return pad;
    }).forEach(function (pad) {
      /*
      if (rumble) {
        if (pad.vibration && pad.vibration.playEffect) {
          pad.vibration.playEffect('dual-rumble', {
            duration: 1000,
            strongMagnitude: 1.0,
            weakMagnitude: 1.0,
          });
        } else if (pad.vibration && pad.vibration.pulse) {
          pad.vibration.pulse(1.0, 1000);
        }
      }
      */

      var A = pad.A,
          B = pad.B,
          X = pad.X,
          Y = pad.Y,
          up = pad.up,
          down = pad.down,
          left = pad.left,
          right = pad.right,
          leftStick = pad.leftStick,
          rightStick = pad.rightStick;


      state.upButtonDown = state.upButtonDown || leftStick.y < 0.2 || rightStick.y < -0.2 || up;
      state.leftButtonDown = state.leftButtonDown || leftStick.x < -0.2 || leftStick.x < -0.2 || left;
      state.rightButtonDown = state.rightButtonDown || leftStick.x > 0.2 || leftStick.x > 0.2 || right;
      state.downButtonDown = state.downButtonDown || leftStick.y > 0.2 || leftStick.y > 0.2 || down;

      state.jumpButtonDown = state.jumpButtonDown || A || B || X || Y;
    });
  }

  if (state.jumpButtonDown) {
    state.jumpButtonFrames = (state.jumpButtonFrames || 0) + 1;
    state.jumpButtonStarted = state.jumpButtonFrames === 1;
  } else {
    state.jumpButtonFrames = 0;
    state.jumpButtonStarted = false;
  }

  listenProp('input.upButtonDown', state.upButtonDown);
  listenProp('input.downButtonDown', state.downButtonDown);
  listenProp('input.leftButtonDown', state.leftButtonDown);
  listenProp('input.rightButtonDown', state.rightButtonDown);
  listenProp('input.jumpButtonDown', state.jumpButtonDown);
}

function jumpShake(type) {
  reactFloodlightsToJump();
  if (type !== JUMP_NORMAL) {
    state.rumble = true;
    state.game.cameras.main.shake(prop('effect.jumpshake.duration_ms'), prop('effect.jumpshake.amount'));
  }
}

function processInput() {
  var game = state.game,
      level = state.level,
      upButtonDown = state.upButtonDown,
      downButtonDown = state.downButtonDown,
      leftButtonDown = state.leftButtonDown,
      rightButtonDown = state.rightButtonDown,
      jumpButtonStarted = state.jumpButtonStarted,
      jumpButtonDown = state.jumpButtonDown,
      jumpButtonHeld = state.jumpButtonHeld;
  var player = level.player;


  if (player.ignoreInput) {
    return;
  }

  var canJump = player.body.touching.down || !player.isJumping && player.framesSinceTouchingDown < 3;

  if (jumpButtonHeld && !jumpButtonDown) {
    state.jumpButtonHeld = false;
  }

  if (jumpButtonStarted) {
    player.isJumping = true;
    state.jumpButtonHeld = true;
    player.body.setGravityY(0);
    if (canJump) {
      jumpShake(JUMP_NORMAL);
      jumpPuff(false);
      jumpPuff(true);
      level.jumps++;
      save.levels[level.index].jumps++;
      player.setVelocityY(-prop('velocityY.jump'));
      playSound('soundJump', 3);
    } else if (player.canWallJump && (player.body.touching.left && leftButtonDown || player.body.touching.right && rightButtonDown)) {
      jumpShake(JUMP_WALL);
      level.walljumps++;
      save.levels[level.index].walljumps++;
      player.body.setGravityY(-100);
      player.setVelocityY(-prop('velocityY.wall_jump'));
      if (player.body.touching.right) {
        player.facingLeft = true;
        player.wallJumpDirectionLeft = true;
        jumpPuff(true);
        player.setFlipX(false);
      } else {
        player.facingLeft = false;
        player.wallJumpDirectionLeft = false;
        jumpPuff(false);
        player.setFlipX(true);
      }

      player.isWallJumping = true;
      player.wallJumpIgnoreDirection = true;
      player.wallJumpContinuing = true;
      player.wallJumpHeld = true;
      player.wallJumpContra = false;
      var suppressSound = spendLife(true);
      if (!suppressSound) {
        playSound('soundWalljump');
      }

      game.time.addEvent({
        delay: prop('wall_jump_ignore_direction_ms'),
        callback: function callback() {
          player.wallJumpIgnoreDirection = false;
        }
      });

      player.isDoubleJumping = false;
    } else if (player.canDoubleJump) {
      jumpShake(JUMP_DOUBLE);
      level.doublejumps++;
      save.levels[level.index].doublejumps++;
      player.setVelocityY(-prop('velocityY.double_jump'));
      player.isDoubleJumping = true;

      player.isWallJumping = false;
      player.wallJumpIgnoreDirection = false;
      player.wallJumpContinuing = false;
      player.wallJumpHeld = false;
      player.wallJumpContra = false;

      jumpPuff(true, true);
      jumpPuff(false, true);

      var _suppressSound = spendLife(true);
      if (!_suppressSound) {
        playSound('soundDoubleJump');
      }
    }
  }

  if (player.isWallJumping && (player.wallJumpDirectionLeft && player.body.touching.left || !player.wallJumpDirectionLeft && player.body.touching.right)) {
    player.setVelocityX(0);
    player.setAccelerationX(0);
    player.isWallJumping = false;
    player.wallJumpIgnoreDirection = false;
    player.wallJumpContinuing = false;
    player.wallJumpHeld = false;
    player.wallJumpContra = false;
  }

  if (player.isWallJumping && !player.wallJumpIgnoreDirection && (player.wallJumpDirectionLeft && rightButtonDown || !player.wallJumpDirectionLeft && leftButtonDown)) {
    player.wallJumpContra = true;
  }

  if (player.wallJumpContra) {
    player.wallJumpContinuing = false;
    player.wallJumpHeld = false;
  }

  if (!player.wallJumpIgnoreDirection && (player.wallJumpDirectionLeft && !leftButtonDown || !player.wallJumpDirectionLeft && !rightButtonDown)) {
    player.wallJumpHeld = false;
  }

  if (player.wallJumpIgnoreDirection || player.wallJumpHeld) {
    var x = prop('velocityX.wall_jump');
    if (player.facingLeft) {
      player.setVelocityX(-x);
    } else {
      player.setVelocityX(x);
    }
  } else if (player.wallJumpContinuing) {
    // lerp down to the slower speed
    var _x = prop('velocityX.walk');
    if (player.wallJumpDirectionLeft) {
      _x *= -1;
    }
    var vx = player.body.velocity.x + 0.5 * (_x - player.body.velocity.x);
    player.setVelocityX(vx);
  } else if (player.wallJumpContra) {
    // lerp down to the reverse speed
    var _x2 = prop('velocityX.reversed_wall_jump');
    if (leftButtonDown) {
      _x2 *= -1;
    }
    var _vx = player.body.velocity.x + 0.3 * (_x2 - player.body.velocity.x);
    player.setVelocityX(_vx);
  } else {
    var _x3 = prop('velocityX.walk');
    if (player.isJumping) {
      if (player.isWallJumping && (player.wallJumpDirectionLeft && rightButtonDown || !player.wallJumpDirectionLeft && leftButtonDown)) {
        _x3 = prop('velocityX.reversed_wall_jump');
      } else if (player.isDoubleJumping) {
        _x3 = prop('velocityX.double_jump');
      } else {
        _x3 = prop('velocityX.jump');
      }
    }

    if (leftButtonDown) {
      player.setVelocityX(-_x3);
      player.facingLeft = true;
    } else if (rightButtonDown) {
      player.setVelocityX(_x3);
      player.facingLeft = false;
    } else {
      player.setVelocityX(0);
    }
  }
}

function renderDebug() {
  var level = state.level;
  var player = level.player;


  listenProp('level.timers', level.timers.length);

  listenProp('player.life', player.life);
  listenProp('player.x', player.x);
  listenProp('player.y', player.y);
  listenProp('player.velocity.x', player.body.velocity.x);
  listenProp('player.velocity.y', player.body.velocity.y);
  listenProp('player.invincible', player.invincible);
  listenProp('player.ignoreInput', player.ignoreInput);
  listenProp('player.canCancelIgnoreInput', player.canCancelIgnoreInput);
  listenProp('player.canDoubleJump', player.canDoubleJump);
  listenProp('player.isDoubleJumping', player.isDoubleJumping);
  listenProp('player.canWallJump', player.canWallJump);
  listenProp('player.isWallJumping', player.isWallJumping);
  listenProp('player.wallJumpIgnoreDirection', player.wallJumpIgnoreDirection);
  listenProp('player.wallJumpContinuing', player.wallJumpContinuing);
  listenProp('player.wallJumpDirectionLeft', player.wallJumpDirectionLeft);
  listenProp('player.wallJumpHeld', player.wallJumpHeld);
  listenProp('player.wallJumpContra', player.wallJumpContra);
  listenProp('player.touching.up', player.body.touching.up);
  listenProp('player.touching.down', player.body.touching.down);
  listenProp('player.touching.left', player.body.touching.left);
  listenProp('player.touching.right', player.body.touching.right);

  listenProp('player.freebies', player.freebies);

  if (state.shader) {
    state.shader.setFloat1('shockwaveScale', prop('effect.shockwave.scale'));
    state.shader.setFloat1('shockwaveRange', prop('effect.shockwave.range'));
    state.shader.setFloat1('shockwaveThickness', prop('effect.shockwave.thickness'));
    state.shader.setFloat1('shockwaveSpeed', prop('effect.shockwave.speed'));
    state.shader.setFloat1('shockwaveInner', prop('effect.shockwave.inner'));
    state.shader.setFloat1('shockwaveDropoff', prop('effect.shockwave.dropoff'));
  }
}

function manageWallDragPuff(isEnabled, isLeft) {
  var game = state.game,
      level = state.level;
  var player = level.player;


  if (isEnabled && !player.wallDragPuff) {
    var particles = game.add.particles('effectImagePuff');
    particles.setDepth(5);
    var emitter = particles.createEmitter({
      speed: 50,
      x: player.width * 0.4 * (isLeft ? -1 : 1),
      y: { min: -player.height * 0.4, max: player.height * 0.5 },
      scale: { start: 0.25, end: 0.5 },
      blendMode: 'ADD',
      quantity: 1,
      alpha: 0.5,
      rotate: { min: 0, max: 360 },
      maxParticles: 12,
      angle: isLeft ? { min: 280, max: 310 } : { min: 230, max: 260 },
      lifespan: 200
    });
    emitter.startFollow(player);

    level.particles.push(particles);
    player.wallDragPuff = { particles: particles, emitter: emitter };
  } else if (isEnabled) {
    // update
  } else if (player.wallDragPuff) {
    var _player$wallDragPuff = player.wallDragPuff,
        _particles2 = _player$wallDragPuff.particles,
        _emitter2 = _player$wallDragPuff.emitter;

    _emitter2.stopFollow();
    _emitter2.stop();
    game.time.addEvent({
      delay: 1000,
      callback: function callback() {
        level.particles = level.particles.filter(function (p) {
          return p !== _particles2;
        });
        _particles2.destroy();
      }
    });
    delete player.wallDragPuff;
  }
}

function jumpPuff(isLeft, downward) {
  var game = state.game,
      level = state.level;
  var player = level.player;


  var particles = game.add.particles('effectImagePuff');
  particles.setDepth(5);
  var emitter = particles.createEmitter({
    speed: 50,
    x: player.x + player.width * (isLeft ? -0.2 : 0.2),
    y: player.y + player.height * 0.4,
    scale: { start: 0.7, end: 1 },
    quantity: 1,
    alpha: { start: 0.4, end: 0 },
    rotate: { start: 0, end: isLeft ? 90 : -90 },
    maxParticles: 2,
    angle: isLeft ? { min: 180, max: 180 } : { min: 0, max: 0 },
    lifespan: 500,
    gravityY: downward ? 200 : -200
  });

  level.particles.push(particles);

  game.time.addEvent({
    delay: 500,
    callback: function callback() {
      emitter.stop();
      game.time.addEvent({
        delay: 1000,
        callback: function callback() {
          level.particles = level.particles.filter(function (p) {
            return p !== particles;
          });
          particles.destroy();
        }
      });
    }
  });
}

function setPlayerAnimation(type) {
  var level = state.level;
  var player = level.player;


  if (type === undefined) {
    type = player.previousAnimation;
  }
  var status = player.freebies > 0 ? 'Shielded' : 'Default';
  var animation = 'spritePlayer' + status + type;
  player.anims.play(animation, type === player.previousAnimation && status === player.previousStatus);
  player.previousAnimation = type;
  player.previousStatus = status;
}

function frameUpdates(dt) {
  var level = state.level,
      leftButtonDown = state.leftButtonDown,
      rightButtonDown = state.rightButtonDown;
  var player = level.player,
      hud = level.hud;


  if (player.body.velocity.y > 500) {
    player.setVelocityY(500);
  }

  if (player.body.touching.down) {
    if (leftButtonDown) {
      setPlayerAnimation('Walk');
    } else if (rightButtonDown) {
      setPlayerAnimation('Walk');
    } else {
      setPlayerAnimation('Neutral');
    }
  } else if (player.body.velocity.y <= 0) {
    setPlayerAnimation('JumpUp');
  } else {
    setPlayerAnimation('JumpDown');
  }

  if (!player.wallJumpIgnoreDirection && leftButtonDown) {
    player.setFlipX(false);
  } else if (!player.wallJumpIgnoreDirection && rightButtonDown) {
    player.setFlipX(true);
  }

  level.objects.pupils.forEach(function (pupil) {
    var x = pupil.pupilOriginX;
    var y = pupil.pupilOriginY;

    var dx = player.x - x;
    var dy = player.y - y;

    var theta = Math.atan2(dy, dx);
    x += config.tileWidth / 5 * Math.cos(theta);
    y += config.tileHeight / 5 * Math.sin(theta);

    pupil.x += 0.05 * (x - pupil.x);
    pupil.y += 0.05 * (y - pupil.y);
  });

  if (player.body.touching.down) {
    player.framesSinceTouchingDown = 0;
  } else {
    player.framesSinceTouchingDown++;
  }

  if (player.ignoreInput && player.canCancelIgnoreInput) {
    if (player.body.touching.down || player.body.touching.left || player.body.touching.right || player.body.touching.up) {
      player.ignoreInput = false;
      player.canCancelIgnoreInput = false;
    }
  }

  if (!player.body.touching.down && !state.isWallJumping && (player.body.velocity.y > -40 || !state.jumpButtonHeld)) {
    player.body.setGravityY(config.physics.arcade.gravity.y * 4);
  }

  if (player.body.touching.down) {
    player.body.setGravityY(0);
    player.isJumping = false;

    player.canDoubleJump = true;
    player.isDoubleJumping = false;

    if (prop('cheat.forbidDoubleJump')) {
      player.canDoubleJump = false;
    }

    player.canWallJump = true;
    player.isWallJumping = false;
    player.wallJumpIgnoreDirection = false;
    player.wallJumpContinuing = false;
    player.wallJumpHeld = false;
    player.wallJumpContra = false;
    player.jumpButtonHeld = false;

    if (prop('cheat.forbidWallJump')) {
      player.canWallJump = false;
    }

    /*
    level.objects.freebies.forEach((freebie) => {
      if (freebie.spent) {
        freebie.spent = false;
        freebie.setFrame(0);
      }
    });
     if (player.freebies) {
      player.freebies = 0;
      hud.freebies.forEach((freebie) => {
        freebie.destroy();
      });
      hud.freebies = [];
    }
    */
  }

  // make sure movers never get out of hand
  level.objects.movers.forEach(function (mover) {
    var distance = mover.config.distance * config.tileWidth / 2;
    if (mover.x < mover.initialPosition[0] - distance) {
      mover.x = mover.initialPosition[0] - distance;
    }
    if (mover.x > mover.initialPosition[0] + distance) {
      mover.x = mover.initialPosition[0] + distance;
    }
  });

  // squish and stretch
  var vx = Math.abs(player.body.velocity.x) / (config.tileWidth * config.tileWidth);
  var vy = Math.abs(player.body.velocity.y) / (config.tileHeight * config.tileHeight);
  /*
  if (vx > vy) {
    vy = -vx;
  } else if (vy > vx) {
    vx = -vy;
  }
  */
  if (vx + vy > 0) {
    var _ref2 = [(vx - vy) / (vx + vy), (vy - vx) / (vx + vy)];
    vx = _ref2[0];
    vy = _ref2[1];
  }

  var puffLeft = player.body.touching.left && state.leftButtonDown;
  var puffEnabled = false;
  if (player.body.touching.left && state.leftButtonDown || player.body.touching.right && state.rightButtonDown) {
    vx = 0.7;
    vy = -0.7;
    var max = prop('player.grab.max_y');
    // we intentionally don't do this for the other direction because of
    // jumping against walls being a common case
    if (player.body.velocity.y > max) {
      player.setVelocityY(max);
      puffEnabled = true;
      setPlayerAnimation('Drag');
      if (leftButtonDown) {
        player.setFlipX(true);
      } else if (rightButtonDown) {
        player.setFlipX(false);
      }
    }
  }

  manageWallDragPuff(puffEnabled, puffLeft);

  if (player.isDoubleJumping) {
    vy += 0.7;
    vx -= 0.7;
  } else if (player.isWallJumping) {
    vx += 0.7;
    vy -= 0.7;
  }

  vx *= prop('player.squish.max');
  vy *= prop('player.squish.max');
  vy += 1;
  vx += 1;

  // intentionally flipped for vx, vy
  var scaleX = player.scaleX + prop('player.squish.speed') * (vy - player.scaleX) * dt / 16.667;
  var scaleY = player.scaleY + prop('player.squish.speed') * (vx - player.scaleY) * dt / 16.667;

  player.setScale(scaleX, scaleY); // intentionally flipped

  if (state.shader) {
    state.shockwaveTime += state.shockwaveIncrement;
    state.shader.setFloat1('shockwaveTime', state.shockwaveTime);
  }
}

function updateEnemies() {
  var level = state.level,
      physics = state.physics;
  var enemies = level.enemies;


  enemies.forEach(function (enemy) {
    // hasn't ever touched the floor yet…
    if (!enemy.body.touching.down && enemy.movingLeft === undefined) {
      enemy.setVelocityX(0);
    } else {
      if (enemy.movingLeft === undefined) {
        enemy.movingLeft = !!enemy.config.startsMovingLeft;
      } else if (enemy.movingLeft && enemy.body.touching.left) {
        enemy.movingLeft = false;
      } else if (!enemy.movingLeft && enemy.body.touching.right) {
        enemy.movingLeft = true;
      }

      enemy.setFlipX(!enemy.movingLeft);

      if (enemy.config.edgeCareful) {
        if (enemy.body.velocity.y > 0) {
          enemy.movingLeft = !enemy.movingLeft;
          enemy.setAccelerationY(0);
          enemy.setVelocityY(0);
          enemy.x = enemy.oldX;
          enemy.y = enemy.oldY;
        }

        enemy.oldX = enemy.x;
        enemy.oldY = enemy.y;
      }

      if (enemy.movingLeft) {
        enemy.setVelocityX(-enemy.config.speed);
      } else {
        enemy.setVelocityX(enemy.config.speed);
      }
    }
  });
}

function update_jumpcoins(time, dt) {
  var game = state.game,
      keys = state.keys,
      cursors = state.cursors,
      debug = state.debug;


  listenProp('time', time);
  listenProp('frameTime', dt);

  readInput();
  processInput();
  frameUpdates(dt);
  updateEnemies();

  if (DEBUG) {
    renderDebug();
  }
}

var didAlert = false;
function err(msg) {
  if (!didAlert) {
    // eslint-disable-next-line no-alert
    alert(msg);
    didAlert = true;
  }

  throw new Error(msg);
}

