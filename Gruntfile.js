module.exports = function(grunt) {
  grunt.initConfig({
    'dart-sass': {
      target: {
        options: {
          outputStyle: 'compressed',
          includePaths: [ 'sass/', 'node_modules/trib-styles/sass/' ]
        },
        files: {
          'public/build/styles.css': 'sass/styles.scss'
        }
      }
    },
    postcss: {
      options: {
        processors: [
          require('autoprefixer')(),
        ]
      }, 
      dist: {
        src: 'public/build/*.css'
      }
    },
    watch: {
      css: {
        files: ['sass/**/*.scss', 'sass/*.scss'],
        tasks: ['dart-sass', 'postcss']
      }
    }
  });

  //Load tasks
  grunt.loadNpmTasks('grunt-dart-sass');
  grunt.loadNpmTasks('@lodder/grunt-postcss');
  grunt.loadNpmTasks('grunt-contrib-watch');

  //Register tasks
  grunt.registerTask('default', [
    'dart-sass',
    'postcss'
  ]);
}