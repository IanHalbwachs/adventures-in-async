let asyncUtils = require('./asyncUtils')

asyncUtils.fetchAll((results)=>
  console.log('fetchAll results: \n', results));

asyncUtils.map(['/users/1', '/users/2', '/users/3'], asyncUtils.fetchUrl, (results)=> console.log('map results: \n', results));

asyncUtils.fetchAllPromised((results)=>
  console.log('fetchAllPromised results: \n', results));

asyncUtils.fetchAllAsyncAwait((results)=>
  console.log('fetchAllAsyncAwait results: \n',results));
