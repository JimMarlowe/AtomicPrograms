// JimMarlowe, 2017, MIT license
// version 1.5
// MUST have installed jshint into the os, and have it runnable at command line.
// Adding a menu to run jshint on Scripts/Components *.js
//    how to get output from jshint? reroute the log file...
//    load window for log output.
//    moved config file into plugin dir, so you know where it is
//    fixed ui so it sizes better.

const JSHINTTBPath = "EditorData/jshintreport.ui.txt";
const JSHINTCONFIGFILE = "Resources/EditorData/jshint-config.json";

class JSHintPlugin extends Atomic.ScriptObject
    implements Editor.HostExtensions.HostEditorService,
        Editor.HostExtensions.UIServicesEventListener,
        Editor.HostExtensions.ProjectServicesEventListener {

    // Define the name and description of the plugin.
    name = "JSHintPlugin";
    description = "Check your code!";
    private serviceLocator: Editor.HostExtensions.HostServiceLocator;
    private reportWindow: Editor.Modal.ExtensionWindow = null;

    /**
     * Called when the plugin is first loaded by the editor.  A reference to the
     * service locator interface will be passed to the initialization routine so that
     * it can 'talk back' to the editor.
     *
     * @param {Editor.HostExtensions.HostServiceLocator} serviceLocator
     *
     * @memberOf MyMenuPlugin
     */
    initialize(serviceLocator: Editor.HostExtensions.HostServiceLocator) {
        // some debug  console.log(`$ {this.name} .initialize`);
        this.serviceLocator = serviceLocator;
        this.serviceLocator.uiServices.register(this);
        this.serviceLocator.projectServices.register(this);
    }

    projectLoaded(ev: Editor.EditorLoadProjectEvent) {
        // some debug  console.log(`$ {this.name} .projectLoaded`);
        this.serviceLocator.uiServices.createPluginMenuItemSource("JSHint", { "Check Code" : [`${this.name} .run.myaction`] });
    }

    projectUnloaded() {
        // some debug  console.log(`$ {this.name} .projectUnloaded`);
        this.serviceLocator.uiServices.removePluginMenuItemSource("JSHint");
        this.serviceLocator.projectServices.unregister(this);
        this.serviceLocator.uiServices.unregister(this);
        this.unsubscribeFromAllEvents();
    }

    menuItemClicked(refId: string): boolean {
        // some debug console.log(`${this.name} .menuItemClicked: ${refId}`);
        if (refId == `${this.name} .run.myaction`) {
           
            var filesystem = Atomic.getFileSystem(); // Get the FileSystem subsystem
            var projx = ToolCore.getToolSystem().getProject().getProjectPath();
            var projs = ToolCore.getToolSystem().getProject().getScriptsPath();
            var projm = ToolCore.getToolSystem().getProject().getModulesPath();
            var projc = ToolCore.getToolSystem().getProject().getComponentsPath();

            var mylog = new Atomic.Log();
            mylog.open ( projx + "/jshint.log" ); // open log file so we can capture the jshint results

            var cmd = "jshint " + projs + "/*.js --config " + projx + JSHINTCONFIGFILE;
            filesystem.systemCommand(cmd, true);
            cmd = "jshint " + projm +"/*.js --config " + projx  + JSHINTCONFIGFILE;
            filesystem.systemCommand(cmd, true);
            cmd = "jshint " + projc +"/*.js --config " + projx  + JSHINTCONFIGFILE;
            filesystem.systemCommand(cmd, true);
            mylog.close();  // close the log file, were done capturing.

            var results = "Nothing happened.";

            // Now reopen the capture file so it can be displayed.
            var logfile = new Atomic.File(projx + "/jshint.log", 0 );
            if (logfile.isOpen())
                results= logfile.readText();
            logfile.close();

            this.SpawnUI("jshint", "" ); // spawn the non-blocking dialog
            
            if ( this.reportWindow !== null ) // stuff in capture data
            {
                var reportText = <Atomic.UIEditField>this.reportWindow.getWidget("jshintreporttext");
                reportText.text = results;
            }
            
            // Return true to indicate that we handled the click event
            return true;
        }
        return false;
    }

    SpawnUI(title: string, msg: string) {
        if ( this.reportWindow === null ) { // spawn it if we need to, otherwise reuse it
            this.reportWindow = this.serviceLocator.uiServices.showNonModalWindow(title, JSHINTTBPath, (ev: Atomic.UIWidgetEvent) => {
                if (ev.type == Atomic.UI_EVENT_TYPE.UI_EVENT_TYPE_CLICK && ev.target.id == "jshintok") {
                    this.reportWindow.hide();
                    this.reportWindow = null;
                    return true;
                }
            });
        }
        return false;
    };
}

export default new JSHintPlugin();
