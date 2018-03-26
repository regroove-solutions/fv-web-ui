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
import IntlService from "views/services/intl";

export default {
    clean: function (str, mode = 'NXQL') {
        if (mode == 'NXQL') {
            // Escape single quotes and URL decode
            str = decodeURIComponent(str.replace(/'/g, "\\'"));

            // Escape '&' operator
            str = str.replace(/&/g, "%26")
        }

        return str;
    },
    extractErrorMessage: function (jsonError) {
        let errorMessage = jsonError.message;

        if (jsonError.message != null && jsonError.message.indexOf(": ") !== -1) {
            errorMessage = jsonError.message.split(": ")[1];
            errorMessage = IntlService.instance.translate({
                key: 'error',
                default: "Error",
                append: ': '
            }) + IntlService.instance.searchAndReplace(errorMessage);
        }

        return errorMessage;
    },
    getReadableFileSize: function (size) {
        var e = (Math.log(size) / Math.log(1e3)) | 0;
        return +(size / Math.pow(1e3, e)).toFixed(2) + ' ' + ('kMGTPEZY'[e - 1] || '') + 'B';
    },
    toTitleCase: function (string) {
        return string[0].toUpperCase() + string.substring(1);
    },
    randomIntBetween: function (min, max) {
        return Math.floor(Math.random() * (Math.floor(max) - Math.ceil(min))) + Math.ceil(min);
    },
    formatUTCDateString: function (dateString) {
        let dayDesc;
        let d = new Date(dateString);
        // let m = [
        //     intl.trans('jan', 'Jan', 'first'),
        //     intl.trans('feb', 'Feb', 'first'),
        //     intl.trans('mar', 'Mar', 'first'),
        //     intl.trans('apr', 'Apr', 'first'),
        //     intl.trans('may', 'May', 'first'),
        //     intl.trans('jun', 'Jun', 'first'),
        //     intl.trans('jul', 'Jul', 'first'),
        //     intl.trans('aug', 'Aug', 'first'),
        //     intl.trans('sept', 'Sep', 'first'),
        //     intl.trans('oct', 'Oct', 'first'),
        //     intl.trans('nov', 'Nov', 'first'),
        //     intl.trans('dec', 'Dec', 'first')
        // ];
        // @todo translate using the above?
        let m = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'June', 'July', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

        switch (d.getDate().toString()[d.getDate().toString().length - 1]) {
            case '1':
                dayDesc = 'st';
                break;

            case '2':
                dayDesc = 'nd';
                break;

            case '3':
                dayDesc = 'rd';
                break;

            default:
                dayDesc = 'th'
        }
        ;

        return (m[d.getMonth()]) + ' ' + d.getDate() + dayDesc + ', ' + d.getFullYear() + ' @ ' + ("0" + d.getUTCHours()).slice(-2) + ":" + ("0" + d.getUTCMinutes()).slice(-2);
    }
}