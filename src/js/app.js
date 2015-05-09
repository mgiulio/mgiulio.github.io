var
	tmpl = {},
	slice = Array.prototype.slice,
	domNodes = {}
;

function toArray(o, n) { 
	return slice.call(o, n || 0); 
}

init();

function init() {
	setupTemplating();
	
	domNodes.projectsSection = document.querySelector('.projects');
	domNodes.projects = domNodes.projectsSection.querySelector('.items');
	domNodes.mask = domNodes.projectsSection.querySelector('#mask');
	
	fetchRepos();
}

function fetchRepos() {
	domNodes.projectsSection.classList.add('activity');
	
	var ghUrl = domNodes.projectsSection.querySelector('.github-link').href;
	var username = ghUrl.substr(ghUrl.lastIndexOf('/') + 1);
	
	var script = document.createElement('script');
	script.src = 
		'repos.js'
		//`https://api.github.com/users/${username}/repos?callback=jsonPCallback`
	;
	document.getElementsByTagName('head')[0].appendChild(script);
}

function jsonPCallback(response) {
	if (response.meta.status != 200)
		throw new Error('status not 200');
	
	processRepos(response.data);
}

function processRepos(data) {
	if (data.length === 0) 
		return;
	
	var projects = data.map(pluck);
		
	var markup = tmpl['projects']({projects: projects});
		
	domNodes.projectsSection.innerHTML += markup;
	
	//domNodes.projectsSection.classList.remove('activity');
}

function pluck(repo) {
	return {
		name: repo.name,
		description: repo.description,
		mainLanguage: repo.language,
		isFork: repo.fork,
		forks: repo.forks_count,
		creationTime: repo.created_at,
		stars: repo.stargazers_count,
		watchers: repo.watchers
	};
}

function setupTemplating() {
	Handlebars.registerHelper('toLowerCase', function(str) {
		return str.toLowerCase();
	});
	
	var templateNodes = document.querySelectorAll('[type="text/x-handlebars-template"]');
	toArray(templateNodes).forEach(function(domNode) {
		var tmplName = domNode.id.slice(5);
		tmpl[tmplName] = Handlebars.compile(domNode.innerHTML);
	});
}
