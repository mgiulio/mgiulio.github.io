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
	domNodes.about = document.querySelector('.about');
	
	domNodes.about.querySelector('.about .toggle').addEventListener('click', function(e) {
		e.stopPropagation();
		e.preventDefault();
		
		domNodes.about.classList.toggle('cover');
	});
	
	fetchRepos();
}

function fetchRepos() {
	domNodes.projectsSection.classList.add('activity');
	
	var ghUrl = domNodes.projectsSection.querySelector('.github-link').href;
	var username = ghUrl.substr(ghUrl.lastIndexOf('/') + 1);
	
	var script = document.createElement('script');
	script.src = 
		'repos.js'
		//`https://api.github.com/users/${username}/repos?callback=jsonPCallback&sort=pushed`
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
	
	var projects = data.filter(filterRepo).map(pluckRepo);
		
	var markup = tmpl['projects']({projects: projects});
		
	domNodes.projectsSection.innerHTML += markup;
	
	domNodes.projects = domNodes.projectsSection.querySelector('.items');
	
	domNodes.projects.addEventListener('click', showProjectDetails, false);
	
	domNodes.projectsSection.classList.remove('activity');
	document.body.classList.remove('empty');
}

function filterRepo(r) {
	return !r.fork;
}

function pluckRepo(r) {
	return {
		name: r.name,
		description: r.description,
		mainLanguage: r.language,
		isFork: r.fork,
		forks: r.forks_count,
		lastCommit: r.pushed_at,
		stars: r.stargazers_count,
		watchers: r.watchers,
		repoUrl: r.html_url
	};
}

function setupTemplating() {
	Handlebars.registerHelper('toLowerCase', function(str) {
		return str.toLowerCase();
	});
	
	Handlebars.registerHelper('date', function(str) {
		var d = new Date(str);
		
		var day = d.getDate();
		var month = d.getMonth();
		var year = d.getFullYear();
		
		month = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'][month];
		year = String(year).substr(-2);
		
		return `${day} ${month} ${year}`;
	});
	
	var templateNodes = document.querySelectorAll('[type="text/x-handlebars-template"]');
	toArray(templateNodes).forEach(function(domNode) {
		var tmplName = domNode.id.slice(5);
		tmpl[tmplName] = Handlebars.compile(domNode.innerHTML);
	});
}

function showProjectDetails(e) {
	e.stopPropagation();
	
	var target = e.target;
	
	if (target === domNodes.projects)
		return;
	
	while (!target.classList.contains('item'))
		target = target.parentNode; // check for uncatched clicks
	
	window.open(target.dataset.repoUrl);
}
