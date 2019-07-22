(function() {

  setup();

  function setup() {
    document.removeEventListener("keydown", listenForKeyCombo);
    document.addEventListener("keydown", listenForKeyCombo);
  }

  function listenForKeyCombo(e) {
    if (e.ctrlKey && e.shiftKey && e.key === "F") {
      var menus = [];
      getMenus();
      removePalette();
      createPalette();
      document.getElementById('quick-search-palette-input').focus();
    }
    if (e.key === "Escape" && document.getElementById('quick-search-palette')) {
      document.getElementById('quick-search-palette').remove();
    }
  }

  function removePalette() {
    var errorPalette = document.getElementById('quick-search-palette');
    if (errorPalette) {
      errorPalette.parentNode.removeChild(errorPalette);
    }
  }

  function createPalette() {
    var div = document.createElement("div");
    div.className = 'quick-search-palette';
    div.style.cssText = 'all: initial; padding-top: 20px; position: fixed; left: 25%; top: 25vh; width: 50%; height: 50%; z-index: 9999; border: 1rem solid rgba(0, 0, 255, 0.75); background: rgba(255,255,255,0.75); color: black; overflow-y: auto; border-radius: 5px; font-family: avenir, arial, tahoma; box-shadow: inset 0 -50px 50px -55px rgba(0, 0, 0, 1);';
    div.id = 'quick-search-palette';

    var button = document.createElement("button");
    button.className = 'quick-search-palette';
    button.innerHTML = 'X';
    button.style.cssText = 'all: initial; position: absolute; right: 1rem; background: blue; padding: 0.5rem; margin: 0.75rem; display: inline; border-radius: 5px; font-family: avenir, arial, tahoma;';
    button.title = 'Close';
    button.onclick = function() {
      removePalette();
    };
    div.appendChild(button);

    var h1 = document.createElement("H1");
    h1.className = 'quick-search-palette';
    h1.innerHTML = 'Search Menus and Links:';
    h1.style.cssText = 'all: initial; margin: 10px; font-family: avenir, arial, tahoma; font-weight: bold;';
    div.appendChild(h1);

    var searchBox = document.createElement("INPUT");
    searchBox.id = 'quick-search-palette-input';
    searchBox.style.cssText = 'all: initial !important; background: rgba(255,0,0,0.1) !important; border: solid red 1px !important; border-radius: 5px !important; padding: 5px !important; font-family: avenir, arial !important;';
    searchBox.placeholder = 'Start typing'
    searchBox.onkeyup = function() {
      document.getElementById('quick-search-palette-container').innerHTML = '';
      document.getElementById('quick-search-palette-container').innerHTML = findText(searchBox.value);
    };
    div.appendChild(searchBox);

    var resultsContainer = document.createElement("div");
    resultsContainer.className = 'quick-search-palette';
    resultsContainer.id = 'quick-search-palette-container';
    resultsContainer.style.cssText = 'float: left; width: 100%; height: 100%; padding: 0.75rem; overflow-y: auto;';

    div.appendChild(resultsContainer);

    document.body.insertBefore(div, document.body.firstChild);
  }

  function getMenus() {
    menus = [];

    var findAnyATag = true;
    var foundUrls = {};
    var openedMenu = document.querySelector("a.has-children-open");
    var collapsedMenus = document.querySelectorAll("a.has-children-closed");

    if (collapsedMenus.length > 0) {
      for (var c = 0; c < collapsedMenus.length; c++) {
        var collapsedMenu = collapsedMenus[c];
        collapsedMenu.click();

        menus = findATags('', menus, foundUrls, findAnyATag);
      }

      collapsedMenus[collapsedMenus.length - 1].click();

      if (openedMenu) {
        openedMenu.click();
      }
    } else {
      menus = findATags('', menus, foundUrls, findAnyATag);
    }
  }

  function findText(text) {
    if (text === '') {
      return '';
    } else if (text !== '' && text.length < 3) {
      return '(Keep typing)';
    }

    var results = [];

    for (var m = 0; m < menus.length; m++) {
      var content = menus[m];
      var inText = content.toLowerCase().includes(text.toLowerCase());
      var hasHref = content.includes("href");
      var href = content.match(/href=\"(.+)"/);
      var isCurrentPage = (href && href[1] === window.location.href);
      if (inText && hasHref && !isCurrentPage) {
        results.push(menus[m]);
      }
    }

    /* KEEP THIS COMMENTED CODE FOR LATER JUST IN CASE: */

    // var foundUrls = {};
    // var openedMenu = document.querySelector("a.has-children-open");
    // var collapsedMenus = document.querySelectorAll("a.has-children-closed");

    // if (collapsedMenus) {
    //   for (var c = 0; c < collapsedMenus.length; c++) {
    //     var collapsedMenu = collapsedMenus[c];
    //     collapsedMenu.click();

    //     results = findATags(text, results, foundUrls);
    //   }

    //   collapsedMenus[collapsedMenus.length - 1].click();

    //   if (openedMenu) {
    //     openedMenu.click();
    //   }
    // } else {
    //   results = findATags(text, results, foundUrls);
    // }

    if (results.length == 0) {
      return 'No results found for: ' + text;
    }

    return '<strong>(Hint: Tab or Shift+Tab)</strong><br/><br/>' + results.join('<br/><br/>');
  }

  function findATags(text, results, foundUrls, any) {
    var navs = document.querySelectorAll("a[href*='" + text + "']");
    if (any) {
      navs = document.querySelectorAll("a");
    }
    for (var i = 0; i < navs.length; i++) {
      var nav = navs[i];
      var content = nav.textContent || nav.innerText;
      var inText = content.includes(text);
      var inUrl = nav.href.includes(text);
      var isNewUrl = !(nav.href in foundUrls);
      if ((inText || inUrl) && isNewUrl) {
        foundUrls[nav.href] = true;
        results.push('<a href="' + nav.href + '">' + content + ' -> ' + nav.href + ' </a>');
      }
    }

    return results;
  }

})();