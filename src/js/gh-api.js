var gh = (function() {
	
	var
		apiUrl = 'https://api.github.com',
		done
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

	return {
		getUserRepos: getUserRepos
	};
	
})();

