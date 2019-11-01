#!/bin/bash

touch /opt/nuxeo/server/nxserver/tmp/folder.mounted.in.docker.container

/opt/nuxeo/server/bin/nuxeoctl stop
/opt/nuxeo/server/bin/nuxeoctl mp-install --accept /opt/nuxeo/server/nxserver/tmp/FirstVoices-marketplace-package-latest.zip
/opt/nuxeo/server/bin/nuxeoctl start
