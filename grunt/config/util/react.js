// Configuration for React task(s)
// Compiles Facebook React's JSX templates into JavaScript.
'use strict';

var taskConfig = function(grunt) {

  grunt.config.set('react', {
    server: {
      files: {
        '<%= yeogurt.tmp %>/templates/components.js': ['<%= yeogurt.client %>/templates/components/**/*.jsx']
      }
    }
  });

};

module.exports = taskConfig;
