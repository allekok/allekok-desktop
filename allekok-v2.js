/* basic tools for main program */

/* what a useful thing! */
function null_func() { return null; }

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
  // request = encodeURIComponent(request);
  uri += `?${request}`;
  if(preventCache)  uri += `&preventCache=${Date.now()}`;
  return uri;
}

/* now that we have downloaded whatever, we should store them */

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

/* get functions, to retrieve data from Storage */

/* first retrieve data from localStorage , (synchronous) */
function get_from_localStorage (title) {
  return localStorage.getItem(title);
}

/* retrieve content from indexedDB , (asynchronous) */
function get_from_IndexedDB (title , callback) {
  ldb.get( title , callback(res) );
}

/* generalize form of retrieval */
function get (method , title , callback=null_func) {
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

/* the main part */

/* constants */
const index_title = "index";
const dest_id = "main";
const kinds = ["dead" , "alive", "pending"];
const bayt_id = 73;
const location_title = "location";


/* check whether or not "index_version" is available */
function index_version_available () {
  if( get("localStorage" , "index_version") == null ) return false;
  return true;
}
/* check whether or not "index_version" outdated */
/*    first we should retrieve index version    */
function get_index_version_from_localStorage() {
  return get("localStorage" , "index_version");
}

/* now we have to retrieve new "index_version" from server */
function download_index_version(callback=null_func) {
  var uri = "https://allekok.com/desktop/update/index/update-version.txt";
  uri = build_url(uri, "" , true);

  download(uri , function(res) {
    compare_index_versions(res, callback)
  });
}

/* now we compare the old and new version
*   if(new) update index_title , "index_version"
*   else if(not) return null
*/
/* we need a function to set new "index_version" */
/* we're going to use this after index_title has been updated */
function set_index_version_to_localStorage(new_version) {
  set("localStorage" , "index_version" , new_version);
}

/* compare versions after download "index_version" */
function compare_index_versions (new_version, callback) {
  var old_version = get_index_version_from_localStorage();
  if(new_version > old_version) {
    // update index_title
    download_index(new_version, callback);
  }

}

/* now we need a function to download index */
function download_index(new_version, callback) {
  var uri = "https://allekok.com/dev/tools/poet.php";
  var request = "poet=all";
  uri = build_url(uri , request , true);

  download(uri , function(new_index){
    set_index_to_localStorage(new_index , new_version, callback)
  });
}

/* set index_title after download */
function set_index_to_localStorage(new_index , new_version , callback) {
  set("localStorage" , index_title , new_index);
  set_index_version_to_localStorage(new_version);
  callback();
}

/* latest location */
function set_location ( L ) {
  /* L Structure: {"code to evaluate()" => ["index()", "poet(n)", ...]} */
  set("localStorage" , location_title , L);
}
function latest_location () {
  var loc = get("localStorage" , location_title);
  if(loc != null) {
    eval(loc);
  } else {
    index();
  }
}
/* end latest location */

/* index(kind = "dead") */
function index(kind=kinds[0]) {
  if(index_version_available()) {
    show_index(kind);
  }
  else {
    download_index_version(show_index);
  }
}

/* now retrieve index_title */
function get_index_from_localStorage(j) {
  var index = get("localStorage" , index_title);
  if(j) return JSON.parse(index);
  return index;
}

/* print index page */
function show_index(kind=kinds[0]) {
  var index = get_index_from_localStorage(true);

  var dest = document.getElementById(dest_id);

  var inner_dest = "";
  var IDs = [];

  for(var i in index) {
    if( index[i].kind == kind) {
      inner_dest += `<div role='button' onclick='poet(${index[i].id})' class='poet'>
      <img id='${index[i].id}' src='./back.jpg'>
      <h3>${index[i].takh}</h3>
      </div>`;

      IDs.push(index[i].id);
    }
  }

  // define kind =>
  var kind_dest = kinds[1], kind_txt = "شاعیرانی نوێ";
  if(kind == kinds[1]) {
    kind_dest = kinds[0]; kind_txt = "شاعیرانی کۆچ‌کردوو";
  }

  inner_dest += `<footer>
      <button type="button" onclick="index('${kind_dest}');">
          ${kind_txt}
      </button>
      <button type="button" onclick="bayt()">
          بەیتی کوردی
      </button>
  </footer>`;

  dest.innerHTML = inner_dest;

  // set latest location
  set_location(`index('${kind}')`);

  // load images
  // poets_images(IDs);
}

/* check for updates after first initialization */
function update_index(callback=null_func) {
  if(index_version_available()){
    download_index_version(callback);
  }

}

/* download and retrieve all poet's images */
/* first we should retrieve image version */
function get_poet_image_version (p) {
  return get("localStorage" , `img_version_${p}`);
}
/* now we should check if "img_[poetID]" is available */
function poet_image_version_available(p) {
  if(get_poet_image_version(p) != null) return true;
  return false;
}
/* actually we don't need to check "img_${poetID}" itself. because img_version_${poetID}
* only sets when image itself has been downloaded successfully. */

/* we need this function to prevent from re-downloading [no-image] alternative */
/* and downloading it just once */
function poet_has_image(p) {
  var index = get_index_from_localStorage(true);
  var poet_img = index[poet_ID_to_index(p)].img.x130_130;
  if( poet_img.substr(-6) == "_0.jpg" ) return false;
  return true;
}

/* now let's download image */
function download_poet_image(p , callback) {
  var uri = "https://allekok.com/dev/tools/img-to-b64.php";
  var request = `pt=${p}`;
  uri = build_url(uri, request , true);

  download(uri , callback);
}

/* download poet img version */
function download_poet_image_version(p , callback) {
  var uri = "https://allekok.com/desktop/update/imgs/update-version.txt";
  uri = build_url(uri , "" , true);

  download(uri , callback);
}

/* poet(poetID) */
/* convert poet's index to his ID */
function poet_index_to_ID(i) {
  return get_index_from_localStorage(true)[i].id;
}
/* convert poet's ID to his index */
function poet_ID_to_index(ID) {
  var index = get_index_from_localStorage(true);
  for(var i in index) {
    if(index[i].id == ID) return i;
  }
}
