(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

/* app
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

},{"./components/accordions":2,"./components/dialogs":3,"./components/states":4,"./components/tabPanels":5}],2:[function(require,module,exports){
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

},{"./../tools/preventNested":6}],3:[function(require,module,exports){
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

},{}],4:[function(require,module,exports){
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

},{}],5:[function(require,module,exports){
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

  var _ref2 = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : {},
      _ref2$focus = _ref2.focus,
      focus = _ref2$focus === undefined ? false : _ref2$focus;

  closeTabs(tabs, panels);

  if (focus) {
    tab.focus();
  }

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

        openTab(prevTab, prevPanel, tabPanels, { focus: true });
      }
    });

    // open next tab
    tab.addEventListener('keydown', function (event) {
      if (event.which === keyCodes.right || event.which === keyCodes.down) {
        event.preventDefault();

        openTab(nextTab, nextPanel, tabPanels, { focus: true });
      }
    });

    // open first tab
    tab.addEventListener('keydown', function (event) {
      if (event.which === keyCodes.home) {
        event.preventDefault();

        openTab(firstTab, firstPanel, tabPanels, { focus: true });
      }
    });

    // open last tab
    tab.addEventListener('keydown', function (event) {
      if (event.which === keyCodes.end) {
        event.preventDefault();

        openTab(lastTab, lastPanel, tabPanels, { focus: true });
      }
    });
  });
}

},{"./../tools/preventNested":6}],6:[function(require,module,exports){
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYXBwLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvYWNjb3JkaW9ucy5qcyIsInNyYy9qcy9jb21wb25lbnRzL2RpYWxvZ3MuanMiLCJzcmMvanMvY29tcG9uZW50cy9zdGF0ZXMuanMiLCJzcmMvanMvY29tcG9uZW50cy90YWJQYW5lbHMuanMiLCJzcmMvanMvdG9vbHMvcHJldmVudE5lc3RlZC5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDR0E7Ozs7QUFDQTs7OztBQUNBOzs7O0FBQ0E7Ozs7OztBQU5BOzs7QUFRQSxJQUFNLFdBQVc7QUFDZixPQUFLLENBRFU7QUFFZixTQUFPLEVBRlE7QUFHZixVQUFRLEVBSE87QUFJZixPQUFLLEVBSlU7QUFLZixRQUFNLEVBTFM7QUFNZixRQUFNLEVBTlM7QUFPZixNQUFJLEVBUFc7QUFRZixTQUFPLEVBUlE7QUFTZixRQUFNO0FBVFMsQ0FBakI7O0FBWUEsSUFBTSxvQkFBb0IsU0FBcEIsaUJBQW9CLENBQVUsU0FBVixFQUFxQjtBQUM3QyxNQUFNLGdCQUFnQixVQUFVLE9BQVYsQ0FBa0IsU0FBeEM7O0FBRUEsTUFBSSxrQkFBa0IsT0FBdEIsRUFBK0I7QUFDN0IsMEJBQU0sU0FBTixFQUFpQixRQUFqQjtBQUNEO0FBQ0QsTUFBSSxrQkFBa0IsUUFBdEIsRUFBZ0M7QUFDOUIsMkJBQU8sU0FBUCxFQUFrQixRQUFsQjtBQUNEO0FBQ0QsTUFBSSxrQkFBa0IsS0FBdEIsRUFBNkI7QUFDM0IsNkJBQVMsU0FBVCxFQUFvQixRQUFwQjtBQUNEO0FBQ0QsTUFBSSxrQkFBa0IsV0FBdEIsRUFBbUM7QUFDakMsOEJBQVUsU0FBVixFQUFxQixRQUFyQjtBQUNEO0FBQ0YsQ0FmRDs7QUFpQkEsU0FBUyxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsWUFBTTtBQUNsRCxNQUFNLGFBQWEsU0FBUyxnQkFBVCxDQUEwQixrQkFBMUIs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QUNELEdBVkQ7O0FBWUEsU0FBTyxLQUFQO0FBQ0QiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLyogYXBwXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuaW1wb3J0IHN0YXRlIGZyb20gJy4vY29tcG9uZW50cy9zdGF0ZXMnO1xuaW1wb3J0IGRpYWxvZyBmcm9tICcuL2NvbXBvbmVudHMvZGlhbG9ncyc7XG5pbXBvcnQgdGFiUGFuZWwgZnJvbSAnLi9jb21wb25lbnRzL3RhYlBhbmVscyc7XG5pbXBvcnQgYWNjb3JkaW9uIGZyb20gJy4vY29tcG9uZW50cy9hY2NvcmRpb25zJztcblxuY29uc3Qga2V5Q29kZXMgPSB7XG4gIHRhYjogOSxcbiAgZW50ZXI6IDEzLFxuICBlc2NhcGU6IDI3LFxuICBlbmQ6IDM1LFxuICBob21lOiAzNixcbiAgbGVmdDogMzcsXG4gIHVwOiAzOCxcbiAgcmlnaHQ6IDM5LFxuICBkb3duOiA0MCxcbn07XG5cbmNvbnN0IHRlc3RDb21wb25lbnRUeXBlID0gZnVuY3Rpb24gKGNvbXBvbmVudCkge1xuICBjb25zdCBkYXRhQ29tcG9uZW50ID0gY29tcG9uZW50LmRhdGFzZXQuY29tcG9uZW50O1xuXG4gIGlmIChkYXRhQ29tcG9uZW50ID09PSAnc3RhdGUnKSB7XG4gICAgc3RhdGUoY29tcG9uZW50LCBrZXlDb2Rlcyk7XG4gIH1cbiAgaWYgKGRhdGFDb21wb25lbnQgPT09ICdkaWFsb2cnKSB7XG4gICAgZGlhbG9nKGNvbXBvbmVudCwga2V5Q29kZXMpO1xuICB9XG4gIGlmIChkYXRhQ29tcG9uZW50ID09PSAndGFiJykge1xuICAgIHRhYlBhbmVsKGNvbXBvbmVudCwga2V5Q29kZXMpO1xuICB9XG4gIGlmIChkYXRhQ29tcG9uZW50ID09PSAnYWNjb3JkaW9uJykge1xuICAgIGFjY29yZGlvbihjb21wb25lbnQsIGtleUNvZGVzKTtcbiAgfVxufTtcblxuZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignRE9NQ29udGVudExvYWRlZCcsICgpID0+IHtcbiAgY29uc3QgY29tcG9uZW50cyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWNvbXBvbmVudF0nKTtcblxuICBjb21wb25lbnRzLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgIHRlc3RDb21wb25lbnRUeXBlKGNvbXBvbmVudCk7XG4gIH0pO1xuXG4gIGNvbnN0IG9ic2VydmVyID0gbmV3IE11dGF0aW9uT2JzZXJ2ZXIoKG11dGF0aW9ucykgPT4ge1xuICAgIG11dGF0aW9ucy5mb3JFYWNoKChtdXRhdGlvbikgPT4ge1xuICAgICAgbXV0YXRpb24uYWRkZWROb2Rlcy5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICAgICAgaWYgKHR5cGVvZiBjb21wb25lbnQuZ2V0QXR0cmlidXRlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgaWYgKGNvbXBvbmVudC5nZXRBdHRyaWJ1dGUoJ2RhdGEtY29tcG9uZW50JykpIHtcbiAgICAgICAgICAgIHRlc3RDb21wb25lbnRUeXBlKGNvbXBvbmVudCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9KTtcbiAgICB9KTtcbiAgfSk7XG4gIG9ic2VydmVyLm9ic2VydmUoZG9jdW1lbnQuYm9keSwge1xuICAgIGNoaWxkTGlzdDogdHJ1ZSxcbiAgICBzdWJ0cmVlOiB0cnVlLFxuICB9KTtcbn0pO1xuIiwiLyogYWNjb3JkaW9uc1xuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbmltcG9ydCBwcmV2ZW50TmVzdGVkIGZyb20gJy4vLi4vdG9vbHMvcHJldmVudE5lc3RlZCc7XG5cbmNvbnN0IGNsb3NlVGFiID0gZnVuY3Rpb24gKHRhYiwgcGFuZWwpIHtcbiAgdGFiLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAtMSk7XG4gIHRhYi5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCBmYWxzZSk7XG4gIHBhbmVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcbn07XG5cbmNvbnN0IGNsb3NlVGFicyA9IGZ1bmN0aW9uIChjdXJyZW50VGFiLCB0YWJzLCBwYW5lbHMpIHtcbiAgdGFicy5mb3JFYWNoKCh0YWIsIGluZGV4KSA9PiB7XG4gICAgaWYgKHRhYiAhPT0gY3VycmVudFRhYikge1xuICAgICAgY2xvc2VUYWIodGFiLCBwYW5lbHNbaW5kZXhdKTtcbiAgICB9XG4gIH0pO1xufTtcblxuY29uc3QgZGVzZWxlY3RUYWIgPSBmdW5jdGlvbiAodGFiKSB7XG4gIHRhYi5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgLTEpO1xuICB0YWIuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgZmFsc2UpO1xufTtcblxuY29uc3QgZGVzZWxlY3RUYWJzID0gZnVuY3Rpb24gKHRhYnMpIHtcbiAgdGFicy5mb3JFYWNoKCh0YWIpID0+IHtcbiAgICBkZXNlbGVjdFRhYih0YWIpO1xuICB9KTtcbn07XG5cbmNvbnN0IHRvZ2dsZVRhYiA9IGZ1bmN0aW9uICh0YWIsIHBhbmVsLCB7IHRhYnMsIHBhbmVscyB9LCB7IG11bHRpc2VsZWN0YWJsZSB9KSB7XG4gIGlmICghbXVsdGlzZWxlY3RhYmxlKSB7XG4gICAgY2xvc2VUYWJzKHRhYiwgdGFicywgcGFuZWxzKTtcbiAgfVxuXG4gIHRhYi5mb2N1cygpO1xuICB0YWIuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIDApO1xuICB0YWIuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgdHJ1ZSk7XG4gIHRhYi5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCB0YWIuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgIT09ICd0cnVlJyk7XG4gIHBhbmVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBwYW5lbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykgIT09ICd0cnVlJyk7XG59O1xuXG5jb25zdCBzZWxlY3RUYWIgPSBmdW5jdGlvbiAodGFiLCB0YWJzKSB7XG4gIGlmICh0YWJzKSB7XG4gICAgZGVzZWxlY3RUYWJzKHRhYnMpO1xuICAgIHRhYi5mb2N1cygpO1xuICB9XG5cbiAgdGFiLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAwKTtcbiAgdGFiLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIHRydWUpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYWNjb3JkaW9uKGNvbXBvbmVudCwga2V5Q29kZXMpIHtcbiAgY29uc3QgdGFicyA9IHByZXZlbnROZXN0ZWQoY29tcG9uZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tyb2xlPVwidGFiXCJdJyksIGNvbXBvbmVudCk7XG4gIGNvbnN0IHBhbmVscyA9IHByZXZlbnROZXN0ZWQoY29tcG9uZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tyb2xlPVwidGFicGFuZWxcIl0nKSwgY29tcG9uZW50KTtcbiAgY29uc3QgdGFiUGFuZWxzID0geyB0YWJzLCBwYW5lbHMgfTtcbiAgY29uc3QgZmlyc3RUYWIgPSB0YWJzWzBdO1xuICBjb25zdCBsYXN0VGFiID0gdGFic1t0YWJzLmxlbmd0aCAtIDFdO1xuICBjb25zdCBtdWx0aXNlbGVjdGFibGUgPSAoY29tcG9uZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1tdWx0aXNlbGVjdGFibGUnKSB8fCAndHJ1ZScpID09PSAndHJ1ZSc7XG5cbiAgdGFicy5mb3JFYWNoKCh0YWIsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgcHJldlRhYiA9IHRhYnNbaW5kZXggLSAxXSB8fCBsYXN0VGFiO1xuICAgIGNvbnN0IG5leHRUYWIgPSB0YWJzW2luZGV4ICsgMV0gfHwgZmlyc3RUYWI7XG4gICAgY29uc3QgcGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YWIuZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJykpO1xuXG4gICAgLy8gdG9nZ2xlIHRhYlxuICAgIHRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdG9nZ2xlVGFiKHRhYiwgcGFuZWwsIHRhYlBhbmVscywgeyBtdWx0aXNlbGVjdGFibGUgfSk7XG4gICAgfSk7XG5cbiAgICB0YWIuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LndoaWNoID09PSBrZXlDb2Rlcy5lbnRlciB8fCBldmVudC53aGljaCA9PT0ga2V5Q29kZXMuZXNjYXBlKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgdG9nZ2xlVGFiKHRhYiwgcGFuZWwsIHRhYlBhbmVscywgeyBtdWx0aXNlbGVjdGFibGUgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBzZWxlY3QgdGFiXG4gICAgdGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgKCkgPT4ge1xuICAgICAgc2VsZWN0VGFiKHRhYik7XG4gICAgfSk7XG5cbiAgICAvLyBzZWxlY3QgcHJldiB0YWJcbiAgICB0YWIuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LndoaWNoID09PSBrZXlDb2Rlcy5sZWZ0IHx8IGV2ZW50LndoaWNoID09PSBrZXlDb2Rlcy51cCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHNlbGVjdFRhYihwcmV2VGFiLCB0YWJzKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIHNlbGVjdCBuZXh0IHRhYlxuICAgIHRhYi5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQud2hpY2ggPT09IGtleUNvZGVzLnJpZ2h0IHx8IGV2ZW50LndoaWNoID09PSBrZXlDb2Rlcy5kb3duKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgc2VsZWN0VGFiKG5leHRUYWIsIHRhYnMpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gc2VsZWN0IGZpcnN0IHRhYlxuICAgIHRhYi5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQud2hpY2ggPT09IGtleUNvZGVzLmhvbWUpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBzZWxlY3RUYWIoZmlyc3RUYWIsIHRhYnMpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gc2VsZWN0IGxhc3QgdGFiXG4gICAgdGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC53aGljaCA9PT0ga2V5Q29kZXMuZW5kKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgc2VsZWN0VGFiKGxhc3RUYWIsIHRhYnMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cbiIsIi8qIGRpYWxvZ3NcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5jb25zdCBwYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXBhZ2UnKTtcbmNvbnN0IGRvYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1kb2N1bWVudCcpO1xuXG5jb25zdCBvcGVuRGlhbG9nID0gZnVuY3Rpb24gKGNvbXBvbmVudCwga2V5Q29kZXMpIHtcbiAgY29uc3QgZm9jdXNhYmxlRWxlbXMgPSBjb21wb25lbnQucXVlcnlTZWxlY3RvckFsbCgnW2hyZWZdLCBidXR0b24sIGlucHV0LCBzZWxlY3QsIHRleHRhcmVhLCBbdGFiaW5kZXhdOm5vdChbdGFiaW5kZXg9XCItMVwiXScpO1xuICBjb25zdCBmaXJzdEZvY3VzYWJsZUVsZW0gPSBmb2N1c2FibGVFbGVtc1swXTtcbiAgY29uc3Qgc2Vjb25kRm9jdXNhYmxlRWxlbSA9IGZvY3VzYWJsZUVsZW1zWzFdO1xuICBjb25zdCBsYXN0Rm9jdXNhYmxlRWxlbSA9IGZvY3VzYWJsZUVsZW1zW2ZvY3VzYWJsZUVsZW1zLmxlbmd0aCAtIDFdO1xuXG4gIGNvbXBvbmVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZmFsc2UpO1xuICBkb2Muc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHRydWUpO1xuICBwYWdlLmNsYXNzTGlzdC5hZGQoJ2lzLWluYWN0aXZlJyk7XG5cbiAgLy8gcmV0dXJuIGlmIG5vIGZvY3VzYWJsZSBlbGVtZW50XG4gIGlmICghZmlyc3RGb2N1c2FibGVFbGVtKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGlmIChzZWNvbmRGb2N1c2FibGVFbGVtKSB7XG4gICAgICBzZWNvbmRGb2N1c2FibGVFbGVtLmZvY3VzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpcnN0Rm9jdXNhYmxlRWxlbS5mb2N1cygpO1xuICAgIH1cblxuICAgIC8vIHRyYXBwaW5nIGZvY3VzIGluc2lkZSB0aGUgZGlhbG9nXG4gICAgZm9jdXNhYmxlRWxlbXMuZm9yRWFjaCgoZm9jdXNhYmxlRWxlbSkgPT4ge1xuICAgICAgaWYgKGZvY3VzYWJsZUVsZW0uYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICBmb2N1c2FibGVFbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCB0YWIgPSBldmVudC53aGljaCA9PT0ga2V5Q29kZXMudGFiO1xuXG4gICAgICAgICAgaWYgKCF0YWIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQudGFyZ2V0ID09PSBmaXJzdEZvY3VzYWJsZUVsZW0pIHsgLy8gc2hpZnQgKyB0YWJcbiAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICBsYXN0Rm9jdXNhYmxlRWxlbS5mb2N1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQudGFyZ2V0ID09PSBsYXN0Rm9jdXNhYmxlRWxlbSkgeyAvLyB0YWJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGZpcnN0Rm9jdXNhYmxlRWxlbS5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sIDEwMCk7XG59O1xuXG5jb25zdCBjbG9zZURpYWxvZyA9IGZ1bmN0aW9uIChjb21wb25lbnQsIHNyYykge1xuICBjb25zdCBuZXN0ZWQgPSAoc3JjLmRhdGFzZXQubmVzdGVkIHx8ICdmYWxzZScpID09PSAndHJ1ZSc7XG5cbiAgLy8gY2hlY2sgaWYgZGlhbG9nIGlzIGluc2lkZSBhbm90aGVyIGRpYWxvZ1xuICBpZiAoIW5lc3RlZCkge1xuICAgIGRvYy5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZmFsc2UpO1xuICAgIHBhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnaXMtaW5hY3RpdmUnKTtcbiAgfVxuXG4gIGNvbXBvbmVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG5cbiAgLy8gcmVzdG9yaW5nIGZvY3VzXG4gIHNyYy5mb2N1cygpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGlhbG9nKHNyYywga2V5Q29kZXMpIHtcbiAgY29uc3QgY29tcG9uZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLiR7c3JjLmRhdGFzZXQudGFyZ2V0fWApO1xuICBjb25zdCBkaXNtaXNzVGFyZ2V0cyA9IGNvbXBvbmVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1kaXNtaXNzXScpO1xuICBjb25zdCB7IG92ZXJsYXkgfSA9IHNyYy5kYXRhc2V0O1xuXG4gIC8vIG9wZW4gZGlhbG9nXG4gIHNyYy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBvcGVuRGlhbG9nKGNvbXBvbmVudCwga2V5Q29kZXMpO1xuICB9KTtcblxuICBzcmMuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgIGlmIChldmVudC53aGljaCA9PT0ga2V5Q29kZXMuZW50ZXIpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIG9wZW5EaWFsb2coY29tcG9uZW50LCBrZXlDb2Rlcyk7XG4gICAgfVxuICB9KTtcblxuICAvLyBjbG9zZSBkaWFsb2dcbiAgY29tcG9uZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICBpZiAoZXZlbnQud2hpY2ggPT09IGtleUNvZGVzLmVzY2FwZSkge1xuICAgICAgY2xvc2VEaWFsb2coY29tcG9uZW50LCBzcmMpO1xuICAgIH1cbiAgfSk7XG5cbiAgZGlzbWlzc1RhcmdldHMuZm9yRWFjaCgoZGlzbWlzc1RhcmdldCkgPT4ge1xuICAgIGNvbnN0IHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC4ke2Rpc21pc3NUYXJnZXQuZGF0YXNldC5kaXNtaXNzfWApO1xuXG4gICAgZGlzbWlzc1RhcmdldC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgY2xvc2VEaWFsb2codGFyZ2V0LCBzcmMpO1xuICAgIH0pO1xuICAgIGRpc21pc3NUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LndoaWNoID09PSBrZXlDb2Rlcy5lbnRlcikge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGNsb3NlRGlhbG9nKHRhcmdldCwgc3JjKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gY29tcG9uZW50ICYmICghb3ZlcmxheSB8fCBvdmVybGF5ID09PSAndHJ1ZScpKSB7XG4gICAgICBjbG9zZURpYWxvZyhjb21wb25lbnQsIHNyYyk7XG4gICAgfVxuICB9KTtcbn1cbiIsIi8qIHN0YXRlc1xuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbmNvbnN0IGFkZCA9ICdhZGQnO1xuY29uc3QgcmVtb3ZlID0gJ3JlbW92ZSc7XG5jb25zdCB0b2dnbGUgPSAndG9nZ2xlJztcbmNvbnN0IGFyaWFBdHRyaWJ1dGVzID0gW1xuICB7XG4gICAgdHlwZTogJ2FyaWEtaGlkZGVuJyxcbiAgICBpbml0OiB0cnVlLFxuICB9LFxuICB7XG4gICAgdHlwZTogJ2FyaWEtZGlzYWJsZWQnLFxuICAgIGluaXQ6IHRydWUsXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnYXJpYS1zZWxlY3RlZCcsXG4gICAgaW5pdDogZmFsc2UsXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnYXJpYS1leHBhbmRlZCcsXG4gICAgaW5pdDogZmFsc2UsXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnYXJpYS1wcmVzc2VkJyxcbiAgICBpbml0OiBmYWxzZSxcbiAgfSxcbiAge1xuICAgIHR5cGU6ICdhcmlhLWNoZWNrZWQnLFxuICAgIGluaXQ6IGZhbHNlLFxuICB9LFxuXTtcblxuY29uc3Qgc2V0Q2xhc3MgPSBmdW5jdGlvbiAoZWxlbSwgc3RhdGVDbGFzcywgYmVoYXZpb3VyKSB7XG4gIGlmIChzdGF0ZUNsYXNzICE9PSAnZmFsc2UnKSB7XG4gICAgaWYgKGJlaGF2aW91ciA9PT0gYWRkKSB7XG4gICAgICBlbGVtLmNsYXNzTGlzdC5hZGQoc3RhdGVDbGFzcyk7XG4gICAgfSBlbHNlIGlmIChiZWhhdmlvdXIgPT09IHJlbW92ZSkge1xuICAgICAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKHN0YXRlQ2xhc3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtLmNsYXNzTGlzdC50b2dnbGUoc3RhdGVDbGFzcyk7XG4gICAgfVxuICB9XG59O1xuXG5jb25zdCBzZXRBcmlhID0gZnVuY3Rpb24gKGVsZW0sIGJlaGF2aW91cikge1xuICBhcmlhQXR0cmlidXRlcy5mb3JFYWNoKChhcmlhQXR0cmlidXRlKSA9PiB7XG4gICAgY29uc3QgeyB0eXBlLCBpbml0IH0gPSBhcmlhQXR0cmlidXRlO1xuXG4gICAgaWYgKGVsZW0uaGFzQXR0cmlidXRlKHR5cGUpKSB7XG4gICAgICBpZiAoYmVoYXZpb3VyID09PSBhZGQpIHtcbiAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUodHlwZSwgIWluaXQpO1xuICAgICAgfSBlbHNlIGlmIChiZWhhdmlvdXIgPT09IHJlbW92ZSkge1xuICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZSh0eXBlLCBpbml0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKHR5cGUsIGVsZW0uZ2V0QXR0cmlidXRlKHR5cGUpICE9PSAndHJ1ZScpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59O1xuXG5jb25zdCBzZXRUYWJpbmRleCA9IGZ1bmN0aW9uIChlbGVtLCB0YWJpbmRleCwgYmVoYXZpb3VyKSB7XG4gIGlmICh0YWJpbmRleCA9PT0gJ3RydWUnKSB7XG4gICAgaWYgKGJlaGF2aW91ciA9PT0gYWRkKSB7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAwKTtcbiAgICB9IGVsc2UgaWYgKGJlaGF2aW91ciA9PT0gcmVtb3ZlKSB7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAtMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW0uc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIGVsZW0uZ2V0QXR0cmlidXRlKCd0YWJpbmRleCcpID09PSAnLTEnID8gMCA6IC0xKTtcbiAgICB9XG4gIH1cbn07XG5cbmNvbnN0IHNldFN0YXRlID0gZnVuY3Rpb24gKHBhcmFtZXRlcnMpIHtcbiAgcGFyYW1ldGVycy5iZWhhdmlvdXJzLmZvckVhY2goKGJlaGF2aW91ciwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBlbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke3BhcmFtZXRlcnMudGFyZ2V0c1tpbmRleF19YCk7XG4gICAgY29uc3Qgc3RhdGVDbGFzcyA9IHBhcmFtZXRlcnMuc3RhdGVzW2luZGV4XTtcbiAgICBjb25zdCB0YWJpbmRleCA9IHBhcmFtZXRlcnMudGFiaW5kZXhlcyAhPT0gbnVsbCA/IHBhcmFtZXRlcnMudGFiaW5kZXhlc1tpbmRleF0gOiBudWxsO1xuXG4gICAgZWxlbXMuZm9yRWFjaCgoZWxlbSkgPT4ge1xuICAgICAgaWYgKGJlaGF2aW91ciA9PT0gYWRkKSB7XG4gICAgICAgIHNldENsYXNzKGVsZW0sIHN0YXRlQ2xhc3MsIGFkZCk7XG4gICAgICAgIHNldEFyaWEoZWxlbSwgYWRkKTtcbiAgICAgICAgc2V0VGFiaW5kZXgoZWxlbSwgdGFiaW5kZXgsIGFkZCk7XG4gICAgICB9IGVsc2UgaWYgKGJlaGF2aW91ciA9PT0gcmVtb3ZlKSB7XG4gICAgICAgIHNldENsYXNzKGVsZW0sIHN0YXRlQ2xhc3MsIHJlbW92ZSk7XG4gICAgICAgIHNldEFyaWEoZWxlbSwgcmVtb3ZlKTtcbiAgICAgICAgc2V0VGFiaW5kZXgoZWxlbSwgdGFiaW5kZXgsIHJlbW92ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZXRDbGFzcyhlbGVtLCBzdGF0ZUNsYXNzLCB0b2dnbGUpO1xuICAgICAgICBzZXRBcmlhKGVsZW0sIHRvZ2dsZSk7XG4gICAgICAgIHNldFRhYmluZGV4KGVsZW0sIHRhYmluZGV4LCB0b2dnbGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHN0YXRlKGVsZW0sIGtleUNvZGVzKSB7XG4gIGNvbnN0IHBhcmFtZXRlcnMgPSB7XG4gICAgYmVoYXZpb3VyczogZWxlbS5kYXRhc2V0LmJlaGF2aW91ci5zcGxpdCgnLCAnKSxcbiAgICBzdGF0ZXM6IGVsZW0uZGF0YXNldC5zdGF0ZS5zcGxpdCgnLCAnKSxcbiAgICB0YWJpbmRleGVzOiBlbGVtLmRhdGFzZXQudGFiaW5kZXggPyBlbGVtLmRhdGFzZXQudGFiaW5kZXguc3BsaXQoJywgJykgOiBudWxsLFxuICAgIHRhcmdldHM6IGVsZW0uZGF0YXNldC50YXJnZXQuc3BsaXQoJywgJyksXG4gIH07XG5cbiAgZWxlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBzZXRTdGF0ZShwYXJhbWV0ZXJzKTtcbiAgfSk7XG4gIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgIGlmIChldmVudC53aGljaCA9PT0ga2V5Q29kZXMuZW50ZXIpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIHNldFN0YXRlKHBhcmFtZXRlcnMpO1xuICAgIH1cbiAgfSk7XG59XG4iLCIvKiB0YWIgcGFuZWxzXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuaW1wb3J0IHByZXZlbnROZXN0ZWQgZnJvbSAnLi8uLi90b29scy9wcmV2ZW50TmVzdGVkJztcblxuY29uc3QgY2xvc2VUYWIgPSBmdW5jdGlvbiAodGFiLCBwYW5lbCkge1xuICB0YWIuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIC0xKTtcbiAgdGFiLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIGZhbHNlKTtcbiAgcGFuZWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHRydWUpO1xufTtcblxuY29uc3QgY2xvc2VUYWJzID0gZnVuY3Rpb24gKHRhYnMsIHBhbmVscykge1xuICB0YWJzLmZvckVhY2goKHRhYiwgaW5kZXgpID0+IHtcbiAgICBjbG9zZVRhYih0YWIsIHBhbmVsc1tpbmRleF0pO1xuICB9KTtcbn07XG5cbmNvbnN0IG9wZW5UYWIgPSBmdW5jdGlvbiAodGFiLCBwYW5lbCwgeyB0YWJzLCBwYW5lbHMgfSwgeyBmb2N1cyA9IGZhbHNlIH0gPSB7fSkge1xuICBjbG9zZVRhYnModGFicywgcGFuZWxzKTtcblxuICBpZiAoZm9jdXMpIHtcbiAgICB0YWIuZm9jdXMoKTtcbiAgfVxuXG4gIHRhYi5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgMCk7XG4gIHRhYi5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCB0cnVlKTtcbiAgcGFuZWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIGZhbHNlKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRhYlBhbmVsKGNvbXBvbmVudCwga2V5Q29kZXMpIHtcbiAgY29uc3QgdGFicyA9IHByZXZlbnROZXN0ZWQoY29tcG9uZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tyb2xlPVwidGFiXCJdJyksIGNvbXBvbmVudCk7XG4gIGNvbnN0IHBhbmVscyA9IHByZXZlbnROZXN0ZWQoY29tcG9uZW50LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tyb2xlPVwidGFicGFuZWxcIl0nKSwgY29tcG9uZW50KTtcbiAgY29uc3QgdGFiUGFuZWxzID0geyB0YWJzLCBwYW5lbHMgfTtcbiAgY29uc3QgZmlyc3RUYWIgPSB0YWJzWzBdO1xuICBjb25zdCBsYXN0VGFiID0gdGFic1t0YWJzLmxlbmd0aCAtIDFdO1xuICBjb25zdCBmaXJzdFBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZmlyc3RUYWIuZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJykpO1xuICBjb25zdCBsYXN0UGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChsYXN0VGFiLmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpKTtcblxuICB0YWJzLmZvckVhY2goKHRhYiwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBwcmV2VGFiID0gdGFic1tpbmRleCAtIDFdIHx8IGxhc3RUYWI7XG4gICAgY29uc3QgbmV4dFRhYiA9IHRhYnNbaW5kZXggKyAxXSB8fCBmaXJzdFRhYjtcbiAgICBjb25zdCBwYW5lbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhYi5nZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnKSk7XG4gICAgY29uc3QgcHJldlBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocHJldlRhYi5nZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnKSk7XG4gICAgY29uc3QgbmV4dFBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmV4dFRhYi5nZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnKSk7XG5cbiAgICAvLyBvcGVuIHRhYlxuICAgIHRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgb3BlblRhYih0YWIsIHBhbmVsLCB0YWJQYW5lbHMpO1xuICAgIH0pO1xuXG4gICAgLy8gb3BlbiBwcmV2IHRhYlxuICAgIHRhYi5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQud2hpY2ggPT09IGtleUNvZGVzLmxlZnQgfHwgZXZlbnQud2hpY2ggPT09IGtleUNvZGVzLnVwKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgb3BlblRhYihwcmV2VGFiLCBwcmV2UGFuZWwsIHRhYlBhbmVscywgeyBmb2N1czogdHJ1ZSB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIG9wZW4gbmV4dCB0YWJcbiAgICB0YWIuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LndoaWNoID09PSBrZXlDb2Rlcy5yaWdodCB8fCBldmVudC53aGljaCA9PT0ga2V5Q29kZXMuZG93bikge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIG9wZW5UYWIobmV4dFRhYiwgbmV4dFBhbmVsLCB0YWJQYW5lbHMsIHsgZm9jdXM6IHRydWUgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBvcGVuIGZpcnN0IHRhYlxuICAgIHRhYi5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQud2hpY2ggPT09IGtleUNvZGVzLmhvbWUpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBvcGVuVGFiKGZpcnN0VGFiLCBmaXJzdFBhbmVsLCB0YWJQYW5lbHMsIHsgZm9jdXM6IHRydWUgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBvcGVuIGxhc3QgdGFiXG4gICAgdGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC53aGljaCA9PT0ga2V5Q29kZXMuZW5kKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgb3BlblRhYihsYXN0VGFiLCBsYXN0UGFuZWwsIHRhYlBhbmVscywgeyBmb2N1czogdHJ1ZSB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG4iLCIvKiBwcmV2ZW50IG5lc3RlZFxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHByZXZlbnROZXN0ZWQoc2VsZWN0b3JzLCBjb21wb25lbnQpIHtcbiAgY29uc3QgZWxlbXMgPSBbXTtcblxuICBzZWxlY3RvcnMuZm9yRWFjaCgoc2VsZWN0b3IpID0+IHtcbiAgICBsZXQgcGFyZW50ID0gc2VsZWN0b3IucGFyZW50Tm9kZTtcblxuICAgIHdoaWxlIChwYXJlbnQgIT09IGNvbXBvbmVudCkge1xuICAgICAgaWYgKHBhcmVudC5kYXRhc2V0LmNvbXBvbmVudCA9PT0gY29tcG9uZW50LmRhdGFzZXQuY29tcG9uZW50KSB7XG4gICAgICAgIHJldHVybjtcbiAgICAgIH1cbiAgICAgIHBhcmVudCA9IHBhcmVudC5wYXJlbnROb2RlO1xuICAgIH1cbiAgICBlbGVtcy5wdXNoKHNlbGVjdG9yKTtcbiAgfSk7XG5cbiAgcmV0dXJuIGVsZW1zO1xufVxuIl19
