pacmod - A package module environment
======================================

pacmod is a package module environment that can be used to develop browser modules with es6. Using babel and browserify, pacmod will compile your packages into a single distribution file.

```
Warning: Please note that releases before 1.0.0 may not be backwards compatable
 ```
 

## Usage

At the moment, pacmod the pacmod files should be downloaded and put into your project directory. Once complete, run

```
npm install -g gulp
npm install
```

You can then use pacmod by running gulp. The main entry point of pacmod defaults to the <code>index.js</code> file of the main package.

You may also put files in the <code>/public</code> folder to be included in the /dist directory

## Configuration

To configure pacmod, create a pacmod.json file in your project directory. The following configuration options are available:

### <code>BUILD_DESTINATION</code>
Default: <code>'_build'</code>
The directory to use for temporary build files. You should have this directory in your project's <code>.gitignore</code> 

### <code>PACKAGE_NAME</code>
Default: <code>'pacmod'</code>
The name of your module and the subsequent file to be built

### <code>DIST_FOLDER</code>
Default: <code>''</code>
The folder relative to <code><Project-directory>/dist</code> that the compiled JS file should be moved to

### <code>MAIN_PACKAGE</code>
Default: <code>'main'</code>
The name of the package that should be used as the main entry point for the application. This file will be invoked on script load.

## Package Structure

Packages are defined as self contained components or module packs that are distributed with their own unit tests. Each package should be independant and have no dependencies outside of itself. The package folder structure is
 
```
- /package-name
--- /lib
----- /index.js (entry point)
--- /tests
--- /readme.md (optional)
```