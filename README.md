## Build
In order to build the FirstVoices marketplace package run:

```
mvn clean install
```

## Deploy

To install the mp on your Nuxeo :

```
nuxeoctl mp-install FirstVoices-marketplace/target/FirstVoices-marketplace-package-1.0.23-SNAPSHOT.zip
```

## Apps

Default backend is : http://localhost:8080/nuxeo/jsf or http://localhost:8080/nuxeo/view_documents.faces
React app at: http://localhost:8080/nuxeo/app/
