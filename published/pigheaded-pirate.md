title: Pigheaded Pirate
subtitle: my Ludum Dare 43 game
description: Pigheaded Pirate is a sidescrolling beat-em-up with a twist: your weapon is your partner. Sacrifice them to complete three progressively harder levels for treasure and an important lesson about life, money, and love.
date: 2018-12-30
@scripts: /phaser-3.15.1.min.js
@scripts: /pigheaded-pirate/game.js

The theme for [Ludum Dare 43](https://ldjam.com/events/ludum-dare/43/pigheaded-pirate) was "Sacrifices must be made". I made my entry, <i>Pigheaded Pirate</i> from scratch in 48 hours solo.

You can play my game at [https://pigheaded-pirate.shawn.dev](https://pigheaded-pirate.shawn.dev)<span class="laptop-only"> or right here</span>! <span class="safari-only laptop-only">(If you're using Safari some features might not work consistently, so switching browsers might help)</span>

<div class="laptop-only" id="kickoff" style="position: relative; width: 800px; height: 600px; box-shadow: 0 13px 27px -5px rgba(50,50,93,.9),0 8px 16px -8px rgba(0,0,0,.95),0 -6px 16px -6px rgba(0,0,0,.5); border-radius: 16px; background-color: #36495b; background-image: url('/pigheaded-pirate/assets/cover.png'); margin-left: auto; margin-right: auto; background-size: 800px 600px; background-repeat: no-repeat; cursor: pointer;" onClick="document.getElementById('kickoff').style.display = 'none'; document.getElementById('engine').style.display = 'block'; startGame(); document.querySelector('#engine canvas').style.borderRadius = '16px'">
  <div style="text-align: center; position: absolute; top: 100px; left: 80px;  font-size: 2em; color: white; text-shadow: -1px -1px 0 #000, 1px -1px 0 #000, -1px 1px 0 #000, 1px 1px 0 #000;">click to play<br />Pigheaded Pirate</div>
</div>

<div class="laptop-only" id="engine" style="display: none; overflow: hidden; width: 800px; height: 600px; margin-left: auto; margin-right: auto; box-shadow: 0 13px 27px -5px rgba(50,50,93,.9),0 8px 16px -8px rgba(0,0,0,.95),0 -6px 16px -6px rgba(0,0,0,.5); border-radius: 16px">
</div>

<br />
