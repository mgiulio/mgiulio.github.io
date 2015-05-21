var
	slice = Array.prototype.slice,
	domNodes = {}
;

function toArray(o, n) { 
	return slice.call(o, n || 0); 
}

init();

function init() {
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
	gh.getUserRepos(username, 'pushed', processRepos);
}

function processRepos(data) {
	if (data.length === 0) 
		return;
	
	var projects = data.filter(filterRepo).map(pluckRepo);
		
	var markup = tmpl['projects'](projects);
		
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

function showProjectDetails(e) {
	e.stopPropagation();
	
	var target = e.target;
	
	if (target === domNodes.projects)
		return;
	
	while (!target.classList.contains('item'))
		target = target.parentNode; // check for uncatched clicks
	
	window.open(target.dataset.repoUrl);
}
