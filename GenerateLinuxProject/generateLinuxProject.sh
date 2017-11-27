#!/bin/bash
# Script to generate a linux project for Torque 3d. This script is to be executed in the top Torque3D directory.
# MIT License
#  $1 = Project name (i.e. Torque app name), if you want to use spaces, put quotes around the name.
#  $2 = optional cmake arguments, if there are spaces, put quotes around the argument.
#

# no arguments were given, give guidance and exit.
if [ -z "$1" ]; then
    echo "$0 Error - Torque app name argument was not given."
    echo "The syntax is : $0 myProjectName [optional cmake arguments]"
    echo "Hint: if the project name or optional cmake arguments contain spaces, enclose them in quotes."
    exit
fi

# blowing off foot check, are we where we think we are?
if [ ! -d "My Projects" ]; then
    echo "$0 Error - My Projects directory not found."
    echo "Please execute $0 from the top Torque3D directory."
    exit
fi

# move into the projects directory to do the work, hmmm path with spaces... use quotes
cd "My Projects"

# make the support directories, autogenerate the build dir name
# "linux" is selected since that is the platform we are building on.
mkdir -p $1Source/buildFiles/linux

# go into the support dir
cd $1Source/buildFiles/linux

# collect additional cmake args so we dont have to change any files...
# for instance, I need to add "-DVIDEO_MIR=OFF" for reasons I dont know.
CMAKEARGS=""
#if [ ! -z "$2" ]; then
if [ -n "$2" ]; then
    CMAKEARGS="$2"
fi

# generate the makefiles for a release build
cmake ../../../.. -DTORQUE_APP_NAME=$1 -DCMAKE_BUILD_TYPE=Release $CMAKEARGS

# make the Torque3D software
make

# fix up some files (issue #1465) so make install wont fail.
# if the files are in the right places, do nothing.
if [ ! -h ./Tools/CMake/sdl2/libSDL2.so ]; then
    cp -rp ./libSDL2.so ./Tools/CMake/sdl2/ ;
fi

if [ ! -h ./Tools/CMake/sdl2/libSDL2-2.0.so ]; then
    cp -rp ./temp/lib/libSDL2-2.0.so ./Tools/CMake/sdl2/ ;
fi

if [ ! -e .Tools/CMake/sdl2/libSDL2-2.0.so.0.4.1 ]; then
    cp -rp ./temp/lib/libSDL2-2.0.so.0.4.1 ./Tools/CMake/sdl2/ ;
fi

# and install the project
make install

# good news, we are done.
