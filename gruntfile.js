// GruntFile.js
module.exports = function(grunt){
    grunt.initConfig({
        jshint: {
            files: ["*.js", "js/script.js"],
            options: {
                globals:{
                    jQuery: true
                }
            }
        },
        csslint: {
            strict: {
              options: {
                import: 2
              },
              src: ["css/style.css"]
            }
        },
        cssmin:{
            target:{
                files: [{
                    expand: true,
                    cwd: "css/",
                    src: ["*.css", "!*.min.css"],
                    dest: "css/",
                    ext: ".min.css"
                }]
            }
        },
        uglify:{
            my_target:{
                files: {
                    "js/script.min.js":["js/script.js"]
                }
            }
        },
        watch: {
            css:{
                files:["css/style.css", "css/sass.css"],
                tasks:["csslint", "cssmin"]
            },
            js:{
                files:["js/script.js"],
                tasks:["jshint", "uglify"]
            },
            sass:{
                files:["sass/style.scss"],
                tasks:["sass"]
            }
        },
        sass:{
            dist:{
                files:{
                    "css/style.css":"sass/style.scss"
                }
            }
        }
          connect: {
            livereload: {
              options: {
                port: 9000,
                hostname: 'localhost',
                middleware: function(connect, options, middlewares) {
                  middlewares.unshift(function(req, res, next) {
                      res.setHeader('Access-Control-Allow-Origin', '*');
                      res.setHeader('Access-Control-Allow-Methods', '*');
                      next();
                  });

                  return middlewares;
                }
              }
            }
          }
        
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-csslint');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-contrib-sass');

    grunt.registerTask("default", ["jshint", "csslint"]);
    grunt.registerTask("debug", ["jshint", "csslint"]);
    grunt.registerTask("min", ["csslint", "cssmin","jshint", "uglify"]);
    grunt.registerTask("w", ["watch"]);
    grunt.registerTask("c", ["sass"]);

};