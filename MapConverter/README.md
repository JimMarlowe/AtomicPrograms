## PK3 Map Converter
by JimMarlowe

This program converts a Q3 style PK3 maps to wavefront/.obj, collada/.dae, irrMesh, STereoLithography/.stl and Polygon File Format/.ply.
It operates with command line arguments, and can also show the map, which can be moved thru in first person, with no collision.

### Running the program

the command line options and arguments are :

MapConverter [options] srcpk3 destfile 

 --close  - adding this argument will close the program after the conversion is complete.

 --format=[obj|dae|irr|stl|ply]  -  this selects the output file format, if no selection is made, the default setting is obj

 --driver=[ogl|dx9|dx8|burn|sw]  -  this argument can override the video driver selection, the default is platform specific, and falls back to Burnings (software driver) if the platform can not be determined.

 srcpk3 - this argument is the pathname to the pk3 file to be converted.

 destfile - this argument is the pathname when the converted file will land. Note, the destination directory must exist before running the conversion. Note, you must add the appropriate extension to the converted file.


 If you chose to not close the program, you can move around in the map, using the arrow keys for forward, back, left, right and the mouse/touchpad will set the direction (pitch and yaw).
 to exit the program, press 'Ecs', 'q' or Alt+4.
 
 
### Compiling the program.
 You need to get [Irrlicht](http://irrlicht.sourceforge.net/), which is the base technology for this program. Download the [latest version](http://irrlicht.sourceforge.net/?page_id=10) and compile for your platform.
Once you have a working irrlicht, unzip MapConverter.zip into the /irrlicht-version/tools directory, go into the /irrlicht-version/tools/MapConverter directory, and compile the program. The executable program will end up in /irrlicht-version/bin/platform/ as MapConverter.


### And go

Then you can run the MapConverter program.  There is a pk3 map in the irrlicht distribution you can test, at /irrlicht-version/media/map-20kdm2.pk3


It does a good job, but there are maps that can not be converted. One such map is SGDTT3.pk3, which assimp uses for some testing, so be warned.


Zlib License.
