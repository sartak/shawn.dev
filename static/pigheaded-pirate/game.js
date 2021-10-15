// SACRIFICES MUST BE MADE
//
var DEBUG = false;

var config = {
  debug: DEBUG,
  type: Phaser.AUTO,
  parent: 'engine',
  width: 800,
  height: 600,
  input: {
    gamepad: true
  },
  levelNames: ['level-1', 'level-2', 'level-3'],
  physics: {
    default: 'matter',
    matter: {
      debug: DEBUG
    }
  },
  scene: {
    preload: preload_pigheaded,
    create: create_pigheaded,
    update: update_pigheaded
  }
};

function createLevel(index) {
  var level = {
    index: index,
    name: config.levelNames[index],
    heroDeaths: 0,
    sidekickDeaths: 0,
    enemies: [],
    waveEnemies: [],
    throwState: 'calm',
    wigglePhase: 0,
    facingRight: true,
    endLabels: []
  };

  if (DEBUG) {
    window.level = level;
  }
  return level;
}

var state = {
  level: createLevel(0),
  physicsShapes: physicsShapes,
  keys: {},
  heroDeaths: 0,
  sidekickDeaths: 0,
  tutorialState: 'begin'
};

var enemyDefaults = {
  a: { hp: 100,
    attack: 1,
    mass: 7,
    quick: 1,
    jumps: false },
  b: { hp: 150,
    attack: 1,
    mass: 7,
    quick: 1.5,
    jumps: true },
  c: { hp: 50,
    attack: 3,
    mass: 7,
    quick: 0.5,
    jumps: true },
  k: { hp: 700,
    attack: 1.5,
    quick: 2,
    mass: 40,
    flippy: false,
    jumps: true },
  x: { hp: 200,
    attack: 2,
    mass: 14,
    quick: 0,
    jumps: false }
};

var whiteColor = {
  r: 255,
  g: 255,
  b: 255
};
var redColor = {
  r: 255,
  g: 0,
  b: 0
};
var greenColor = {
  r: 0,
  g: 255,
  b: 0
};

var physicsShapes = {
	"generator_info": "Shape definitions generated with PhysicsEditor. Visit https://www.codeandweb.com/physicseditor",
	"ground": {
		"type": "fromPhysicsEditor",
		"label": "ground",
		"isStatic": true,
		"density": 0.10000000149011612,
		"restitution": 0,
		"friction": 0.10000000149011612,
		"frictionAir": 0.009999999776482582,
		"frictionStatic": 0.5,
		"collisionFilter": {
			"group": 0,
			"category": 1,
			"mask": 255
		},
		"fixtures": [
			{
				"label": "",
				"isSensor": false,
				"vertices": [
					[ { "x":0, "y":20 }, { "x":800, "y":20 }, { "x":800, "y":0 }, { "x":0, "y":0 } ]
				]
			}
		]
	},
	"wall": {
		"type": "fromPhysicsEditor",
		"label": "wall",
		"isStatic": true,
		"density": 0.1,
		"restitution": 0,
		"friction": 0.1,
		"frictionAir": 0.01,
		"frictionStatic": 0.5,
		"collisionFilter": {
			"group": 0,
			"category": 1,
			"mask": 255
		},
		"fixtures": [
			{
				"label": "",
				"isSensor": false,
				"vertices": [
					[ { "x":10, "y":800 }, { "x":10, "y":0 }, { "x":0, "y":0 }, { "x":0, "y":800 } ]
				]
			}
		]
	},
	"block": {
		"type": "fromPhysicsEditor",
		"label": "block-a",
		"isStatic": true,
		"density": 0.1,
		"restitution": 0,
		"friction": 0.1,
		"frictionAir": 0.01,
		"frictionStatic": 0.5,
		"collisionFilter": {
			"group": 0,
			"category": 1,
			"mask": 255
		},
		"fixtures": [
			{
				"label": "",
				"isSensor": false,
				"vertices": [
					[ { "x":32, "y":32 }, { "x":32, "y":0 }, { "x":0, "y":0 }, { "x":0, "y":32 } ]
				]
			}
		]
	},
	"enemy-a": {
		"type": "fromPhysicsEditor",
		"label": "enemy-a",
		"isStatic": false,
		"density": 0.10000000149011612,
		"restitution": 0,
		"friction": 0.10000000149011612,
		"frictionAir": 0.009999999776482582,
		"frictionStatic": 0.5,
		"collisionFilter": {
			"group": 0,
			"category": 1,
			"mask": 255
		},
		"fixtures": [
			{
				"label": "",
				"isSensor": false,
				"vertices": [
					[ { "x":70, "y":100 }, { "x":70, "y":0 }, { "x":0, "y":0 }, { "x":0, "y":100 } ]
				]
			}
		]
	},
	"enemy-b": {
		"type": "fromPhysicsEditor",
		"label": "enemy-b",
		"isStatic": false,
		"density": 0.10000000149011612,
		"restitution": 0,
		"friction": 0.10000000149011612,
		"frictionAir": 0.009999999776482582,
		"frictionStatic": 0.5,
		"collisionFilter": {
			"group": 0,
			"category": 1,
			"mask": 255
		},
		"fixtures": [
			{
				"label": "",
				"isSensor": false,
				"vertices": [
					[ { "x":70, "y":100 }, { "x":70, "y":0 }, { "x":0, "y":0 }, { "x":0, "y":100 } ]
				]
			}
		]
	},
	"enemy-c": {
		"type": "fromPhysicsEditor",
		"label": "enemy-c",
		"isStatic": false,
		"density": 0.10000000149011612,
		"restitution": 0,
		"friction": 0.10000000149011612,
		"frictionAir": 0.009999999776482582,
		"frictionStatic": 0.5,
		"collisionFilter": {
			"group": 0,
			"category": 1,
			"mask": 255
		},
		"fixtures": [
			{
				"label": "",
				"isSensor": false,
				"vertices": [
					[ { "x":70, "y":100 }, { "x":70, "y":0 }, { "x":0, "y":0 }, { "x":0, "y":100 } ]
				]
			}
		]
	},
	"enemy-k": {
		"type": "fromPhysicsEditor",
		"label": "enemy-k",
		"isStatic": false,
		"density": 0.10000000149011612,
		"restitution": 0,
		"friction": 0.10000000149011612,
		"frictionAir": 0.009999999776482582,
		"frictionStatic": 0.5,
		"collisionFilter": {
			"group": 0,
			"category": 1,
			"mask": 255
		},
		"fixtures": [
			{
				"label": "",
				"isSensor": false,
				"vertices": [
					[ { "x":136, "y":200 }, { "x":136, "y":11 }, { "x":6, "y":11 }, { "x":6, "y":200 } ]
				]
			}
		]
	},
	"enemy-x": {
		"type": "fromPhysicsEditor",
		"label": "enemy-x",
		"isStatic": true,
		"density": 0.10000000149011612,
		"restitution": 0,
		"friction": 0.10000000149011612,
		"frictionAir": 0.009999999776482582,
		"frictionStatic": 0.5,
		"collisionFilter": {
			"group": 0,
			"category": 1,
			"mask": 255
		},
		"fixtures": [
			{
				"label": "",
				"isSensor": false,
				"vertices": [
					[ { "x":14, "y":120 }, { "x":77, "y":120 }, { "x":77, "y":61 }, { "x":14, "y":61 } ]
				]
			}
		]
	},
	"sidekick": {
		"type": "fromPhysicsEditor",
		"label": "sidekick",
		"isStatic": false,
		"density": 0.10000000149011612,
		"restitution": 0,
		"friction": 0.10000000149011612,
		"frictionAir": 0.009999999776482582,
		"frictionStatic": 0.5,
		"collisionFilter": {
			"group": 0,
			"category": 1,
			"mask": 255
		},
		"fixtures": [
			{
				"label": "",
				"isSensor": false,
				"vertices": [
					[ { "x":70, "y":70 }, { "x":70, "y":0 }, { "x":0, "y":0 }, { "x":0, "y":70 } ]
				]
			}
		]
	}
};

if (DEBUG) {
  window.state = state;
}

function startGame() {
  return new Phaser.Game(config);
}

