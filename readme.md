**renderTmpl**: Loads external template files and renders them with a template engine in JavaScript.

Features
--------

Allows templates to be broken out into seperate files.

Supports multiple template engines side-by-side on a single page.

Built-in support for jsRender.

Notifies your javascript code when templates have loaded with the ready() callbacks.

How to use
----------

1) Add your template file as a link:
```html
<link rel="template/jsrender" type="text/html" href="mytemplate.tmpl.html" />
```

Note that the name of the template is automatically extracted from the file name.

2) In JavaScript, add a ready callback.

```javascript
	//set a callback so that you can do something with the templates once they are loaded.
	$.renderTmpl.ready(function() {
		
		//now we're ready to start rendering with the template.
		
		//just call renderTmpl() and pass the template name and a model to bind with.
		var content = $.renderTmpl('mytemplate', { message: "whatever" });
		
		//let's have it pop up on the screen.
		alert('rendered content: '+content);		
	});
	
```

Fancy Stuff
-----------

You can register a built-in template engine with a custom alias I.E. rel="template/custom-alias":
```javascript
	
	//jsrender by default uses "jsrender" and is configured automatically.
	$.renderTmpl.engines.jsrender('custom-alias'); 

```

You can also register a completely custom template engine:
```javascript

	//register a custom engine:
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

```

Future releases
---------------

Remove dependency on jQuery.

Add additional templating engines.
