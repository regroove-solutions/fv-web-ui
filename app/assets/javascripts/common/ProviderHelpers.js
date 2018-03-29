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

import Immutable, {List, Map} from 'immutable';
import StringHelpers from './StringHelpers'

const toJSKeepId = function (js) {
    return typeof js !== 'object' || js === null ? js :
        Array.isArray(js) ?
            Immutable.Seq(js).map(toJSKeepId).toList() :
            (js.hasOwnProperty('id')) ? Immutable.Seq(js).toMap() : Immutable.Seq(js).map(toJSKeepId).toMap();
}

const proxiesKeys = [
    {
        workspace: 'fv-word:categories',
        section: 'fvproxy:proxied_categories'
    },
    {
        workspace: 'fv-phrase:phrase_books',
        section: 'fvproxy:proxied_categories'
    },
    {
        workspace: 'fvm:origin',
        section: 'fvproxy:proxied_origin'
    },
    {
        workspace: 'fv:related_pictures',
        section: 'fvproxy:proxied_pictures'
    },
    {
        workspace: 'fv:related_videos',
        section: 'fvproxy:proxied_videos'
    },
    {
        workspace: 'fv:related_audio',
        section: 'fvproxy:proxied_audio'
    }
];

export default {
    getEntry: function (wordResults, path) {
        if (!wordResults || wordResults.isEmpty() || !path) {
            return null;
        }

        let result = wordResults.find(function (entry) {
            return entry.get('id') === path;
        });

        if (result) {
            return result.toJS();
        }

        return null;
    },
    toJSKeepId: function (js) {
        return toJSKeepId(js)
    },
    /*hasExtendedGroup: function (extendedGroups, group) {

      if (extendedGroups && extendedGroups.size > 0) {
        if (extendedGroups.findIndex(function(entry) { return (entry.get('name') === group) }) === -1) {
          return false;
        } else {
          return true;
        }
      }

      return false;
    },*/
    isActiveRole: function (roles) {
        if (roles && roles.length > 0) {
            if (roles.indexOf("Record") !== -1 || roles.indexOf("Approve") !== -1 || roles.indexOf("Manage") !== -1 || roles.indexOf("Member") !== -1) {
                return true;
            }
        }

        return false;
    },
    getDialectPathFromURLArray: function (url) {
        return decodeURI(url.slice(1, 7).join('/'));
    },
    switchWorkspaceSectionKeys: function (workspaceKey, area) {

        let row = proxiesKeys.find(function (mapping) {
            return mapping.workspace === workspaceKey;
        })

        if (row) {
            if (area == 'sections') {
                return row.section;
            } else {
                return row.workspace;
            }
        }

        return workspaceKey;
    },
    getDialectGroups: function (aces = [], currentlyAssignedGroups = []) {

        if (aces.length === 0) {
            return {
                all: null,
                new: null
            };
        }

        // Generate list of groups this user can be added to
        let allAvailableGroups = {};

        // Generate list of all groups related to this dialect
        let newAvailableGroups = {};

        (aces).forEach(function (group, i) {
            let groupArray = group.username.split('_');
            if (group.username.match(/members|recorders|administrators/g) != null) {

                let groupLabel = groupArray.map((group) => StringHelpers.toTitleCase(group)).join(' ');

                allAvailableGroups[group.username] = groupLabel;

                // If user is not already a memeber of this group, add to new available groups
                if (currentlyAssignedGroups.indexOf(group.username) === -1) {
                    newAvailableGroups[group.username] = groupLabel;
                }
            }
        });

        return {
            all: allAvailableGroups,
            new: newAvailableGroups
        };
    },
    replaceAllWorkspaceSectionKeys: function (string, area) {

        let searchKey = (area == 'sections') ? 'workspace' : 'section';
        let replaceKey = (area == 'sections') ? 'section' : 'workspace';

        for (let proxyKey in proxiesKeys) {
            string = string.replace(new RegExp(proxiesKeys[proxyKey][searchKey], 'g'), proxiesKeys[proxyKey][replaceKey]);
        }

        return string;
    },
    filtersToNXQL: function (filterArray) {

        let nxqlFilterString = '';
        let nxqlGroups = {};

        const generateNXQLString = function (nxql, appliedFilter) {
            return nxql.replace(/\$\{value\}/g, appliedFilter);
        }

        for (let appliedFilterKey in filterArray) {
            let ak = Object.assign({}, filterArray[appliedFilterKey]);
            if (ak && ak.hasOwnProperty('filterOptions') && ak.filterOptions && ak.filterOptions.hasOwnProperty('nxql')) {

                if (ak.appliedFilter === true) (ak.appliedFilter = 1);
                if (ak.appliedFilter === false) (ak.appliedFilter = 0);

                if (!ak.filterOptions.hasOwnProperty('nxqlGroup')) {
                    nxqlFilterString += ' ' + (ak.filterOptions.hasOwnProperty('operator') ? ak.filterOptions.operator : 'AND') + ' ' + generateNXQLString(ak.filterOptions.nxql, ak.appliedFilter);
                } else {
                    if (nxqlGroups.hasOwnProperty(ak.filterOptions.nxqlGroup) && nxqlGroups[ak.filterOptions.nxqlGroup].length > 0) {
                        nxqlGroups[ak.filterOptions.nxqlGroup].push(generateNXQLString(ak.filterOptions.nxql, ak.appliedFilter));
                    } else {
                        nxqlGroups[ak.filterOptions.nxqlGroup] = [generateNXQLString(ak.filterOptions.nxql, ak.appliedFilter)];
                    }
                }
            }
        }

        let appendGroupNXQL = '';

        for (var key in nxqlGroups) {
            appendGroupNXQL += ' AND (' + nxqlGroups[key].join(' OR ') + ')'
        }

        return nxqlFilterString + appendGroupNXQL;
    },
    regex: {
        ANYTHING_BUT_SLASH: "([^/]*)",
        ANY_LANGUAGE_CODE: "(en|fr)",
        WORKSPACE_OR_SECTION: "(sections|Workspaces)",
        KIDS_OR_DEFAULT: "(kids|explore)"
    }
}