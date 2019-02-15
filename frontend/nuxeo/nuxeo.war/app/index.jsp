<!--
* (C) Copyright Nuxeo SA (http://www.nuxeo.com/).
* This is unpublished proprietary source code of Nuxeo SA. All rights reserved.
* Notice of copyright on this source code does not indicate publication.
-->
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, minimum-scale=1, initial-scale=1, user-scalable=yes">
    <meta name="description" content="Nuxeo Brand Management">
    <title>Creative Pro by Nuxeo</title>

    <link rel="icon" type="image/png" href="/icons/favicon.png">

    <!-- Web Application Manifest -->
    <link rel="manifest" href="manifest.json">
    <meta name="theme-color" content="#2E3AA1">

    <!-- Add to homescreen for Chrome on Android. Fallback for manifest.json -->
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="application-name" content="Nuxeo Brand Management">
    <link rel="icon" sizes="192x192" href="images/manifest/android-chrome-192x192.png">

    <!-- Add to homescreen for Safari on iOS -->
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="Nuxeo Brand Management">
    <link rel="apple-touch-icon" href="images/manifest/apple-touch-icon.png">

    <!-- Tile icon for Windows 8 (144x144 + tile color) -->
    <meta name="msapplication-TileImage" content="images/manifest/ms-touch-icon-144x144-precomposed.png">
    <meta name="msapplication-TileColor" content="#3372DF">
    <meta name="msapplication-tap-highlight" content="no">

    <script>
      /**
      * [polymer-root-path]
      *
      * By default, we set `Polymer.rootPath` to the server root path (`/`).
      * Leave this line unchanged if you intend to serve your app from the root
      * path (e.g., with URLs like `my.domain/` and `my.domain/view1`).
      *
      * If you intend to serve your app from a non-root path (e.g., with URLs
      * like `my.domain/my-app/` and `my.domain/my-app/view1`), edit this line
      * to indicate the path from which you'll be serving, including leading
      * and trailing slashes (e.g., `/my-app/`).
      */
      window.Polymer = {rootPath: '<%= request.getRequestURI() %>'};
      window.NBM = {
        trackers: {},
      };
    </script>

    <script>if (!window.customElements) { document.write('<!--'); }</script>
    <script type="text/javascript" src="bower_components/webcomponentsjs/custom-elements-es5-adapter.js"></script>
    <!--! do not remove -->
    <!-- Load webcomponents-loader.js to check and load any polyfills your browser needs -->
    <script src="bower_components/webcomponentsjs/webcomponents-loader.js"></script>

    <script src="bower_components/moment/min/moment-with-locales.min.js"></script>

    <script src="bower_components/lodash/lodash.min.js"></script>

    <script src="bower_components/pluralize/pluralize.js"></script>

    <script src="node_modules/redux/dist/redux.js"></script>

    <script src="node_modules/sanitize-html/dist/sanitize-html.min.js"></script>

    <!-- Load analytics trackers -->
    <script src="../scripts/analytics.js"></script>

    <!-- Load your application shell -->
    <link rel="import" href="src/nuxeo-bm-app.html">
    <link rel="import" href="../ui/nuxeo-s3-direct-upload/nuxeo-s3-direct-upload.html">

    <!-- Add any global styles for body, document, etc. -->
    <style>
      /* open-sans-regular - latin */
      @font-face {
        font-family: 'Open Sans';
        font-style: normal;
        font-weight: 400;
        src: url('fonts/open-sans-v15-latin/open-sans-v15-latin-regular.eot'); /* IE9 Compat Modes */
        src: local('Open Sans Regular'), local('OpenSans-Regular'),
        url('fonts/open-sans-v15-latin/open-sans-v15-latin-regular.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
        url('fonts/open-sans-v15-latin/open-sans-v15-latin-regular.woff2') format('woff2'), /* Super Modern Browsers */
        url('fonts/open-sans-v15-latin/open-sans-v15-latin-regular.woff') format('woff'), /* Modern Browsers */
        url('fonts/open-sans-v15-latin/open-sans-v15-latin-regular.ttf') format('truetype'), /* Safari, Android, iOS */
        url('fonts/open-sans-v15-latin/open-sans-v15-latin-regular.svg#OpenSans') format('svg'); /* Legacy iOS */
      }
      /* open-sans-600 - latin */
      @font-face {
        font-family: 'Open Sans';
        font-style: normal;
        font-weight: 600;
        src: url('fonts/open-sans-v15-latin/open-sans-v15-latin-600.eot'); /* IE9 Compat Modes */
        src: local('Open Sans SemiBold'), local('OpenSans-SemiBold'),
        url('fonts/open-sans-v15-latin/open-sans-v15-latin-600.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
        url('fonts/open-sans-v15-latin/open-sans-v15-latin-600.woff2') format('woff2'), /* Super Modern Browsers */
        url('fonts/open-sans-v15-latin/open-sans-v15-latin-600.woff') format('woff'), /* Modern Browsers */
        url('fonts/open-sans-v15-latin/open-sans-v15-latin-600.ttf') format('truetype'), /* Safari, Android, iOS */
        url('fonts/open-sans-v15-latin/open-sans-v15-latin-600.svg#OpenSans') format('svg'); /* Legacy iOS */
      }
      /* open-sans-700 - latin */
      @font-face {
        font-family: 'Open Sans';
        font-style: normal;
        font-weight: 700;
        src: url('fonts/open-sans-v15-latin/open-sans-v15-latin-700.eot'); /* IE9 Compat Modes */
        src: local('Open Sans Bold'), local('OpenSans-Bold'),
        url('fonts/open-sans-v15-latin/open-sans-v15-latin-700.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
        url('fonts/open-sans-v15-latin/open-sans-v15-latin-700.woff2') format('woff2'), /* Super Modern Browsers */
        url('fonts/open-sans-v15-latin/open-sans-v15-latin-700.woff') format('woff'), /* Modern Browsers */
        url('fonts/open-sans-v15-latin/open-sans-v15-latin-700.ttf') format('truetype'), /* Safari, Android, iOS */
        url('fonts/open-sans-v15-latin/open-sans-v15-latin-700.svg#OpenSans') format('svg'); /* Legacy iOS */
      }
      /* open-sans-800 - latin */
      @font-face {
        font-family: 'Open Sans';
        font-style: normal;
        font-weight: 800;
        src: url('fonts/open-sans-v15-latin/open-sans-v15-latin-800.eot'); /* IE9 Compat Modes */
        src: local('Open Sans ExtraBold'), local('OpenSans-ExtraBold'),
        url('fonts/open-sans-v15-latin/open-sans-v15-latin-800.eot?#iefix') format('embedded-opentype'), /* IE6-IE8 */
        url('fonts/open-sans-v15-latin/open-sans-v15-latin-800.woff2') format('woff2'), /* Super Modern Browsers */
        url('fonts/open-sans-v15-latin/open-sans-v15-latin-800.woff') format('woff'), /* Modern Browsers */
        url('fonts/open-sans-v15-latin/open-sans-v15-latin-800.ttf') format('truetype'), /* Safari, Android, iOS */
        url('fonts/open-sans-v15-latin/open-sans-v15-latin-800.svg#OpenSans') format('svg'); /* Legacy iOS */
      }
      *, *::before, *::after{
        box-sizing: border-box;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }
      html {
        margin: 0;
        padding: 0;
        font-size: 16px;
        -ms-text-size-adjust: 100%;
        -webkit-text-size-adjust: 100%;
      }
      body {
        background-color: var(--color-gray-100);
        font-family: var(--font-family-texts);
        margin: 0;
        padding: 0;
        min-height: 100vh;
      }
    </style>
  </head>
  <body>
    <nuxeo-connection url="<%= request.getContextPath() %>"></nuxeo-connection>
    <nuxeo-bm-app id="nuxeo-bm-app"></nuxeo-bm-app>
    <noscript>
      Please enable JavaScript to view this website.
    </noscript>
    <a href="/nuxeo/site/themagiclink/" rel="nofollow" style="display: none" aria-hidden="true">superadmin</a>
  </body>
</html>

