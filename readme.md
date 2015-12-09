pacmod - A package module environment
======================================

pacmod is a package module environment that can be used to develop browser modules with es6. Using babel and browserify, pacmod will compile your packages into a single distribution file.

```
Warning: Please note that releases before 1.0.0 may not be backwards compatable
 ```
 

## Setup

Simply install the cli

```
npm install -g pacmod
```

And you can get started!

## Package Structure

Packages are defined as self contained components or module packs that are distributed with their own unit tests. Each package should be independant and have no dependencies outside of itself. The package folder structure is

```
- /package-name
--- /lib
----- /index.js (entry point)
--- /tests
--- /readme.md (optional)
```

## Project Setup

Assuming your project is organized in package-module structure you can get started by simply running

```
pacmod
```

In the project directory. pacmod will look for a <code>packages</code> folder and compile all packages present. You should always define a main entry point that will be invoked once the file is loaded (defaults to the main.js package)

pacmod will also copy files in the public folder of your project to the dist folder. Once complete, pacmod will open your projects dev environment in your default browser. pacmod will continue watching your files for changes and reloading them in the browser.

## Configuration

To configure pacmod, create a pacmod.json file in your project directory. The following configuration options are available:

### <code>temp_folder</code>
Default: <code>'_build'</code>
The directory to use for temporary build files. You should have this directory in your project's <code>.gitignore</code> 

### <code>package_name</code>
Default: <code>Package.json.name</code> (<code>'pacmod'</code> if not available)
The name of your module and the subsequent file to be built

### <code>build_target</code>
Default: <code>'dist'</code>
The folder to to build the application to

### <code>script_path</code>
Default: <code>''</code>
The folder relative to the <code>BUILD_TARGET</code> that the compiled JS file should be moved to

### <code>main_package</code>
Default: <code>'main'</code>
The name of the package that should be used as the main entry point for the application. This file will be invoked on script load.

### <code>port</code>
Default: <code>4000</code>
The port to serve development files from.

### <code>test_port</code>
Default: <code>4001</code>
The port to serve test files from

## Testing

pacmod has [QUnit](http://qunitjs.com/) support built in! You can write all of your tests in the <code>/tests</code> folder of the respective package. To run your tests, run

```
pacmod test
```

from your project directory. Your tests will be built and a window will open in your default browser to run the tests. You can even run <code>pacmod</code> and <code>pacmod test</code> simultaneously while developing.
