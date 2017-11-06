(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = accordion;

var _preventNested = require('./../tools/preventNested');

var _preventNested2 = _interopRequireDefault(_preventNested);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var closeTab = function closeTab(tab, panel) {
  tab.setAttribute('tabindex', -1);
  tab.setAttribute('aria-expanded', false);
  panel.setAttribute('aria-hidden', true);
}; /* accordions
    ========================================================================== */

var closeTabs = function closeTabs(currentTab, tabs, panels) {
  tabs.forEach(function (tab, index) {
    if (tab !== currentTab) {
      closeTab(tab, panels[index]);
    }
  });
};

var deselectTab = function deselectTab(tab) {
  tab.setAttribute('tabindex', -1);
  tab.setAttribute('aria-selected', false);
};

var deselectTabs = function deselectTabs(tabs) {
  tabs.forEach(function (tab) {
    deselectTab(tab);
  });
};

var toggleTab = function toggleTab(tab, panel, _ref, _ref2) {
  var tabs = _ref.tabs,
      panels = _ref.panels;
  var multiselectable = _ref2.multiselectable;

  if (!multiselectable) {
    closeTabs(tab, tabs, panels);
  }

  tab.focus();
  tab.setAttribute('tabindex', 0);
  tab.setAttribute('aria-selected', true);
  tab.setAttribute('aria-expanded', tab.getAttribute('aria-expanded') !== 'true');
  panel.setAttribute('aria-hidden', panel.getAttribute('aria-hidden') !== 'true');
};

var selectTab = function selectTab(tab, tabs) {
  if (tabs) {
    deselectTabs(tabs);
    tab.focus();
  }

  tab.setAttribute('tabindex', 0);
  tab.setAttribute('aria-selected', true);
};

function accordion(component, keyCodes) {
  var tabs = (0, _preventNested2.default)(component.querySelectorAll('[role="tab"]'), component);
  var panels = (0, _preventNested2.default)(component.querySelectorAll('[role="tabpanel"]'), component);
  var tabPanels = { tabs: tabs, panels: panels };
  var firstTab = tabs[0];
  var lastTab = tabs[tabs.length - 1];
  var multiselectable = (component.getAttribute('aria-multiselectable') || 'true') === 'true';

  tabs.forEach(function (tab, index) {
    var prevTab = tabs[index - 1] || lastTab;
    var nextTab = tabs[index + 1] || firstTab;
    var panel = document.getElementById(tab.getAttribute('aria-controls'));

    // toggle tab
    tab.addEventListener('click', function (event) {
      event.preventDefault();

      toggleTab(tab, panel, tabPanels, { multiselectable: multiselectable });
    });

    tab.addEventListener('keydown', function (event) {
      if (event.which === keyCodes.enter || event.which === keyCodes.escape) {
        event.preventDefault();

        toggleTab(tab, panel, tabPanels, { multiselectable: multiselectable });
      }
    });

    // select tab
    tab.addEventListener('focus', function () {
      selectTab(tab);
    });

    // select prev tab
    tab.addEventListener('keydown', function (event) {
      if (event.which === keyCodes.left || event.which === keyCodes.up) {
        event.preventDefault();

        selectTab(prevTab, tabs);
      }
    });

    // select next tab
    tab.addEventListener('keydown', function (event) {
      if (event.which === keyCodes.right || event.which === keyCodes.down) {
        event.preventDefault();

        selectTab(nextTab, tabs);
      }
    });

    // select first tab
    tab.addEventListener('keydown', function (event) {
      if (event.which === keyCodes.home) {
        event.preventDefault();

        selectTab(firstTab, tabs);
      }
    });

    // select last tab
    tab.addEventListener('keydown', function (event) {
      if (event.which === keyCodes.end) {
        event.preventDefault();

        selectTab(lastTab, tabs);
      }
    });
  });
}

},{"./../tools/preventNested":6}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = dialog;
/* dialogs
 ========================================================================== */

var page = document.querySelector('.js-page');
var doc = document.querySelector('.js-document');

var openDialog = function openDialog(component, keyCodes) {
  var focusableElems = component.querySelectorAll('[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"]');
  var firstFocusableElem = focusableElems[0];
  var secondFocusableElem = focusableElems[1];
  var lastFocusableElem = focusableElems[focusableElems.length - 1];

  component.setAttribute('aria-hidden', false);
  doc.setAttribute('aria-hidden', true);
  page.classList.add('is-inactive');

  // return if no focusable element
  if (!firstFocusableElem) {
    return;
  }

  window.setTimeout(function () {
    if (secondFocusableElem) {
      secondFocusableElem.focus();
    } else {
      firstFocusableElem.focus();
    }

    // trapping focus inside the dialog
    focusableElems.forEach(function (focusableElem) {
      if (focusableElem.addEventListener) {
        focusableElem.addEventListener('keydown', function (event) {
          var tab = event.which === keyCodes.tab;

          if (!tab) {
            return;
          }
          if (event.shiftKey) {
            if (event.target === firstFocusableElem) {
              // shift + tab
              event.preventDefault();

              lastFocusableElem.focus();
            }
          } else if (event.target === lastFocusableElem) {
            // tab
            event.preventDefault();

            firstFocusableElem.focus();
          }
        });
      }
    });
  }, 100);
};