function preload_pigheaded() {
  var game = state.game = this;

  var base = '/pigheaded-pirate/assets/';

  game.load.spritesheet('hero', base + 'hero.png', { frameWidth: 70,
    frameHeight: 100 });
  game.load.spritesheet('sidekick', base + 'sidekick.png', { frameWidth: 70,
    frameHeight: 70 });

  game.load.image('enemy-a', base + 'enemy-a.png');
  game.load.image('enemy-b', base + 'enemy-b.png');
  game.load.image('enemy-c', base + 'enemy-c.png');
  game.load.image('enemy-k', base + 'enemy-k.png');
  game.load.image('enemy-x', base + 'enemy-x.png');
  game.load.image('exit', base + 'exit.png');
  game.load.image('level-1', base + 'level-1.png');
  game.load.image('level-2', base + 'level-2.png');
  game.load.image('level-3', base + 'level-3.png');
  game.load.image('ground', base + 'ground.png');
  game.load.image('wall', base + 'wall.png');
  game.load.image('hpbar', base + 'hpbar.png');
  game.load.image('star', base + 'star.png');
  game.load.image('radial', base + 'radial.png');

  game.load.image('block-a', base + 'block-a.png');
  game.load.image('block-b', base + 'block-b.png');
  game.load.image('block-c', base + 'block-c.png');
  game.load.image('block-d', base + 'block-d.png');
  game.load.image('block-e', base + 'block-e.png');
  game.load.image('block-f', base + 'block-f.png');
  game.load.image('block-g', base + 'block-g.png');
  game.load.image('block-h', base + 'block-h.png');
  game.load.image('block-i', base + 'block-i.png');
  game.load.image('block-j', base + 'block-j.png');
  game.load.image('block-k', base + 'block-k.png');
  game.load.image('block-l', base + 'block-l.png');
  game.load.image('block-m', base + 'block-m.png');
  game.load.image('block-n', base + 'block-n.png');
  game.load.image('block-o', base + 'block-o.png');
  game.load.image('block-p', base + 'block-p.png');
  game.load.image('block-q', base + 'block-q.png');
  game.load.image('block-r', base + 'block-r.png');

  game.load.text('level-1', base + 'level-1.map');
  game.load.text('level-2', base + 'level-2.map');
  game.load.text('level-3', base + 'level-3.map');

  game.load.audio('pickup-sidekick', base + 'pickup-sidekick.wav');
  game.load.audio('unlock-exit', base + 'unlock-exit.wav');
  game.load.audio('throw-sidekick', base + 'throw-sidekick.wav');
  game.load.audio('sidekick-hits', base + 'sidekick-hits.wav');
  game.load.audio('hero-hit', base + 'hero-hit.wav');
  game.load.audio('hero-die', base + 'hero-die.wav');
  game.load.audio('sidekick-die', base + 'sidekick-die.wav');
  game.load.audio('hero-hits', base + 'hero-hits.wav');
  game.load.audio('enemy-die', base + 'enemy-die.wav');
  game.load.audio('hero-respawn', base + 'hero-respawn.wav');
  game.load.audio('sidekick-respawn', base + 'sidekick-respawn.wav');
  game.load.audio('jump', base + 'jump.wav');
}

function createHero(_ref, isInitial) {
  var x = _ref.x,
      y = _ref.y;
  var game = state.game,
      matter = state.matter;


  var hero = matter.add.sprite(0, 0, 'hero', null, { shape: physicsShapes.hero });

  var _Phaser$Physics$Matte = Phaser.Physics.Matter.Matter,
      Body = _Phaser$Physics$Matte.Body,
      Bodies = _Phaser$Physics$Matte.Bodies;
  var w = hero.width,
      h = hero.height;


  var sensors = hero.sensors = {
    t: Bodies.rectangle(0, -h * 0.5 - 2, w * 0.5, 4, { isSensor: true }),
    b: Bodies.rectangle(0, h * 0.5 + 2, w * 0.5, 4, { isSensor: true }),
    l: Bodies.rectangle(-w * 0.5 - 2, 0, 4, h * 0.5, { isSensor: true }),
    r: Bodies.rectangle(w * 0.5 + 2, 0, 4, h * 0.5, { isSensor: true })
  };

  var compoundBody = Body.create({
    parts: [hero.body, sensors.t, sensors.b, sensors.l, sensors.r],
    frictionStatic: 0,
    frictionAir: 0.02,
    friction: 0.1
  });

  hero.setExistingBody(compoundBody);

  hero.setPosition(x, y);

  hero.setMass(7.68);

  hero.attack = 0.25;

  // can't rotate
  hero.setFixedRotation();

  hero.touching = {
    left: false,
    right: false,
    bottom: false
  };

  if (isInitial) {
    updateCachedVelocityFor(hero);
    createHpBar(hero, 200);
  }

  return hero;
}

function createSidekick(_ref2, isInitial) {
  var x = _ref2.x,
      y = _ref2.y;
  var game = state.game;


  var sidekick = game.matter.add.sprite(x, y, 'sidekick', null, { shape: physicsShapes.sidekick });

  if (isInitial) {
    updateCachedVelocityFor(sidekick);
    createHpBar(sidekick, 300);
  }

  sidekick.xHoldLag = 0;
  sidekick.yHoldBob = 0;
  sidekick.name = 'sidekick';
  sidekick.setMass(4.9);
  sidekick.attack = 1.75;

  return sidekick;
}

function replaceSidekick(existing) {
  var replacement = createSidekick({
    x: existing.x,
    y: existing.y
  }, false);

  replacement.hpBar = existing.hpBar;
  replacement.previousHP = existing.previousHP;
  replacement.currentHP = existing.currentHP;
  replacement.maxHP = existing.maxHP;
  replacement.cachedVelocity = existing.cachedVelocity;
  replacement.yHoldUp = existing.yHoldUp;
  delete replacement.yHoldTween;

  existing.destroy();

  return replacement;
}

function createHpBar(owner, maxHP) {
  var game = state.game;
  var x = owner.x,
      y = owner.y;


  var border = game.add.sprite(x, y, 'hpbar');
  var fill = game.add.sprite(x, y, 'hpbar');
  var hpBar = {
    fill: fill,
    border: border
  };

  fill.setCrop(1, 1, fill.width - 2, fill.height - 2);
  fill.tint = greenToRedFade(1);

  border.tint = 0;

  owner.hpBar = hpBar;
  owner.currentHP = owner.previousHP = owner.maxHP = maxHP;

  return hpBar;
}

function createEnemy(_ref3) {
  var type = _ref3.type,
      x = _ref3.x,
      y = _ref3.y;
  var game = state.game;

  var enemyId = 'enemy-' + type;

  var enemy = game.matter.add.sprite(x, y, enemyId, null, { shape: physicsShapes[enemyId] });

  enemy.enemyType = type;
  enemy.attack = enemyDefaults[type].attack;
  enemy.quick = enemyDefaults[type].quick;
  enemy.jumps = enemyDefaults[type].jumps;
  enemy.flippy = enemyDefaults[type].flippy;

  if (enemyDefaults[type].mass) {
    enemy.setMass(enemyDefaults[type].mass);
  }

  updateCachedVelocityFor(enemy);
  createHpBar(enemy, enemyDefaults[type].hp);

  return enemy;
}

function greenToRedFade(fraction) {
  fraction = Math.min(Math.max(0, fraction), 1) * 510;
  var blue = 0;
  var red = void 0;
  var green = void 0;
  if (fraction < 255) {
    red = 255;
    green = Math.sqrt(fraction) * 16;
    green = Math.round(green);
  } else {
    green = 255;
    fraction -= 255;
    red = 255 - fraction * fraction / 255;
    red = Math.round(red);
  }

  return blue + 256 * green + 256 * 256 * red;
}

function updateHpBarFor(owner) {
  var game = state.game;
  var previousHP = owner.previousHP,
      currentHP = owner.currentHP,
      maxHP = owner.maxHP,
      hpBar = owner.hpBar;
  var fill = hpBar.fill,
      border = hpBar.border;

  // respect rotation? offset?

  border.x = owner.x;
  border.y = owner.y - owner.height * 0.75;
  fill.x = owner.x;
  fill.y = owner.y - owner.height * 0.75;

  // tween em if you got em
  if (previousHP !== currentHP) {
    if (fill.tween) {
      fill.tween.stop();
    }

    fill.tween = game.tweens.addCounter({
      from: fill.tween ? fill.tween.getValue() : previousHP,
      to: currentHP,
      duration: 500,
      ease: 'Cubic.easeInOut',
      onUpdate: function onUpdate() {
        var percentHP = fill.tween.getValue() / maxHP;
        fill.setCrop(1, 1, fill.width * percentHP - 2, fill.height - 2);
        fill.tint = greenToRedFade(percentHP);
      }
    });

    owner.previousHP = currentHP;
  }
}

function isOutOfBounds(character) {
  var ceiling = state.ceiling,
      ground = state.ground,
      leftWall = state.leftWall,
      rightWall = state.rightWall;

  return character.y < ceiling.position.y - 50 || character.y > ground.y || character.x < leftWall.x || character.x > rightWall.x;
}

function playSound(name) {
  var game = state.game;
  try {
    game.sound.play(name);
  } catch (e) {
    console.log(e);
  }
}

function updateEnemy(enemy) {
  var game = state.game,
      matter = state.matter,
      level = state.level;
  var hero = level.hero,
      waveEnemies = level.waveEnemies;


  if (enemy.isDying) {
    return;
  }

  if (isOutOfBounds(enemy)) {
    enemy.currentHP = -1;
  }

  updateCachedVelocityFor(enemy);
  updateHpBarFor(enemy);

  if (enemy.currentHP <= 0) {
    matter.world.remove(enemy);
    enemy.isDying = true;

    if (enemy.enemyType === 'x') {
      var sprite = game.add.sprite(enemy.x, enemy.y - 32, 'exit');
      removeEnemy(enemy);
      playSound('unlock-exit');
      createTreasureEffects(sprite);
      level.exit = {
        x: sprite.x,
        y: sprite.y,
        sprite: sprite
      };
    } else {
      game.tweens.add({
        targets: enemy,
        alpha: 0,
        y: enemy.y - 100,
        angle: enemy.angle - 45,
        duration: 500,
        onComplete: function onComplete() {
          removeEnemy(enemy);
        }
      });
    }

    return;
  }

  var hasOnscreenEnemy = waveEnemies.find(function (e) {
    return e.x < game.cameras.main.scrollX + config.width + 100;
  });

  if (waveEnemies.find(function (e) {
    return e === enemy;
  })) {
    if (!hasOnscreenEnemy) {
      return;
    }

    if (enemy.enemyType !== 'x') {
      if (enemy.jumps && hero.y < enemy.y - 20 && enemy.body.velocity.y < 0.1) {
        if (!enemy.nextJump || Date.now() > enemy.nextJump) {
          enemy.nextJump = Date.now() + 1000 * Phaser.Math.Between(3, 10);
          enemy.applyForce({
            x: 0,
            y: -0.30
          });
        }
      }

      var dx = hero.x - enemy.x;
      if (dx < -10) {
        if (enemy.flippy !== false) {
          enemy.setFlipX(true);
        }

        enemy.applyForce({
          x: -0.004 * enemy.quick,
          y: 0
        });
      } else if (dx > 10) {
        if (enemy.flippy !== false) {
          enemy.setFlipX(false);
        }
        enemy.applyForce({
          x: 0.004 * enemy.quick,
          y: 0
        });
      } else {
        // attack
      }
    }
  }
}

