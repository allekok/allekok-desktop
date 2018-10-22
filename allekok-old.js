//conts
const loading = "<div class='loading'></div>";
const progressBar = "<progress class='prb'></progress>";

// https://github.com/DVLP/localStorageDB
!function(){function e(t,o){return n?void(n.transaction("s").objectStore("s").get(t).onsuccess=function(e){var t=e.target.result&&e.target.result.v||null;o(t)}):void setTimeout(function(){e(t,o)},100)}var t=window.indexedDB||window.mozIndexedDB||window.webkitIndexedDB||window.msIndexedDB;if(!t)return void console.error("indexDB not supported");var n,o={k:"",v:""},r=t.open("d2",1);r.onsuccess=function(e){n=this.result},r.onerror=function(e){console.error("indexedDB request error"),console.log(e)},r.onupgradeneeded=function(e){n=null;var t=e.target.result.createObjectStore("s",{keyPath:"k"});t.transaction.oncomplete=function(e){n=e.target.db}},window.ldb={get:e,set:function(e,t){o.k=e,o.v=t,n.transaction("s","readwrite").objectStore("s").put(o)}}}();


// index

function get_index(j) {
  var idx = localStorage.getItem("index");
  if ( j ) {
    return JSON.parse(idx);
  }
  return idx;
}

function id_to_index ( pID ) {
  var idx = get_index(true);
  for (var i = 0; i < idx.length; i++) {
    if( pID == i.id )  return i;
  }
  return 0;
}

function index(k = "dead") {

    var idx = get_index();
    var t = document.querySelector("#main");
    var res = "";
    t.style.animation = "none";
    void t.offsetWidth;
    t.innerHTML = loading;

    if(idx == null) {
        get_index_version();
    }
    else {

        idx = JSON.parse(idx);

        var arr = [];
        for(var p = 0; p < idx.length; p++) {

          var pID = index_to_id(p);

            if(k == idx[p].kind) {
                res += `<div role='button' onclick='poet(${pID})' class='poet'>
                <img id='${pID}' src='./back.jpg'>
                <h3>${idx[p].takh}</h3>
                </div>`;

                arr.push(pID);
            }
        }

        if( k == "alive" ) {
          var k_txt = "شاعیرانی کۆچ‌کردوو";
          var k_dist = "dead";
        } else {
          var k_txt = "شاعیرانی نوێ";
          var k_dist = "alive";
        }

        res += `<footer>
            <button type="button" onclick="index('${k_dist}');">
                ${k_txt}
            </button>
            <button type="button" onclick="bayt()">
                بەیتی کوردی
            </button>
        </footer>`;

        t.innerHTML = res;
        t.style.animation = "fade .2s";

        var location = {ki:"index", kind:k};
        set_location(location);

        poet_imgs(arr);
    }
}

function isJSON (json) {
    try {
        JSON.parse(json);
    }
    catch(e) {
        console.log(e);
        return false;
    }

    return true;
}

function download_index() {
    var uri = "https://allekok.com/dev/tools/poet.php?poet=all" + "&preventCache="+Date.now();
    var http = new XMLHttpRequest();

    http.onload = function () {
        var res = this.responseText;

        localStorage.setItem("index", res);
        index();
    }

    http.open("get" , uri);
    http.send();
}

function get_index_version() {
  var uri = "https://allekok.com/desktop/update/index/update-version.txt" + "?preventCache="+Date.now();
  var http = new XMLHttpRequest();
  http.open("get" , uri );
  http.onload = function () {
    localStorage.setItem("index_update_version" , parseInt(this.responseText) );
    download_index();
  }

  http.send();
}

// bayt

function bayt ( bayt_id=73 ) {
  poet(bayt_id);
}

// poet

function get_poet ( pID ) {
  return get_index(true)[id_to_index(pID)];
}

