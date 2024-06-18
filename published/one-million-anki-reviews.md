title: One million Anki reviews
date: 2022-03-09
description: Reflections and stats after hitting one million flash card reviews in Anki for studying Japanese, Chinese, Go, and more.
@scripts: /one-million-anki-reviews/plotly-2.9.0.min.js
@scripts: /one-million-anki-reviews/chart.js

<style>
div.plotly-notifier {
  visibility: hidden;
}
div.chart,
div.chart>div {
  height: 450px;
}
div.chart .js-plotly-plot .plotly .cursor-pointer {
  cursor: crosshair;
}
.card {
  text-align: center;
  margin: 1.5em auto;
  width: 42rem;
  overflow: hidden;
  padding-bottom: 0.5em;
  border-radius: 16px;
}
.card {
  background: rgb(229, 229, 245);
}
@media (prefers-color-scheme: dark) {
  .card {
    background: rgb(33, 34, 42);
  }
}
#content .card p {
  margin-top: 0;
  margin-bottom: 0;
}
#content .card img {
  height: calc((2160 / 3840) * 42rem);
  background-color: rgb(104, 144, 124);
  border-radius: 0;
}
.chart .loading {
  display: flex;
  justify-content: center;
  align-items: center;
}
@media all and (max-width: 47.826em) {
  .card {
    width: 100vw;
    border-radius: 0;
  }
  .card hr {
    width: 80vw;
  }
  #content .card img {
    max-width: none;
    width: 100vw;
    height: calc((2160 / 3840) * 100vw);
    margin-left: 0;
    margin-right: 0;
    padding-left: 0;
    padding-right: 0;
  }
}
</style>

Today, I hit one million reviews in Anki. One **million**!

I started using spaced repetition back in 2009 to learn the kanji. My very first review was for the kanji meaning "one", which looks like <span class="hang">this: 一</span>

Since then, my use of Anki has grown to studying a third language, the board game Go, and other bits of miscellany. I've also tried to use SRS for non-memorization tasks, like reminding me of meaningful quotes, but never quite got that to work.

My millionth review was for the Japanese sentence below. (The screenshot has the sentence in it, on the right-hand side, but the low contrast makes it hard to read). Having the source image right in the card makes a _huge_ difference; it's more interesting and gives loads of context to connect the dots. I could fill several articles about how I do sentence mining nowadays. The short version is I've been putting together a personal study app that has 2.5 million OCR'd sentences across &gt;90gb of photos from travel, images of video games, scans of manga, etc. It all started with the Switch having a hardware screenshot button…

<div class="card">
  <img src="https://shawn.dev/one-million-anki-reviews/ff7r.jpg" />
  <p>『ザンガン流精神統一』が発動した</p>
  <hr />
  <p>流【りゅう】</p>
  <p>精神【せいしん】</p>
  <p>統一【とういつ】</p>
  <p>発動【はつどう】</p>
</div>

The beauty of spaced repetition is that the average time between reviews for any particular card in my deck is _1.85 years_. Exponential growth catches up to you real fast.

Here's a chart of my reviews over time, broken down by subject. It's wild to look at this because I can clearly see my own life in here, such as when I took on fulltime study between jobs, or when I met my future wife.

<div class="chart"><div class="loading" id="revs">loading…</div></div>

And here's when I created my ~40k cards. This might (unfortunately) be a better proxy metric for when I was more engaged in active study. Though I'll give myself a pass for stagnating on new kanji, seeing as how high school students learn only about 2100 of them.

<div class="chart"><div class="loading" id="cards">loading…</div></div>

If Anki's time tracking is to be believed, I've spent over 2000 hours (3 months) on reviewing, and that's excluding time spent distracted with the app left open. That's… sobering, to say the least. But, considering that I get my reviews in during downtime (waiting in line, watching Twitch, etc), it's a price I gladly pay for what these million reviews have given me. And with that, off I go to continue my 439 day study streak!
