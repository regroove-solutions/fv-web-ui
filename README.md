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
In order to build the FirstVoices marketplace package run on branch migration-10.10:

```
mvn clean install
```

To install the mp on your Nuxeo:

```
nuxeoctl mp-install FirstVoices-marketplace/target/FirstVoices-marketplace-package-1.0.23-SNAPSHOT.zip
```

## Apps

Default backend is : http://localhost:8080/nuxeo/jsf or http://localhost:8080/nuxeo/view_documents.faces
React app at: http://localhost:8080/nuxeo/app/