function poet ( pID ) {
  var t = document.querySelector("#main");
  var res = "";

  t.style.animation = "none";
  void t.offsetWidth;
  t.innerHTML = loading;

  p = get_poet(pID);

  res += `<div>
  <div id='poet_pic'>
  <img id='${pID}' src='./back.jpg'>
  </div>
  <div id='adrs'>
  <button type='button' onclick='index(${p.kind})'>
  ئاڵەکۆک
  </button>
  &rsaquo;
  <div id='current_location'>${p.profname}</div>
  </div>
  <div id='poet_books'>
  <p style='background-color:${p.colors[0]}; color:${p.colors[1]};'>
  بەرهەمەکانی
  ${p.profname}
  </p>`;

  for(var b = 0; b < p.bks.length; b++) {
      res += `<button type='button' onclick='check_books_version(${pID},${bookID(b)});book(${pID},${bookID(b)});'>${p.bks[b]}</button>`;
  }

  res += `</div>
  </div>
  <div id='poet_info'>`;

  for(var h = 0; h < p.hdesc.length; h++) {
      res += `<div class='poet_info_row'>${p.hdesc[h]}</div>`;
  }

  res += `</div>`;

  t.innerHTML = res;
  t.style.animation = "fade .2s";

  var location = {ki:"poet",pt:pID};
  set_location(location);

  poet_img(pID);
}

// book

function book(pID , bID) {
  var ldb_name = `book_${pID}_${bID}`;

  var t = document.querySelector("#main");
  t.style.animation = "none";
  void t.offsetWidth;
  t.innerHTML = loading;

  ldb.get(ldb_name , function(bk) {
    res = "";

    if( bk == null ) {
        get_books_version(pID , bID);
    }
    else {

      bk = JSON.parse(bk);
      pt = get_poet(pID);

      res += `<div>
      <div id='poet_pic'>
      <img id='${pID}' src='./back.jpg'>
      </div>
      <div id='book_info'>
      <div id='adrs'>
      <button type='button' onclick='index(${pt.kind})'>
      ئاڵەکۆک
      </button>
      &rsaquo;
      <button type='button' onclick='poet(${pID})'>
      ${bk.poet}
      </button>
      &rsaquo;
      <div id='current_location'>${bk.book}</div>
      </div>
      </div>
      </div>
      <div id='book_poems'>`;

      for(var m = 0; m < bk.poems.length; m++) {
          res += `<button class='pm' type='button' onclick='poem(${pID},${bID},${bookID(m)})'>${num_convert(bk.poems[m].id)}. ${bk.poems[m].name}</button>`;
      }

      res += `</div>`;

      t.innerHTML = res;
      t.style.animation = "fade .2s";

      var location = {ki:"book",pt:p,bk:b};
      set_location(location);

      poet_img(pID);
    }
  });

}

function bookID ( b ) {
  return ++b;
}

function bookIndex ( bID ) {
  return --b;
}

function index_to_id ( p ) {
  var idx = get_index(true);
  return idx[p].id;
}


function download_book(pID , bID) {
	var t = document.querySelector("#main");
	t.innerHTML = progressBar;
	var prb = document.querySelector(".prb");

  var uri = `https://allekok.com/dev/tools/poem.php?poet=${pID}&book=${bID}&poem=all&html` + "&preventCache="+Date.now();
  var http = new XMLHttpRequest();

	http.open("get", uri);
	http.onprogress = function(pe) {
		var contentLength;
		if (pe.lengthComputable) {
		    contentLength = pe.total;
		} else {
		    contentLength = parseInt(pe.target.getResponseHeader('x-con-len'));
		}
		prb.max = contentLength;
		prb.value = pe.loaded;
	}
  http.onload = function() {
    var ldb_name = `book_${pID}_${bID}`;
    ldb.set(ldb_name, this.responseText);
    book(pID , bID);
  }

  http.send();
}

function get_books_version( pID , bID ) {
  var uri = "https://allekok.com/desktop/update/books/update-version.txt" + "?preventCache="+Date.now();
  var http = new XMLHttpRequest();

  http.open("get" , uri );
  http.onload = function () {
    localStorage.setItem(`book_${pID}_${bID}_update_version` , parseInt(this.responseText) );
    download_book( pID , bID );
  }

  http.send();
}