function createTreasureEffects(sprite) {
  var game = state.game;


  var radial = game.add.image(sprite.x, sprite.y - 20, 'radial');
  radial.blendMode = 'ADD';
  radial.alpha = 0.33;
  sprite.radial = radial;

  radial.glowTween = game.tweens.add({
    targets: radial,
    alpha: 0.66,
    loop: -1,
    ease: 'Quad.easeInOut',
    yoyo: true,
    duration: 1000
  });

  return radial;
}

function updateCachedVelocityFor(character) {
  character.cachedVelocity = {
    x: character.body.velocity.x,
    y: character.body.velocity.y
  };
}

function removeHpBarFor(owner) {
  var hpBar = owner.hpBar;
  var fill = hpBar.fill,
      border = hpBar.border;

  fill.destroy();
  border.destroy();
}

function removeEnemy(enemy) {
  var matter = state.matter,
      level = state.level,
      game = state.game;


  removeHpBarFor(enemy);
  level.enemies = level.enemies.filter(function (e) {
    return e !== enemy;
  });
  level.waveEnemies = level.waveEnemies.filter(function (e) {
    return e !== enemy;
  });
  enemy.destroy();
  playSound('enemy-die');
}

function createGround() {
  var game = state.game,
      matter = state.matter;
  var vertices = physicsShapes.ground.fixtures[0].vertices;

  vertices[0][0].y = 100;
  vertices[0][1].y = 100;
  vertices[0][2].y = 0;
  vertices[0][3].y = 0;

  var _Phaser$Physics$Matte2 = Phaser.Physics.Matter.Matter,
      Body = _Phaser$Physics$Matte2.Body,
      Bodies = _Phaser$Physics$Matte2.Bodies;


  var ground = matter.add.sprite(config.width / 2, config.height + 50, 'ground', null, { shape: physicsShapes.ground });
  ground.name = 'ground';

  return ground;
}

function createWall(isRight, x, y) {
  var game = state.game,
      matter = state.matter;
  var vertices = physicsShapes.wall.fixtures[0].vertices;

  if (isRight) {
    vertices[0][0].x = 100;
    vertices[0][1].x = 100;
    vertices[0][2].x = 0;
    vertices[0][3].x = 0;
  } else {
    vertices[0][0].x = 10;
    vertices[0][1].x = 10;
    vertices[0][2].x = -90;
    vertices[0][3].x = -90;
  }

  var _Phaser$Physics$Matte3 = Phaser.Physics.Matter.Matter,
      Body = _Phaser$Physics$Matte3.Body,
      Bodies = _Phaser$Physics$Matte3.Bodies;


  var wall = matter.add.sprite(x, y, 'wall', null, { shape: physicsShapes.wall });
  if (isRight) {
    wall.setFlipX(true);
  }

  return wall;
}

function createCeiling() {
  var matter = state.matter;


  var ceiling = matter.add.rectangle(config.width / 2, -50, config.width, 100, {
    isStatic: true,
    friction: 0,
    frictionStatic: 0
  });

  return ceiling;
}

function createMap() {
  var matter = state.matter,
      game = state.game,
      level = state.level;


  var map = level.map = game.cache.text.get(level.name);

  var rows = map.split('\n');
  var cols = rows[0].split('').map(function (col) {
    return [];
  });
  rows.forEach(function (row, r) {
    row.split('').forEach(function (spec, c) {
      cols[c][r] = spec;
    });
  });

  var waves = [];
  var waveEnemies = [];
  var blocks = [];

  cols.forEach(function (col, c) {
    var x = c * 32;
    col.forEach(function (spec, r) {
      var y = r * 32 - 8; // 8 because doesnt cleanly divide

      if (spec === '.') {
        return;
      }

      if (spec === '@') {
        level.initialHeroPosition = {
          x: x,
          y: y - 32
        };
      } else if (spec === '$') {
        level.initialSidekickPosition = {
          x: x,
          y: y - 8
        };
      } else if (spec === '#') {
        // exit
        // add last wave if needed
        if (waveEnemies.length) {
          waves.push({
            enemies: waveEnemies,
            x_lock: x - config.width,
            i: waves.length
          });
          waveEnemies = [];
        }

        var enemy = createEnemy({
          type: 'x',
          x: x,
          y: y + 4
        });
        level.enemies.push(enemy);
        waveEnemies.push(enemy);
        waves.push({
          enemies: waveEnemies,
          x_lock: x - config.width + 64,
          i: waves.length
        });
      } else if (spec === '>') {
        // exit but not an enemy
        var sprite = game.add.sprite(x, y - 28, 'exit');
        level.exit = {
          x: x,
          y: y - 28,
          sprite: sprite
        };

        createTreasureEffects(sprite);
      } else if (spec === '|') {
        waves.push({
          enemies: waveEnemies,
          x_lock: x - config.width,
          i: waves.length
        });
        waveEnemies = [];
      } else if (spec.toUpperCase() === spec) {
        // uppercase is enemy
        var type = spec.toLowerCase();
        var _enemy = createEnemy({
          type: type,
          x: x,
          y: y - 16
        });
        level.enemies.push(_enemy);
        waveEnemies.push(_enemy);
      } else {
        // lowercase is block
        var _type = 'block-' + spec;
        var block = matter.add.sprite(x + 16, y + 16, _type, null, { shape: physicsShapes.block });
        block.name = block;
        blocks.push(block);
      }
    });
  });

  level.width = cols.length * 32;
  level.waves = waves;
  level.blocks = blocks;
}

function setupLevel(isInitial) {
  var game = state.game,
      level = state.level,
      leftWall = state.leftWall,
      rightWall = state.rightWall;


  level.background = game.add.sprite(0, 0, level.name);
  level.background.setPosition(level.background.width * 0.5, 300);

  createMap();

  game.cameras.main.scrollX = 0;
  game.cameras.main.setBounds(0, 0, level.width, 1080 * 2);

  if (isInitial) {
    level.readyToPlay = true;
    var hero = level.hero = createHero(level.initialHeroPosition, true);

    var sidekick = level.sidekick = createSidekick(level.initialSidekickPosition, true);

    // target, round pixels for jitter, lerpx, lerpy, offsetx, offsety
    game.cameras.main.startFollow(hero, false, 0.05, 0, 0, 270);
    game.cameras.main.setBounds(0, 0, level.width, 1080 * 2);
  } else {
    rightWall.x = level.width + 50;
    leftWall.x = -50;

    level.background.alpha = 0;
    game.tweens.add({
      targets: level.background,
      alpha: 1,
      duration: Math.sqrt(screen.width / 32) * 200 + 500,
      onComplete: function onComplete() {
        level.readyToPlay = true;
        var hero = level.hero = createHero(level.initialHeroPosition, true);

        var sidekick = level.sidekick = createSidekick(level.initialSidekickPosition, true);

        [hero, sidekick].forEach(function (character) {
          updateHpBarFor(character);
          [character, character.hpBar.fill, character.hpBar.border].forEach(function (component) {
            component.alpha = 0;

            game.tweens.add({
              targets: component,
              alpha: 1,
              ease: 'Cubic.easeOut',
              duration: 200
            });
          });
        });

        // target, round pixels for jitter, lerpx, lerpy, offsetx, offsety
        game.cameras.main.startFollow(hero, false, 0.05, 0, 0, 270);
        game.cameras.main.setBounds(0, 0, level.width, 1080 * 2);

        game.matter.resume();
      }
    });

    level.enemies.forEach(function (enemy) {
      var x = enemy.x,
          y = enemy.y;

      var dx = x - level.initialHeroPosition.x;
      var dy = y - level.initialHeroPosition.y;
      if (dx * dx + dy * dy > 2 * config.width * config.width) {
        return;
      }

      updateHpBarFor(enemy);
      [enemy, enemy.hpBar.fill, enemy.hpBar.border].forEach(function (component) {
        component.alpha = 0;
        component.y -= 100;

        game.tweens.add({
          targets: component,
          y: component.y + 100,
          alpha: 1,
          ease: 'Cubic.easeOut',
          delay: 200 + Math.sqrt(x / 32) * 200,
          duration: 1000
        });
      });
    });

    level.blocks.forEach(function (block) {
      var x = block.x,
          y = block.y;

      var dx = x - level.initialHeroPosition.x;
      var dy = y - level.initialHeroPosition.y;
      if (dx * dx + dy * dy > 2 * config.width * config.width) {
        return;
      }

      var xOffset = Phaser.Math.Between(-30, 30);
      var yOffset = Phaser.Math.Between(-30, 30);
      block.x -= xOffset;
      block.y -= yOffset;
      block.alpha = 0.5;
      game.tweens.add({
        targets: block,
        x: block.x + xOffset,
        y: block.y + yOffset,
        alpha: 1,
        ease: 'Cubic.easeOut',
        delay: Math.sqrt(x / 32) * 200,
        duration: Phaser.Math.Between(500, 1000)
      });
    });
  }
}

