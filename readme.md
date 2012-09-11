renderTmpl: Loads external template files and renders them with a template engine in JavaScript.

Features:
-> Allows templates to be broken out into seperate files.
-> Supports multiple template engines on a single page.
-> Notifies your javascript code when templates have loaded with the ready() callback.

How to use:

1) Add your template file as a link:
<link rel="template/engine-name" type="text/html" href="mytemplate.tmpl.html" />

2) In JavaScript, register your engines and load renderTmpl.
$(function() {
	
	//register a known template library:
	
	$.renderTmpl.engines.jsrender('engine-name');

	//or... register a custom engine:

	$.renderTmpl.onRegister('engine-name', function(name, data) {
		//code to register the template with some sort of collection.
		...
	});
	
	$.renderTmpl.onRender('engine-name', function(name, data) {
		//code to render the template given some set of data input.
		...
	});
		
	//set a callback so that you can do something with the templates once they are loaded.
	$.renderTmpl.ready(function() {
		
		//now we're ready to start rendering with the template. Just call renderTmpl() and pass the template name and a model to bind with.
		alert($.renderTmpl('myTemplate', { message: "whatever" }));
		
	});
	
	//call load to indicate that we're ready to start loading the templates.

	$.renderTmpl.load();

});

Future releases:
-> remove dependency on jQuery.