// poem

function poem (pID , bID , mID) {
    var ldb_name = `book_${pID}_${bID}`;

    ldb.get(ldb_name , function(bk) {
      bk = JSON.parse(bk);
      var pm = bk.poems[bookIndex(mID)];

      var res = "";
      var t = document.querySelector("#main");
      t.style.animation = "none";
      void t.offsetWidth;

      if(pm == null) {
          return;
      }

      pt = get_poet(pID);

      res += `<div>
      <div id='poem_info'>
      <div id='poet_pic'>
      <img id='${pID}' src='./back.jpg'>
      </div>
      <div id='adrs'>
      <button type='button' onclick='index(${pt.kind})'>
      ئاڵەکۆک
      </button>
      &rsaquo;
      <button type='button' onclick='poet(${pID})'>${bk.poet}</button>
      &rsaquo;
      <button type='button' onclick='book(${pID},${bID})'>${bk.book}</button>
      &rsaquo;
      <div id='current_location'>${num_convert(pm.id)}. ${pm.name}</div>
      </div>
      </div>
      </div>
      <div id='poem_nav'>
      <button type='button' onclick='poem(${pID},${bID},${mID-1})' id='nav_prev'> &lsaquo; </button>
      <button type='button' onclick='poem(${pID},${bID},${mID+1})' id='nav_next'> &rsaquo; </button>
      </div>
      <div id='poem_tools'>
      <button type='button' onclick="save_fs('bigger')" id='fs_bigger'>
      گەورەتر
      </button>
      <button type='button' onclick="save_fs('smaller')" id='fs_smaller'>
      بچوک‌تر
      </button>
      </div>
      <div id='poem_context'>${pm.hon}</div>`;
      if(pm.hdesc != "") {
      	res += `<div id='poem_desc'>${pm.hdesc}</div>`;
      }

      t.innerHTML = res;
      t.style.animation = "fade .2s";
      get_fs();

      var location = {ki:"poem",pt:p,bk:b,pm:m};
      set_location(location);

      poet_img(p);
    });

}

// check for updates

// update index

// work with this
function check_index_version() {
  var idx = get_index();
  if( idx == null ) return;

  var uri = "https://allekok.com/desktop/update/index/update-version.txt" + "?preventCache="+Date.now();;
  var http = new XMLHttpRequest();

  http.open("get" , uri);
  http.onload = function () {
    var old_ver = localStorage.getItem("index_update_version");
    var new_ver = parseInt(this.responseText);

    if(old_ver == new_ver)  return;

    update_index(new_ver);
  }

  http.send();
}

function update_index( new_ver ) {
  var uri = `https://allekok.com/dev/tools/poet.php?poet=all` + "&preventCache="+Date.now();
  var http = new XMLHttpRequest();
  http.open("get", uri);
  http.onload = function() {
    localStorage.setItem("index_update_version" , new_ver);
    localStorage.setItem("index", this.responseText);
  }

  http.send();
}

// work with this
function check_books_version ( pID , bID ) {
  ldb.get(`book_${pID}_${bID}` , function(bk){
    if(bk == null)  return;

    var ldb_name = `book_${pID}_${bID}_update_version`;
    var old_ver = localStorage.getItem(ldb_name);
    var uri = `https://allekok.com/desktop/update/books/update-version.txt` + "?preventCache="+Date.now();
    var http = new XMLHttpRequest();

    http.open("get", uri);
    http.onload = function () {
      var new_ver = parseInt(this.responseText);
      if(old_ver == new_ver)  return;

      check_book_version( pID , bID , new_ver , old_ver );
    }

    http.send();
  });
}

