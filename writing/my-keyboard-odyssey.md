title: My keyboard odyssey
draft: 1
date: 2023-02-01

Over the last six months, I've been on a journey. I went back to first principles and threw everything out. Everything. Got rid of qwerty. Made and manufactured a bespoke circuit board. Modded already-esoteric key switches. Even threw out typing words by pressing their constituent letters in order. (That's right, I even challenged the concepts of _time_ and _causality_).

This article is an exhaustive (in both senses of the word) account of the journey to my keyboard endgame. Right up front, to help you determine whether you're interested in reading, here's a comparison of where I was originally:

<iframe width="560" height="315" src="https://www.youtube.com/embed/7NS3UPsmWE8?controls=0" title="130 wpm qwerty two-finger hunt and peck" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>

And where I'm at now:

## The prologue

Gettin' old. Wrist pain typing.

I learned to type well before I'd ever heard of touch typing. By the time I got to typing in school, I was given a pass because all they evaluated for was not looking at the keyboard.

## The endgame

I use a Ferris Sweep keyboard which sports 34 keys arranged using the Canary layout.

## Sweep keyboard

Split. Column stagger not row stagger. 1dfh. Thumbs not a comically long spacebar.

Ben Vallack.

Originally the [Gergoplex](https://www.google.com/search?q=gergoplex+keyboard&source=lnms&tbm=isch) caught my attention, but that was unavailable. In looking for alternatives. Unfortunately I quickly found that buying a keyboard like this prebuilt was not really an option. So, experimenting with soldering was

Choc Galapagos.

### Customizing the hardware

Springs.

PCB.

## Canary layout

This [guide to alt keyboard layouts](https://getreuer.info/posts/keyboards/alt-layouts/index.html) by Pascal Getreuer is a great overview of the motivation and practice of switching keyboard layouts. Please indulge me by going to read that, rather than me rehashing it poorly.

In particular, I agree with Pascal's statement that "speed is a matter of typing practice, not layout". However my primary motivation was the exception that proves the rule. I learned a new layout so that I could not fall back on all of my terrible habits. So by _unlearning_ qwerty I was able to remove the barrier holding my speed back at 130 wpm.

I chose Canary in particular because it is highly-regarded by the Alt Keyboard Layout community. It optimizes for rolls, which are the motion you get when you type the last three letters of "power" (on qwerty). Who amongst us hasn't absent-mindedly drummed that way on a desk?

## Layout design

An alt keyboard layout gives you locations for the 26 alpha keys and the most common English punctuation. There's still a lot of design to go before you have a working keyboard. This is why popular keyboard designs like [Miryoku](https://github.com/manna-harbour/miryoku) have popped up prescribe where _all_ the functionality goes.

Since I had very specific goals in mind I wanted to design the rest myself starting with just the alphabet. First, need the workhorse punctuation of `.` `,` and `'`. Also definitely need space and backspace. Enter too.

That's already 32 of my 34 keys, and we haven't yet gotten to modifiers (shift, ctrl, alt, command). We also don't have any numbers, and we're missing practically all of the symbols. Designing a completely-functional 30% keyboard, the feeling is economy not luxury.

Luckily there are plenty of tricks you can use.

I personally have tinkered with some keyboard hacking suggested by [Steve Losh's Modern Space Cadet](https://stevelosh.com/blog/2012/10/a-modern-space-cadet/) guidance in the decade (… … oof) that it's been out there. One of Steve's insights is most keys are _either_ like Ctrl where they have an effect only when held with another key _or_ like Escape have some effect when tapped. So you can combine them, nowadays called a hold-tap key.

One common approach to adding modifiers is [home row mods](https://precondition.github.io/home-row-mods). I intentionally avoided home row mods because they would compromise chording.

One feature I came across is autoshift. Tap an alpha to emit it. Hold that alpha for a moment to emit its uppercase variant. This wouldn't interfere at all with chording because it's using one key versus many. But, I didn't want typing ordinary English to involve intentional pauses. One of the goals here is uncompromising speed. But, the autoshift concept translates extremely well to the "gui" (aka command or windows key) modifier. Tap "q" to type "q". Hold "q" for a beat to close an app.

I don't use the alt modifier much so I'm okay leaving that until I need it.

## Symbols and numbers

Informed by my JavaScript, Go, Rust, shell, and in case of emergencies, Perl.

[Benford's law](https://en.wikipedia.org/wiki/Benford%27s_law#Generalization_to_digits_beyond_the_first). Better to have 0, 1, 2, and 3 on the home row.

Playing NetHack.

## Dup key

(This is most commonly called a "repeat key" but I prefer the term "dup" to avoid confusion with the completely separate concept of "key repeat")

## Vim

hjkl.

Muscle memory for keys and commands.

Isn't most of your time spent thinking? Perhaps. But I challenge you to also up-end your entire keyboard experience. When you're at 10 wpm you _absolutely_ feel that slow typing is a bottleneck. And if a bottleneck exists at 10 wpm, who's to say that it cannot exist at 100 wpm? Or 200? Professional stenographers must be able to demonstrate sustained _and accurate_ typing at 225 wpm. That's the floor.

## Chording

Zipf's law

steno and CharaChorder

### Chording extensions

commands

sentence mode

dup

hold

## Practice

Fifteen one-minute tests for pure character entry. Anything more than that is likely to give diminishing returns.

Twenty sets of ten chords. Get each up to 100 wpm, then add the next set in.

### iOS

I switched my phone to the Canary layout, including my symbol and number layers. The [xKeyboard](https://apps.apple.com/us/app/xkeyboard-custom-keyboard/id1440245962) app is surprisingly flexible; I was able to recreate a split orthographic layout.

However I wouldn't recommend taking this step. In fact I'm likely to switch back to the stock keyboard. There are too many compromises with third-party keyboards on iOS:

- No autocorrect.
- Swipe typing.
- Secure fields. 1password.
- Qwerty is actually good for the form factor.

## Tools

### Config generator

QMK and ZMK

Suggest combos for output.

Linting.

### Anki

If you look [elsewhere on my blog](https://shawn.dev/2022/03/one-million-anki-reviews.html) it should come as no surprise that I study chords with spaced repetition.

Example card.

### serial-proxy

## Progress