function create_pigheaded() {
  var _this = this;

  var game = state.game,
      level = state.level;
  var matter = game.matter;


  state.matter = matter;

  setupLevel(true);

  var ground = state.ground = createGround();
  var ceiling = state.ceiling = createCeiling();
  var leftWall = state.leftWall = createWall(false, -40, 400);
  var rightWall = state.rightWall = createWall(true, level.width + 40, 400);

  state.cursors = game.input.keyboard.createCursorKeys();

  game.input.keyboard.on('keydown_SPACE', function () {});

  game.input.keyboard.on('keydown', function () {});

  game.anims.create({
    key: 'neutral',
    frames: [{
      key: 'hero',
      frame: 0
    }]
  });

  game.anims.create({
    key: 'walk',
    frames: [{
      key: 'hero',
      frame: 0
    }, {
      key: 'hero',
      frame: 1
    }, {
      key: 'hero',
      frame: 0
    }, {
      key: 'hero',
      frame: 2
    }],
    frameRate: 8,
    repeat: -1
  });

  game.anims.create({
    key: 20,
    frames: [{
      key: 'sidekick',
      frame: 0
    }]
  });

  game.anims.create({
    key: 40,
    frames: [{ key: 'sidekick',
      frame: 1 }]
  });

  game.anims.create({
    key: 60,
    frames: [{ key: 'sidekick',
      frame: 2 }]
  });

  game.anims.create({
    key: 80,
    frames: [{ key: 'sidekick',
      frame: 3 }]
  });

  game.anims.create({
    key: 100,
    frames: [{ key: 'sidekick',
      frame: 4 }]
  });

  if (config.debug) {
    game.input.keyboard.on('keydown_Q', function () {
      game.scene.stop();
      var engine = document.querySelector('#engine canvas');
      if (engine) {
        engine.remove();
      }
    });

    game.input.keyboard.on('keydown_Y', function () {
      winLevel();
    });

    game.input.keyboard.on('keydown_R', function () {
      level.hero.currentHP = 0;
    });

    game.input.keyboard.on('keydown_S', function () {
      level.sidekick.currentHP = 0;
    });
  }

  ['Z', 'X', 'C'].forEach(function (code) {
    state.keys[code] = _this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes[code]);
  });

  game.matter.world.on('beforeupdate', function () {
    beforeCollisions();
  });

  game.matter.world.on('collisionstart', function (event) {
    collisionStart(event);
  });

  game.matter.world.on('collisionactive', function (event) {
    collisionActive(event);
  });

  game.matter.world.on('collisionend', function (event) {
    collisionEnd(event);
  });
}

function beforeCollisions() {
  var level = state.level;
  var hero = level.hero,
      readyToPlay = level.readyToPlay;


  if (!readyToPlay) {
    return;
  }

  hero.touching.left = false;
  hero.touching.right = false;
  hero.touching.bottom = false;
}

function pickup() {
  var game = state.game,
      level = state.level,
      tutorialState = state.tutorialState;
  var sidekick = level.sidekick;


  level.throwState = 'hold';
  playSound('pickup-sidekick');

  if (level.sidekickAngleRestore) {
    level.sidekickAngleRestore.stop();
    delete level.sidekickAngleRestore;
  }

  sidekick.angle = 0;
  game.matter.world.remove(sidekick);

  var duration = 200;
  var start = 0;
  var end = 100;
  if (sidekick.pickupTween) {
    start = sidekick.pickupTween.getValue();
    sidekick.pickupTween.stop();
  }

  sidekick.pickupTween = game.tweens.addCounter({
    from: start,
    to: end,
    duration: duration,
    ease: 'Cubic.easeInOut',
    onUpdate: function onUpdate() {
      var tint = Phaser.Display.Color.Interpolate.ColorWithColor(whiteColor, greenColor, 100, sidekick.pickupTween.getValue());
      var color = Phaser.Display.Color.ObjectToColor(tint).color;
      sidekick.setTint(color);
    },
    onComplete: function onComplete() {
      sidekick.pickupTween = game.tweens.addCounter({
        from: end,
        to: 0,
        duration: duration,
        ease: 'Cubic.easeInOut',
        onUpdate: function onUpdate() {
          var tint = Phaser.Display.Color.Interpolate.ColorWithColor(whiteColor, greenColor, 100, sidekick.pickupTween.getValue());
          var color = Phaser.Display.Color.ObjectToColor(tint).color;
          sidekick.setTint(color);
        }
      });
    }
  });

  if (tutorialState === 'awaiting-pickup') {
    var existing = state.tutorialHello;
    existing.tween.stop();

    game.tweens.add({
      targets: existing,
      alpha: 0,
      y: existing.y - 80,
      ease: 'Cubic.easeInOut',
      delay: 500,
      duration: 500
    });
    game.tweens.add({
      targets: existing,
      scale: 2,
      ease: 'Cubic.easeInOut',
      duration: 2000
    });

    state.tutorialState = 'awaiting-throw';

    var bye = game.add.text(sidekick.x - 75, sidekick.y - 75, 'If you must . . . press Z to throw me.', {
      fontFamily: '"Avenir Next", "Avenir", "Helvetica Neue", "Helvetica"',
      fontSize: 18,
      color: 'rgb(186, 109, 153)'
    });
    bye.setStroke('#000000', 6);
    bye.alpha = 0;
    bye.scale = 0.5;

    state.tutorialBye = bye;

    state.tutorialBye.tween = game.tweens.add({
      targets: bye,
      alpha: 1,
      y: bye.y - 40,
      ease: 'Cubic.easeInOut',
      delay: 1000,
      duration: 1000
    });
  }
}

function collisionStart(event) {
  var zDown = state.zDown,
      matter = state.matter,
      game = state.game,
      level = state.level;
  var hero = level.hero,
      sidekick = level.sidekick,
      enemies = level.enemies,
      readyToPlay = level.readyToPlay;


  if (!readyToPlay) {
    return;
  }

  event.pairs.forEach(function (_ref4) {
    var bodyA = _ref4.bodyA,
        bodyB = _ref4.bodyB,
        separation = _ref4.separation;

    var a = bodyA.gameObject;
    var b = bodyB.gameObject;

    if (!a || !b) {
      return;
    }

    if (bodyA.id === hero.sensors.l.id || bodyB.id === hero.sensors.l.id) {
      if (!hero.touching.left) {
        hero.x += Math.max(0, separation - 0.5);
      }
      hero.touching.left = true;
    }

    if (bodyA.id === hero.sensors.r.id || bodyB.id === hero.sensors.r.id) {
      if (!hero.touching.right) {
        hero.x -= Math.max(0, separation - 0.5);
      }
      hero.touching.right = true;
    }

    if (bodyA.id === hero.sensors.b.id || bodyB.id === hero.sensors.b.id) {
      hero.touching.bottom = true;
    }

    var isSensor = Object.keys(hero.sensors).map(function (key) {
      return hero.sensors[key];
    }).find(function (sensor) {
      return sensor.id === bodyA.id || sensor.id === bodyB.id;
    }) || hero === a || hero === b;
    if (isSensor && level.throwState === 'pull' && zDown && (a === sidekick || b === sidekick)) {
      pickup();
    }

    var isEnemy = enemies.find(function (enemy) {
      return enemy === a || enemy === b;
    });
    var isPlayer = [hero, sidekick].find(function (p) {
      return p === a || p === b;
    });
    if (isEnemy && isPlayer && !a.isRespawning && !b.isRespawning) {
      var Vector = Phaser.Physics.Matter.Matter.Vector;

      var aMomentum = Vector.mult(a.cachedVelocity, a.body.mass);
      var bMomentum = Vector.mult(b.cachedVelocity, b.body.mass);
      var relativeMomentum = Vector.sub(aMomentum, bMomentum);
      var impact = Vector.magnitude(relativeMomentum);
      var baseDamage = impact / 5;
      var duration = impact;
      var impactForShake = impact;

      var damageA = baseDamage * b.attack;
      var damageB = baseDamage * a.attack;

      if (a === hero || b === hero) {
        impactForShake *= 2;
        // who hits whom?
        if (Phaser.Math.Between(0, 1) === 0) {
          playSound('hero-hit');
        } else {
          playSound('hero-hits');
        }
      } else if (a === sidekick || b === sidekick) {
        playSound('sidekick-hits');

        var sidekickDamage = a === sidekick ? damageA : damageB;
        if ((sidekickDamage > sidekick.currentHP && sidekick.currentHP > 0 || sidekickDamage > 30 && Phaser.Math.Between(0, 5) === 0) && (!level.lastOink || level.lastOink < Date.now() - 5 * 1000)) {
          level.lastOink = Date.now();

          var texts = ['oink!!', 'squeal!!', 'yarr!!', 'avast!!', 'ow!!', 'barf!!', 'golly!!'];
          var oink = game.add.text(sidekick.x, sidekick.y, texts[Phaser.Math.Between(0, texts.length - 1)], {
            fontFamily: '"Avenir Next", "Avenir", "Helvetica Neue", "Helvetica"',
            fontSize: 18,
            color: 'rgb(186, 109, 153)'
          });
          oink.setStroke('#000000', 6);
          oink.alpha = 0;
          oink.scale = 0.5;

          game.tweens.add({
            targets: oink,
            alpha: 1,
            y: oink.y - 40,
            ease: 'Cubic.easeInOut',
            duration: 1000
          });
          game.tweens.add({
            targets: oink,
            alpha: 0,
            y: oink.y - 80,
            ease: 'Cubic.easeInOut',
            delay: 1500,
            duration: 500
          });
          game.tweens.add({
            targets: oink,
            scale: 2,
            ease: 'Cubic.easeInOut',
            duration: 2000
          });
        }
      }

      a.currentHP = Math.max(0, a.currentHP - damageA);
      b.currentHP = Math.max(0, b.currentHP - damageB);

      [{ character: a,
        damage: damageA }, { character: b,
        damage: damageB }].forEach(function (_ref5) {
        var character = _ref5.character,
            damage = _ref5.damage;

        var percent = damage / character.maxHP;
        var start = 0;
        var end = damage * 3;
        if (character.damageTween) {
          start = character.damageTween.getValue();
          character.damageTween.stop();
        }

        character.damageTween = game.tweens.addCounter({
          from: start,
          to: end,
          duration: duration,
          onUpdate: function onUpdate() {
            var tint = Phaser.Display.Color.Interpolate.ColorWithColor(whiteColor, redColor, 100, character.damageTween.getValue());
            var color = Phaser.Display.Color.ObjectToColor(tint).color;
            character.setTint(color);
          },
          onComplete: function onComplete() {
            character.damageTween = game.tweens.addCounter({
              from: end,
              to: 0,
              duration: duration,
              onUpdate: function onUpdate() {
                var tint = Phaser.Display.Color.Interpolate.ColorWithColor(whiteColor, redColor, 100, character.damageTween.getValue());
                var color = Phaser.Display.Color.ObjectToColor(tint).color;
                character.setTint(color);
              }
            });
          }
        });
      });

      game.cameras.main.shake(impactForShake / 2, 0.00005 * impactForShake);
    }
  });
}

