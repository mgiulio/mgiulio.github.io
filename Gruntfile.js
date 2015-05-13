module.exports = function (grunt) {
    grunt.initConfig({
		sass: {
			dist: {
				options: {
					style: 'expanded'
				},
				files: {
					'src/css/style.css': 'src/scss/style.scss'
				}
			}
		},
        autoprefixer: {
            dist: {
                files: {
                    'src/css/style.css': 'src/css/style.css'
                }
            }
        }
    });
	
	grunt.loadNpmTasks('grunt-contrib-sass');
    grunt.loadNpmTasks('grunt-autoprefixer');
	
	grunt.registerTask('default', ['sass', 'autoprefixer']);
};