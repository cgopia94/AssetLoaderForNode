var assetLoader = (function() {
  var images      = {};
  var medias      = {}; // for both audios and videos
  var fragments   = {};

  function load(url, success, fail) {  // get file names to be loaded
    var jqhxr = $.get(url);
    jqhxr
    .done(function (files) {
      doPreload(files, getParameterByName(url, 'p'), success);
    })
    .fail(function (err) {
      if (typeof fail == 'function') fail(err);
    });
  }

  function doPreload(files, path, callback) {
    path = (path || '').replace(/^\/|\/$/g, '');
    var aCnt = 0;
    function checkAssetLoadedSum() {
      aCnt--;
      if (aCnt <= 0 && typeof callback == 'function') {
        callback();
      }
    }
    files.forEach(function (e) {
      var ext = /[^.]+$/.exec(e)[0];
      var d;
      var evt;
      switch (ext) {
        
        // images
        case 'jpg': case 'png': case 'gif':
          d = new Image();
          images[path + '/' + e] = d;
          evt = 'load';
        break;

        // videos or Audio
        case 'webm': case 'mp4': case 'ogg': case 'wav':
          if (ext != 'ogg' || ext != 'wav') d = document.createElement('video');  
          else d = new Audio();
          medias[path + '/' + e] = d;
          evt = 'canplay';
        break;

        // html template
        case 'html':
          console.log('**html', e);
          aCnt++;
          $.get(path + '/' + e, function(dom) {
            fragments[path + '/' + e] = $(dom);
            checkAssetLoadedSum();
          });

        break;
      }

      if (d) {
        aCnt++;
        $(d).on(evt + ' error', function() {
          $(this).off();
          checkAssetLoadedSum();
        });
        d.src = path + '/' + e;
      }
      console.log(ext);
    });

  }

  function getParameterByName(url, name) {
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regex = new RegExp("[\\?&]" + name + "=([^&#]*)"),
        results = regex.exec(url);
    return results == null ? "" : decodeURIComponent(results[1].replace(/\+/g, " "));
  }

  return {
    load:               load,
    images:             images,
    medias:             medias,
    fragments:          fragments
  };
}());

