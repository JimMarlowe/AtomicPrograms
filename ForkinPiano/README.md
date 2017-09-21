### Forkin Piano app
by JimMarlowe

Just unzip and load ForkinPiano.atomic and run in the AtomicEditor, and you can deploy to your favorite platform, works on desktop and mobile.

![ForkinPiano](https://github.com/JimMarlowe/GameFarm/raw/master/ForkinPiano/forkinpiano.png)

### Technical Details
  This is a polyphonic, multitimbral sampler with a one octave keyboard. That said, it's also a toy with which you can annoy everyone in earshot :) I did an lot of research (well, I googled something) to find out the correct mathematical formulas to get perfect pitches and intervals, plugged then in, and it sounded like crap. 
  Apparently, I should have googled something else, but now multiple websites are convinced that I need to by musical instruments at rock-bottom prices.
  So, I shotgunned it, and got close enough for demo purposes, and now it sounds "charming".

I found out some things writing this program, namely that this isn't a good way to write this sort of program. It's laggy, the using the audio in this way leaves a lot to be desired when multiple items are played at one time.
I've since thought of better ways to make this work, so the next musical app will be more awesomer.

Yes, that is a completely skinned Turbobager UI around the keyboard (which itself is an ortho 2D set of sprites), and this time, I had to do a separate layout file for mobile to get the font to look good in the buttons.



### How you work this thing?
Click the buttons to change samples, adjust the sound level, and exit the app

To play  on desktop, you can click the keys with the mouse, or on your computer keyboard, use the 
"zxcvbnm," for the white keys and "sdghj" for the black keys.
    
For mobile, you touch the buttons and keys to play. And you can play more than one note at a time, up to the limit of your device's multitouch count!


Roll over, Bach.



Made with the Atomic Game Engine, http://atomicgameengine.com/

MIT License for Source code.
Assets are CC0 licensed.
