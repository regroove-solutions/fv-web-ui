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

const arrayPopImmutable = function (array) {
  return array.slice(0, array.length - 1);
}

export default {
  // Navigate up by removing the last page from the URL
  navigateUp: function (currentPathArray, navigationFunc) {
        navigationFunc('/' + arrayPopImmutable(currentPathArray).join('/'));
  },
  // Navigate forward, replacing the current page within the URL
  navigateForwardReplace: function (currentPathArray, forwardPathArray, navigationFunc) {
        navigationFunc('/' + arrayPopImmutable(currentPathArray).concat(forwardPathArray).join('/'));
  }
}