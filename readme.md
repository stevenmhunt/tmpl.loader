renderTmpl: Loads external template files and renders them with a template engine in JavaScript.

Features:

Allows templates to be broken out into seperate files.

Supports multiple template engines side-by-side on a single page.

Built-in support for jsRender.

Notifies your javascript code when templates have loaded with the ready() callbacks.

Future releases:

remove dependency on jQuery.

How to use:

1) Add your template file as a link:
```html
<link rel="template/engine-name" type="text/html" href="mytemplate.tmpl.html" />
```

2) In JavaScript, register any custom engines and a ready callback.

```javascript
    $(function() {

	//Note: if you use the default engine configuration, no code is required to configure it.

	//register a built-in template library with a different alias:
	
	//jsrender by default uses "x-jsrender" and is configured automatically.
	$.renderTmpl.engines.jsrender('custom-jsrender'); 
	
	//or... register a custom engine:

	$.renderTmpl.engines.register('engine-name', {
		//code to register the template with some sort of collection.
		register: function(name, data) {
			...
		}),
		//code to render the template given some set of data input.
		render: function(name, data) {
			...
		}),
		//code to reset the template collection for the engine.
		reset: function() {
			...
		}
	});
			
	//set a callback so that you can do something with the templates once they are loaded.
	$.renderTmpl.ready(function() {
		
		//now we're ready to start rendering with the template. Just call renderTmpl() and pass the template name and a model to bind with.
		alert($.renderTmpl('myTemplate', { message: "whatever" }));
		
	});
    }
```
