module.exports = function (grunt) {
    grunt.initConfig({
		sass: {
			main: {
				options: {
					style: 'expanded',
					sourcemap: 'none'
				},
				files: {
					'tmp/style.css': 'src/scss/style.scss'
				}
			}
		},
        autoprefixer: {
            main: {
                files: {
                    'tmp/style.css': 'tmp/style.css'
                }
            }
        },
		concat: {
			main: {  
				src: ['src/js/handlebars.js', 'src/js/svg4everybody.min.js', 'src/js/gh-api.js', 'src/js/app.js'],
				dest: 'tmp/script.js'
			}
		},
		uglify: {
			options: {
				sourceMap: true
			},
			main: {
				files: {
					'tmp/script.js': 'tmp/script.js'
				}
			}
		},
		copy: {
			main: {
				files: {
					'index.html': 'src/index.html',
					'style.css': 'tmp/style.css',
					'script.js': 'tmp/script.js',
					//'dist/script.js.map': 'tmp/script.js.map'
					'img/sprite.svg': 'src/img/sprite.svg',
					'img/diag-patt.png': 'src/img/diag-patt.png'
				}
			}
		}
    });
	
	grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
	grunt.loadNpmTasks('grunt-contrib-concat');
	grunt.loadNpmTasks('grunt-contrib-uglify');
	grunt.loadNpmTasks('grunt-contrib-copy');
	
	grunt.registerTask('clean', 'Cleanup tmp and dest directories', function() {
		grunt.file.delete('tmp/');
		grunt.file.delete('dest/');
	});
	
	grunt.registerTask('default', ['clean', 'sass', 'autoprefixer', 'concat', 'copy']);
	grunt.registerTask('release', ['clean', 'sass', 'autoprefixer', 'concat', 'uglify', 'copy']);
};