var closeDialog = function closeDialog(component, src) {
  var nested = (src.dataset.nested || 'false') === 'true';

  // check if dialog is inside another dialog
  if (!nested) {
    doc.setAttribute('aria-hidden', false);
    page.classList.remove('is-inactive');
  }

  component.setAttribute('aria-hidden', true);

  // restoring focus
  src.focus();
};

function dialog(src, keyCodes) {
  var component = document.querySelector('.' + src.dataset.target);
  var dismissTargets = component.querySelectorAll('[data-dismiss]');
  var overlay = src.dataset.overlay;

  // open dialog

  src.addEventListener('click', function (event) {
    event.preventDefault();

    openDialog(component, keyCodes);
  });

  src.addEventListener('keydown', function (event) {
    if (event.which === keyCodes.enter) {
      event.preventDefault();

      openDialog(component, keyCodes);
    }
  });

  // close dialog
  component.addEventListener('keydown', function (event) {
    if (event.which === keyCodes.escape) {
      closeDialog(component, src);
    }
  });

  dismissTargets.forEach(function (dismissTarget) {
    var target = document.querySelector('.' + dismissTarget.dataset.dismiss);

    dismissTarget.addEventListener('click', function (event) {
      event.preventDefault();

      closeDialog(target, src);
    });
    dismissTarget.addEventListener('keydown', function (event) {
      if (event.which === keyCodes.enter) {
        event.preventDefault();

        closeDialog(target, src);
      }
    });
  });

  window.addEventListener('click', function (event) {
    if (event.target === component && (!overlay || overlay === 'true')) {
      closeDialog(component, src);
    }
  });
}

},{}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = state;
/* states
 ========================================================================== */

var add = 'add';
var remove = 'remove';
var toggle = 'toggle';
var ariaAttributes = [{
  type: 'aria-hidden',
  init: true
}, {
  type: 'aria-disabled',
  init: true
}, {
  type: 'aria-selected',
  init: false
}, {
  type: 'aria-expanded',
  init: false
}, {
  type: 'aria-pressed',
  init: false
}, {
  type: 'aria-checked',
  init: false
}];

var setClass = function setClass(elem, stateClass, behaviour) {
  if (stateClass !== 'false') {
    if (behaviour === add) {
      elem.classList.add(stateClass);
    } else if (behaviour === remove) {
      elem.classList.remove(stateClass);
    } else {
      elem.classList.toggle(stateClass);
    }
  }
};

var setAria = function setAria(elem, behaviour) {
  ariaAttributes.forEach(function (ariaAttribute) {
    var type = ariaAttribute.type,
        init = ariaAttribute.init;


    if (elem.hasAttribute(type)) {
      if (behaviour === add) {
        elem.setAttribute(type, !init);
      } else if (behaviour === remove) {
        elem.setAttribute(type, init);
      } else {
        elem.setAttribute(type, elem.getAttribute(type) !== 'true');
      }
    }
  });
};

var setTabindex = function setTabindex(elem, tabindex, behaviour) {
  if (tabindex === 'true') {
    if (behaviour === add) {
      elem.setAttribute('tabindex', 0);
    } else if (behaviour === remove) {
      elem.setAttribute('tabindex', -1);
    } else {
      elem.setAttribute('tabindex', elem.getAttribute('tabindex') === '-1' ? 0 : -1);
    }
  }
};

var setState = function setState(parameters) {
  parameters.behaviours.forEach(function (behaviour, index) {
    var elems = document.querySelectorAll('.' + parameters.targets[index]);
    var stateClass = parameters.states[index];
    var tabindex = parameters.tabindexes !== null ? parameters.tabindexes[index] : null;

    elems.forEach(function (elem) {
      if (behaviour === add) {
        setClass(elem, stateClass, add);
        setAria(elem, add);
        setTabindex(elem, tabindex, add);
      } else if (behaviour === remove) {
        setClass(elem, stateClass, remove);
        setAria(elem, remove);
        setTabindex(elem, tabindex, remove);
      } else {
        setClass(elem, stateClass, toggle);
        setAria(elem, toggle);
        setTabindex(elem, tabindex, toggle);
      }
    });
  });
};

function state(elem, keyCodes) {
  var parameters = {
    behaviours: elem.dataset.behaviour.split(', '),
    states: elem.dataset.state.split(', '),
    tabindexes: elem.dataset.tabindex ? elem.dataset.tabindex.split(', ') : null,
    targets: elem.dataset.target.split(', ')
  };

  elem.addEventListener('click', function (event) {
    event.preventDefault();

    setState(parameters);
  });
  elem.addEventListener('keydown', function (event) {
    if (event.which === keyCodes.enter) {
      event.preventDefault();

      setState(parameters);
    }
  });
}

},{}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = tabPanel;

var _preventNested = require('./../tools/preventNested');

