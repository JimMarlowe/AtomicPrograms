// -------------------------------------------------------
// Plugin to support the rogue cpp sdk in the Atomic editor
// -------------------------------------------------------
// it can perform a make on the cpp "project"
// it can execute the "project"
// it can do some deploy operations (package resources)
// It can do some config for the cpp sdk (saved to config file)
// -------------------------------------------------------
// JimMarlowe 

const CPPSDK_UI = "EditorData/cppsdk.ui.txt";
const CPPSDK_CONFIGFILE = "Resources/EditorData/cppsdk-config.json";
const CPPSDK_CMAKETEMPLATE = "Resources/EditorData/CMakeLists.txt";

class CPPSDKPlugin extends Atomic.ScriptObject
    implements Editor.HostExtensions.HostEditorService,
    Editor.HostExtensions.UIServicesEventListener,
    Editor.HostExtensions.ProjectServicesEventListener
{
    // Define the name and description of the plugin.
    name = "CPPSDKPlugin";
    description = "Operational support for the rouge C++ SDK";
    private cppsdkWindow: Editor.Modal.ExtensionWindow = null;
    private configWindow: Atomic.UIWindow = null;
    private serviceLocator: Editor.HostExtensions.HostServiceLocator;

    // config values - the object of use, serialization
    // -- plugin settings
    private mysdkpath = "";
    private myfileeditcmd = "";
    // ---- project settings
    private myexecutablepath = "";
    private myexecutablename = "";
    private mymakefile = "";
    // moveable panels
    private pwinheight: number = 0;

    /**
     * Called when the plugin is first loaded by the editor.  A reference to the
     * service locator interface will be passed to the initialization routine so that
     * it can 'talk back' to the editor.
     *
     * @param {Editor.HostExtensions.HostServiceLocator} serviceLocator
     *
     * @memberOf MyMenuPlugin
     */
    initialize(serviceLocator: Editor.HostExtensions.HostServiceLocator)
    {
        Atomic.print(`$ {this.name } .initialize`); // some debug
        this.serviceLocator = serviceLocator;
        this.serviceLocator.uiServices.register(this);
        this.serviceLocator.projectServices.register(this);
    }

    projectLoaded(ev: Editor.EditorLoadProjectEvent)
    {
        // Atomic.print(`$ {this.name } .projectLoaded`); // some debug
        this.serviceLocator.uiServices.createPluginMenuItemSource("C++ Operations", { "Run Project" : [`${this.name } .myaction1`, "Ctrl+F5" ], "Build Project" : [`${this.name } .myaction2`, "Ctrl+F6" ], "CPP Plugin" : [`${this.name } .myaction3`] } );

        // read in the json saved configuration
        var filesystem = Atomic.getFileSystem();
        var projx = ToolCore.getToolSystem().getProject().getProjectPath();
        var projs = ToolCore.getToolSystem().getProject().getScriptsPath();
        var configf = projx + CPPSDK_CONFIGFILE;
        var file3 = new Atomic.File( configf, Atomic.FileMode.FILE_READ);
        if ( file3.isOpen() )
        {
            var f3string = file3.readString();
            var jsonsettings = JSON.parse(f3string);
            file3.close();
            this.myfileeditcmd = jsonsettings.editcmd;
            this.mysdkpath = jsonsettings.sdk;
        }
        Atomic.print("projectLoaded  file = " + configf );
        Atomic.print("projectLoaded  read setting this.mysdkpath= " + this.mysdkpath);
        Atomic.print("projectLoaded  read setting this.myfileeditcmd= " + this.myfileeditcmd);

        if ( this.myfileeditcmd === "" )  // hmmm needs a default
        {
            this.myfileeditcmd = "gedit "; // pick something at least on linux.
            Atomic.print("projectLoaded fallback default this.myfileeditcmd= " + this.myfileeditcmd);
        }

        if ( this.myexecutablename === "" )  // harvest this from the project dir name
        {
            // get the last prt of ->  projx
            var tokens = projx.split("/");  // do a split and take the last token?
            this.myexecutablename = tokens[tokens.length-2];
            Atomic.print("projectLoaded setting this.myexecutablename = " + this.myexecutablename);

            //IDEALLY, if the Scripts/CMakeLists.txt, exists, we should be able to extract it from there.
        }

        if ( this.mymakefile === "" ) // CMakeLists.txt is not declared in this cpp project
        {
            this.mymakefile = projs+"/CMakeLists.txt";
            if ( !filesystem.fileExists ( this.mymakefile ) )   // check to see if it exists, and its just not reported.
            {
                Atomic.print("The CMakeLists.txt is missing from the Scripts folder, this project can not be compiled\n");
            }
        }

        if (this.myexecutablepath === "" )   // give it a value
        {
            this.myexecutablepath = projx + "SDK-Build";
            if ( !filesystem.dirExists(this.myexecutablepath ) )
            {
                Atomic.print("The SDK-Build folder is missing, this project can not be compiled\n");
            }
            Atomic.print("projectLoaded setting this.myexecutablepath= " + this.myexecutablepath);
        }

        if ( this.mysdkpath === "" ) // assign (guess) default path for SDK
        {
            this.mysdkpath = filesystem.getProgramDir()+"Resources/ToolData/Deployment/SDK";
            if ( !filesystem.dirExists(this.mysdkpath))
            {
                Atomic.print("The SDK folder is missing, this project can not be compiled\n");
            }
        }

        var myforkingplug = this;  // get around the context issue, since what it's telling me about bind isnt making sense.
        this.subscribeToEvent( "UIShortcut", function (ev)
        {
            if ( ev.key == Atomic.KEY_F5 && ev.qualifiers == Atomic.QUAL_CTRL )   // make an Ctrl+F5 shortcut work
            {
                myforkingplug.menuItemClicked(`$ { myforkingplug.name } .myaction1` ); //"CPPSDKPlugin. myaction1");
            }
            if ( ev.key == Atomic.KEY_F6 && ev.qualifiers == Atomic.QUAL_CTRL )   // make an Ctrl+F6 shortcut work
            {
                myforkingplug.menuItemClicked(`$ { myforkingplug.name } .myaction2`);
            }
            if ( ev.key ==  Atomic.KEY_F7 && ev.qualifiers == Atomic.QUAL_CTRL )   // make an Ctrl+F7 shortcut work
            {
                myforkingplug.menuItemClicked(`$ { myforkingplug.name } .myaction3`);
            }
            if ( ev.key ==  Atomic.KEY_F1 && ev.qualifiers == Atomic.QUAL_CTRL )   // make an Ctrl+F1 shortcut work
            {
                myforkingplug.menuItemClicked(`$ { myforkingplug.name } .gethelp`);
                //  myforkingplug.getHelp();  // this doesnt work
                //  `${ myforkingplug.name } .getHelp()`;  // this doesnt work
            }
        });
    }

    projectUnloaded()
    {
        Atomic.print(`$ {this.name } .projectUnloaded`); // some debug
        this.serviceLocator.uiServices.removePluginMenuItemSource("C++ Operations");
        this.serviceLocator.projectServices.unregister(this);
        this.serviceLocator.uiServices.unregister(this);
        this.unsubscribeFromAllEvents();
    }

    menuItemClicked(refId: string): boolean
    {
        Atomic.print(`${this.name } .menuItemClicked: ${refId }`); // some debug

        if (refId == `${this.name } .myaction1`)
        {
            Atomic.print( "handled myaction1  as  `${this.name } .myaction1`" );
            this.performRun();
            // Return true to indicate that we handled the click event
            return true;
        }
        else if (refId == `${this.name } .myaction2`)
        {
            Atomic.print( "handled myaction2" );
            this.performMake();
            return true;
        }
        else if (refId == `${this.name } .myaction3`)
        {

            Atomic.print( "handled myaction3" );
            this.SpawnUI()
            return true;
        }
        else if (refId == `${this.name } .myaction4`)
        {

            Atomic.print( "handled myaction4" );
            //  this.performDeploy();
            return true;
        }
        else if (refId == `${this.name } .gethelp`)
        {

            Atomic.print( "handled gethelp -- a fake menu event!" );
            this.getHelp();
            return true;
        }
        return false;
    }

    SpawnUI()
    {
        if ( this.cppsdkWindow === null )   // spawn it if we need to, otherwise reuse it
        {
            this.cppsdkWindow = this.serviceLocator.uiServices.showNonModalWindow("C++ Operations", CPPSDK_UI, (ev: Atomic.UIWidgetEvent) =>
            {
                Atomic.print( "cppsdkWindow UIWidgetEvent for " + ev.target.id );
                if (ev.type == Atomic.UI_EVENT_TYPE.UI_EVENT_TYPE_CLICK && ev.target.id == "cppsdkok")
                {
                    this.cppsdkWindow.hide();
                    this.cppsdkWindow = null;
                    return true;
                }
                if (ev.type == Atomic.UI_EVENT_TYPE.UI_EVENT_TYPE_CLICK && ev.target.id == "cppsdkcompile")
                {
                    this.performMake();
                    return true;
                }
                if (ev.type == Atomic.UI_EVENT_TYPE.UI_EVENT_TYPE_CLICK && ev.target.id == "cppsdkrun")
                {
                    this.performRun();
                    return true;
                }
                if (ev.type == Atomic.UI_EVENT_TYPE.UI_EVENT_TYPE_CLICK && ev.target.id == "cppsdkdeploy")
                {
                    this.performDeploy();
                    return true;
                }
                if (ev.type == Atomic.UI_EVENT_TYPE.UI_EVENT_TYPE_CLICK && ev.target.id == "cppsdkhelp")
                {
                    this.getHelp();
                    return true;
                }
                if (ev.type == Atomic.UI_EVENT_TYPE.UI_EVENT_TYPE_CLICK && ev.target.id == "cppsdkcmake")
                {
                    this.performCmake();
                    return true;
                }
                if (ev.type == Atomic.UI_EVENT_TYPE.UI_EVENT_TYPE_CLICK && ev.target.id == "cppsdkclear")
                {
                    this.performClearLog();
                    return true;
                }
                if (ev.type == Atomic.UI_EVENT_TYPE.UI_EVENT_TYPE_CLICK && ev.target.id == "cppsdkclean")
                {
                    this.performClean();
                    return true;
                }
                if (ev.type == Atomic.UI_EVENT_TYPE.UI_EVENT_TYPE_CLICK && ev.target.id == "savesettings")
                {
                    this.performSettingsSave();
                    return true;
                }
                if (ev.type == Atomic.UI_EVENT_TYPE.UI_EVENT_TYPE_CLICK && ev.target.id == "cppsdkinstall")
                {
                    this.selectInstall();
                    return true;
                }
                if (ev.type == Atomic.UI_EVENT_TYPE.UI_EVENT_TYPE_CHANGED && ev.target.id == "moverslider")
                {
                    var slider = <Atomic.UISlider>ev.target;
                    var newsize = slider.getValue();
                    this.changeSize( newsize );
                    return true;
                }
            });

            this.pwinheight = this.cppsdkWindow.height;  // seed for window watching, with no onresize

            // fix the UITabContainer visuals.
            var tc = <Atomic.UITabContainer>this.cppsdkWindow.findWidget("SDKTabContainer");
            tc.setCurrentPage(0);

            var myslider = <Atomic.UISlider>this.cppsdkWindow.getWidget("moverslider");
            var myhandle = myslider.getFirstChild();
            if ( myhandle !== null )
            {
                myhandle.setSkinBg ("TBWindow.mover"); // change the slider "look"
                myhandle.invalidate();
            }

            // MAP DATA IN
            var filesystem = Atomic.getFileSystem(); // Get the FileSystem subsystem

            var filelist = <Atomic.UISelectList>this.cppsdkWindow.getWidget("cppfilelist");  // file list
            var fileSource = new Atomic.UISelectItemSource(); // make a new one, does it replace the old one?
            var nn = 0;
            var myfiles;
            var projs = ToolCore.getToolSystem().getProject().getScriptsPath();
            if ( filesystem.dirExists ( projs ) )    // fill the list, feel the joy
            {
                myfiles = filesystem.scanDir ( projs, "*.cpp", Atomic.SCAN_FILES, false );  // get all the cpp files
                for ( nn=0; nn< myfiles.length; nn ++ )
                {
                    fileSource.addItem(new Atomic.UISelectItem( "Scripts/"+myfiles[nn] ));
                }
            }
            var projm = ToolCore.getToolSystem().getProject().getModulesPath();
            if ( filesystem.dirExists ( projm ) )    // fill the list, feel the joy
            {
                myfiles = filesystem.scanDir ( projm, "*.cpp", Atomic.SCAN_FILES, false );  // get all the cpp files
                for ( nn=0; nn< myfiles.length; nn ++ )
                {
                    fileSource.addItem(new Atomic.UISelectItem( "Modules/"+myfiles[nn] ));
                }
            }
            var projc = ToolCore.getToolSystem().getProject().getComponentsPath();
            if ( filesystem.dirExists ( projc ) )    // fill the list, feel the joy
            {
                myfiles = filesystem.scanDir ( projc, "*.cpp", Atomic.SCAN_FILES, false );  // get all the cpp files
                var sortedFiles: string[] = myfiles.sort((n1,n2) =>     // sort them
                {
                    if (n1 > n2) { return 1; }
                    if (n1 < n2) { return -1; }
                    return 0;
                });
                for ( nn=0; nn<sortedFiles.length; nn ++ )
                    fileSource.addItem(new Atomic.UISelectItem( "Components/"+sortedFiles[nn] ));
            }

            filelist.setValue(-1); // fix the selection and scrolling
            filelist.setSource(fileSource); // and stuff it into the list

            var examplelist = <Atomic.UISelectList>this.cppsdkWindow.getWidget("sdkexamplelist");

            var exampleSource = new Atomic.UIMultiItemSource();
            var er0 = new Atomic.UIMultiItem ( "CPP-Empty", "IMAGE", "EditorData/Screenshote.png", 120, 70 );
            er0.addColumn ( "TEXT", "Empty Project", 120 );
            var er1 = new Atomic.UIMultiItem ( "CPP-Basic2D", "IMAGE", "EditorData/Screenshot2.png", 120, 70 );
            er1.addColumn ( "TEXT", "Basic 2D", 120 );
            var er2 = new Atomic.UIMultiItem ( "CPP-Basic3D", "IMAGE", "EditorData/Screenshot3.png", 120, 70 );
            er2.addColumn ( "TEXT","Basic 3D", 120 );
            var er3 = new Atomic.UIMultiItem ( "CPP-Periodic", "IMAGE", "EditorData/Screenshotp.png", 120, 70 );
            er3.addColumn ( "TEXT","UIPeriodicTable",  120 );
            var er4 = new Atomic.UIMultiItem ( "CPP-Simple", "IMAGE", "EditorData/Screenshots.png", 120, 70 );
            er4.addColumn ( "TEXT", "Simple", 120 );
            exampleSource.addItem(er0);
            exampleSource.addItem(er1);
            exampleSource.addItem(er2);
            exampleSource.addItem(er3);
            exampleSource.addItem(er4);
            examplelist.setValue(-1); // fix the selection and scrolling
            examplelist.setSource(exampleSource); // and stuff it into the list

            var edit1 = <Atomic.UIEditField>this.cppsdkWindow.getWidget("sdkpath");
            edit1.setText (this.mysdkpath);
            var edit5 = <Atomic.UIEditField>this.cppsdkWindow.getWidget("fileeditcmd");
            edit5.setText (this.myfileeditcmd);

            var ed1 = <Atomic.UIButton>this.cppsdkWindow.getWidget("cppsdkeditfile");
            var editcmd = this.myfileeditcmd; // scope end-around
            ed1.onClick = function ()
            {
                var projx = ToolCore.getToolSystem().getProject().getProjectPath();
                projx += "/Resources/";
                var myfile = filelist.getSelectedItemString(); // mylist.value  // get selected list entry
                projx += myfile; // make a full path out of it ....
                if (filesystem.fileExists(projx) )
                {
                    if (editcmd !== "" )   // get edit command
                    {
                        var cmd = editcmd + " " + projx  + " &"; // put the two together bingo.
                        filesystem.systemCommandAsync(cmd);  //run it async!
                    }
                }
            } .bind(this);
            var ff1 = <Atomic.UIButton>this.cppsdkWindow.getWidget("findsdkpath");
            ff1.onClick = function ()
            {
                var sfinder = new Atomic.UIFinderWindow(ff1.getView(), "mysdkfinder");
                sfinder.findPath("Find SDK Folder", this.mysdkpath, 0, 0, 0);
                sfinder.subscribeToEvent( sfinder, "UIFinderComplete", function (ev)
                {
                    if( ev.reason == "OK" )   // reasons are strings "OK" and "CANCEL", depending on which was pressed
                    {
                        // do OK action   Atomic.print ( "the file (or folder) I got was " + ev.selected );
                        edit1.setText ( ev.selected );
                    }
                });
            } .bind(this);
        }
        return false;
    }

    changeSize( sizer: number )
    {
        var currentht = this.cppsdkWindow.height;
        var myslider = <Atomic.UISlider>this.cppsdkWindow.findWidget("moverslider");
        var sval =  currentht - myslider.getValue();

        var myok = <Atomic.UIButton>this.cppsdkWindow.findWidget("cppsdkok");
        var bheight = myok.getHeight();
        var sbot = (currentht - sval) - bheight;
        var mylayouttop = <Atomic.UILayout>this.cppsdkWindow.findWidget("movertop");
        mylayouttop.setLayoutPrefHeight(sval);
        var mylayout1 = <Atomic.UILayout>this.cppsdkWindow.findWidget("SDKTabLayout1");
        mylayout1.setLayoutPrefHeight(sval);
        var mylayout2 = <Atomic.UILayout>this.cppsdkWindow.findWidget("SDKTabLayout2");
        mylayout2.setLayoutPrefHeight(sval);
        var mylayout3 = <Atomic.UILayout>this.cppsdkWindow.findWidget("SDKTabLayout3"); // < problem child
        mylayout3.setLayoutPrefHeight(sval);
        var mylayout4 = <Atomic.UILayout>this.cppsdkWindow.findWidget("SDKTabLayout4");
        mylayout4.setLayoutPrefHeight(sval);
        
        var mylayoutbot = <Atomic.UILayout>this.cppsdkWindow.findWidget("moverbot");
        mylayoutbot.setLayoutPrefHeight(sbot);

        mylayoutbot.invalidate();
        mylayouttop.invalidate();

        if ( this.pwinheight != currentht )  // stuff has changed, fix the slider
        {
            if (currentht <= 160 ) myslider.setLimits(160, 161);
            else
                myslider.setLimits(160, currentht);
            this.pwinheight = currentht;
        }
    }

    performProjectInit()
    {
        Atomic.print( "performProjectInit" );
        var filesystem = Atomic.getFileSystem(); // Get the FileSystem subsystem
        var projs = ToolCore.getToolSystem().getProject().getScriptsPath();
        if ( filesystem.dirExists ( projs ) )    // fill the list, feel the joy
        {
            var mycppfiles = filesystem.scanDir ( projs, "*.cpp", Atomic.SCAN_FILES, false );
            if ( mycppfiles.length > 0 )     // we have cpp files, do some more checking
            {
                Atomic.print( "Detected cpp files in Scripts directory" );
                if ( !filesystem.fileExists ( projs+"/CMakeLists.txt" ))    // check for Scripts/CMakeLists.txt
                {
                    Atomic.print("The CMakeLists.txt is missing from the Scripts folder, this project can not be compiled\n");
                }
                else    // this project is good-ish, for now, run cmake on project entry
                {
                    Atomic.print( "Running cmake at project load to ensure freshness." );
                    this.performCmake();
                }
            }
        }
    }

    performCmake()     // used when files are added or removed or requested.
    {
        Atomic.print( "performCmake" );
        var filesystem = Atomic.getFileSystem(); // Get the FileSystem subsystem
        var projx = ToolCore.getToolSystem().getProject().getProjectPath();
        var projs = ToolCore.getToolSystem().getProject().getScriptsPath();
        var builddir = projx + "/Build";

        var mylog = new Atomic.Log();
        mylog.open ( projx + "/Resources/EditorData/cppsdkops.log" ); // open log file so we can capture the compile

        var cmd = "cd " + builddir + "; ";         // cd to the project/Build
        cmd += " cmake " + projs + " ;";    // then cmake

        if ( this.cppsdkWindow !== null )   // stuff in compile log
        {
            var logText = <Atomic.UIEditField>this.cppsdkWindow.findWidget("cppsdklog");
            logText.text = "Running command: " + cmd;
        }

        filesystem.systemCommand(cmd, true);
        mylog.close();  // close the log file, were done capturing.

        var results = "Nothing happened.";

        // Now reopen the capture file so it can be displayed.
        var logfile = new Atomic.File(projx + "/Resources/EditorData/cppsdkops.log", 0 );
        if (logfile.isOpen())
        {
            results = logfile.readText();
            logfile.close();
        }

        if ( this.cppsdkWindow !== null )   // stuff in compile log
        {
            var reportText = <Atomic.UIEditField>this.cppsdkWindow.findWidget("cppsdklog");
            reportText.appendText( "\n\n" + results);
            reportText.scrollTo ( 0, 1000 );  // it wont easily tell the position, so shotgun it!
        }
    }

    performMake()
    {
        Atomic.print( "performMake" );

        if ( this.projectValidator() === false ) return;

        var filesystem = Atomic.getFileSystem(); // Get the FileSystem subsystem
        var projx = ToolCore.getToolSystem().getProject().getProjectPath();

        if ( !filesystem.fileExists(projx+"Build/Makefile") )
        {
            this.performCmake();
        }

        //
        // cmake's makefile outputs errors to stderr, which the Log doesnt pick up!
        // so we have to do this... which is not platform friendly. thanks cmake.
        //
        var mymakelog =  projx + "/Resources/EditorData/cppsdkops1.log";

        var cmd = "cd " + projx + "/Build ; ";       // cd to the Scripts/build
        cmd += " make > " + mymakelog + " 2>&1 ;";   // then do the make-cmake workaround

        filesystem.systemCommand(cmd, true);

        this.SpawnUI(); // spawn the non-blocking dialog, if its already up, uses it

        if ( this.cppsdkWindow !== null )   // stuff in make log
        {
            var reportText = <Atomic.UIEditField>this.cppsdkWindow.findWidget("cppsdklog");
            var logfile1 = new Atomic.File(projx + "/Resources/EditorData/cppsdkops1.log", 0 );
            if (logfile1.isOpen())
            {
                reportText.appendText( "\n\n" + logfile1.readText());
                reportText.scrollTo ( 0, 1000 );  // it wont easily tell the position, so shotgun it!
                logfile1.close();
            }
        }
    }

    performRun()
    {
        Atomic.print( "performRun" );

        this.SpawnUI(); // spawn the non-blocking dialog, if its already up, uses it

        if ( this.cppsdkWindow !== null )
        {
            var reportText = <Atomic.UIEditField>this.cppsdkWindow.findWidget("cppsdklog");
            reportText.setText( "performRun\n" );
        }

        if ( this.projectValidator() === false ) return;

        this.performMake();  // do this before running

        var filesystem = Atomic.getFileSystem(); // Get the FileSystem subsystem
        var projx = ToolCore.getToolSystem().getProject().getProjectPath();

        // form command...
        var cmd = "cd " + projx + "/SDK-Build ; ";  // cd to executable dir
        cmd += "sh ./run.sh ;";  // and run this script to find local Resources

        filesystem.systemCommandAsync(cmd);  //run it async!

        if ( this.cppsdkWindow !== null )   // stuff in compile log
        {
            var reportText = <Atomic.UIEditField>this.cppsdkWindow.findWidget("cppsdklog");
            reportText.appendText( "\n\nrunning command: " + cmd );
            reportText.scrollTo ( 0, 1000 );  // it wont easily tell the position, so shotgun it!
        }
    }

    selectInstall()
    {
        Atomic.print( "selectInstall" );
        if ( this.cppsdkWindow !== null )   // stuff in compile log
        {
            var installpath = "";
            var myplug = this;
            var ifinder = new Atomic.UIFinderWindow( this.cppsdkWindow.getView(), "myinstallfinder");
            ifinder.findPath("Select Install Folder", "", 0, 0, 0);
            ifinder.subscribeToEvent( ifinder, "UIFinderComplete", function (ev)
            {
                if( ev.reason == "OK" )   // reasons are strings "OK" and "CANCEL", depending on which was pressed
                {
                    installpath = ev.selected;
                    Atomic.print( "performInstall destination = " + installpath );
                    myplug.performInstall(installpath);
                }
                else
                {
                    return;  // they cancelled
                }
            });
        }
    }

    performInstall(installat: string)  // really need the plugin to be installed ...
    {
        Atomic.print( "performInstall" );
        if ( this.cppsdkWindow !== null )   // stuff in compile log
        {
            var filesystem = Atomic.getFileSystem(); // Get the FileSystem subsystem
            var projx = ToolCore.getToolSystem().getProject().getProjectPath();
            var reportText = <Atomic.UIEditField>this.cppsdkWindow.findWidget("cppsdklog");
            var examplelist = <Atomic.UISelectList>this.cppsdkWindow.getWidget("sdkexamplelist");
            if ( examplelist.getSelectedItemID() !== "" && installat !== "" )
            {
                var theexample = projx + "Resources/EditorData/";
                theexample += examplelist.getSelectedItemID() + ".zip";
                reportText.setText( "The selected example is "+ examplelist.getSelectedItemString() + "\n");
                if ( filesystem.fileExists (theexample) )
                {
                    reportText.appendText( "The example file is "+ theexample + "\n" );
                    // we need a place to put it ...
                    var destinationdir = installat;
                    reportText.appendText( "The destination is "+ destinationdir+ "\n" );
                    // cd to destination or use unzip -d arg...
                    // unzip it,  Usage: unzip [-Z] [-opts[modifiers]] file[.zip] [list] [-x xlist] [-d exdir]
                    var cmd = "unzip " + theexample + " -d " + destinationdir;
                    reportText.appendText( "run command :" + cmd + "\n" );
                    filesystem.systemCommand(cmd, true);

                    var sdkpath = filesystem.getProgramDir() + "Resources/ToolData/Deployment/SDK";  // the rogue sdk
                    var projheaddir = destinationdir + "/" + examplelist.getSelectedItemID(); // this is an assumption...
                    if ( filesystem.dirExists(projheaddir) ) // test that assumption
                    {
                        reportText.appendText( "filling out project in : " + projheaddir + "\n" );

                        // make the Build dir
                        if ( !filesystem.dirExists( projheaddir + "/Build") )
                        {
                            filesystem.createDir( projheaddir + "/Build");
                            reportText.appendText( "created : " +  projheaddir + "/Build" + "\n" );
                        }

                        // make the SDK-Build dir
                        if ( !filesystem.dirExists( projheaddir + "/SDK-Build") )
                        {
                            filesystem.createDir( projheaddir + "/SDK-Build");
                            reportText.appendText( "created : " +  projheaddir + "/SDK-Build" + "\n" );
                        }

                        // make the Cache dir
                        if ( !filesystem.dirExists( projheaddir + "/Cache") )
                        {
                            filesystem.createDir( projheaddir + "/Cache");
                            reportText.appendText( "created : " +  projheaddir + "/Cache" + "\n" );
                        }

                        var runrel = projheaddir + "/SDK-Build/run.sh";
                        if (filesystem.fileExists (runrel) )
                            filesystem.delete(runrel);  //in case there is an old one
                        filesystem.copy(projx + "Resources/EditorData/run.sh", runrel );
                        this.oneLiner ( runrel, "EXECUTABLE", "./" + examplelist.getSelectedItemID() + " -w -s -p \"Resources;BaseResources\" -pp \".;..;\" \n" );
                        reportText.appendText( "created and fixed: " +  runrel + "\n" );

                        var baseres = sdkpath +"/pak/BaseResources.pak";
                        if (!filesystem.fileExists (projheaddir + "/SDK-Build/BaseResources.pak") )
                        {
                            filesystem.copy(baseres, projheaddir + "/SDK-Build/BaseResources.pak");
                            reportText.appendText( "created : " + projheaddir + "/SDK-Build/BaseResources.pak" + "\n" );
                        }

                        // work on the the CMakeLists.template file
                        var cmakefile = projheaddir +"/Resources/Scripts/CMakeLists.txt";
                        if (filesystem.fileExists (cmakefile ) )
                            filesystem.delete( cmakefile);  //in case there is an old one
                        filesystem.copy(projx + "Resources/EditorData/CMakeLists.template", cmakefile ); // copy in template
                        reportText.appendText( "created : " +  cmakefile + "\n" );

                        // and spruce the CMakeLists.txt up
                        var sdkset = "SET(SDK_DIR \"" + sdkpath +"\")";
                        this.oneLiner ( cmakefile, "SDK_DIR", sdkset );
                        var executablepath = projheaddir + "/SDK-Build";
                        var exeset = "SET(EXECUTABLE_OUTPUT_PATH  \"" +  executablepath +"\")";
                        this.oneLiner ( cmakefile, "EXECUTABLE_OUTPUT_PATH", exeset );
                        var executablenamex = examplelist.getSelectedItemID();
                        var nameset = "SET(EXECUTABLE_NAME \"" +  executablenamex + "\")";
                        this.oneLiner ( cmakefile, "EXECUTABLE_NAME", nameset );

                        // last, but not least, copy this cpp-plugin.
                        if ( filesystem.copyDir ( projx + "/Resources/EditorData", projheaddir + "/Resources/EditorData" ))
                          reportText.appendText( "Copied EditorData.\n" );

                        reportText.appendText( "Done with install.\n" );
                        reportText.scrollTo ( 0, 1000 );  // it wont easily tell the position, so shotgun it!
                    }
                }
            }
            else
            {
                if ( examplelist.getSelectedItemID() === "" )
                    reportText.appendText( "Please select an example to install\n");
                if ( installat === "" )
                    reportText.appendText( "Please select a valid folder to install into.\n" );
                reportText.scrollTo ( 0, 1000 );  // it wont easily tell the position, so shotgun it!
            }
        }
    }

    performDeploy()
    {
        Atomic.print( "performDeploy" );
        if ( this.cppsdkWindow !== null )   // stuff in compile log
        {
            var reportText = <Atomic.UIEditField>this.cppsdkWindow.findWidget("cppsdklog");

            // whats the command ?  " cd projectroot ;  <SDK>/PackageTool Resources Resources.pak -c ; mv Resources.pak SDK-Build "

            var filesystem = Atomic.getFileSystem(); // Get the FileSystem subsystem
            var projx = ToolCore.getToolSystem().getProject().getProjectPath();
            var sdkpath = filesystem.getProgramDir()+"Resources/ToolData/Deployment/SDK";

            var cmd = "cd " + projx + " ; " + sdkpath + "/pak/PackageTool Resources Resources.pak -c ; mv Resources.pak SDK-Build ; ";
            filesystem.systemCommand(cmd, true);
            reportText.appendText( "run deploy command1 :" + cmd + "\n" );

            // need the Cache too!
            cmd = "cd " + projx + " ; " + sdkpath + "/pak/PackageTool Cache Cache.pak -c ; mv Cache.pak SDK-Build ; ";
            filesystem.systemCommand(cmd, true);
            reportText.appendText( "run deploy command2 :" + cmd + "\n" );
            reportText.scrollTo ( 0, 1000 );  // it wont easily tell the position, so shotgun it!
        }
    }

    getHelp()
    {
        Atomic.print( "getHelp" );
        var indexhtml = this.mysdkpath + "/html/index.html";
        var filesystem = Atomic.getFileSystem();
        if ( filesystem.fileExists(indexhtml) )
        {
            filesystem.systemOpen("file://" + indexhtml );  // always local file
        }
        else
        {
            if ( this.cppsdkWindow !== null )   // stuff in compile log
            {
                var reportText = <Atomic.UIEditField>this.cppsdkWindow.findWidget("cppsdklog");
                reportText.setText( "No help installed in SDK." );
            }
        }
    }

    performClearLog()
    {
        Atomic.print( "performClearLog" );
        if ( this.cppsdkWindow !== null )
        {
            var reportText = <Atomic.UIEditField>this.cppsdkWindow.findWidget("cppsdklog");
            reportText.setText( "" );
        }
    }

    performClean()
    {
        Atomic.print( "performClean" );

        var filesystem = Atomic.getFileSystem(); // Get the FileSystem subsystem
        var projx = ToolCore.getToolSystem().getProject().getProjectPath();

        var cmd = "cd " + projx + "/Build ; make clean  ;";  // cd to the Scripts/build

        filesystem.systemCommand(cmd, true);

        // remove executable too? why not.
        var exefile = projx + "/SDK-Build/" + this.myexecutablename;
        if ( filesystem.fileExists(exefile))
            filesystem.delete (exefile);

    }

    performSettingsSave()
    {
        Atomic.print( "performSettingsSave()" );
        if ( this.cppsdkWindow !== null )
        {
            var edit1 = <Atomic.UIEditField>this.cppsdkWindow.findWidget("sdkpath");
            this.mysdkpath = edit1.getText();
            var edit5 = <Atomic.UIEditField>this.cppsdkWindow.findWidget("fileeditcmd");
            this.myfileeditcmd = edit5.getText();

            var saveme =   // create the save object
            {
                "sdk" : this.mysdkpath,
                "editcmd" : this.myfileeditcmd
            };

            var savemestr = JSON.stringify(saveme);
            var projx = ToolCore.getToolSystem().getProject().getProjectPath();
            projx += CPPSDK_CONFIGFILE;
            var file1 = new Atomic.File(projx, Atomic.FileMode.FILE_WRITE);
            file1.writeString(savemestr);
            file1.close();

            var projs = ToolCore.getToolSystem().getProject().getScriptsPath();  // update CMakeLists.txt
            if ( this.mysdkpath !== "" )
            {
                var sdkset = "SET(SDK_DIR \"" + this.mysdkpath +"\")";
                this.oneLiner ( projs+"/CMakeLists.txt", "SDK_DIR", sdkset );
            }
            if ( this.myexecutablepath !== "" )
            {
                var exeset = "SET(EXECUTABLE_OUTPUT_PATH  \"" +  this.myexecutablepath +"\")";
                this.oneLiner ( projs+"/CMakeLists.txt", "EXECUTABLE_OUTPUT_PATH", exeset );
            }
            if ( this.myexecutablename !== "" )
            {
                var nameset = "SET(EXECUTABLE_NAME \"" + this.myexecutablename + "\")";
                this.oneLiner ( projs+"/CMakeLists.txt", "EXECUTABLE_NAME", nameset );
            }
        }
    }

    // project validator
    // looks for the project structure and sees if it matches the cpp plugin expectations
    // for successfully building the project.
    projectValidator(): boolean
    {
        var filesystem = Atomic.getFileSystem();
        var projx = ToolCore.getToolSystem().getProject().getProjectPath();
        var projs = ToolCore.getToolSystem().getProject().getScriptsPath();
        var sdkpath = filesystem.getProgramDir()+"Resources/ToolData/Deployment/SDK";

        var gotsdk = filesystem.dirExists(sdkpath); // check if sdk exists
        var gotmak = filesystem.fileExists(projs+"/CMakeLists.txt"); // check if scripts/cmakelists.txt exists
        var gotbld = filesystem.dirExists(projx+"/Build"); // check if Build exists
        var gotexe = filesystem.dirExists(projx+"/SDK-Build"); // check if SDK-Build exists

        if ( gotsdk && gotmak && gotbld && gotexe ) return true;

        // give them the bad news
        var mess = "This project is not configured properly to be build with the CPP-Plugin\n";
        if (!gotsdk) mess += "The Rogue CPP SDK is not installed.\n";
        if (! gotmak) mess += "The CMakeLists.txt is missing from the Scripts folder.\n";
        if (!gotbld ) mess += "The project Build folder is missing.\n";
        if (!gotexe ) mess += "The project SDK-Build folder is missing.\n";
        mess += "If you would like to use the CPP-Plugin to make your CPP project, refer to \n";
        mess +=  "documentation on how to properly set up your project.\n";

        if ( this.cppsdkWindow !== null )
        {
            var mess2 = new Atomic.UIMessageWindow(this.cppsdkWindow, "ProjectProblem");
            mess2.show( "ProjectProblem", mess, Atomic.UI_MESSAGEWINDOW_SETTINGS.UI_MESSAGEWINDOW_SETTINGS_OK, false, 0, 0);
            var reportText = <Atomic.UIEditField>this.cppsdkWindow.findWidget("cppsdklog");
            reportText.setText( "performRun\n" );
        }
        else
            Atomic.print ( mess );

        return false;
    }

    // one liner utility ...
    // looks for the pathname file, returns false if not found.
    // looks for the (first) line in the file that contains token string, if not found, returns false.
    // replaces the entire line with the changeTo string, and saves the file, returns true if it succeeds.
    oneLiner(pathname: string, token: string, changeTo: string): boolean
    {
        var fileCache = "";
        var madeChange = false;
        var filesystem = Atomic.getFileSystem(); // Get the FileSystem subsystem
        if ( filesystem.fileExists ( pathname  ) )
        {
            var filex = new Atomic.File( pathname, Atomic.FileMode.FILE_READ);
            if ( filex.isOpen() )
            {
                while ( !filex.isEof() )
                {
                    var myline = filex.readLine();
                    if ( myline.search(token) !== -1 && madeChange === false ) // found it
                    {
                        madeChange = true;
                        fileCache += changeTo; // do we need to add a newline automagically?
                    }
                    else fileCache += myline;

                    fileCache += "\n";  // readline strips off newlines, add them back
                }
                filex.close();
            }
            if ( madeChange)
            {
                var filey = new Atomic.File(pathname, Atomic.FileMode.FILE_WRITE);
                if ( filey.isOpen() )
                {
                    filey.writeString(fileCache);
                    filey.close();
                    return true;
                }
            }
        }
        return false; // did nothing
    }
}

export default new CPPSDKPlugin();
