## Adventure Suite Game
by JimMarlowe

Just unzip and load advsuite.atomic and run in the AtomicEditor, and you can deploy to your favorite platform, works on desktop and mobile.

### How to play

Find the treasure chests with the gold in it. But watch out for the chests full of "fools gold" instead of getting a treat, you are sent back to a spawn point! You must find all the treasures to complete a level.

#### Adventure 1
The starter level, see the sights and find the treasure.
#### Adventure 2
More is better on the plains.
#### Adventure 3
Bigger is better too, a stress test for number of models.
#### Adventure 4
A rogue homage, complete with mazes, dont get lost.


### TMX2SCENE
This game uses the TMX2SCENE utility (aka the Plat.js module) to create the levels. You use the Tiled editor to place map objects where you want them, then using the TMX2SCENE utility, it transforms the map instructions into 3D object. Bonus, you can change the map with Tiled at any time.

And yes, its real low poly, Jim is not made of bandwidth :) But it performs well everywhere, like on Android. Check the FPSes!

### Assets
* Psionic's dwarf model, with axe removed. http://www.psionic3d.co.uk/ CC0
* The chest from the Atomic Basic3D Example converted to mdl
* https://opengameart.org/content/low-poly-objects-landscape *had to massage the heck out of it. CC0
* https://opengameart.org/content/rpg-sound-pack  *also massaged  CC0
* https://opengameart.org/content/breakout-graphics-no-shadow  *some of the icons CC0

### Controls
  * WSAD or Arrow keys to move. 
  * Android has onscreen controls for WSAD, and touch steers the player.
  * "F" to toggle between 3rd person, 1st person and Freecam (desktop only)
  * F1 for screenshot on desktop only.
  * Esc to exit

### Configuration Options:
 * Debug Scene Geometry  -- for the developer, you can turn on the geometry debugging visuals.
 * Shadow Override for Linux and Android  -- these two platforms have shadow problems, if you want, you can make them appear anyway!
 * Autosize mobile display (recommended)  -- Makes the text and onscreen controls be a good size. its a guess, if the guess is wrong try these three options.
   * Use Phone Dpi                                          
   * Use Tablet Dpi
   * Use Desktop Dpi


Made with the Atomic Game Engine, http://atomicgameengine.com/

MIT License for Source code.
Assets are CC0 licensed.

