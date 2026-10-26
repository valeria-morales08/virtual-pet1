 Pixel Pal

A tiny virtual pet that lives in your browser. Feed it, play with it, and let it sleep, or it will run away. Built with plain HTML, CSS, and JavaScript, no frameworks or dependencies.


 How to play

 Feed:  +15 hunger, +5 happiness
 Play:  +20 happiness, -10 hunger, -15 energy (needs at least 15 energy) 
 Sleep:   +40 energy, -15 hunger 

Every 2 seconds, all stats slowly drop. If hunger or happiness reaches 0, your pet runs away and a button appears to adopt a new one.

If energy reaches 0, your pet passes out for a few ticks: it recovers some energy on its own, but you can't feed, play, or put it to sleep until it wakes up. Hunger keeps dropping meanwhile, so don't let it get that far.

 Moods

The avatar and status message change with the pet's real state. When a stat falls below 25, the pet shows it, with this priority: hungry, tired, sad. Otherwise it's happy. The bars turn from green to yellow (below 50) to red (below 25).

 Run it locally

No build step. Download or clone the repo and open `index.html` in your browser.



 Tweaking the game

All the balance numbers live in the `CONFIG` object at the top of `script.js`: tick speed, decay rates, what each button does, exhaustion length, and the thresholds for colors and moods. Change a number and reload to make the game easier or harder.


I created this project for terra
