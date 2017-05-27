#
# Part of the unofficial AtomicSDK for building the cpp examples
#

XX := g++

# Name of the executable created
Target := CppDemo.bin

# List of source files, separated by spaces
Sources := Source/2DSprite.cpp Source/CrowdNavigation.cpp Source/Mover.cpp Source/RenderToTexture.cpp    Source/Touch.cpp \
Source/AnimatingScene.cpp Source/Decals.cpp Source/MultipleViewports.cpp Source/Rotator.cpp Source/Vehicle.cpp \
Source/Billboards.cpp Source/DynamicGeometry.cpp Source/Particles3D.cpp Source/Sample.cpp Source/VehicleDemo.cpp \
Source/Character.cpp Source/FeatureExamples.cpp Source/Physics2D.cpp Source/SampleSelector.cpp Source/Water.cpp \
Source/CharacterDemo.cpp Source/HelloGui.cpp Source/Physics3D.cpp Source/SkeletalAnimation.cpp  \
Source/Constraints2D.cpp Source/HelloWorld.cpp Source/PhysicsRope2D.cpp Source/SpriterAnimation.cpp \
Source/CreateRagdoll.cpp Source/LightAnimation.cpp Source/Ragdolls.cpp Source/StaticScene.cpp \

# Path to AtomicSDK directory, should contain include/ and lib/
ATOMICSDK := ..
ATOMICLIBS := ../lib
 # Path for the executable.  
BinPath = .

CXX_DEFINES = -DATOMIC_3D -DATOMIC_64BIT=1 -DATOMIC_API="" -DATOMIC_ATOMIC2D -DATOMIC_CXX11=1 -DATOMIC_FILEWATCHER -DATOMIC_LOGGING -DATOMIC_NAVIGATION -DATOMIC_NETWORK -DATOMIC_OPENGL -DATOMIC_PHYSICS -DATOMIC_PLATFORM_DESKTOP -DATOMIC_PLATFORM_LINUX -DATOMIC_PROFILING -DATOMIC_ROOT_BUILD_DIR=\"./\" -DATOMIC_ROOT_SOURCE_DIR=\"./Source\" -DATOMIC_STATIC_DEFINE -DATOMIC_TBUI -DATOMIC_THREADING -DATOMIC_WEB -DATOMIC_WEBVIEW -DCURL_STATICLIB=1 -DHAVE_INT64_T -DKNET_UNIX -DPOCO_NO_AUTOMATIC_LIBS -DPOCO_STATIC

# general compiler settings (might need to be set when compiling the lib, too)
# preprocessor flags, e.g. defines and include paths
USERCPPFLAGS = 

USERCXXFLAGS = -Wno-invalid-offsetof -std=gnu++0x -fPIC -O3 -DNDEBUG -I$(ATOMICSDK)/include -I$(ATOMICSDK)/Source -I$(ATOMICSDK)/include/ThirdParty/Poco/Foundation/include -I$(ATOMICSDK)/include/ThirdParty/rapidjson/include -I$(ATOMICSDK)/include/ThirdParty -I$(ATOMICSDK)/include/ThirdParty/kNet/include -I$(ATOMICSDK)/include/ThirdParty/FreeType/include -I$(ATOMICSDK)/include/ThirdParty/Box2D -I$(ATOMICSDK)/include/ThirdParty/zlib -Wno-warn-absolute-paths

USERLDFLAGS =  -Wno-invalid-offsetof -std=gnu++0x -fPIC -O3 -DNDEBUG -o $(Target) $(ATOMICLIBS)/libAtomic.a $(ATOMICLIBS)/libBox2D.a  $(ATOMICLIBS)/libTurboBadger.a $(ATOMICLIBS)/libFreeType.a $(ATOMICLIBS)/libJO.a $(ATOMICLIBS)/libLZ4.a $(ATOMICLIBS)/libPugiXml.a $(ATOMICLIBS)/libSTB.a $(ATOMICLIBS)/libSDL.a $(ATOMICLIBS)/libBullet.a $(ATOMICLIBS)/libStanHull.a $(ATOMICLIBS)/libCivetweb.a $(ATOMICLIBS)/libRecast.a $(ATOMICLIBS)/libDetour.a $(ATOMICLIBS)/libDetourCrowd.a $(ATOMICLIBS)/libDetourTileCache.a $(ATOMICLIBS)/libkNet.a $(ATOMICLIBS)/libcurl.a $(ATOMICLIBS)/liblibsquish.a -lpthread $(ATOMICLIBS)/libGLEW.a -lGL -ldl $(ATOMICLIBS)/libssl.a $(ATOMICLIBS)/libcrypto.a $(ATOMICLIBS)/libzlib.a 

####
#no changes necessary below this line
####

CPPFLAGS = -I. 
CXXFLAGS = $(USERCXXFLAGS)
LDFLAGS = $(USERLDFLAGS)

#default target is Linux -I$(UHome)/include/Urho3D
all: all_linux

# target specific settings
#all_linux all_win32 static_win32: LDFLAGS += $(Urho3DHome)/usr/local/lib/Urho3D/libUrho3D.a
all_linux all_win32 static_win32: LDFLAGS += -ldl
all_linux: LDFLAGS += -ldl -lpthread -lrt -lm -lGL -lc -lX11 
all_linux clean_linux: SYSTEM=Linux

# name of the binary - only valid for targets which set SYSTEM
DESTPATH = $(BinPath)/$(Target)$(SUF)

all_linux all_win32 static_win32:
	$(warning Building...)
	$(CXX) $(CXX_DEFINES) $(CPPFLAGS) $(CXXFLAGS) $(Sources) -o $(DESTPATH) $(LDFLAGS)

clean: clean_linux clean_win32
	$(warning Cleaning...)

clean_linux clean_win32:
	@$(RM) $(DESTPATH)

.PHONY: all all_win32 static_win32 clean clean_linux clean_win32

#multilib handling
ifeq ($(HOSTTYPE), x86_64)
LIBSELECT=64
endif
#solaris real-time features
ifeq ($(HOSTTYPE), sun4)
LDFLAGS += -lrt
endif

