# jshint AtomicEditor plugin

Be the first on your block to check your JS/TS code from within the AtomicEditor, using jshint.

You **must** have [jshint](http://jshint.com/) already installed on your system to use this plugin.


### How to install

Copy the EditorData directory (and contents) and place it into your project, in the `Resources` directory.

if you already have an `EditorData` directory in `Resources`, you only need to copy the 3 plugin files, which are

- `jshint.plugin.ts`
- `jshint-config.json`
- `jshintreport.ui.txt`

The `EditorData` directory is where the editor looks at to determine if there are any plugins to load. 

When the files are installed, you will need to "compile" the typescript file into javascript, just once.

To do this, open the project that has the jshint plugin. 

In the project tree, select the `EditorData` directory.

In the file view panel below it, select the file `jshint.plugin.ts`

In the Developer pulldown menu, select Plugins -> Typescript -> Compile Project

If a `jshint.plugin.js` has appeared in the file view panel, you're done, otherwise do the "Compile Project" step again.

Now, close the project, no really, it needs to be done to be able to load the plugin.

Reopen the project, and if everything has worked, look in the Developer pulldown menu -> Plugins for the JSHint entry.

### How to Run

Remember, jshint must be already installed and available on your search path.

Select Developer pulldown menu -> Plugins -> JSHint -> Check Code

That menu will stay on screen while it is doing the checking, so don't be alarmed.

It will check javascript code that is in the Scripts, Modules and Components directories.

At the completion of the task, it will bring up a dialog box containing a list of issues that were found.

There is a file, `EditorData/jshint-config.json` that contains the jshint rules, if you don't like the ones that are being used, this is where you can change them.

### Finally

I find there are some false jshint positives that I don't know how to make rules for, so I just ignore them, and fix the things I know how to fix. 
