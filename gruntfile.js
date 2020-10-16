module.exports = function(grunt){
	//match dependencies: load all grunt tasks from package.json automagically
	require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        //automation is sexy (watch for changes and act accordingly)
        watch: {
            options: {
                livereload: true
            },
            // js: {
            //     files: ['assets/js/**/*.js'],
            //     tasks: ['buildjs']
            // },
            css: {
                fil'scss/**/*.scss'],
                tasks: ['sass'],
        	},
            // images: {
            //     files: ['assets/images/**/*'],
            //     tasks: ['smush']
            // }
        },

        web_server: {
            options: {
              cors: true,
              port: 8000,
              nevercache: true,
              logRequests: true
            },
            foo: 'bar' // For some reason an extra key with a non-object value is necessary
          },

        // compile sass to with debug info for dev,
        // and into a tiny file for production
        sass: {
            dev : {
                options: {
                    lineNumbers: true, 
                },    
                files: {
                    'style.css' : 'scss/style.scss',
                }
            },
            prod : {
                options: {
                    style: 'compressed',
                },
                files: {
                    'style-min.css' : 'scss/style.scss',
                }
            }
        },


        //enable friendly notifications!
        notify: {
            options: {
                enabled: true,
                max_jshint_notifications: 5, // maximum number of notifications from jshint output
            },
            buildcss : {
                    options: {
                    message: 'CSS compiled!'
                }
            }
        },

    });

    grunt.registerTask('default', ['watch', 'web_server']);
};
