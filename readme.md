Hello Button!

I'm assuming the clients for this project are end users and that browser compatibility is therefore a priority. I'll start then with a function that solves the Ask explicitly and should work in any browser:

```javascript
//declare provided fetchUrl in scope
function fetchUrl(pathname, callback) {
  var responses = {
    '/users/1': { id: 1, name: 'Lisa' },
    '/users/2': { id: 2, name: 'Homer' },
    '/users/3': { id: 3, name: 'Marge' }
  };

  setTimeout(function() {
    var response = responses[pathname];
    callback(response ? null : new Error('Not Found!'), response);
  }, Math.random() * 10000);
}

function fetchAll(finalCallback) {
  var results = []; // array with which finalCallback will eventually be invoked
  var paths = ['/users/1', '/users/2', '/users/3'];
  var length = paths.length;
  var responses = 0;
  for (var i = 0; i < length; i++) {
    // IIFE to get around function scope limitations of var
    (function(i){
     fetchUrl(paths[i], function(err, response) {
        //code in this block will happen asynchronously
        if (err) {
          //helpful error message
          throw new Error(err + ' at ' + paths[i]);
        } else {
          // ensures results will be in order
          results[i] = response;
          // keep track of how many responses we've gotten so far
          responses++;
          // if we've gotten them all, invoke finalCallback
          if (responses === length) {
            finalCallback(results);
          }
        }
      })
    })(i);
  }
}
```
then we can simply


```javascript
fetchAll(console.log);
//later...
//[ { id: 1, name: 'Lisa' }, { id: 2, name: 'Homer' }, { id: 3, name: 'Marge' } ]
```

But that's a lot of of code for something so specific. I used my own implementation of the async library's .map function, which I'll include since it's self-contained, browser-friendly, and reusable with an arbitrary number of values and any error-first asyncronous function (such as fetchUrl):

```javascript
function asyncMap(valuesArray, asyncFunction, finalCallback) {
  var results = []; // array with which finalCallback will eventually be invoked
  var length = valuesArray.length;
  var responses = 0;
  for (var i = 0; i < length; i++) {
    // IIFE to get around function scope limitations of var
    (function(i){
     asyncFunction(valuesArray[i], function(err, response) {
        //code in this block will happen asynchronously
        if (err) {
          //helpful error message
          throw new Error(err + ' at ' + valuesArray[i]);
        } else {
          // ensures results will be in order
          results[i] = response;
          // keep track of how many responses we've gotten so far
          responses++;
          // if we've gotten them all, invoke finalCallback
          if (responses === length) {
            finalCallback(results);
          }
        }
      });
    })(i);
  }
}
```
You can pass it fetchUrl to do the same thing:

```javascript
asyncMap(['/users/1', '/users/2', '/users/3'], fetchUrl, console.log);
// later...
// [ { id: 1, name: 'Lisa' }, { id: 2, name: 'Homer' }, { id: 3, name: 'Marge' } ]
```

Or reuse it like this with another function:

```javascript
function asyncAddTen(n, callback) {
  setTimeout(function() {
    var response = n + 10;
    callback(null, response);
  }, Math.random() * 1000);
}

asyncMap([1, 2, 3, 4, 5], asyncAddTen, console.log);
// later...
// [11, 12, 13, 14, 15]
```

How's that for handy? Speaking of reusability, and since the other challenges rely on a more robust runtime, I've bundled these and the following in ```asyncUtils.js``` so they can be imported and put to use.

```javascript
const asyncUtils = require('./asyncUtils');
```
The following functions will (eventually) log the same result:
```javascript
asyncUtils.fetchAll(console.log);

asyncUtils.map(['/users/1', '/users/2', '/users/3'], fetchUrl, console.log);

asyncUtils.fetchAllPromised(console.log);

asyncUtils.fetchAllAsyncAwait(console.log);
```
