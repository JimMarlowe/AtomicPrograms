#!/bin/bash
# unofficial linux Atomic C++ SDK
# For 
# JimMarlowe

# $1 = base directory of a built Atomic Game engine
# $2 = pathname for the SDK to be built
# $3 = optional location of Doxygen file
#
if [[ -z $1 || -z $2 ]]; then
echo "mksdk error"
echo "first argument is the base directory of a built Atomic Game Engine"
echo "Second argument is the pathname for the SDK to be built"
exit 1
fi

# making a new SDK, clear if it exists
rm -rf $2 ;
mkdir $2 ;

#make lib dir
mkdir $2/lib ;

#fill in includes
rsync -a --prune-empty-dirs --include '*/' --include '*.h' --exclude '*' $1/Source/ $2/include ; 

#copy in some non-header files
cp $1/Source/ThirdParty/kNet/include/kNet/*.inl $2/include/ThirdParty/kNet/include/kNet

#copy in libs
find $1/Artifacts/Build/Linux -name '*.a' -exec cp -pr '{}' $2'/lib/' ';' ;

#copy in cpp examples
cp -rp $1/Submodules/AtomicExamples/FeatureExamples/CPlusPlus $2

#add docs ?
if [ $3 ]; then
echo 'Generating docs'
cat $3 > $2/Doxyfile.age.tmp
echo "OUTPUT_DIRECTORY       = $2" >> $2/Doxyfile.age.tmp
cd $1/Source
doxygen $2/Doxyfile.age.tmp
fi

echo 'the SDK is completed'
