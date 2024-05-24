title: Jumpcoins
subtitle: my Ludum Dare 44 game
description: Jumpcoins is an action platformer. Play through 20 levels dodging spikes, enemies and collecting coins to power up your special jumps. Collect all the badges while threading together a combination of double jumps and walljumps, and beat your best times.
date: 2019-05-02
@scripts: /phaser-3.15.1.min.js
@scripts: /jumpcoins/game.js

The theme for [Ludum Dare 44](https://ldjam.com/events/ludum-dare/44/jumpcoins) was "Your life is currency". I made my entry, <i>Jumpcoins</i> from scratch in 48 hours solo.

You can play my game at [https://jumpcoins.shawn.dev](https://jumpcoins.shawn.dev)<span class="laptop-only"> or right here</span>! <span class="safari-only laptop-only">(If you're using Safari some features might not work consistently, so switching browsers might help)</span>

<div class="laptop-only" id="kickoff" style="position: relative; margin-bottom: 2em; width: 800px; height: 600px; -webkit-box-shadow: 0 13px 27px -5px rgba(50, 50, 93, 0.9), 0 8px 16px -8px rgba(0, 0, 0, 0.95), 0 -6px 16px -6px rgba(0, 0, 0, 0.5); box-shadow: 0 13px 27px -5px rgba(50, 50, 93, 0.9), 0 8px 16px -8px rgba(0, 0, 0, 0.95), 0 -6px 16px -6px rgba(0, 0, 0, 0.5); border-radius: 16px; background-color: #000000; background-image: url('/jumpcoins/assets/cover.png'); margin-left: auto; margin-right: auto; background-size: 800px 600px; background-repeat: no-repeat; cursor: pointer;" onClick="document.getElementById('kickoff').style.display = 'none'; document.getElementById('engine').style.display = 'block'; startGame(); document.querySelector('#engine canvas').style.borderRadius = '16px'">
</div>

<div class="laptop-only" id="engine" style="display: none; overflow: hidden; width: 800px; height: 600px; margin-left: auto; margin-right: auto; margin-bottom: 2em; -webkit-box-shadow: 0 13px 27px -5px rgba(50, 50, 93, 0.9), 0 8px 16px -8px rgba(0, 0, 0, 0.95), 0 -6px 16px -6px rgba(0, 0, 0, 0.5); box-shadow: 0 13px 27px -5px rgba(50, 50, 93, 0.9), 0 8px 16px -8px rgba(0, 0, 0, 0.95), 0 -6px 16px -6px rgba(0, 0, 0, 0.5); border-radius: 16px">
</div>

<br />
