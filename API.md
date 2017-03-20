# API Reference <!-- This title stays the same probably -->

<!-- Auto Table of Contents. Use doctoc: https://github.com/thlorenz/doctoc -->
<!-- START doctoc generated TOC please keep comment here to allow auto update -->

<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

In order to start using `toki-method-http`, you should...<!-- Description on how to setup and initialize your thing -->

## toki-method-http

## Properties <!-- Public properties if you have any -->

```
{
    name: 'my-action-name' //name your action
    inputConfiguration: { //configuration for making our request
        url: 'http://target/path' //target URL
        passThroughHeaders: true //true if we want to pass all incoming request headers along, or an array of the ones we want to pass
        headers: {'X-Authorization': 'Bearer MyApiKey'} //headers to add
        payload: true //pass along the incoming request body? Template literals are also acceptable
        method: 'post' //any valid http method
        type: 'json' //JSON is default
    }
    clientResponseConfiguration: //any valid template or literal to give back to the client, true to return the output of the request unmodified
}
```
