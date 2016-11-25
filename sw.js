var cacheName = "ng-3";
var cacheFiles = [
'index.html',
'js/app.js',
];

this.addEventListener('install', event => {
  console.log('installed', event);
  event.waitUntil(
  	caches.open(cacheName).then(cache=>{
  		return cache.addAll(cacheFiles);
  	})
  )
});

this.addEventListener('activate', event => {
  console.log('Event Activated', event);
  event.waitUntil(
  	caches.keys().then(cacheNames=>{
  			return Promise.all(
  				cacheNames.
  				filter(cacheNameVar => (cacheNameVar.startsWith('ng'))).
  				filter(cacheNameVar => (cacheNameVar !== cacheName)).
  				map(c1 => caches.delete(c1))
  			)
  	})
  )
});
this.addEventListener('fetch', event => {
  //console.log('fetch Activated', event);
  //console.log(event.request.url);
  	event.respondWith(
  		caches.match(event.request).then(resp=> {
		  return resp || fetch(event.request).then(r=> {
		    caches.open(cacheName).then(cache=> {
		      cache.put(event.request, r);
		    });
		    return r.clone();
		  });
		}).catch(error =>{ return error;})
  	)
});