function collisionActive(event) {
  var zDown = state.zDown,
      matter = state.matter,
      level = state.level;
  var hero = level.hero,
      sidekick = level.sidekick,
      readyToPlay = level.readyToPlay;


  if (!readyToPlay) {
    return;
  }

  event.pairs.forEach(function (_ref6) {
    var bodyA = _ref6.bodyA,
        bodyB = _ref6.bodyB,
        separation = _ref6.separation;

    var a = bodyA.gameObject;
    var b = bodyB.gameObject;

    if (!a || !b) {
      return;
    }

    if (bodyA.id === hero.sensors.l.id || bodyB.id === hero.sensors.l.id) {
      if (!hero.touching.left) {
        hero.x += Math.max(0, separation - 0.5);
      }
      hero.touching.left = true;
    }

    if (bodyA.id === hero.sensors.r.id || bodyB.id === hero.sensors.r.id) {
      if (!hero.touching.right) {
        hero.x -= Math.max(0, separation - 0.5);
      }
      hero.touching.right = true;
    }

    if (bodyA.id === hero.sensors.b.id || bodyB.id === hero.sensors.b.id) {
      hero.touching.bottom = true;
    }

    var isSensor = Object.keys(hero.sensors).map(function (key) {
      return hero.sensors[key];
    }).find(function (sensor) {
      return sensor.id === bodyA.id || sensor.id === bodyB.id;
    }) || hero === a || hero === b;
    if (isSensor && level.throwState === 'pull' && zDown && (a === sidekick || b === sidekick)) {
      pickup();
    }
  });
}

function collisionEnd(event) {}

// parameter t is milliseconds since load
function update_pigheaded() {
  var game = state.game,
      level = state.level,
      keys = state.keys,
      cursors = state.cursors,
      tutorialState = state.tutorialState;
  var waveEnemies = level.waveEnemies,
      enemies = level.enemies,
      victory = level.victory,
      hero = level.hero,
      sidekick = level.sidekick;


  if (!level.readyToPlay) {
    return;
  }

  if (!level.startTime) {
    level.startTime = new Date();
  }

  if (!state.startTime) {
    state.startTime = new Date();
  }

  if (tutorialState === 'begin') {
    state.tutorialState = 'awaiting-pickup';

    var hello = game.add.text(sidekick.x - 75, sidekick.y - 25, 'Hold Z to pick me up!', {
      fontFamily: '"Avenir Next", "Avenir", "Helvetica Neue", "Helvetica"',
      fontSize: 18,
      color: 'rgb(186, 109, 153)'
    });
    hello.setStroke('#000000', 6);
    hello.alpha = 0;
    hello.scale = 0.5;

    state.tutorialHello = hello;

    hello.tween = game.tweens.add({
      targets: hello,
      alpha: 1,
      y: hello.y - 40,
      ease: 'Cubic.easeInOut',
      duration: 1000
    });
    return;
  }

  var oldZDown = state.zDown;
  state.zDown = keys.Z.isDown;
  state.leftDown = cursors.left.isDown;
  state.rightDown = cursors.right.isDown;
  state.upDown = cursors.up.isDown;

  if (game.input.gamepad.total) {
    var pads = this.input.gamepad.gamepads;
    pads.forEach(function (pad) {
      if (!pad) {
        return;
      }

      if (pad.A || pad.B) {
        state.zDown = true;
      }
      if (pad.X || pad.Y || pad.up) {
        state.upDown = true;
      }
      if (pad.left) {
        state.leftDown = true;
      }
      if (pad.right) {
        state.rightDown = true;
      }
    });
  }

  var zDown = state.zDown;
  state.zDownStart = !oldZDown && zDown;

  if (tutorialState) {
    state.leftDown = false;
    state.rightDown = false;
    state.upDown = false;
  }

  if (victory) {
    if (zDown && level.advanceReady && !level.advancing) {
      level.advancing = true;

      level.endLabels.forEach(function (label, i) {
        game.tweens.add({
          targets: label,
          alpha: 0,
          y: label.y + 20,
          ease: 'Cubic.easeIn',
          delay: i * 100,
          duration: 500
        });
      });

      game.tweens.add({
        targets: level.background,
        alpha: 0,
        duration: 500
      });

      game.tweens.add({
        targets: level.hero,
        alpha: 0,
        delay: 500,
        duration: 1000
      });

      game.tweens.add({
        targets: level.sidekick,
        alpha: 0,
        duration: 500
      });

      game.time.addEvent({
        delay: 2000,
        callback: function callback() {
          game.cameras.main.stopFollow();
          game.cameras.main.scrollX = 0;

          level.background.destroy();
          level.background = null;

          removeHpBarFor(level.hero);
          level.hero.destroy();
          level.hero = null;

          removeHpBarFor(level.sidekick);
          level.sidekick.destroy();
          level.sidekick = null;

          level.enemies.forEach(function (enemy) {
            removeEnemy(enemy);
          });
          level.enemies = null;

          level.blocks.forEach(function (block) {
            block.destroy();
          });
          level.blocks = null;

          level.endLabels.forEach(function (endLabel) {
            endLabel.destroy();
          });
          level.endLabels = null;

          state.level = createLevel(level.index + 1);
          setupLevel(false);
        }
      });
    }

    return;
  }

  updateHero();
  updateSidekick();

  if (!tutorialState) {
    // dont update offscreen enemies
    waveEnemies.forEach(function (enemy) {
      return updateEnemy(enemy);
    });
  }

  if (waveEnemies.length === 0) {
    delete level.camera_lock;

    if (level.waves.length) {
      var wave = level.waves.shift();
      level.waveEnemies = wave.enemies;
      level.x_lock = wave.x_lock;
    } else {
      delete level.x_lock;
    }
  }

  updateCameraAndBounds();
}

function updateCameraAndBounds() {
  var game = state.game,
      level = state.level,
      ground = state.ground,
      ceiling = state.ceiling,
      leftWall = state.leftWall,
      rightWall = state.rightWall;
  var x_lock = level.x_lock,
      camera_lock = level.camera_lock,
      background = level.background;


  var leftBound = Math.min(game.cameras.main.scrollX, level.width - config.width);

  if (x_lock && (leftBound > x_lock || camera_lock)) {
    leftBound = game.cameras.main.scrollX = x_lock;
    level.camera_lock = true;
    game.cameras.main.setBounds(leftBound, 0, 0, 0);
  } else {
    game.cameras.main.setBounds(leftBound, 0, level.width - leftBound, 0);
  }

  var rightBound = leftBound + config.width;

  if (x_lock) {
    rightWall.x = x_lock + config.width + 50;
  } else {
    rightWall.x = level.width + 50;
  }

  Phaser.Physics.Matter.Matter.Body.setPosition(ceiling, {
    x: 400 + leftBound,
    y: ceiling.position.y
  });

  ground.x = config.width / 2 + leftBound;

  leftWall.x = Math.max(-50, leftBound - 50);

  // parallax should depend on bg width and level width
  // worldView.x = 0 means we show bg's left border
  // worldView.x = lvl.width means we show bg's right border
  var progress = game.cameras.main.scrollX / (level.width - config.width);
  background.x = background.width * 0.5 + progress * (level.width - background.width);
}

