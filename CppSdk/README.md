# Rogue Atomic Game Engine C++ SDK
#### (For the linux platform)

**Updated Aug12 2017** add imgui lib, and new flexibility in SDK generation, including Saving it in the Atomic Game Engine deployment area.

**Updated Jun11 2017** the SDK now generates a Core resources pak file, called BaseResources.pak, to be completely independent from an Atomic build. The SimpleApp has been modified to use this file.

I made this because sometimes I need to make a C++ Atomic Game Engine program, to get around scripting API holes, use VariantMaps or perhaps to get the most speed.

What it produces, is a self-contained environment that can used to develop C++ games and applications. Then, it's just you, a compiler and an include and lib directories, which will be familiar to C++ developers.
You can start with SimpleApp or try the C++ FeatureExamples.

It is presently for linux.

## SDK Generation
The file `SdkGeneration.zip` contains the script(s) to create an SDK from an Atomic Game Engine source build.

### mksdk.sh
This is the script that creates the SDK from a built version of the Atomic Game Engine, since it uses that to copy the files. 

The command line arguments are :

To set the path to the Atomic Game Engine use : -a /path/to/atomic or --atomic-path /path/to/atomic  or -a=/path/to/atomic  or --atomic-path=/path/to/atomic  (this is a manditory setting)

To set the SDK path use -s /path/to/SDK or --sdk-path value or -s=value or --sdk-path=value, note, that if you are using the move command, you technically do not have to provide an SDK path, a default SDK will be created in /tmp for you.

To generate Doxygen documentation, set the pathname to the Doxyfile.age as -d /path/to/Doxyfile.age or --doxygen-file value or -d=value or --doxygen-file=value

To create a zip file of the SDK, when assembly is completed, use either -z or --zip, the zip file will be in the same directory that the SDK was created in.

To move SDK into Atomic Game Engine when assembly is completed, use either -m or --move, the destination will be
 /path/to/atomic/Artifacts/AtomicEditor/Resources/ToolData/Deployment/SDK

To include C++ examples with the SDK, use either -e or --examples

The basic command to create an SDK is  `./mksdk.sh -a /path/to/AtomicGameEngine -s /path/to/mysdk`

And an SDK with docs `./mksdk.sh -a /path/to/AtomicGameEngine -s /path/to/mysdk -d /path/to/Doxyfile.age`

And embed SDK (with docs) back into Atomic `./mksdk.sh -m -a /path/to/AtomicGameEngine -d /path/to/Doxyfile.age`


### Doxyfile.age
To use this file, copy it to your computer, and note it's location, so it can be used as the 3rd argument to the `mkdsk.sh` script, if you want documentation included.
This is the same doxygen that the Atomic Game Engine build uses, except it has the OUTPUT_DIRECTORY commented out, so it can be appended to the file, to get the documentation inside the SDK. This documentation will match the API that the build uses.

## SimpleApp Template

The file `SimpleApp.zip` contains all files necessary to make and run the SimpleApp.

This is a bare bones Atomic C++ program that is intended to be used with an AtomicSDK. This is a program without scripting support, so only the c++ parts of Atomic will be accessable.

To start with the SimpleApp, unzip `SimpleApp.zip` onto your computer. Go into the SimpleApp directory, and change the Makefile to aim it at the location of the SDK in order to compile for the line `ATOMICSDK := /Path/to/AtomicSDK`, then in a terminal, type `make`.
When it completes, it will produce the file `SimpleApp.bin` and copies in the BaseResources.pak. To run the file, you can use the script `./run.sh` and wonderous things should appear.

The source code has comments where to add the user code and a function `SimpleApp::DoSomething()`. For more examples of what is possible, see the C++ FeatureExamples source codes.



## Additional files for the C++ FeatureExamples
The file `FeatureExampleFiles.zip` contains the two files to copy into the `SDK/CPlusPlus` directory to allow it to use the SDK.

### Makefile
This is a linux makefile created specifically to compile the C++ FeatureExamples with the SDK. 
To use this file, copy it into the `SDK/CPlusPlus` directory, then in a terminal, run `make`, and a CppDemo.bin is created.

### run.sh
This is a script that will run the C++ FeatureExamples, also copy this file into the `SDK/CPlusPlus` directory. Ideally, you shouldn't need anything else to run the c++ program, but these examples require some resources that are in the Atomic Game Engine build, so you must give the pathname to the build as an argument to the script, like : `./run.sh /path/to/AtomicGameEngine` and the examples should run.