function check_book_version( pID , bID , new_ver ,old_ver ) {
  var uri = `https://allekok.com/desktop/update/books/update-log.php?ver=${old_ver}&pt=${pID}&bk=${bID}` + "&preventCache="+Date.now();
  var http = new XMLHttpRequest();

  http.open("get" , uri);
  http.onload = function () {
    if(this.responseText == "true") {
      update_book(pID , bID , new_ver);
    }
  }

  http.send();
}

function update_book(pID,bID,new_ver) {
  var ldb_baseName = `book_${pID}_${bID}`;
  var uri = `https://allekok.com/dev/tools/poem.php?poet=${pID}&book=${bID}&poem=all&html` + "&preventCache="+Date.now();
  var http = new XMLHttpRequest();

  http.open("get" , uri);
  http.onload = function () {
    ldb.set(ldb_baseName , this.responseText);
    localStorage.setItem(`${ldb_baseName}_update_version` , new_ver);
  }

  http.send();
}

// search

function search(q , pt="all", bk="all", num_pt=10, num_bk=15, num_pm=20, k=3) {

}

function search_poets(q , pt_num=10 , k=1, san=0) {

    if(q == "") return;

    if(san == 1) {
        q = san_data(q);
    } else if(san == 2) {
        q = san_data(q, true);
    }

    var pts = localStorage.getItem("index");
    pts = JSON.parse(pts);

    var pts_res = [];
    var takh, profname, name, hdesc;

    var count = 0;
    for(var i=0; i < pts.length; i++) {
        if(count == pt_num) break;
        if( k != 2 ) {
            if(san == 1) {
                takh = san_data(pts[i].takh);
                profname = san_data(pts[i].profname);
            } else if(san == 2) {
                takh = san_data(pts[i].takh, true);
                profname = san_data(pts[i].profname, true);
            } else {
                takh = pts[i].takh;
                profname = pts[i].profname;
            }

            if( takh.indexOf(q) != -1 || profname.indexOf(q) !=-1 ) {
                pts_res.push([i,pts[i]]);
                count++;
            }
        }

        if( k != 1 ) {
            pts[i].hdesc = pts[i].hdesc.join("");
            if(san == 1) {
                name = san_data(pts[i].name);
                hdesc = san_data(pts[i].hdesc);
            } else if(san == 2) {
                name = san_data(pts[i].name, true);
                hdesc = san_data(pts[i].hdesc, true);
            } else {
                name = pts[i].name;
                hdesc = pts[i].hdesc;
            }

            if( name.indexOf(q) != -1 || hdesc.indexOf(q) != -1 ) {
                pts_res.push([i,pts[i]]);
                count++;
            }
        }
    }

    return pts_res;
}

function search_books (q , pt="all", bk_num=10, k=1, san=0) {

    if(q == "") return;

    if(san == 1) {
        q = san_data(q);
    } else if(san == 2) {
        q = san_data(q , true);
    }

    var idx = get_index();
    idx = JSON.parse(idx);
    var pts = [];
    if( pt == "all" ) {
        pts = idx;
    } else {
        pts.push(idx[pt]);
    }

    var bk, bkdesc;
    var bks_res = [];
    var count = 0;
    for(var i in pts) {
        for(var j in pts[i].bks) {
            if(count == bk_num) break;
            if(k != 2) {
                if(san == 1) {
                    bk = san_data(pts[i].bks[j]);
                } else if(san == 2) {
                    bk = san_data(pts[i].bks[j] ,true);
                } else {
                    bk = pts[i].bks[j];
                }

                if( bk.indexOf(q) != -1 ) {
                    bks_res.push([i,j,pts[i]]);
                    count++;
                }
            }
            if(k != 1) {
                if(san == 1) {
                    bkdesc = pts[i].bksdesc[j] != null ? san_data(pts[i].bksdesc[j]) : "";
                } else if(san == 2) {
                    bkdesc = pts[i].bksdesc[j] != null ? san_data(pts[i].bksdesc[j], true) : "";
                } else {
                    bkdesc = pts[i].bksdesc[j] != null ? pts[i].bksdesc[j] : "";
                }

                if( bkdesc.indexOf(q) != -1 ) {
                    bks_res.push([i,j,pts[i]]);
                    count++;
                }
            }
        }

    }

    return bks_res;
}

