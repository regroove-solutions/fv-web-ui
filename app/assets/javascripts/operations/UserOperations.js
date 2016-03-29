/*
Copyright 2016 First People's Cultural Council

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
import Nuxeo from 'nuxeo';

import StringHelpers from 'common/StringHelpers';
import BaseOperations from 'operations/BaseOperations';

export default class UserOperations extends BaseOperations {

  /**
  * Get a user object or current user if username is empty
  */
  static getUser(username = "", headers = {}, params = {}) {

    let properties = this.properties;

    return new Promise(
      function(resolve, reject) {
        properties.client
        .operation('User.Get')
        .params(params)
        .input(username)
        .execute()
        .then((user) => {
            properties.client.request('/user/' + user.uid, params)
            .get(headers)
            .then((userObj) => {
              resolve(userObj);
            }).catch((error) => { reject('Could not retrieve current user.'); });
        })
        .catch((error) => { reject('Could not retrieve current user.'); } );
    });
  }

}