# toki-method-http <!-- Repo Name -->
> Toki method for making HTTP requests <!-- Repo Brief Description -->

<!-- Long Description -->
This is a toki method for making http requests. It supports any valid http method, custom payloads to the endpoint, and custom responses both back to the toki context and if desired, to the originally requesting client.

<!-- Maintainer (Hint, probably you) -->
Lead Maintainer: [Derrick Hinkle](https://github.com/dhinklexo)

<!-- Badges Go Here -->

<!-- Badge from https://badge.fury.io/ -->
<!-- Build Status from Travis -->
<!-- Security Scan from Snyk.io -->
<!-- Security Scan from NSP -->

<!-- End Badges -->
<!-- Quick Example -->
## Example
```Javascript
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
<!-- Customize this if needed -->
More examples can be found in [the examples document](Example.md) and the full api in the [API documentation](API.md).

<!-- Anything Else (Sponsors, Links, Etc) -->
