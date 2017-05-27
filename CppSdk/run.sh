#!/usr/bin/env bash
# script to run the cpp examples
# $1 = atomic base directory
#
if [ -z "$1" ]; then

echo "Specify the Atomic Game Engine directory to run the c++ examples"

else

./CppDemo.bin -w -s -pp $1"/Artifacts/AtomicEditor/Resources/;.;"

fi