// tools

function poet_imgs ( arr ) {
  arr.forEach(function(pID) {
    poet_img(pID);
  });
}

function poet_img(pID) {
  var dist = document.getElementById(`${pID}`);

  ldb.get(`img_${pID}` , function(img) {

    if(img == null) {
      get_poet_img(pID);
    }
    else {
      dist.src = "data:image/jpeg;base64," + img;
    }
  });

}

function get_poet_img (pID) {

  var uri = `https://allekok.com/dev/tools/img-to-b64.php?pt=${pID}` + "&preventCache="+Date.now();
  var http = new XMLHttpRequest();

  http.open("get" , uri);
  http.onload = function () {
    ldb.set(`img_${pID}`, this.responseText);
    if(pID==1) get_poet_img_version();
  }

  http.send();
}

function get_poet_img_version() {
  if(localStorage.getItem(`imgs_update_version`) != null) return;
  var uri = "https://allekok.com/desktop/update/imgs/update-version.txt" + "?preventCache="+Date.now();
  var http = new XMLHttpRequest();

  http.open("get" , uri );
  http.onload = function () {
    localStorage.setItem(`imgs_update_version` , parseInt(this.responseText) );
  }

  http.send();
}

function check_poets_img_update_all () {
  if(localStorage.getItem("imgs_update_version") == null) return;
  var uri = "https://allekok.com/desktop/update/imgs/update-version.txt" + "?preventCache="+Date.now();
  var old_ver = localStorage.getItem("imgs_update_version");
  var idx = get_index(true);
  http = new XMLHttpRequest();
  http.onload = function () {
    var new_ver = parseInt(this.responseText);
    for(var p in idx) {
      if(old_ver != new_ver) {
        check_poet_img_update(index_to_id(p) , new_ver, old_ver);
      }
    }
  }
  http.open("get" , uri);
  http.send();
}

function check_poet_img_update(pID , new_ver, old_ver) {
  var uri = `https://allekok.com/desktop/update/imgs/update-log.php?ver=${old_ver}&pt=${pID}` + "&preventCache="+Date.now();
  var http = new XMLHttpRequest();
  http.onload = function () {
    if(this.responseText == "true") {
      update_poet_img(pID, new_ver);
    }
  }
  http.open("get" , uri);
  http.send();
}

function update_poet_img (pID, new_ver) {

  var idx = get_index(true);
  var uri = `https://allekok.com/dev/tools/img-to-b64.php?pt=${pID}` + "&preventCache="+Date.now();
  var http = new XMLHttpRequest();
  http.onload = function () {
    ldb.set(`img_${pID}`, this.responseText);
    localStorage.setItem( `imgs_update_version` , new_ver );
  }
  http.open("get" , uri);
  http.send();
}


function num_convert(inp) {

    var en_num = [/0/g,/1/g,/2/g,/3/g,/4/g,/5/g,/6/g,/7/g,/8/g,/9/g];
    var ku_num = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];
    var ar_num = [/٠/g,/١/g,/٢/g,/٣/g,/٤/g,/٥/g,/٦/g,/٧/g,/٨/g,/٩/g];

    for(var i in en_num) {
        inp = inp.replace(en_num[i] , ku_num[i]);
        inp = inp.replace(ar_num[i] , ku_num[i]);
    }

    return inp;
}