var _preventNested2 = _interopRequireDefault(_preventNested);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var closeTab = function closeTab(tab, panel) {
  tab.setAttribute('tabindex', -1);
  tab.setAttribute('aria-selected', false);
  panel.setAttribute('aria-hidden', true);
}; /* tab panels
    ========================================================================== */

var closeTabs = function closeTabs(tabs, panels) {
  tabs.forEach(function (tab, index) {
    closeTab(tab, panels[index]);
  });
};

var openTab = function openTab(tab, panel, _ref) {
  var tabs = _ref.tabs,
      panels = _ref.panels;

  closeTabs(tabs, panels);

  tab.focus();
  tab.setAttribute('tabindex', 0);
  tab.setAttribute('aria-selected', true);
  panel.setAttribute('aria-hidden', false);
};

function tabPanel(component, keyCodes) {
  var tabs = (0, _preventNested2.default)(component.querySelectorAll('[role="tab"]'), component);
  var panels = (0, _preventNested2.default)(component.querySelectorAll('[role="tabpanel"]'), component);
  var tabPanels = { tabs: tabs, panels: panels };
  var firstTab = tabs[0];
  var lastTab = tabs[tabs.length - 1];
  var firstPanel = document.getElementById(firstTab.getAttribute('aria-controls'));
  var lastPanel = document.getElementById(lastTab.getAttribute('aria-controls'));

  tabs.forEach(function (tab, index) {
    var prevTab = tabs[index - 1] || lastTab;
    var nextTab = tabs[index + 1] || firstTab;
    var panel = document.getElementById(tab.getAttribute('aria-controls'));
    var prevPanel = document.getElementById(prevTab.getAttribute('aria-controls'));
    var nextPanel = document.getElementById(nextTab.getAttribute('aria-controls'));

    // open tab
    tab.addEventListener('click', function (event) {
      event.preventDefault();

      openTab(tab, panel, tabPanels);
    });

    // open prev tab
    tab.addEventListener('keydown', function (event) {
      if (event.which === keyCodes.left || event.which === keyCodes.up) {
        event.preventDefault();

        openTab(prevTab, prevPanel, tabPanels);
      }
    });

    // open next tab
    tab.addEventListener('keydown', function (event) {
      if (event.which === keyCodes.right || event.which === keyCodes.down) {
        event.preventDefault();

        openTab(nextTab, nextPanel, tabPanels);
      }
    });

    // open first tab
    tab.addEventListener('keydown', function (event) {
      if (event.which === keyCodes.home) {
        event.preventDefault();

        openTab(firstTab, firstPanel, tabPanels);
      }
    });

    // open last tab
    tab.addEventListener('keydown', function (event) {
      if (event.which === keyCodes.end) {
        event.preventDefault();

        openTab(lastTab, lastPanel, tabPanels);
      }
    });
  });
}

},{"./../tools/preventNested":6}],5:[function(require,module,exports){
'use strict';

var _states = require('./components/states');

var _states2 = _interopRequireDefault(_states);

var _dialogs = require('./components/dialogs');

var _dialogs2 = _interopRequireDefault(_dialogs);

var _tabPanels = require('./components/tabPanels');

var _tabPanels2 = _interopRequireDefault(_tabPanels);

var _accordions = require('./components/accordions');

var _accordions2 = _interopRequireDefault(_accordions);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* main
 ========================================================================== */

var keyCodes = {
  tab: 9,
  enter: 13,
  escape: 27,
  end: 35,
  home: 36,
  left: 37,
  up: 38,
  right: 39,
  down: 40
};

var testComponentType = function testComponentType(component) {
  var dataComponent = component.dataset.component;

  if (dataComponent === 'state') {
    (0, _states2.default)(component, keyCodes);
  }
  if (dataComponent === 'dialog') {
    (0, _dialogs2.default)(component, keyCodes);
  }
  if (dataComponent === 'tab') {
    (0, _tabPanels2.default)(component, keyCodes);
  }
  if (dataComponent === 'accordion') {
    (0, _accordions2.default)(component, keyCodes);
  }
};

document.addEventListener('DOMContentLoaded', function () {
  var components = document.querySelectorAll('[data-component]');

  components.forEach(function (component) {
    testComponentType(component);
  });

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (component) {
        if (typeof component.getAttribute === 'function') {
          if (component.getAttribute('data-component')) {
            testComponentType(component);
          }
        }
      });
    });
  });
  observer.observe(document.body, {
    childList: true,
    subtree: true
  });
});

},{"./components/accordions":1,"./components/dialogs":2,"./components/states":3,"./components/tabPanels":4}],6:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = preventNested;
/* prevent nested
 ========================================================================== */

function preventNested(selectors, component) {
  var elems = [];

  selectors.forEach(function (selector) {
    var parent = selector.parentNode;

    while (parent !== component) {
      if (parent.dataset.component === component.dataset.component) {
        return;
      }
      parent = parent.parentNode;
    }
    elems.push(selector);
  });

  return elems;
}

},{}]},{},[5])

//# sourceMappingURL=main.js.map
