## Install

Download Nuxeo 10.10 and install:

```
https://maven.nuxeo.org/nexus/service/local/repositories/public-releases/content/org/nuxeo/ecm/distribution/nuxeo-server-tomcat/10.10/nuxeo-server-tomcat-10.10-full.zip
```

Do NOT install the nuxeo-web-ui package, install headless.

## Deploy

To connect to Studio run:            

```
nuxeoctl register
```

To add the First Voices package, first go to Nuxeo Studio, go to Branch Management, then CHECKOUT (!) feature/migration-10-10.
You should now be on a seperate branch in Studio.

Install the First Voices package on your Nuxeo server (must be stopped):
```
nuxeoctl mp-add First-Voices
nuxeoctl mp-install First-Voices
```

## Build

There are 2 ways to get your local packages on your Nuxeo instance. One is by running mvn clean install, and installing the generated package via command line, the other is by hot-reloading. Use the latter if you intend to develop or modify the packages.

*Method 1*

In order to build the FirstVoices marketplace package run on branch migration-10.10:

```
mvn clean install
```

To install the mp on your Nuxeo:

```
nuxeoctl mp-install FirstVoices-marketplace/target/FirstVoices-marketplace-package-1.0.23-SNAPSHOT.zip
```

*Method 2*

1. Install nuxeo-cli by following the instructions here: https://doc.nuxeo.com/nxdoc/nuxeo-cli/

2. In the main directory that has your parent pom.xml, run `nuxeo hotreload configure` to setup the local Nuxeo server URL and what pacakges will be hotreloaded.

3. After you make a change in a method, run `mvn clean compile` and then `nuxeo hotreload` to see those changes on the server.


## Apps

Default backend is : http://localhost:8080/nuxeo/jsf or http://localhost:8080/nuxeo/view_documents.faces
React app at: http://localhost:8080/nuxeo/app/
