title: Jumpcoins
subtitle: my Ludum Dare 44 game
date: 2019-05-02
@scripts: /phaser-3.15.1.min.js
@scripts: /jumpcoins/game.js

The theme for [Ludum Dare 44](https://ldjam.com/events/ludum-dare/44/) was "Your life is currency".

You can play my entry, <i>Jumpcoins</i>, at [https://jumpcoins.shawn.dev](https://jumpcoins.shawn.dev)<span class="laptop-only"> or right here</span>! <span class="safari-only">(If you're using Safari some features might not work consistently, so switching browsers might help)</span>

<div class="laptop-only" id="kickoff" style="position: relative; margin-bottom: 2em; width: 800px; height: 600px; -webkit-box-shadow: 0 13px 27px -5px rgba(50, 50, 93, 0.9), 0 8px 16px -8px rgba(0, 0, 0, 0.95), 0 -6px 16px -6px rgba(0, 0, 0, 0.5); box-shadow: 0 13px 27px -5px rgba(50, 50, 93, 0.9), 0 8px 16px -8px rgba(0, 0, 0, 0.95), 0 -6px 16px -6px rgba(0, 0, 0, 0.5); border-radius: 16px; background-color: #000000; background-image: url('/jumpcoins/assets/cover.png'); margin-left: auto; margin-right: auto; background-size: 800px 600px; background-repeat: no-repeat; cursor: pointer;" onClick="document.getElementById('kickoff').style.display = 'none'; document.getElementById('engine').style.display = 'block'; startGame(); document.querySelector('#engine canvas').style.borderRadius = '16px'">
</div>

<div class="laptop-only" id="engine" style="display: none; overflow: hidden; width: 800px; height: 600px; margin-left: auto; margin-right: auto; margin-bottom: 2em; -webkit-box-shadow: 0 13px 27px -5px rgba(50, 50, 93, 0.9), 0 8px 16px -8px rgba(0, 0, 0, 0.95), 0 -6px 16px -6px rgba(0, 0, 0, 0.5); box-shadow: 0 13px 27px -5px rgba(50, 50, 93, 0.9), 0 8px 16px -8px rgba(0, 0, 0, 0.95), 0 -6px 16px -6px rgba(0, 0, 0, 0.5); border-radius: 16px">
</div>

<br />
