RenderTmpl: Simple Template Loading and Rendering
=================================================

**Version 0.1**

*Loads external template files and renders them with a template engine in JavaScript.*

Features
--------

Allows templates to be broken out into seperate files.

Supports multiple template engines side-by-side on a single page.

Built-in support for jsRender.

Works with jQuery... or not. Your choice.

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

If you want to have multiple templates in a single large file (production scenarios possibly), you can do the following:

1) Create your template file with comments indicating the sections:
```html
<!-- template section1 -->
template section 1
...
<!-- template section2 -->
template section 2
...
```

2) Add your template with *"-multipart"* at the end of the REL attribute:
```html
<link rel="template/jsrender-multipart" type="text/html" href="mytemplate_multi.tmpl.html" />
```

3) Reference the templates as "file name"_"part name":
```javascript
$.renderTmpl('mytemplate_multi_section1', { data: "foo" });
```

Future releases
---------------

Add additional templating engines.