function san_data(inp , lastChance=false) {
    if (inp == "")  return "";

    var extras = [/&laquo;/g,/&raquo;/g,/&rsaquo;/g,/&lsaquo;/g,/&bull;/g,/&nbsp;/g,/\?/g, /!/g, /#/g, /&/g, /\*/g, /\(/g, /\)/g, /-/g, /\+/g, /=/g, /_/g,/\[/g, /\]/g, /{/g, /}/g,/</g,/>/g, /\//g, /\|/, /\'/g, /\"/g, /;/g, /:/g, /,/g, /\./g, /~/g, /`/g,/؟/g, /،/g, /»/g, /«/g, /ـ/g, /›/g, /‹/g, /•/g, /‌/g,
    /؛/g,
    ];
    var ar_signs =['ِ', 'ُ', 'ٓ', 'ٰ', 'ْ', 'ٌ', 'ٍ', 'ً', 'ّ', 'َ'];

    var kurdish_letters = [
    	"ه",
    	"ه",
    	"ک",
    	"ی",
    	"ه",
    	"ز",
    	"س",
    	"ت",
    	"ز",
    	"ر",
    	"ه",
    	"خ",
    	"و",
    	"و",
    	"و",
    	"ی",
    	"ر",
    	"ل",
    	"ز",
    	"س",
    	"ه",
    	"ر",
    	"م",
    	"ا",
    	"ا",
    	"ل",
    	"س",
    	"ی",
    	"و",
    	"ئ",
    	"ی",
    ];

    var other_letters = [
    	/ه‌/g,
    	/ە/g,
    	/ك/g,
    	/ي/g,
    	/ھ/g,
    	/ض/g,
    	/ص/g,
    	/ط/g,
    	/ظ/g,
    	/ڕ/g,
    	/ح/g,
    	/غ/g,
    	/وو/g,
    	/ۆ/g,
    	/ؤ/g,
    	/ێ/g,
    	/ڕ/g,
    	/ڵ/g,
    	/ذ/g,
    	/ث/g,
    	/ة/g,
    	/رر/g,
    	/مم/g,
    	/أ/g,
    	/آ/g,
    	/لل/g,
    	/سس/g,
    	/یی/g,
    	/ڤ/g,
    	/ع/g,
    	/ى/g,
    ];

    for (var i in extras) {
        inp = inp.replace(extras[i] , "");
    }

    for (i in ar_signs) {
        inp = inp.replace(ar_signs[i] , "");
    }

    for(i in kurdish_letters) {
        inp = inp.replace(other_letters[i], kurdish_letters[i]);
    }

    inp = num_convert(inp);

    if(lastChance == true)  inp = inp.replace(/ه/g , "");

    return inp;
}

function save_fs(how) {
    // save_fs Function, saves changes of poem's font size into localStorage.

    var hon=document.getElementById("poem_context");
    var fs=parseInt(hon.style.fontSize);
    var wW = window.innerWidth;
    var newfs = 0;
    var hows = ["smaller", "bigger"];
    var scale = 3;

    if(isNaN(fs)){
        if(wW > 600){
            fs=20.8;
        } else {
            fs=15.6;
        }
    }

    /// make font size bigger
    if(hows.indexOf(how) === 1){
        if(fs >= 120){
            return;
        }

    newfs = fs + scale;

    /// make font size smaller
    } else if(hows.indexOf(how) === 0){
        if(fs<=6){
            return;
        }
        newfs = fs - scale;
    }

    localStorage.setItem("fontsize", newfs);
    hon.style.fontSize = newfs + "px";
}
function get_fs() {
	var lsfs = localStorage.getItem('fontsize');
  var hhon = document.getElementById('poem_context');
  if (lsfs != null && !isNaN(lsfs) && hhon !=null) {

      hhon.style.fontSize=lsfs+'px';
	}
}

function set_location(obj) {
    obj = JSON.stringify(obj);
    localStorage.setItem("last_location" , obj);
}
function last_location() {
    var ll = localStorage.getItem("last_location");
    if(ll == null)  return;
    ll = JSON.parse(ll);

    if( ll["ki"] == "index" ) {
        index(ll["kind"]);
    }
    else if( ll["ki"] == "poet" ) {
        poet(ll["pt"]);
    }
    else if( ll["ki"] == "book" ) {
        book(ll["pt"] , ll["bk"]);
    }
    else if( ll["ki"] == "poem" ) {
        poem(ll["pt"], ll["bk"], ll["pm"]);
    }
}
