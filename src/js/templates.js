var tmpl = (function() {
		
	var tmpl = {
			project: m => `
				<li class="item${ mainLanguageClass(m.mainLanguage) }${ classIf(m.isFork, ' ' + 'fork') }" data-repo-url="${m.repoUrl}">
					<h2 class="title">${m.name}</h2>
					<p class="description">${m.description}</p>
					<p class="language">${m.mainLanguage}</p>
					<p class="meta">
						<span class="timestamp last-commit" title="Last commit">
							<svg role="img" title="Clock" class="icon"><use xlink:href="#clock" /></svg>
							${date(m.lastCommit)}
						</span>
						<span class="counter forks">
							<svg role="img" title="Fork" class="icon"><use xlink:href="#fork" /></svg>
							${m.forks}
						</span>
						<span class="counter stars">
							<svg role="img" title="Star" class="icon"><use xlink:href="#star" /></svg>
							${m.stars}
						</span>
						<span class="counter watchers">
							<svg role="img" title="Eye" class="icon"><use xlink:href="#eye" /></svg>
							${m.watchers}
						</span>
					</p>
				</li>
			`,
			projects: m => `<ul class="items">${ m.map(tmpl.project).join('') }</ul>`
		}
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
		
		return day + ' ' + month + ' ' + year;
	}
		
	function classIf(cond, className) {
		return cond ? className : '';
	}
	
	function mainLanguageClass(lang) {
		return !lang ? '' : ' ' + toLowerCase(lang);
	}
	
})();
		