function respawnIfNeeded(character) {
  var game = state.game,
      level = state.level;
  var hero = level.hero,
      background = level.background;
  var sidekick = level.sidekick;


  if (character.currentHP > 0) {
    return;
  }

  if (character.isRespawnBeginning) {
    return;
  }

  if (character === hero) {
    level.heroDeaths++;
    state.heroDeaths++;
    playSound('hero-die');

    if (level.throwState === 'hold') {
      sidekick = level.sidekick = replaceSidekick(sidekick);
    }

    level.throwState = 'calm';
    hero.anims.play('neutral');

    background.heroDieTween = game.tweens.addCounter({
      from: 0,
      to: 70,
      duration: 300,
      onUpdate: function onUpdate() {
        var tint = Phaser.Display.Color.Interpolate.ColorWithColor(whiteColor, redColor, 100, background.heroDieTween.getValue());
        var color = Phaser.Display.Color.ObjectToColor(tint).color;
        background.setTint(color);
      }
    });
  } else if (character === sidekick) {
    level.sidekickDeaths++;
    state.sidekickDeaths++;
    level.throwState = 'calm';
    playSound('sidekick-die');
  }

  game.tweens.add({
    targets: character,
    alpha: 0,
    duration: 1000,
    onComplete: function onComplete() {
      character.y = state.ceiling.position.y + character.height / 2;
      character.x = game.cameras.main.scrollX + 64 + 32 + character.width / 2;
      character.isRespawnBeginning = false;
      character.currentHP = character.maxHP;
      character.setVelocityX(0);
      character.setAngularVelocity(0);

      if (character === sidekick) {
        character.setVelocityY(0);
        character.angle = 45;
        playSound('sidekick-respawn');
        game.tweens.add({
          targets: character,
          angle: -180,
          ease: 'Cubic.easeOut',
          duration: 1000,
          onComplete: function onComplete() {
            // I thought this wouldn't be needed, but it seems to be a
            // crasher
            character.isRespawning = false;
          }
        });
      } else {
        playSound('hero-respawn');
        character.setVelocityY(30);
      }

      game.tweens.add({
        targets: character,
        alpha: 1,
        duration: 300
      });

      game.time.addEvent({
        delay: 1000,
        callback: function callback() {
          if (character === hero) {
            background.heroDieTween = game.tweens.addCounter({
              from: background.heroDieTween.getValue(),
              to: 0,
              duration: 300,
              onUpdate: function onUpdate() {
                var tint = Phaser.Display.Color.Interpolate.ColorWithColor(whiteColor, redColor, 100, background.heroDieTween.getValue());
                var color = Phaser.Display.Color.ObjectToColor(tint).color;
                background.setTint(color);
              }
            });
          }
        }
      });
    }
  });

  character.isRespawnBeginning = true;
  character.isRespawning = true;
  character.setVelocityX(0);
  character.setVelocityY(0);
}

function updateSidekick() {
  var game = state.game,
      level = state.level,
      zDown = state.zDown,
      zDownStart = state.zDownStart;
  var hero = level.hero;
  var sidekick = level.sidekick;


  if (sidekick.x > hero.x + config.width) {
    sidekick.setVelocityX(0);
  }

  if (isOutOfBounds(sidekick)) {
    hero.throwState = 'calm';
    sidekick.currentHP = -1;
  }

  var dx = hero.x - sidekick.x;
  var dy = hero.y - sidekick.y;

  updateCachedVelocityFor(sidekick);
  updateHpBarFor(sidekick);
  respawnIfNeeded(sidekick);

  var frame = '20';
  if (sidekick.maxHP * 0.2 < sidekick.currentHP) {
    frame = '40';
  }
  if (sidekick.maxHP * 0.4 < sidekick.currentHP) {
    frame = '60';
  }
  if (level.index <= 1 && sidekick.maxHP * 0.6 < sidekick.currentHP) {
    frame = '80';
  }
  if (level.index <= 0 && sidekick.maxHP * 0.8 < sidekick.currentHP) {
    frame = '100';
  }
  sidekick.anims.play(frame);

  if (sidekick.isRespawning || hero.isRespawning) {
    return;
  }

  switch (level.throwState) {
    default:
      break;

    case 'calm':
      if (zDown) {
        level.throwState = 'pull';
      } else if (sidekick.currentHP / sidekick.maxHP < 0.25) {
        // crawl away
        sidekick.applyForce({
          x: dx < 0 ? 0.002 : -0.002,
          y: 0
        });
        sidekick.setAngularVelocity(level.wigglePhase < 5 ? 0.01 : -0.01);
        level.wigglePhase = (level.wigglePhase + 1) % 10;
      }
      break;
    case 'pull':
      if (zDown) {
        var tractable = dx * dx + dy * dy < 200 * 200;
        if (tractable) {
          // tractor beam towards hero
          // apply a force vector based on the angle
          sidekick.applyForce({
            x: dx < 0 ? -0.03 : 0.03,
            y: dy < 0 ? -0.03 : 0.03
          });

          hero.applyForce({
            x: dx < 0 ? 0.005 : -0.005,
            y: dy < 0 ? 0.005 : -0.005
          });

          // tween toward zero
          if (!level.sidekickAngleRestore) {
            level.sidekickAngleRestore = game.tweens.add({
              targets: sidekick,
              angle: 0,
              duration: 200
            });
          }
        } else if (sidekick.currentHP / sidekick.maxHP >= 0.5) {
          // wiggle but don't move. and only when he's not
          // totally afraid of hero
          sidekick.setAngularVelocity(level.wigglePhase < 5 ? 0.02 : -0.02);
          sidekick.applyForce({
            x: level.wigglePhase < 5 ? 0.01 : -0.01,
            y: 0
          });

          level.wigglePhase = (level.wigglePhase + 1) % 10;
        }
      } else {
        level.throwState = 'calm';

        if (level.sidekickAngleRestore) {
          level.sidekickAngleRestore.stop();
          delete level.sidekickAngleRestore;
        }
      }
      break;
    case 'hold':
      {
        sidekick.x = hero.x + (level.facingRight ? 10 : -10) + sidekick.xHoldLag;
        sidekick.y = hero.y + 10 + sidekick.yHoldBob + sidekick.yHoldLag;

        if (zDownStart) {
          level.throwState = 'throw';

          playSound('throw-sidekick');

          // recreate a new sidekick because re-adding to
          // physics seems unsupported
          sidekick = level.sidekick = replaceSidekick(sidekick);

          sidekick.applyForce({
            x: level.facingRight ? 0.75 : -0.75,
            y: state.tutorialState ? -0.05 : Phaser.Math.FloatBetween(-0.20, 0)
          });

          hero.applyForce({
            x: level.facingRight ? -0.1 : 0.1,
            y: -0.01
          });

          game.time.addEvent({
            delay: 200,
            callback: function callback() {
              level.throwState = 'calm';
            }
          });

          if (state.tutorialState === 'awaiting-throw') {
            var existing = state.tutorialBye;
            existing.tween.stop();
            game.tweens.add({
              targets: existing,
              alpha: 0,
              y: existing.y - 80,
              ease: 'Cubic.easeInOut',
              delay: 500,
              duration: 500
            });
            game.tweens.add({
              targets: existing,
              scale: 2,
              ease: 'Cubic.easeInOut',
              duration: 2000
            });

            delete state.tutorialState;
          }
        }
        break;
      }
    case 'throw':
      break;
  }
}

