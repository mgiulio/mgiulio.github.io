var
	tmpl = {},
	slice = Array.prototype.slice,
	domNodes = {
	}
;

function toArray(o, n) { 
		return slice.call(o, n || 0); 
	}

init();

function init() {
	setupTemplating();
	fetchRepos();
	setupUI();
}

function fetchRepos() {
	var script = document.createElement('script');
	script.src = 
		'repos.js'
		//'https://api.github.com/users/mgiulio/repos?callback=jsonPCallback'
	;
	document.getElementsByTagName('head')[0].appendChild(script);
}

function jsonPCallback(response) {
	//console.log(response);
	
	if (response.meta.status != 200)
		throw new Error('status not 200');
	
	processRepos(response.data);
}

function processRepos(data) {
	if (data.length === 0) 
		return;
	
	var projects = data.map(pluck);
	//console.log(projects);
		
	var markup = tmpl['project-tease'](projects);
	//console.log(markup);
		
	var projectItems = document.querySelector('.projects .items');
	projectItems.innerHTML = markup;
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
	var templateNodes = document.querySelectorAll('[type="text/x-handlebars-template"]');
	toArray(templateNodes).forEach(function(domNode) {
		var tmplName = domNode.id.slice(5);
		tmpl[tmplName] = Handlebars.compile(domNode.innerHTML);
	});
}

function setupUI() {
	domNodes.projectsSection = document.querySelector('.projects');
	domNodes.projects = domNodes.projectsSection.querySelector('.items');
	domNodes.article = domNodes.projectsSection.querySelector('.details');
	domNodes.mask = domNodes.projectsSection.querySelector('#mask');
	
	domNodes.projects.addEventListener('click', showProjectDetails, false);
	domNodes.article.querySelector('.close').addEventListener('click', hideProjectDetails, false);
}

function showProjectDetails(e) {
	e.stopPropagation();
	
	var target = e.target;
	while (!target.classList.contains('item'))
		target = target.parentNode; // check for uncatched clicks
	
	//target.classList.add('details');
	
	// Assign to article node the top&friend values of the clicked prj
	//var targetStyle = window.getComputedStyle(target, null);
	//var borderBox = target.getBoundingClientRect();
	console.log(target.offsetWidth, target.offsetHeight, target.offsetParent, target.offsetLeft, target.offsetTop);
	
	domNodes.mask.style.left = target.offsetLeft + 'px';
	domNodes.mask.style.right = target.offsetParent.offsetWidth - (target.offsetLeft + target.offsetWidth) + 'px';
	domNodes.mask.style.top = target.offsetTop + 'px';
	domNodes.mask.style.bottom = target.offsetParent.offsetHeight - (target.offsetTop + target.offsetHeight) + 'px';
	//domNodes.article.style.width = target.offsetWidth + 'px';
	//domNodes.article.style.height = target.offsetHeight + 'px';
	//domNodes.article.style.bottom = target.offsetTop + target.offsetHeight + 'px';
	
	//domNodes.article.style.left = targetStyle.left;//'400px';
	/* domNodes.article.style.left = borderBox.left + 'px';
	domNodes.article.style.top = borderBox.top + 'px';
	domNodes.article.style.right = borderBox.right + 'px';
	domNodes.article.style.bottom = borderBox.bottom + 'px'; */
	//domNodes.article.style.left = '400px';
	//domNodes.article.style.top = targetStyle.top;
	//domNodes.article.style.width = '400px';
	//domNodes.article.style.height = '400px';
	domNodes.mask.style.display = 'block';
	
	setTimeout(expand, 0);
	
	function expand() {
		domNodes.mask.dataset.left = domNodes.mask.style.left;
		domNodes.mask.dataset.right = domNodes.mask.style.right;
		domNodes.mask.dataset.top = domNodes.mask.style.top;
		domNodes.mask.dataset.bottom = domNodes.mask.style.bottom;
		
		domNodes.mask.style.left = domNodes.mask.style.right = domNodes.mask.style.top = domNodes.mask.style.bottom = '0px';
		//domNodes.article.style.width = domNodes.article.style.height = 'auto';
		
		domNodes.mask.addEventListener('transitionend', f, false);
		
		function f(e) {
			domNodes.mask.removeEventListener('transitionend', f, false);
			
			domNodes.projects.style.display = 'none';
			domNodes.article.style.display = 'block';
			
			domNodes.mask.addEventListener('transitionend', displayNone, false);
			domNodes.mask.style.opacity = 0;
			function displayNone(e) {
				if (e.propertyName !== 'opacity')
					return;
				domNodes.mask.removeEventListener('transitionend', displayNone, false);
				//domNodes.mask.style.display = 'none';
				domNodes.mask.style.visibility = 'hidden';
			}
		}
	}
}

function hideProjectDetails(e) {
	e.stopPropagation();
	
	//domNodes.mask.style.display = 'block';
	domNodes.mask.style.visibility = 'visible';
	
	domNodes.mask.addEventListener('transitionend', contract, false);
	domNodes.mask.style.opacity = 1;
	
	function contract(e) {
		domNodes.mask.removeEventListener('transitionend', contract, false);
		
		domNodes.article.style.display = 'none';
		domNodes.projects.style.display = 'flex';
		
		domNodes.mask.addEventListener('transitionend', hideMask, false);
		domNodes.mask.style.left = domNodes.mask.dataset.left;
		domNodes.mask.style.right = domNodes.mask.dataset.right;
		domNodes.mask.style.top = domNodes.mask.dataset.top;
		domNodes.mask.style.bottom = domNodes.mask.dataset.bottom;
		
		function hideMask(e) {
			domNodes.mask.removeEventListener('transitionend', hideMask, false);
			
			domNodes.mask.style.display = 'none';
			//domNodes.mask.style.visibility = 'hidden';
		}
	}
	
}