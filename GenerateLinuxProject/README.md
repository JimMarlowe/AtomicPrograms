## Generate Linux Project Script for Torque3D
by JimMarlowe

This script will generate (compile) a project for the current version of [Torque 3D](https://github.com/GarageGames/Torque3D) hosted on GitHub.

![GenerateLinuxProject](https://github.com/JimMarlowe/GameFarm/raw/master/GenerateLinuxProject/GenerateLinuxProject.png)

### How to install

Download the GenerateLinuxProject.sh script an place it into the top level Torque3D directory, where the Engine, My Projects, Templates and Tools directories are found. That's it!


### Running the script

The command line options and arguments are :

**`./generateLinuxProject.sh projectname "optional cmake arguments"`**

**projectname** is the name for your project, choose wisely, and if you have spaces in the name, use quotes around it.

**"optional cmake arguments"** are flags you can pass into the cmake configuration. If the software fails to compile, sometimes you can tell it to do other things to allow it to compile.

I made this because its somewhat detailed to build Torque3D on linux successfully. 
I'm presently using Mint Linux 17 Qiana, with a gcc (Ubuntu 4.9.4-2ubuntu1~14.04.1) 4.9.4 compiler.
This covers the make and install of the Torque3D software, 
and has some special handling for issue #1465, if it ever gets fixed, this script won't have to do the file copies.

Once this script executes successfully, you will have a projectname executable in the "My Projects/projectname/game" directory.  Then you can try some tutorials and torquescripting.

Remember to use quotes around pathname that contain spaces on linux.

### Example Script Usage

Note: For me, I have to add some cmake args to stop it from going into the weeds, you probably won't have to.
And you may pick a more imaginative project name than "projectname".

`./generateLinuxProject.sh myproject "-DVIDEO_MIR=OFF" `

For everyone else ...

`./generateLinuxProject.sh myproject `

If you want to look at the build log later, do this ...

`./generateLinuxProject.sh myproject >& buildlog.txt`


### Outro

I'm not sure yet if you can actually develop a program on linux (at least my linux), but getting it compiled was a good first step.
I can get the program to come up, and load in an empty mission, shoot things, 
I run into problems with the "Outpost" mission not loading, and the UI file finder is missing the file list, where it works ok on windows. 


MIT License.
