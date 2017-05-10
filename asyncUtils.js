const asyncUtils = module.exports

//original fetchUrl function
function fetchUrl(pathname, callback) {
  const responses = {
    '/users/1': { id: 1, name: 'Lisa' },
    '/users/2': { id: 2, name: 'Homer' },
    '/users/3': { id: 3, name: 'Marge' }
  };

  setTimeout(function() {
    const response = responses[pathname];
    callback(response ? null : new Error('Not Found!'), response);
  }, Math.random() * 1000);
}

//cf. readme
asyncUtils.fetchAll = function(finalCallback) {
  const results = [];
  const paths = ['/users/1', '/users/2', '/users/3'];
  const length = paths.length;
  let responses = 0;
  for (let i = 0; i < length; i++) {
   fetchUrl(paths[i], function(err, response) {
      if (err) {
        throw new Error(err + ' at ' + paths[i]);
      } else {
        results[i] = response;
        responses++;
        if (responses === length) {
          finalCallback(results);
        }
      }
    })
  }
}


//export for demonstration purposes only
asyncUtils.fetchUrl = fetchUrl;

//cf. readme
asyncUtils.map = function(valuesArray, asyncFunction, finalCallback) {
  const results = [];
  const length = valuesArray.length;
  let responses = 0;
  for (let i = 0; i < length; i++) {
   asyncFunction(valuesArray[i], function(err, response) {
      if (err) {
        throw new Error(err + ' at ' + valuesArray[i]);
      } else {
        results[i] = response;
        responses++;
        if (responses === length) {
          finalCallback(results);
        }
      }
    })
  }
}

//the following demonstrate implementations of fetchAll based on
//this promisified fetchUrl function
function fetchUrlPromise(pathname) {
  const responses = {
    '/users/1': { id: 1, name: 'Lisa' },
    '/users/2': { id: 2, name: 'Homer' },
    '/users/3': { id: 3, name: 'Marge' }
  };
  return new Promise((resolve, reject) => {
    setTimeout(function() {
      const response = responses[pathname]
      if (response) {
        resolve(response);
      } else {
        reject('Not found!');
      }
    }, Math.random() * 1000);
  });
}

const pathArray = ['/users/1', '/users/2', '/users/3'];

asyncUtils.fetchAllPromised = function(callback) {
  const promises = pathArray.map(path => fetchUrlPromise(path));
  Promise.all(promises)
  .then(result => callback(result))
  .catch(e => console.error(e));
}

asyncUtils.fetchAllAsyncAwait = async function(callback) {
  const promises = pathArray.map(path => fetchUrlPromise(path));
  try {
    result = await Promise.all(promises)
  } catch(err) {
    return console.error(err)
  }
  callback(result);
}



