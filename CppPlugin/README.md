# Commando C++ Plugin
### Made for the Rogue Atomic Game Engine C++ SDK (Linux)
![CommandsTab](https://github.com/JimMarlowe/GameFarm/raw/master/CppPlugin/cppplug1.png)

This is an AtomicEditor plugin that takes advantage of the C++ project organization and Rogue C++ SDK, and provides a way to do full toolchain, Just Code(TM) work.
The AtomicEditor integration isn't great, so the Commando C++ Plugin is used for most functions, we're rogue and now commando, remember? 

## Step 0. Installing the Rogue C++ SDK

Yeah we've been here before. It's presently only for linux, it takes the essence of Atomic and packages it in an SDK form, 
and it is *required* to make the Commando C++ Plugin work. 
It's got it's own page, go get it!

Quick tip on recommended install ... ```./mksdk.sh  -m  -a /<mypathto>/AtomicGameEngine -d /<mypathto>/Doxyfile.age```


The current implementation collects all libraries and includes necessary to compile and link a C++ program.

You can also generate doxygen help documentation.

It generates BaseResources.pak, which is a the pak file that contains all the default PlayerData and Data content in a single file, so you can develop resource based programs without being tied to an Atomic codebase.

It also builds and saves PackageTool to do the final resource packaging, when you want to deploy your program.

Since it includes all libraries, in the future it may be possible to only link necessary libraries instead of all libraries.

And now, it can be embedded in the AtomicEditor Deployment area, to make life better for step 3, so with the AtomicEditor, embedded SDK and a C++ compilier, you too can (theoritically) Just Code(TM) too. 



## Step 1. Installing the Commando C++ Plugin

Download the CPPPlugin.zip and unzip it in a project in the Resources folder.
It will add an EditorData folder, in which, is hiding the Commando C++ Plugin.
This can be any project, even an empty one, we are just using it to activate the Commando C++ Plugin.

If the AtomicEditor had that project loaded, 
unload it and load it again, otherwise the Typescript menu may not be available.

You will need to "compile" this plugin before it can be used (technically, transpile or something).

To do this, open the project in the Atomic editor, select EditorData in the project browser, then in the panel under that, select cppsdk.plugin.ts, and it will open in the editor.

Select menu entry Developer->Plugins->Typescript->CompileProject and wait for the Typescript Compilation Results window to appear, and press close. If cppsdk.plugin.js hasn't appeared under cppsdk.plugin.ts in the project browser, do the Developer->Plugins->Typescript->CompileProject operation again.

Then, you can close the project and when you reopen it, there should be a Developer->Plugins->C++ Operations entry, that is the Commando C++ Plugin.

You can now install some of the examples, and the Commando C++ Plugin will propagate itself, without need to be compiled again.



## Step 2. Organizing C++ coding into the project format

This is just common sense stuff to make C++ projects be like other language projects.

The Scripts Directory will be used to hold (at least) the cpp file that has the main function / class in it. 

As a default, there can be a AtomicMain.cpp file, which serves the same functon as a starting point like the AtomicMain.cs does for the C# projects.

Use the Components directory for other c++ code and components.

Use the Modules directory for ther C++ code and added libraries for the project.

Resources can be used 2 ways. For development, use the Resource tree for assets, with a bundled BaseResources.pak. Note: BaseResources.pak is found exclusively in the Rogue C++ SDK, in the pak folder.

When the program is ready to deploy, the convert the Resource and Cache directories into pak files, as is done with AtomicPlayer based programs. 

With this organization, we can start to get stuff done. And this is the format that the Commando C++ Plugin will support.

##### As a side note : this organization can be used to create a cpp project in VS or Xamarin or monodevelop. The thing about the Rogue SDK is, it can provide known locations for includes and libraries, but there are many options to creating that sort of project.



## Step 3.  Commando C++ Plugin, the inside story.

It adds a project CMakeLists.txt in the Scripts directory, to give the recipe to build the project. 
The operator does not need to manually edit this file, what edits that need to be done, are in the Commando C++ Plugin UI (see the Settings page).
Cmake was chosen as the build mechanism, to be cross-platform and ease of use, and to be able to support Windows, OSX (minus this Commando C++ Plugin).

It is possible to from the command line to make the project without the aid of the plugin, though it is far, far easier to do it with the plugin.

```
// Commands to do the initial cmake (creates the makefile) often done only once...
   cd <projectdir>/Build
   cmake <projectdir>/Resources/Scripts
   
// Commands to then build the project...
   cd <projectdir>/Build
   make

// Commands to run the compiled project 
   cd <projectdir>/SDK-Build
   source run.sh

```

Also added is a Build directory in the project directory, at the same level as Cache and Resources, to hold the cmake crap and intermediate object files.

And an SDK-Build directory in the project directory to put the executable being built.
  
####  Commands Tab
  ![CommandsTab](https://github.com/JimMarlowe/GameFarm/raw/master/CppPlugin/cppplug1.png)
  
 * Run    Ctrl+F5 - This button will build and run the current project
 * Build  Ctrl+F6 - This just builds the project.
 * Clear Log - This clears the console area.
 * Clean - This removes the intermediate object files and the executable.
 * Cmake - This runs cmake, which normally does not need to be run.
 * Deploy - This packages the Resources and Cache into pak files, so the executable can be run outside of the development environment.
 * Help  Ctrl+F1 - If the SDK includes documentation, this will spawn it in a browser.

The console area is used to give status on the commands.
 
The little thing on the right side allows you to change the upper and lower viewing area sizes.

#### Files Tab
  ![FilesTab](https://github.com/JimMarlowe/GameFarm/raw/master/CppPlugin/cppplug2.png)

This lists all the cpp files in the project. They can be viewed and editted by selecting the file and pressing the "Edit Selected File" button.
  
#### Setup Tab
  ![SetupTab](https://github.com/JimMarlowe/GameFarm/raw/master/CppPlugin/cppplug3.png)

 * File Edit Command - this is a command to execute an editor. it presently defaults to gedit, this option is saved.
 * SDK Path - location of an SDK, currently aimed at the embedded rogue SDK, this option is saved.
 * Save Settings - this saves the values to be available next time the plugin is brought up.
      
#### Examples Tab
  ![ExamplesTab](https://github.com/JimMarlowe/GameFarm/raw/master/CppPlugin/cppplug4.png)
  
Select an example and press  "Install Selected Example..." button, then select the destination directory, and on OK, will
install the ready to use example.

The examples are :

 * Empty Project - a completely empty project, it compiles, does ... nothing.
 * Basic 2D  - the basic 2d example.
 * Basic 3D  - the basic 3d example.
 * UIPeriodicTable - the UI periodic example.
 * Simple - a simple 3d program where you can click and be the destroyer of world(s).

Once these programs are installed, you can press "Run", and they do.

Would you like to know more?




