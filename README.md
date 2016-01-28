# FirstVoices Dictionary Prototype #
<a rel="Exploration" href="https://github.com/BCDevExchange/docs/blob/master/discussion/projectstates.md"><img alt="Being designed and built, but in the lab. May change, disappear, or be buggy." style="border-width:0" src="http://bcdevexchange.org/badge/2.svg" title="Being designed and built, but in the lab. May change, disappear, or be buggy." /></a>

This is a responsive dictionary web-application for the FirstVoices language assets that uses [Nuxeo ECM](http://www.nuxeo.com/) as a back-end.

## Stack ##
This web app is built using the following:

-  [ReactJS](https://facebook.github.io/react/)
-  [Webpack](https://webpack.github.io/)
-  [Material-UI](https://github.com/callemall/material-ui)

For additional dependencies see package.json.

This app has been scaffolded using [gulp-starter](https://github.com/vigetlabs/gulp-starter).

## Getting Started ##

You'll need [NodeJS](http://nodejs.org/), and [Git](http://git-scm.com/downloads). Clone this repo from GitHub, change directory to the repo root.

1. Run `npm install`*.
2. Run `gulp` to start a Node server.  Defaults to [localhost:3001](http://localhost:3001).

* On some Windows machines installation of certain modules may not work as part of `npm install`. If that is the case, install missing modules individually (e.g. `npm install imagemin-jpegtran`, after trying to run `gulp`).

## Licensing ##

The data and code in this repository is licensed under multiple licenses.

- All code in the /app directory is licensed under the Apache License 2.0. See LICENSE.

- All [gulp-starter](https://github.com/vigetlabs/gulp-starter) code in /gulpfile.js directory is licensed under MIT License (MIT). See gulpfile.js/LICENSE.
