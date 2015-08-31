var gh = (function() {
  var apiUrl = 'https://api.github.com',
      done;
  ;
  function getUserRepos(username, sort, done) {
    makeRequest('/users/' + username + '/repos', {'sort': sort}, done);
  }
  function makeRequest(path, pars, _done) {
    done = _done;
    pars.callback = 'handleResponse';
    var queryString = [];
    for (var p in pars)
      queryString.push(p + '=' + pars[p]);
    queryString = '?' + queryString.join('&');
    var script = document.createElement('script');
    script.src = apiUrl + path + queryString;
    document.getElementsByTagName('head')[0].appendChild(script);
  }
  window.handleResponse = function(response) {
    if (response.meta.status != 200)
      throw new Error('status not 200');
    done(response.data);
  };
  return {getUserRepos: getUserRepos};
})();

var tmpl = (function() {
  var tmpl = {
    project: (function(m) {
      return ("\n\t\t\t\t<li class=\"item" + mainLanguageClass(m.mainLanguage) + classIf(m.isFork, ' ' + 'fork') + "\" data-repo-url=\"" + m.repoUrl + "\">\n\t\t\t\t\t<h2 class=\"title\">" + m.name + "</h2>\n\t\t\t\t\t<p class=\"description\">" + m.description + "</p>\n\t\t\t\t\t<p class=\"language\">" + (m.mainLanguage ? m.mainLanguage : 'Not Available') + "</p>\n\t\t\t\t\t<p class=\"meta\">\n\t\t\t\t\t\t<span class=\"timestamp last-commit\" title=\"Last commit\">\n\t\t\t\t\t\t\t<svg role=\"img\" title=\"Clock\" class=\"icon\"><use xlink:href=\"#clock\" /></svg>\n\t\t\t\t\t\t\t" + date(m.lastCommit) + "\n\t\t\t\t\t\t</span>\n\t\t\t\t\t\t<span class=\"counter forks\">\n\t\t\t\t\t\t\t<svg role=\"img\" title=\"Fork\" class=\"icon\"><use xlink:href=\"#fork\" /></svg>\n\t\t\t\t\t\t\t" + m.forks + "\n\t\t\t\t\t\t</span>\n\t\t\t\t\t\t<span class=\"counter stars\">\n\t\t\t\t\t\t\t<svg role=\"img\" title=\"Star\" class=\"icon\"><use xlink:href=\"#star\" /></svg>\n\t\t\t\t\t\t\t" + m.stars + "\n\t\t\t\t\t\t</span>\n\t\t\t\t\t\t<span class=\"counter watchers\">\n\t\t\t\t\t\t\t<svg role=\"img\" title=\"Eye\" class=\"icon\"><use xlink:href=\"#eye\" /></svg>\n\t\t\t\t\t\t\t" + m.watchers + "\n\t\t\t\t\t\t</span>\n\t\t\t\t\t</p>\n\t\t\t\t</li>\n\t\t\t");
    }),
    projects: (function(m) {
      return ("<ul class=\"items\">" + m.map(tmpl.project).join('') + "</ul>");
    })
  };
  ;
  return tmpl;
  function toLowerCase(str) {
    return str.toLowerCase();
  }
  function date(str) {
    var d = new Date(str);
    var day = d.getDate();
    var month = d.getMonth();
    var year = d.getFullYear();
    month = ['jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'][month];
    year = String(year).substr(-2);
    return (day + " " + month + " " + year);
  }
  function classIf(cond, className) {
    return cond ? className : '';
  }
  function mainLanguageClass(lang) {
    var lang = !lang ? 'not-available' : toLowerCase(lang);
    return ' ' + 'main-lang-' + lang;
  }
})();

var slice = Array.prototype.slice,
    domNodes = {};
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
    return ;
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
    return ;
  while (!target.classList.contains('item'))
    target = target.parentNode;
  window.open(target.dataset.repoUrl);
}
