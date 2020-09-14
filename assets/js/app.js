(function() {
  var hashId = getHash();

  var mainArticleArray = [].map.call(document.querySelectorAll('.main-content > article'), function(item) {return item});
  var navArray = [];

  if (mainArticleArray.length) {
    var navListEl = createEl({
      tagName: 'ul',
      class: 'main-nav-list',
    }, document.querySelector('.main-header'));

    mainArticleArray.forEach(function (articleEl, index) {
      var articleShortName = articleEl.dataset.shortName;
      if (!articleShortName) {
        var headingEl = articleEl.querySelector('h1');
        articleShortName = headingEl ? headingEl.innerText : '???';
        articleEl.dataset.shortName = articleShortName;
      }

      var articleAnchorEl = articleEl.querySelector('a[id]') || articleEl.querySelector('a[name]');
      if (!articleAnchorEl) {
        var anchorId = articleShortName.toLowerCase().replace(/\s+/g, '-');
        articleAnchorEl = createEl({
          tagName: 'a',
          id: anchorId,
          name: anchorId,
        });
        articleEl.insertBefore(articleAnchorEl, articleEl.firstChild);
      }
      var articleId = articleAnchorEl.id || articleAnchorEl.name || null;
      articleEl.dataset.id = articleId;

      var navItemEl = createEl({
        tagName: 'li',
        class: 'main-nav-item',
        data: {
          id: articleId,
        },
      }, navListEl);
      navArray.push(navItemEl);

      var navAnchorEl = createEl({
        tagName: 'a',
        href: '#' + articleId,
        text: articleShortName,
      }, navItemEl);
      navAnchorEl.addEventListener('click', function(ev) {
        if (history.pushState) {
          ev.preventDefault();
          history.pushState(null, null, '#' + articleId);

          setActiveElement(navArray, articleId);
          setActiveElement(mainArticleArray, articleId);
        }
        else {
          location.hash = '#' + articleId;
        }
      })
    });

    setActiveElement(navArray, hashId);
    setActiveElement(mainArticleArray, hashId);
  }

  window.addEventListener('hashchange', function() {
    hashId = getHash();

    setActiveElement(navArray, hashId);
    setActiveElement(mainArticleArray, hashId);
  }, false);

  window.addEventListener('resize', function() {
    checkProductsMenu();
  }, false);

  checkProductsMenu();

  function checkProductsMenu() {
    var sideMenuEl = document.querySelector('.page-side-nav');
    var sideMenuProductsEl = sideMenuEl.querySelector('.nav-products');

    var minContentHeight = window.innerHeight - document.querySelector('.page-header').offsetHeight - document.querySelector('.page-footer').offsetHeight;

    if (sideMenuProductsEl.offsetHeight >= minContentHeight) {
      sideMenuEl.classList.remove('sticky');
      sideMenuEl.style.removeProperty('--blank-height');
    } else {
      sideMenuEl.classList.add('sticky');
      sideMenuEl.style.setProperty('--blank-height', (minContentHeight - sideMenuProductsEl.offsetHeight)/4 + 'px');
    }
  }



  function getHash() {
    return location.hash && location.hash.length > 1 ? location.hash.substring(1) : null;
  }

  function createEl(props, parentEl) {
    const el = document.createElement((props && props.tagName) || 'div');
  
    if (props) Object.keys(props).forEach(function(prop) {
      if (prop !== 'tagName') switch(prop) {
        case 'class': {
          if (typeof props[prop] === 'string') {
            el.className = props[prop];
          } else if (Array.isArray(props[prop])) {
            props[prop].forEach(function(className) {el.classList.add(className);});
          }
          break;
        }

        case 'style': {
          if (typeof props[prop] === 'string') {
            el.style.cssText = props[prop];
          } else {
            Object.keys(props[prop]).forEach(function(style) {
              el.style[style] = props[prop][style];
            });
          }
          break;
        }

        case 'text': {
          el.innerText = props[prop];
          break;
        }
  
        case 'html': {
          el.innerHTML = props[prop];
          break;
        }
  
        case 'data': {
          Object.keys(props[prop]).forEach(function(key) {el.dataset[key] = props[prop][key];});
          break;
        }
  
        default: {
          if (typeof props[prop] !== 'object') el.setAttribute(prop, props[prop]);
          break;
        }
      }
    });
  
    if (parentEl) parentEl.appendChild(el);
    return el;
  }

  function setActiveElement(elementsArray, elementDataId) {
    elementsArray.forEach(function(el, index) {
      if ( (elementDataId && el.dataset.id == elementDataId) || (!elementDataId && index == 0) ) {
        el.classList.add('active');
        el.classList.remove('inactive');
      } else {
        el.classList.remove('active');
        el.classList.add('inactive');
      }
    });
  }
})();
