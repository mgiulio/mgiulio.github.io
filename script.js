function toArray(a,b){return slice.call(a,b||0)}function init(){domNodes.projectsSection=document.querySelector(".projects"),domNodes.about=document.querySelector(".about"),domNodes.about.querySelector(".about .toggle").addEventListener("click",function(a){a.stopPropagation(),a.preventDefault(),domNodes.about.classList.toggle("cover")}),fetchRepos()}function fetchRepos(){domNodes.projectsSection.classList.add("activity");var a=domNodes.projectsSection.querySelector(".github-link").href,b=a.substr(a.lastIndexOf("/")+1);gh.getUserRepos(b,"pushed",processRepos)}function processRepos(a){if(0!==a.length){var b=a.filter(filterRepo).map(pluckRepo),c=tmpl.projects(b);domNodes.projectsSection.innerHTML+=c,domNodes.projects=domNodes.projectsSection.querySelectorAll(".items");for(var d=0;d<domNodes.projects.length;++d)domNodes.projects[d].addEventListener("click",showProjectDetails,!1);domNodes.projectsSection.classList.remove("activity"),document.body.classList.remove("empty")}}function filterRepo(a){return!a.fork}function pluckRepo(a){return{name:a.name,description:a.description,mainLanguage:a.language,isFork:a.fork,forks:a.forks_count,lastCommit:a.pushed_at,stars:a.stargazers_count,watchers:a.watchers,repoUrl:a.html_url}}function showProjectDetails(a){a.stopPropagation();var b=a.target;if(!b.classList.contains("items")){for(;!b.classList.contains("item");)b=b.parentNode;window.open(b.dataset.repoUrl)}}var gh=function(){function a(a,c,d){b("/users/"+a+"/repos",{sort:c},d)}function b(a,b,e){c=e,b.callback="handleResponse";var f=[];for(var g in b)f.push(g+"="+b[g]);f="?"+f.join("&");var h=document.createElement("script");h.src=d+a+f,document.getElementsByTagName("head")[0].appendChild(h)}var c,d="https://api.github.com";return window.handleResponse=function(a){if(200!=a.meta.status)throw new Error("status not 200");c(a.data)},{getUserRepos:a}}(),tmpl=function(){function a(a){return a.toLowerCase()}function b(a){var b=new Date(a),c=b.getDate(),d=b.getMonth(),e=b.getFullYear();return d=["jan","feb","mar","apr","may","jun","jul","aug","sep","oct","nov","dec"][d],e=String(e).substr(-2),c+" "+d+" "+e}function c(a,b){return a?b:""}function d(b){var b=b?a(b):"not-available";return" main-lang-"+b}var e={project:function(a){return'\n				<li class="item'+d(a.mainLanguage)+c(a.isFork," fork")+'" data-repo-url="'+a.repoUrl+'">\n					<h2 class="title">'+a.name+'</h2>\n					<p class="description">'+a.description+'</p>\n					<p class="language">'+(a.mainLanguage?a.mainLanguage:"Not Available")+'</p>\n					<p class="meta">\n						<span class="timestamp last-commit" title="Last commit">\n							<svg role="img" title="Clock" class="icon"><use xlink:href="#clock" /></svg>\n							'+b(a.lastCommit)+'\n						</span>\n						<span class="counter forks">\n							<svg role="img" title="Fork" class="icon"><use xlink:href="#fork" /></svg>\n							'+a.forks+'\n						</span>\n						<span class="counter stars">\n							<svg role="img" title="Star" class="icon"><use xlink:href="#star" /></svg>\n							'+a.stars+'\n						</span>\n						<span class="counter watchers">\n							<svg role="img" title="Eye" class="icon"><use xlink:href="#eye" /></svg>\n							'+a.watchers+"\n						</span>\n					</p>\n				</li>\n			"},projects:function(a){return'<ul class="items">'+a.map(e.project).join("")+"</ul>"}};return e}(),slice=Array.prototype.slice,domNodes={};init();
//# sourceMappingURL=script.js.map