function winLevel() {
  var game = state.game,
      matter = state.matter,
      level = state.level;
  var background = level.background;


  var lastLevel = level.name === config.levelNames[config.levelNames.length - 1];
  if (lastLevel) {
    state.endTime = new Date();
  }

  level.endTime = new Date();
  var hero = level.hero,
      sidekick = level.sidekick,
      blocks = level.blocks,
      exit = level.exit;

  var _ref7 = lastLevel ? state : level,
      startTime = _ref7.startTime,
      endTime = _ref7.endTime,
      heroDeaths = _ref7.heroDeaths,
      sidekickDeaths = _ref7.sidekickDeaths;

  var duration = (endTime.getTime() - startTime.getTime()) / 1000;

  matter.world.pause();
  level.victory = true;
  hero.anims.play('neutral');

  if (sidekick.damageTween) {
    sidekick.damageTween.stop();
  }

  if (hero.damageTween) {
    hero.damageTween.stop();
  }

  sidekick.setTint(0xFFFFFF);
  hero.setTint(0xFFFFFF);

  background.victoryTween = game.tweens.addCounter({
    from: 0,
    to: 70,
    duration: 300,
    onUpdate: function onUpdate() {
      var tint = Phaser.Display.Color.Interpolate.ColorWithColor(whiteColor, greenColor, 100, background.victoryTween.getValue());
      var color = Phaser.Display.Color.ObjectToColor(tint).color;
      background.setTint(color);
      background.setAlpha(1 - background.victoryTween.getValue() / 100);
    }
  });

  // if holding then throw
  [hero, sidekick].forEach(function (character) {
    var hpBar = character.hpBar;
    var border = hpBar.border,
        fill = hpBar.fill;


    game.tweens.add({
      targets: [border, fill],
      y: border.y - 30,
      alpha: 0,
      angle: 12,
      ease: 'Cubic.easeIn',
      duration: 500
    });
  });

  if (level.throwState === 'hold') {
    game.tweens.add({
      targets: sidekick,
      x: sidekick.x + (level.facingRight ? 400 : -400),
      ease: 'Quad.easeOut',
      duration: 500
    });
  }

  if (exit && exit.sprite) {
    var mult = level.index === 1 ? -1 : 1;
    game.tweens.add({
      targets: exit.sprite,
      x: hero.x,
      y: exit.sprite.y - 175 * mult,
      ease: 'Cubic.easeInOut',
      delay: 1500,
      duration: 1000,
      onComplete: function onComplete() {
        if (!lastLevel) {
          game.tweens.add({
            targets: exit.sprite,
            alpha: 0,
            y: exit.sprite.y + 40 * mult,
            ease: 'Cubic.easeIn',
            delay: 2000,
            duration: 500
          });
        }
      }
    });
    game.tweens.add({
      targets: exit.sprite.radial,
      x: hero.x,
      y: exit.sprite.radial.y - 175 * mult,
      ease: 'Cubic.easeInOut',
      delay: 1500,
      duration: 1000,
      onComplete: function onComplete() {
        if (!lastLevel) {
          game.time.addEvent({
            delay: 2000,
            callback: function callback() {
              exit.sprite.radial.glowTween.stop();
            }
          });

          game.tweens.add({
            targets: exit.sprite.radial,
            alpha: 0,
            y: exit.sprite.radial.y + 40 * mult,
            ease: 'Cubic.easeIn',
            delay: 2000,
            duration: 500
          });
        }
      }
    });
  }

  blocks.forEach(function (block) {
    var x = block.x,
        y = block.y;

    var dx = x - hero.x;
    var dy = y - hero.y;
    if (dx * dx + dy * dy > 2 * config.width * config.width) {
      return;
    }

    var theta = Math.atan2(dy, dx);

    game.tweens.add({
      targets: block,
      x: x + config.width * Math.cos(theta),
      y: y + config.width * Math.sin(theta),
      ease: 'Cubic.easeIn',
      duration: 3000
    });
  });

  var origin = game.cameras.main.scrollX;
  game.cameras.main.stopFollow();

  var delay = 0;
  if (lastLevel) {
    delay += 3000;
    sidekick.anims.play('40');

    var sidekickX = origin + 600;
    var sidekickY = 300;
    game.tweens.add({
      targets: sidekick,
      x: sidekickX,
      y: sidekickY,
      angle: 0,
      alpha: 1,
      delay: delay,
      duration: 1000,
      ease: 'Quad.easeInOut'
    });

    var heroX = origin + 300;
    var heroY = 330;
    game.tweens.add({
      targets: hero,
      x: heroX,
      y: heroY,
      angle: 0,
      alpha: 1,
      duration: 1000,
      ease: 'Quad.easeInOut'
    });

    game.tweens.add({
      targets: exit.sprite,
      x: origin + 400,
      y: 330,
      ease: 'Quad.easeInOut',
      duration: 1000
    });
    game.tweens.add({
      targets: exit.sprite.radial,
      x: origin + 400,
      y: 330 - 20,
      ease: 'Quad.easeInOut',
      duration: 1000
    });

    delay += 1000;

    var worthIt = game.add.text(origin + 500, 310, 'Was it worth it?', {
      fontFamily: '"Avenir Next", "Avenir", "Helvetica Neue", "Helvetica"',
      fontSize: 25,
      color: 'rgb(186, 109, 153)'
    });
    worthIt.setStroke('#000000', 6);
    worthIt.alpha = 0;

    delay += 500;
    game.tweens.add({
      targets: worthIt,
      y: 350,
      alpha: 1,
      ease: 'Cubic.easeInOut',
      delay: delay,
      duration: 500
    });

    var myPain = game.add.text(origin + 520, 340, 'All my pain?', {
      fontFamily: '"Avenir Next", "Avenir", "Helvetica Neue", "Helvetica"',
      fontSize: 25,
      color: 'rgb(186, 109, 153)'
    });
    myPain.setStroke('#000000', 6);
    myPain.alpha = 0;

    delay += 2000;
    game.tweens.add({
      targets: myPain,
      y: 380,
      alpha: 1,
      ease: 'Cubic.easeInOut',
      delay: delay,
      duration: 500
    });

    var mySuffering = game.add.text(origin + 540, 370, 'All my suffering?', {
      fontFamily: '"Avenir Next", "Avenir", "Helvetica Neue", "Helvetica"',
      fontSize: 25,
      color: 'rgb(186, 109, 153)'
    });
    mySuffering.setStroke('#000000', 6);
    mySuffering.alpha = 0;

    delay += 1000;
    game.tweens.add({
      targets: mySuffering,
      y: 410,
      alpha: 1,
      ease: 'Cubic.easeInOut',
      delay: delay,
      duration: 500
    });

    delay += 2000;
    game.tweens.add({
      targets: worthIt,
      y: 390,
      alpha: 0,
      ease: 'Cubic.easeInOut',
      delay: delay,
      duration: 500
    });

    delay += 500;
    game.tweens.add({
      targets: myPain,
      y: 420,
      alpha: 0,
      ease: 'Cubic.easeInOut',
      delay: delay,
      duration: 500
    });

    delay += 250;
    game.tweens.add({
      targets: mySuffering,
      y: 450,
      alpha: 0,
      ease: 'Cubic.easeInOut',
      delay: delay,
      duration: 500
    });

    delay += 1000;
    var sprite2 = game.add.sprite(heroX, heroY, 'exit');
    var radial2 = createTreasureEffects(sprite2);
    var sprite3 = game.add.sprite(heroX, heroY, 'exit');
    var radial3 = createTreasureEffects(sprite3);
    sprite2.alpha = 0;
    sprite3.alpha = 0;
    radial2.alpha = 0;
    radial3.alpha = 0;
    radial2.glowTween.stop();
    radial3.glowTween.stop();

    delay += 1000;

    game.time.addEvent({
      delay: delay,
      callback: function callback() {
        playSound('unlock-exit');
      }
    });

    game.tweens.add({
      targets: exit.sprite,
      x: heroX,
      y: 200,
      ease: 'Cubic.easeInOut',
      delay: delay,
      duration: 1000,
      onComplete: function onComplete() {
        playSound('unlock-exit');
      }
    });
    game.tweens.add({
      targets: exit.sprite.radial,
      x: heroX,
      y: 200 - 20,
      ease: 'Cubic.easeInOut',
      delay: delay,
      duration: 1000
    });
    delay += 800;
    game.tweens.add({
      targets: sprite2,
      x: heroX + 100,
      y: 200,
      alpha: 1,
      ease: 'Cubic.easeInOut',
      delay: delay,
      duration: 1000,
      onComplete: function onComplete() {
        playSound('unlock-exit');
      }
    });
    game.tweens.add({
      targets: radial2,
      x: heroX + 100,
      y: 200 - 20,
      alpha: 0.33,
      ease: 'Cubic.easeInOut',
      onComplete: function onComplete() {
        radial2.glowTween = game.tweens.add({
          targets: radial2,
          alpha: 0.66,
          loop: -1,
          ease: 'Quad.easeInOut',
          yoyo: true,
          duration: 1000
        });
      },
      delay: delay,
      duration: 1000
    });
    delay += 800;
    game.tweens.add({
      targets: sprite3,
      x: heroX - 100,
      y: 200,
      alpha: 1,
      ease: 'Cubic.easeInOut',
      delay: delay,
      duration: 1000
    });
    game.tweens.add({
      targets: radial3,
      x: heroX - 100,
      y: 200 - 20,
      alpha: 0.33,
      ease: 'Cubic.easeInOut',
      onComplete: function onComplete() {
        radial3.glowTween = game.tweens.add({
          targets: radial3,
          alpha: 0.66,
          loop: -1,
          ease: 'Quad.easeInOut',
          yoyo: true,
          duration: 1000
        });
      },
      delay: delay,
      duration: 1000
    });

    delay += 1500;
    var sac = game.add.text(origin + 200, 350, 'Sacrifices must be made.', {
      fontFamily: '"Avenir Next", "Avenir", "Helvetica Neue", "Helvetica"',
      fontSize: 25,
      color: 'rgb(220, 60, 60)'
    });
    sac.setStroke('#000000', 6);
    sac.alpha = 0;

    game.tweens.add({
      targets: sac,
      y: 400,
      alpha: 1,
      ease: 'Cubic.easeInOut',
      delay: delay,
      duration: 500
    });

    delay += 2000;
    game.tweens.add({
      targets: sac,
      y: 440,
      alpha: 0,
      ease: 'Cubic.easeInOut',
      delay: delay,
      duration: 500
    });

    delay += 2000;
    game.time.addEvent({
      delay: delay,
      callback: function callback() {
        sidekick.anims.play('20');
      }
    });

    delay += 500;
    sidekickY += 20;
    game.tweens.add({
      targets: sidekick,
      y: sidekickY,
      delay: delay,
      ease: 'Quad.easeOut',
      duration: 300,
      onComplete: function onComplete() {
        playSound('sidekick-die');
      }
    });

    delay += 2000;
    var idotdotdot = game.add.text(origin + 450, 330, 'I...', {
      fontFamily: '"Avenir Next", "Avenir", "Helvetica Neue", "Helvetica"',
      fontSize: 25,
      color: 'rgb(186, 109, 153)'
    });
    idotdotdot.setStroke('#000000', 6);
    idotdotdot.alpha = 0;

    game.tweens.add({
      targets: idotdotdot,
      y: 370,
      alpha: 1,
      ease: 'Cubic.easeInOut',
      delay: delay,
      duration: 500
    });

    delay += 2000;
    game.tweens.add({
      targets: idotdotdot,
      y: 410,
      alpha: 0,
      ease: 'Cubic.easeInOut',
      delay: delay,
      duration: 500
    });

    delay += 2000;
    var idly = game.add.text(origin + 450, 330, "I... don't love you any more.", {
      fontFamily: '"Avenir Next", "Avenir", "Helvetica Neue", "Helvetica"',
      fontSize: 25,
      color: 'rgb(186, 109, 153)'
    });
    idly.setStroke('#000000', 6);
    idly.alpha = 0;

    game.tweens.add({
      targets: idly,
      y: 370,
      alpha: 1,
      ease: 'Cubic.easeInOut',
      delay: delay,
      duration: 2000
    });

    delay += 3000;
    sidekickX = origin + config.width + 64;
    game.tweens.add({
      targets: sidekick,
      x: sidekickX,
      delay: delay,
      duration: 3000
    });

    delay += 5000;
    game.tweens.add({
      targets: idly,
      y: 410,
      alpha: 0,
      ease: 'Cubic.easeInOut',
      delay: delay,
      duration: 500
    });

    delay += 2000;
    var sac2 = game.add.text(origin + 200, 350, 'Sacrifices must be made.', {
      fontFamily: '"Avenir Next", "Avenir", "Helvetica Neue", "Helvetica"',
      fontSize: 25,
      color: 'rgb(220, 60, 60)'
    });
    sac2.setStroke('#000000', 6);
    sac2.alpha = 0;

    game.tweens.add({
      targets: sac2,
      y: 400,
      alpha: 1,
      ease: 'Cubic.easeInOut',
      delay: delay,
      duration: 500
    });

    delay += 2000;
    game.tweens.add({
      targets: sac2,
      y: 400,
      alpha: 0,
      ease: 'Cubic.easeInOut',
      delay: delay,
      duration: 500
    });

    delay += 1000;
    game.tweens.add({
      targets: background,
      alpha: 0,
      ease: 'Cubic.easeInOut',
      delay: delay,
      duration: 1000
    });

    delay += 2000;
    game.tweens.add({
      targets: sprite2,
      y: 150,
      alpha: 0,
      ease: 'Cubic.easeInOut',
      delay: delay,
      duration: 2000
    });
    game.time.addEvent({
      delay: delay,
      callback: function callback() {
        radial2.glowTween.stop();
      }
    });
    game.tweens.add({
      targets: radial2,
      y: 150 - 20,
      alpha: 0,
      ease: 'Cubic.easeInOut',
      delay: delay,
      duration: 2000
    });

    delay += 1000;
    game.tweens.add({
      targets: sprite3,
      y: 150,
      alpha: 0,
      ease: 'Cubic.easeInOut',
      delay: delay,
      duration: 2000
    });
    game.time.addEvent({
      delay: delay,
      callback: function callback() {
        radial3.glowTween.stop();
      }
    });
    game.tweens.add({
      targets: radial3,
      y: 150 - 20,
      alpha: 0,
      ease: 'Cubic.easeInOut',
      delay: delay,
      duration: 2000
    });

    delay += 1000;
    game.tweens.add({
      targets: exit.sprite,
      y: 150,
      alpha: 0,
      ease: 'Cubic.easeInOut',
      delay: delay,
      duration: 2000
    });

    game.time.addEvent({
      delay: delay,
      callback: function callback() {
        exit.sprite.radial.glowTween.stop();
      }
    });
    game.tweens.add({
      targets: exit.sprite.radial,
      y: 150 - 20,
      alpha: 0,
      ease: 'Cubic.easeInOut',
      delay: delay,
      duration: 2000
    });

    delay += 3000;

    heroX = origin + 400;
    game.tweens.add({
      targets: hero,
      x: heroX,
      y: 500,
      ease: 'Cubic.easeInOut',
      delay: delay,
      duration: 500
    });

    delay += 1000;
  }

  game.time.addEvent({
    delay: 2000 + delay,
    callback: function callback() {
      var titleLabel = 'level ' + (level.index + 1) + ' complete!!';
      if (lastLevel) {
        titleLabel = 'You won the game!!';
      }

      var durationLabel = 'time: ' + duration.toFixed(1) + 's';
      var deathsLabel = 'deaths: ' + heroDeaths;
      var sacrificesLabel = 'sacrifices: ' + sidekickDeaths;
      var continueLabel = 'press throw to continue';

      addEndLevelLabel(origin + 130, 100, 0, 64, titleLabel, false);
      addEndLevelLabel(origin + 310, 200, 1, 32, durationLabel, false);
      addEndLevelLabel(origin + 310, 250, 2, 32, deathsLabel, false);
      addEndLevelLabel(origin + 310, 300, 3, 32, sacrificesLabel, false);

      if (lastLevel) {
        var thanksLabel = 'Thank you for playing.';
        addEndLevelLabel(origin + 225, 350, 4.5, 32, thanksLabel, true);
      } else {
        addEndLevelLabel(origin + 225, 350, 5, 32, continueLabel, true);
      }
    }
  });
}

