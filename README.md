# JsDoc Route Plugin

[![NPM version][npm-image]][npm-url]
[![Dependencies][david-image]][david-url]
[![devDependencies][david-dev-image]][david-dev-url]

This is a plugin for [JsDoc](http://usejsdoc.org/) which is a tool to generate HTML documentation from comment blocks.
JsDoc will scan your code files looking for comment blocks then generate a nicely formated HTML document.

JsDoc supports a number of tags to help document a number of things such as each parameter in a function or what the function will return.
These tags are picked up by JsDoc and used when generating the HTML documentation; for example function parameters are shown in a table.

This plugin adds custom tags to JsDoc that work with the default document template. The custom tags are meant to help document Express routes.

## Why JsDoc Route Plugin

I like documenting my code within the code, that way the documentation gets updated as I update the code because the two are co-located.
I use to do a lot of C++ and C# development and used a tool called [Doxygen](http://doxygen.org) which generated HTML documentation from comment blocks placed around my projects code files.
When I switched over to Node.js development I found [JsDoc](http://usejsdoc.org/) which looks to do the same thing.

My issue was that I was writing web services which have Express routes and [JsDoc](http://usejsdoc.org/) did not have a nice way to document those.
I figured out how to fake it by using the `@name` tag but it was hard to document the details about my route; I was writing HTML in the long description to add parameter tables.

To simplify this I wanted to add custom tags but had a hard time finding instructions on how to do that without modifying the built in [JsDoc](http://usejsdoc.org/) layout template or rolling my own template to use in its sted.

I eventually figured out how to hack it by defining new tags which insert HTML into the description before it gets to the default template; JsDoc Route Plugin is a collection of those tags specifically designed to work with the default [JsDoc](http://usejsdoc.org/) template.
They might work with other templates as they just add h5, tables, and paragraphs to the top and/or bottom of the doclets description property.

They allowed me to document my routes without too much fuss and hopefully if your in the same boat will help you to.
If I did this completely the wrong way feel free to let me know what the better solution is but for now install this plugin and start documenting!

## How to install

First you need to install JsDoc
```
npm install jsdoc --save-dev
```

Then you need to install the JsDoc Route Plugin

```
npm install jsdoc-route-plugin --save-dev
```

Next you need to tell [JsDoc](http://usejsdoc.org/) to enable the plugin.

You can do this by adding a `jsdoc.conf` file and telling [JsDoc](http://usejsdoc.org/) to use it when you run it.

**Example jsdoc.conf**
```
{
    "tags": {
        "allowUnknownTags": true,
        "dictionaries": ["jsdoc","closure"]
    },
    "source": {
        "include": [ "." ],
        "exclude": [ "node_modules" ],
        "includePattern": ".+\\.js(doc|x)?$",
        "excludePattern": "(^|\\/|\\\\)_"
    },
    "plugins": ["jsdoc-route-plugin"],
    "templates": {
        "cleverLinks": false,
        "monospaceLinks": false
    },
    "opts": {
      "recurse": true
    }
}
```

Now run [JsDoc](http://usejsdoc.org/) with the `--config` flag.
```
./node_modules/.bin/jsdoc --config jsdoc.conf
```

## Example

If you want to see an example of this plugin in action run the `npm run example1` command.
That will run [JsDoc](http://usejsdoc.org/) against a sample Express app located in `examples` and produce HTML documentation in the `out` folder.
To view the documentation open `out/index.html` in a browser.

## What are the new Tags

The new tags are all about documenting Express routes.
Find a list of them and how they are to be used below.

## @route

Because JsDoc does not know about routes we need to decorate the route documentation with the `@name` tag to make JsDoc think you are documenting a member of the given module.
This will add an entry under the **Members** section in the HTML document; however, if we used only the `@name` tag to describe the route verb and path it might look a bit odd as it would show up like this:
> *(inner)* POST /v1/files

To make documenting a route a bit nicer I suggest using the `@name` tag to define a common name for the route, such as File Upload, and the `@route` tag to define the verb and route path.
Using the `@route` tag will also change the method attribute from *(inner)* to *(route)*.

```
/**
 * Upload a file.
 *
 * @name File Upload
 * @route {POST} /v1/file
 */
server.post({
  url: '/v1/file',
}, (req, res, next) => {...}
```

The `@route` tag will add a table showing the HTTP verb (i.e. POST, PUT, DEL, GET), and the route path (i.e. /v1/files) for the route you are documenting just under the friendly name of the route above the details section.
It would look something similar to the following:

--------------------------------------

## Members
  *(route)* File Upload

### Route:
|Method |Path      |
|:------|:---------|
| POST  | /v1/file |

Upload a file.

--------------------------------------

Only one `@route` tag is expected per route document.

## @authentication

The `@authentication` tag allows you to state what authentication a route requires.

```
/**
 * Upload a file.
 *
 * @name File Upload
 * @route {POST} /v1/file
 * @authentication This route requires HTTP Basic Authentication. If authentication fails it will return a 401 error.
 */
server.post({
  url: '/v1/file',
}, (req, res, next) => {...}
```

It will result in a new sub-heading called **Authentication** with whatever text you provided to the tag beneath it.
It would look something similar to the following:

--------------------------------------
## Members
  *(route)* File Upload

### Route:
|Method |Path      |
|:------|:---------|
| POST  | /v1/file |

Upload a file.

### Authentication
This route requires HTTP Basic Authentication. If authentication fails it will return a 401 error.

--------------------------------------

Only one `@authentication` tag is expected per route document.

## @headerparam

The `@headerparam` allows you to document any parameters which are passed via the header of the HTTP request.

With this tag you need to provide the name and a description. The name is the first word of the text following the tag.
* `@headerparam MyName And this part is the description`

You can also optionally provide a type for the parameter.
* `@headerparam {String} MyName And this part is the description`

```
/**
 * Upload a file.
 *
 * @name File Upload
 * @route {POST} /v1/file
 * @headerparam authorization is the identification information for the request
 * @headerparam {String} user-id is the unique User Id to assign to the file
 */
server.post({
  url: '/v1/file',
}, (req, res, next) => {...}
```

The above would add a table under the route description that lists all the header parameters.
It would look something similar to the following:

--------------------------------------
## Members
  *(route)* File Upload

### Route:
|Method |Path      |
|:------|:---------|
| POST  | /v1/file |

Upload a file.

### Header Parameters:
|Name            |Type    | Description                                       |
|:---------------|:-------|:--------------------------------------------------|
| authorization  |        | is the identification information for the request |
| user-id        | String | is the unique User Id to assign to the file       |

--------------------------------------

You can use the `@headerparam` tag as many times as you have parameters in your request header you whish to document.


## @bodyparam

The `@bodyparam` allows you to document any parameters which are passed via the body of the HTTP request.

With this tag you need to provide the name and a description. The name is the first word of the text following the tag.
* `@bodyparam MyName And this part is the description`

You can also optionally provide a type for the parameter.
* `@bodyparam {String} MyName And this part is the description`

You can also specify that the parameter is optional by placing the name within square brackets.
* `@bodyparam {String} [MyName] And this part is the description`

Lastly you can define a default value for the parameter. The idea is to document the value which will be used if the parameter is not provided.
* `@bodyparam {String} [MyName=Phillip] And this part is the description`


```
/**
 * Upload a file.
 *
 * @name File Upload
 * @route {POST} /v1/file
 * @bodyparam {String} userId is the unique identifier for the user we are uploading the file to.
 * @bodyparam {Boolean} [sync=false] when true the route will be synchronous otherwise the route
 * is asynchronous.
 */
server.post({
  url: '/v1/file',
}, (req, res, next) => {...}
```

The above would add a table under the route description that lists all the body parameters.
It would look something similar to the following:

--------------------------------------
## Members
  *(route)* File Upload

### Route:
|Method |Path      |
|:------|:---------|
| POST  | /v1/file |

Upload a file.

### Body Parameters:
|Name     |Type     | Attributes | Default | Description                                                                  |
|:--------|:--------|:-----------|:--------|:-----------------------------------------------------------------------------|
| userId  | String  |            |         | is the unique identifier for the user we are uploading the file to.          |
| sync    | Boolean | Optional   | false   | when true the route will be synchronous otherwise the route is asynchronous. |

--------------------------------------

You can use the `@bodyparam` tag as many times as you have parameters in your request body you whish to document.

## @routeparam

The `@routeparam` allows you to document any parameters which make up part of the route path.

With this tag you need to provide the name and a description. The name is the first word of the text following the tag.
* `@routeparam MyName And this part is the description`

You can also optionally provide a type for the parameter.
* `@routeparam {String} MyName And this part is the description`

```
/**
 * Download a file.
 *
 * @name Download File
 * @route {GET} /v1/files/:fileId
 * @routeparam {String} :fileId is the unique identifier for the file to download.
 */
server.get({
  url: '/v1/files/:fileId',
}, (req, res, next) => {...}
```

The above would add a table under the route description that lists all the route parameters.
It would look something similar to the following:

--------------------------------------
## Members
  *(route)* Download File

### Route:
|Method |Path               |
|:------|:------------------|
| GET   | /v1/files/:fileId |

Download a file.

### Route Parameters:
|Name      |Type    | Description                                        |
|:---------|:-------|:---------------------------------------------------|
| :fileId  | String | is the unique identifier for the file to download. |

--------------------------------------

You can use the `@routeparam` tag as many times as you have parameters in your route path.

## @queryparam

The `@queryparam` allows you to document any parameters which are passed via HTTP request url.

With this tag you need to provide the name and a description. The name is the first word of the text following the tag.
* `@queryparam MyName And this part is the description`

You can also optionally provide a type for the parameter.
* `@queryparam {String} MyName And this part is the description`

You can also specify that the parameter is optional by placing the name within square brackets.
* `@queryparam {String} [MyName] And this part is the description`

Lastly you can define a default value for the parameter. The idea is to document the value which will be used if the parameter is not provided.
* `@queryparam {String} [MyName=Phillip] And this part is the description`


```
/**
 * Download files.
 *
 * @name Download Files
 * @route {GET} /v1/files
 * @queryparam {String} [fileType] will limit the download to just these file types.
 */
server.get({
  url: '/v1/files',
}, (req, res, next) => {...}
```

The above would add a table under the route description that lists all the query parameters.
It would look something similar to the following:

--------------------------------------
## Members
  *(route)* Download Files

### Route:
|Method |Path       |
|:------|:----------|
| GET   | /v1/files |

Download files.

### Query Parameters:
|Name      |Type    | Attributes | Description                                       |
|:---------|:-------|:-----------|:--------------------------------------------------|
| fileType | String | Optional   | will limit the download to just these file types. |

--------------------------------------

You can use the `@queryparam` tag as many times as you have parameters in your request url you whish to document.

## Donations

If you like JsDoc Route Plugin and want to support it and other open source work that I do you can do so via [Gratipay](https://gratipay.com/~bvanderlaan/).

[![Support via Gratipay](https://cdn.rawgit.com/gratipay/gratipay-badge/2.3.0/dist/gratipay.svg)](https://gratipay.com/~bvanderlaan/)

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/bvanderlaan/jsdoc-route-plugin. This project is intended to be a safe, welcoming space for
collaboration, and contributors are expected to adhere to the [Contributor Covenant](http://contributor-covenant.org) code of conduct.

## License

The library is available as open source under the terms of the [MIT License](http://opensource.org/licenses/MIT).


[npm-image]: http://img.shields.io/npm/v/jsdoc-route-plugin.svg?style=flat
[npm-url]: https://npmjs.org/package/jsdoc-route-plugin
[david-image]: http://img.shields.io/david/bvanderlaan/jsdoc-route-plugin.svg?style=flat
[david-url]: https://david-dm.org/bvanderlaan/jsdoc-route-plugin
[david-dev-image]: http://img.shields.io/david/dev/bvanderlaan/jsdoc-route-plugin.svg?style=flat
[david-dev-url]: https://david-dm.org/bvanderlaan/jsdoc-route-plugin#info=devDependencies