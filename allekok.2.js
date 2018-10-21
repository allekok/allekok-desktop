/* what a useful thing! */
function null_func(n) {
  return null;
}

/* use case: download poets, books, poems, updates , etc. */

function download( uri , onload=null_func , onprogress=null_func , onerror=null_func ) {
  var client = new XMLHttpRequest();

  client.open( "get" , uri );
  client.onprogress = function (e) {
    onprogress(e);
  }
  client.onload = function () {
    if(this.status === 200) {
      onload( this.responseText );
    }
  }
  client.onerror = function (e) {
    onerror(e);
  }

  client.send();
}

/* let's write a function that can make urls ready to go! */

function build_url ( uri , request , preventCache ) {
  request = encodeURIComponent(request);
  uri += "?" + request;
  if(preventCache)  uri += "&preventCache=" + Date.now();
  return uri;
}

/* now that we have downloaded whatever we wanted, we should store them */

/* using localStorage to store small amount of data */
function set_to_localStorage( title , content) {
  localStorage.setItem( title , content );
}

/* using indexedDB to store large amount of data */
// https://github.com/DVLP/localStorageDB
!function(){function e(t,o){return n?void(n.transaction("s").objectStore("s").get(t).onsuccess=function(e){var t=e.target.result&&e.target.result.v||null;o(t)}):void setTimeout(function(){e(t,o)},100)}var t=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB;if(!t)return void console.error("indexDB not supported");var n,o={k:"",v:""},r=t.open("d2",1);r.onsuccess=function(e){n=this.result},r.onerror=function(e){console.error("indexedDB request error"),console.log(e)},r.onupgradeneeded=function(e){n=null;var t=e.target.result.createObjectStore("s",{keyPath:"k"});t.transaction.oncomplete=function(e){n=e.target.db}},window.ldb={get:e,set:function(e,t){o.k=e,o.v=t,n.transaction("s","readwrite").objectStore("s").put(o)}}}();

function set_to_IndexedDB( title , content ) {
  ldb.set( title , content );
}

/* more generalized form of store */
function set (method , title , content) {
  method = method.toLowerCase();
  if(method === "localstorage") {
    set_to_localStorage ( title , content );
  }
  else if ( method === "indexeddb") {
    set_to_IndexedDB ( title , content );
  }
  else {
    error("set function, method is undefined.");
  }
}

/* now let's define error function. to log errors in console */

function error (context) {
  console.log(`error: ${context}`);
}

/***********************************************************/

/* get functions, to retrieve data from Storage */


/* first retrieve data from localStorage , (synchronous) */
function get_from_localStorage (title) {
  return localStorage.getItem(title);
}

/* retrieve content from indexedDB , (asynchronous) */
function get_from_IndexedDB (title , callback) {
  ldb.get( title , callback() );
}

/* generalize form of retrieval */
function get (method , title , callback) {
  method = method.toLowerCase();

  if( method === "localstorage" ) {
    return get_from_localStorage(title);
  }
  else if (method === "indexeddb") {
    get_from_IndexedDB(title , callback);
  }
  else {
    error("get function, method is undefined.")
  }
}

/***********************************************************/

/* first thing that we need to do is download poets. one by one for now. */

/*function download_poet( p , callback ) {
  download_poet_meta(p , callback);
  download_poet_image(p , callback);
}*/

/* download meta data about one poet defined by "p", the ID. */
function download_poet_meta ( p , callback ) {
  var uri = "https://allekok.com/dev/tools/poet.php";
  var request = `poet=${p}`;
  uri = build_url( uri , request , true );

  download( uri , function(res) {
    set_poet_meta_to_localStorage(p , res , callback);
  });
}

/* title = `${p}` */
function set_poet_meta_to_localStorage ( p , res , callback ) {
  set("localStorage" , p , res);
  callback();
}

/* download poet's image defined by his ID */
function download_poet_image( p , callback ) {
  var uri = "https://allekok.com/dev/tools/img-to-b64.php";
  var request = `pt=${p}`;
  uri = build_url(uri , request , true);

  download( uri , function(res) {
    set_poet_image_to_IndexedDB( p , res , callback);
  });
}

/* title = `img_${p}` */
function set_poet_image_to_IndexedDB(p , res , callback) {
  set("IndexedDB" , `img_${p}` , res);
  callback();
}

function download_all_poets_meta ( k , callback ) {
  var uri = "https://allekok.com/dev/tools/poet.php";
  var request = `poet=all&k=${k}`;
  uri = build_url(uri , request , true);

  download( uri , function(res) {
    set_all_poets_meta_to_localStorage(res , callback);
  });
}