function addEndLevelLabel(x, y, i, fontSize, text, loop) {
  var game = state.game,
      level = state.level;

  var label = game.add.text(x, y + 20, text, {
    fontFamily: '"Avenir Next", "Avenir", "Helvetica Neue", "Helvetica"',
    fontSize: fontSize,
    color: '#FFDF00'
  });
  label.setStroke('#000000', 12);
  label.alpha = 0;

  level.endLabels.push(label);

  game.time.addEvent({
    delay: 400 * i,
    callback: function callback() {
      if (i === 5) {
        level.advanceReady = true;
      }

      game.tweens.add({
        targets: label,
        alpha: 1,
        y: y,
        duration: 500,
        ease: 'Cubic.easeInOut'
      });
    }
  });

  if (loop) {
    game.time.addEvent({
      delay: 400 * (i + 1),
      callback: function callback() {
        game.tweens.add({
          targets: label,
          y: y + 10,
          yoyo: true,
          loop: -1,
          duration: 500,
          ease: 'Cubic.easeInOut'
        });
      }
    });
  }
}

function updateHero() {
  var game = state.game,
      matter = state.matter,
      level = state.level,
      leftDown = state.leftDown,
      rightDown = state.rightDown,
      upDown = state.upDown;
  var hero = level.hero,
      throwState = level.throwState,
      sidekick = level.sidekick,
      exit = level.exit;


  updateCachedVelocityFor(hero);
  updateHpBarFor(hero);
  respawnIfNeeded(hero);

  if (hero.isRespawning) {
    if (hero.touching.bottom && !hero.isRespawnBeginning) {
      game.cameras.main.shake(100, 0.03);
      hero.isRespawning = false;
    }
    return;
  }

  if (exit) {
    var dx = exit.x - hero.x;
    var dy = exit.y - hero.y;
    if (dx * dx + dy * dy < 30 * 30) {
      winLevel();
      return;
    }
  }

  var velocity = hero.body.velocity;

  if (leftDown) {
    level.facingRight = false;
    hero.setFlipX(true);
    hero.applyForce({
      x: throwState === 'hold' ? -0.025 : -0.1,
      y: 0
    });

    hero.anims.play('walk', true);
  } else if (rightDown) {
    level.facingRight = true;
    hero.setFlipX(false);
    hero.applyForce({
      x: throwState === 'hold' ? 0.025 : 0.1,
      y: 0
    });

    hero.anims.play('walk', true);
  } else {
    hero.anims.play('neutral');

    // shed velocity fast if you're on the ground
    if (hero.touching.bottom) {
      hero.setVelocityX(hero.body.velocity.x * 0.85);
    }
  }

  // if we are walking while holding
  sidekick.xHoldLag = 0;
  sidekick.yHoldLag = 0;
  if (throwState === 'hold') {
    sidekick.xHoldLag = -hero.body.velocity.x;
    sidekick.yHoldLag = -hero.body.velocity.y;

    // velocity.x is not the right check, since it is like, desired
    // velocity not actual change in position
    if ((leftDown && hero.body.velocity.x < -2 || rightDown && hero.body.velocity.x > 2) && hero.touching.bottom) {
      if (!sidekick.yHoldTween) {
        if (sidekick.yRecoverTween) {
          sidekick.yRecoverTween.stop();
          delete sidekick.yRecoverTween;
        }
        sidekick.yHoldTween = game.tweens.addCounter({
          from: sidekick.yHoldFrom || 0,
          to: 100,
          ease: 'Quad.easeInOut',
          duration: 100,
          onUpdate: function onUpdate() {
            if (sidekick.yHoldTween) {
              sidekick.yHoldBob = (sidekick.yHoldUp ? -2 : 2) * sidekick.yHoldTween.getValue() / 100;
            }
          },
          onComplete: function onComplete() {
            sidekick.yHoldUp = !sidekick.yHoldUp;
            sidekick.yHoldFrom = -100;
            delete sidekick.yHoldTween;
          }
        });
      }
    } else if (sidekick.yHoldBob !== 0) {
      if (!sidekick.yRecoverTween) {
        if (sidekick.yHoldTween) {
          sidekick.yHoldTween.stop();
          delete sidekick.yHoldTween;
        }
        sidekick.yRecoverTween = game.tweens.addCounter({
          from: sidekick.yHoldBob,
          to: 0,
          duration: 100,
          ease: 'Quad.easeInOut',
          onUpdate: function onUpdate() {
            if (sidekick.yRecoverTween) {
              sidekick.yHoldBob = sidekick.yRecoverTween.getValue();
            }
          },
          onComplete: function onComplete() {
            delete sidekick.yRecoverTween;
            sidekick.yHoldFrom = 0;
          }
        });
      }
    }
  }

  if (hero.touching.bottom) {
    if (upDown && !level.jumpStarted && hero.body.velocity.y < 0.00001) {
      level.jumpStarted = true;
      playSound('jump');
      hero.applyForce({
        x: 0,
        y: throwState === 'hold' ? -0.27 : -0.35
      });
    }
  } else {
    level.jumpStarted = false;
  }

  if (velocity.x > 5) hero.setVelocityX(5);else if (velocity.x < -5) hero.setVelocityX(-5);
}

