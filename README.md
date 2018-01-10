# FirstVoices Dictionary Prototype #
<a rel="Exploration" href="https://github.com/BCDevExchange/docs/blob/master/discussion/projectstates.md"><img alt="Being designed and built, but in the lab. May change, disappear, or be buggy." style="border-width:0" src="http://bcdevexchange.org/badge/2.svg" title="Being designed and built, but in the lab. May change, disappear, or be buggy." /></a>

This is a responsive dictionary web-application for the FirstVoices language assets that uses [Nuxeo ECM](http://www.nuxeo.com/) as a back-end.

## Stack ##
This web app is built using the following:

-  [ReactJS](https://facebook.github.io/react/)
-  [Webpack](https://webpack.github.io/)
-  [Material-UI](https://github.com/callemall/material-ui)
-  [Nuxeo-js-client](https://github.com/nuxeo/nuxeo-js-client)

And interfaces with a [Nuxeo](http://www.nuxeo.com) server, at the moment using custom schemas and configruation specific to FirstVoices.

For additional dependencies see package.json.

This app has been scaffolded using [gulp-starter](https://github.com/vigetlabs/gulp-starter).

## Getting Started ##
There are several version dependency requirements to properly build and run the project:
-  NodeJS v4.1.2
-  Gulp CLI v3.9.1
-  Yarn v0.21.3

Instructions to install specific project dependencies and running the application are described in the *Setting Up and Running* section.

Mac OS X is the ideal environment for running and developing the FirstVoices Web Application. The steps below are instructions for downloading project dependencies and building the project using Terminal on Mac OS X.

### Setting Up and Running ###
Perform the steps below to setup your environment and run the FirstVoices Web Application on Mac OS X.

1. Install [Homebrew](https://brew.sh/) by following the instructions found on the [Homebrew](https://brew.sh/) home page.

2. Use [Homebrew](https://brew.sh/) to install [NVM](http://nvm.sh) by running:
```
$ brew update
$ brew install nvm
$ mkdir ~/.nvm
```
Configure NVM by adding the following entry to your `~/.bash_profile` file:
```
export NVM_DIR=~/.nvm
source $(brew --prefix nvm)/nvm.sh
```
Activate and verify your new `~/.bash_profile` entry by running:
```
source ~/.bash_profile
echo $NVM_DIR
```

3. Clone this repository and navigate into the `fv-web-ui` directory:
```
$ git clone https://github.com/First-Peoples-Cultural-Council/fv-web-ui.git
$ cd fv-web-ui
```

4. Initialize and recursively clone required Git SubModules by running:
```
$ git submodule update --init --recursive
$ git submodule foreach git pull origin master
```

5. Install NodeJS v4.8.0 and set it as the active version of NodeJS by running:
```
$ nvm install 4.8.0
$ nvm use 4.8.0
```

6. Install GULP CLI v3.9.1 by running:
```
$ npm install -g gulp@3.9.1
```

7. Install Yarn v0.21.3 by running:
```
$ npm install -g yarn@0.21.3
```

8. To successfully run Yarn, you need to configure your `~/.ssh/config` file so that Yarn knows which RSA Key to use when cloning GitHub repositories. Create a `~/.ssh/config` file if it does not already exist. Add the following entry to your `~/.ssh/config` file while replacing `<mykey>` as needed:
```
# Github RSA Key
Host github.com
    UseKeychain yes
    AddKeysToAgent yes
    IdentityFile ~/.ssh/<mykey>_rsa
```

9. Run Yarn to download `node_modules` dependencies by running:
```
$ yarn
```
Important Note: when running Yarn for the first time you will be silently prompted to enter the Key Phrase for the RSA Key you added to the `~/.ssh/config` file. If progress halts and a small `lock icon` appears, enter your RSA Key Phrase to proceed.

10. Run GULP build the project and start the Node server by running:
```
$ gulp
```

11. Visit [localhost:3001](http://localhost:3001) in your web browser to view the FirstVoices Dictionary Prototype app.


## Old Notes to Remove (TBD) ##

You'll need [NodeJS](http://nodejs.org/), and [Git](http://git-scm.com/downloads). Clone this repo from GitHub, change directory to the repo root.

1. Run `npm install -g gulp`.
2. Run `npm install`.
3. Run `gulp` to start a Node server.  Defaults to [localhost:3001](http://localhost:3001).
4. Install [Nuxeo](http://www.nuxeo.com) and setup your server, including enabling [Cross-Origin Resource Sharing (CORS)](https://doc.nuxeo.com/pages/viewpage.action?pageId=14257084).
4. Rename */app/assets/javascripts/configuration/sample.local.json* to *local.json* and update that file.

* On some machines installation of certain modules may not work as part of `npm install`. If that is the case, install missing modules individually (e.g. `npm install imagemin-jpegtran`, after trying to run `gulp`).

## Building for Production ##

In order to build for production:
1. Run `npm install -g gulp`.
2. Run `npm install`.
3. Run `gulp build:production`.
4. Copy generated files in /public folder to your webserver.

Note: Remember to configure your web application to rewrite all requests to the root path, in order for Push State to work.

## Contributing ##

### Adding New Dependencies
1. Install dependency using `npm install package --save` or `npm install package --save-dev`
2. When ready, run `npm shrinkwrap` to lock dependencies.

### Tips
* Learn how to work with [React.js](https://facebook.github.io/react/docs/getting-started.html)
* Get familiar with [ES2015](https://babeljs.io/docs/learn-es2015/) syntax

## Licensing ##

The data and code in this repository is licensed under multiple licenses.

- All code in the /app directory is licensed under the Apache License 2.0. See LICENSE.

- All [gulp-starter](https://github.com/vigetlabs/gulp-starter) code in /gulpfile.js directory is licensed under MIT License (MIT). See gulpfile.js/LICENSE.
