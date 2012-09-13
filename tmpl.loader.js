/* tmpl.loader
 * version 0.1
 * http://github.com/stevenmtwhunt/tmpl.loader */

var tmplLoader = {};

(function(global, jQuery, undefined) {

	var _tmplCount = 0;
	var _tmplTypes = new Array();
	
	//used to handle xml http requests.
	//based on code posted by Lukasz Szajkowski.
	var xhr = function(url, callback) {

	  	var http_request = false;
		if (window.XMLHttpRequest) { // Mozilla, Safari,...
	       http_request = new XMLHttpRequest();	   
	       if (http_request.overrideMimeType)
	           http_request.overrideMimeType('text/xml');
	   } 
	   else if (window.ActiveXObject) { // IE
	       try { http_request = new ActiveXObject("Msxml2.XMLHTTP"); } 
		   catch(e) {
		       try { http_request = new ActiveXObject("Microsoft.XMLHTTP"); } 
			   catch (e) { }
	       }	   
	   }
	
	   if (!http_request)       
	       return false;
	
	   http_request.onreadystatechange = function() {
	       if (http_request.readyState == 4) {
	           if (http_request.status == 200)
					callback(http_request.responseText);
			   else return http_request.status;		   
	       }
	   };
	   
	   http_request.open('GET', url, true);
	   http_request.send(null);

	};
	
	//used to render templates based on name and data.
	var render = function(tmpl, data) {
		var fn = onRender(_tmplTypes[tmpl]);
		return fn(tmpl, data);
	};
	
	var _loaded = false;
	
	//loads templates from associated files.
	var load = function() {

		//only load once per request.
		if (_loaded)
			return;
						
		_loaded = true;	
		
		//register all configured engines.
		for (var key in engines) {
			if (key != 'register') {
				engines[key]();
			}
		}
		
		var todo = new Array();
		var rels = new Array();
		
		//get all link tags.
		var links = document.getElementsByTagName('link');
	
		for (var i = 0; i < links.length; i++) {
			
			//find the ones that are templates.
			var rel = ""+links[i].rel;
			rel = rel.substr(0, rel.indexOf('/')+1);
			
			if (rel === 'template/') {
				
				//increment template count; used to determine when to call ready().
				_tmplCount++;
				todo.push(links[i]);
				
				//get the template type from REL and push it to a list.
				rel = ""+links[i].rel;
				rel = rel.substr(rel.lastIndexOf('/')+1);
				rels.push(rel);
			}
		}
		
		//trim string function written by Steven Levithan.
		var trimString = function(str) {
			return str.replace(/^\s\s*/, '').replace(/\s\s*$/, '');
		};
		
		//closure function that handles callback from ajax file load.
		var handleLoadFile = function(file, rel) {
			return function(data) {
	
				var name = file.substring(file.lastIndexOf("/")+1, file.indexOf('.', file.lastIndexOf("/")+1));
				
				var multipart = false;
				var relName = rel;
				if (relName.lastIndexOf('-') > -1 && relName.substr(relName.lastIndexOf('-')+1) == 'multipart') {
					relName = relName.substr(0, relName.lastIndexOf('-'));
					multipart = true;
				}
												
				//register template by name.
				var reg = onRegister(relName);
				
				//if multipart template, parse out the template names and load them individually.
				if (multipart) {
					var items = {};
					var temp = "";
					var lines = data.split("\n");
					var partname = "";
					for (var i = 0; i < lines.length; i++) {
						if (lines[i].length > 14 && lines[i].substr(0, 14) == '<!-- template ') {
							
							//get the template name.
							var _partname = ""+lines[i].substr(14);
							_partname = trimString(name + "_" + _partname.substr(0, _partname.indexOf('-'))).replace(' ', '');
							
							if (temp.length > 0)
								items[partname] = ""+temp;
							
							temp = "";
							partname = ""+_partname;
						}
						else
							temp += lines[i] + "\n";
					}
					
					if (temp.length > 0)
						items[partname] = ""+temp;
					
					for (var key in items) {
		
						//build array that remembers which type the template is.
						_tmplTypes[key] = relName;

						reg(key, items[key]);
					}
				}
				else {

					//build array that remembers which type the template is.
					_tmplTypes[name] = relName;

					reg(name, data);
				}
							
				//subtract counter.				
				if (--_tmplCount == 0) {
					_tmplCount = -1;
					ready();
				}
			}
		}
		
		for (var i = 0; i < todo.length; i++) {
			var file = todo[i].href;
	
			//get the contents of the linked file.
			xhr(file, handleLoadFile(file, rels[i]));
		}
	};
	
	var reload = function() {
		
		if (_loaded) {
			for (var i = 0; i < _onReset.length; i++) {
				var reset = _onReset[i];
				reset();
			}
			_loaded = false;
		}
		
		load();
	}
	
	//resets the templates.
	var reset = function() {

		for (var i = 0; i < _onReset.length; i++) {
			var reset = _onReset[i];
			reset();
		}

		_onRender = new Array();
		_onRegister = new Array();
		_onReset = new Array();
	}
	
	//manages lambdas to call when templates are ready.
	var _ready = new Array();
	var ready = function(lambda) {
		if (lambda === undefined) {
			for (var i = 0; i < _ready.length; i++) {
				var fn = _ready[i];
				fn();
			}
		}
		else
			_ready.push(lambda);
	};
	
	//generic lambda handler
	var lambdaHandler = function(arr, name, lambda) {
		
		//if the name provided is already in the array...
		if (name in arr) {
			//if no lambda is provided, return the lambda in the array.
			if (lambda === undefined)
				return arr[name];
			//if the value provided is null, remove the item from the array.
			else if (lambda == null) {
				delete arr[name];
				return;
			}
		}
		//if the name is undefined, then return the entire array.
		else if (name === undefined)
			return arr;
		//if the name is not in the array, and the lambda is not valid, return.
		else if (lambda === undefined || typeof lambda != 'function')
			return null;
		
		//if the name is not in the array, or the name is in the array but none of the other conditions matched, add/update the value.
		arr[name] = lambda;
	};
	
	//on render lambda handler.
	var _onRender = new Array();
	var onRender = function(name, lambda) {
		return lambdaHandler(_onRender, name, lambda);
	};
	
	//on register lambda handler.
	var _onRegister = new Array();
	var onRegister = function(name, lambda) {
		return lambdaHandler(_onRegister, name, lambda);
	};
	
	//on reset lambda handler.
	var _onReset = new Array();
	var onReset = function(name, lambda) {
		return lambdaHandler(_onReset, name, lambda);
	};
	
	var _basicTmpls = {};
	
	var engines = {
		
		//integration of the jsRender library.
		jsrender: function(name) {
			//use default name if no name is given.
			var alias = (name === undefined ? "jsrender" : name);
			
			onRender(alias, function(tmpl, data) {
				var a = (!jQuery ? jsviews : jQuery);
				return a.templates[tmpl].render(data);
			});
	
			onRegister(alias, function(tmpl, data) {
				var a = (!jQuery ? jsviews : jQuery);
				return a.templates(tmpl, data);
			});
			
			onReset(alias, function() {
				var a = (!jQuery ? jsviews : jQuery);
				a.templates = {};
			});
		},
		
		/* basic template engine for use in examples.
		 * NOT RECOMMENDED FOR PRODUCTION USE.
		 * Iterates through model and replaces {key} with the value from the model. */
		basic: function(name) {
			//use default name if no name is given.
			var alias = (name === undefined ? "basic" : name);
			
			onRegister(alias, function(tmpl, data) {
				_basicTmpls[tmpl] = data;
			});
			
			onRender(alias, function(tmpl, data) {
				var result = ""+_basicTmpls[tmpl];
				for (key in data) {
					result = result.replace('{'+key+'}', data[key]);				
				}
				return result;
			});
			
			onReset(alias, function() {
				_basicTmpls = {};
			});
			
		},
		
		register: function(name, callbacks) {
			onRender(name, callbacks.render);
			onRegister(name, callbacks.register);
			onReset(name, callbacks.reset);
		}
	};

	//register functions manually.
	tmplLoader.render = render;
	tmplLoader.reset = reset;
	tmplLoader.reload = reload;
	tmplLoader.ready = ready;
	tmplLoader.engines = engines;

	//register jQuery extensions if available.
	if (jQuery) {
		jQuery.tmplLoader = render;
		jQuery.tmplLoader.render = render;
		jQuery.tmplLoader.reset = reset;
		jQuery.tmplLoader.reload = reload;
		jQuery.tmplLoader.ready = ready;
		jQuery.tmplLoader.engines = engines;
	}
	
	/*addLoadEvent() was written by Simon Willison. */
	function addLoadEvent(func) {
	  var oldonload = window.onload;
	  if (typeof window.onload != 'function') {
	    window.onload = func;
	  } else {
	    window.onload = function() {
	      if (oldonload) {
	        oldonload();
	      }
	      func();
	    }
	  }
	}

	//fire load function once the window loads.	
	addLoadEvent(function() {
		if (_loaded === false)
			load();
	});

})(this, this.jQuery);