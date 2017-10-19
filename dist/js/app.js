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
/* accordions
 ========================================================================== */

var closeTab = function closeTab(tab, panel) {
  tab.setAttribute('tabindex', -1);
  tab.setAttribute('aria-expanded', false);
  panel.setAttribute('aria-hidden', true);
};

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
  var tabs = component.querySelectorAll('[role="tab"');
  var panels = component.querySelectorAll('[role="tabpanel"');
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

},{}],3:[function(require,module,exports){
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
  var inception = (src.dataset.inception || 'false') === 'true';

  // check if dialog is inside another dialog
  if (!inception) {
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
/* tab panels
 ========================================================================== */

var closeTab = function closeTab(tab, panel) {
  tab.setAttribute('tabindex', -1);
  tab.setAttribute('aria-selected', false);
  panel.setAttribute('aria-hidden', true);
};

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
  var tabs = component.querySelectorAll('[role="tab"');
  var panels = component.querySelectorAll('[role="tabpanel"');
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

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYXBwLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvYWNjb3JkaW9ucy5qcyIsInNyYy9qcy9jb21wb25lbnRzL2RpYWxvZ3MuanMiLCJzcmMvanMvY29tcG9uZW50cy9zdGF0ZXMuanMiLCJzcmMvanMvY29tcG9uZW50cy90YWJQYW5lbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0dBOzs7O0FBQ0E7Ozs7QUFDQTs7OztBQUNBOzs7Ozs7QUFOQTs7O0FBUUEsSUFBTSxXQUFXO0FBQ2YsT0FBSyxDQURVO0FBRWYsU0FBTyxFQUZRO0FBR2YsVUFBUSxFQUhPO0FBSWYsT0FBSyxFQUpVO0FBS2YsUUFBTSxFQUxTO0FBTWYsUUFBTSxFQU5TO0FBT2YsTUFBSSxFQVBXO0FBUWYsU0FBTyxFQVJRO0FBU2YsUUFBTTtBQVRTLENBQWpCOztBQVlBLElBQU0sb0JBQW9CLFNBQXBCLGlCQUFvQixDQUFVLFNBQVYsRUFBcUI7QUFDN0MsTUFBTSxnQkFBZ0IsVUFBVSxPQUFWLENBQWtCLFNBQXhDOztBQUVBLE1BQUksa0JBQWtCLE9BQXRCLEVBQStCO0FBQzdCLDBCQUFNLFNBQU4sRUFBaUIsUUFBakI7QUFDRDtBQUNELE1BQUksa0JBQWtCLFFBQXRCLEVBQWdDO0FBQzlCLDJCQUFPLFNBQVAsRUFBa0IsUUFBbEI7QUFDRDtBQUNELE1BQUksa0JBQWtCLEtBQXRCLEVBQTZCO0FBQzNCLDZCQUFTLFNBQVQsRUFBb0IsUUFBcEI7QUFDRDtBQUNELE1BQUksa0JBQWtCLFdBQXRCLEVBQW1DO0FBQ2pDLDhCQUFVLFNBQVYsRUFBcUIsUUFBckI7QUFDRDtBQUNGLENBZkQ7O0FBaUJBLFNBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLFlBQU07QUFDbEQsTUFBTSxhQUFhLFNBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLENBQW5COztBQUVBLGFBQVcsT0FBWCxDQUFtQixVQUFD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QUNEO0FBQ0YsS0FORDs7QUFRQTtBQUNBLFFBQUksZ0JBQUosQ0FBcUIsU0FBckIsRUFBZ0MsVUFBQyxLQUFELEVBQVc7QUFDekMsVUFBSSxNQUFNLEtBQU4sS0FBZ0IsU0FBUyxJQUE3QixFQUFtQztBQUNqQyxjQUFNLGNBQU47O0FBRUEsZ0JBQVEsUUFBUixFQUFrQixVQUFsQixFQUE4QixTQUE5QixFQUF5QyxFQUFFLE9BQU8sSUFBVCxFQUF6QztBQUNEO0FBQ0YsS0FORDs7QUFRQTtBQUNBLFFBQUksZ0JBQUosQ0FBcUIsU0FBckIsRUFBZ0MsVUFBQyxLQUFELEVBQVc7QUFDekMsVUFBSSxNQUFNLEtBQU4sS0FBZ0IsU0FBUyxHQUE3QixFQUFrQztBQUNoQyxjQUFNLGNBQU47O0FBRUEsZ0JBQVEsT0FBUixFQUFpQixTQUFqQixFQUE0QixTQUE1QixFQUF1QyxFQUFFLE9BQU8sSUFBVCxFQUF2QztBQUNEO0FBQ0YsS0FORDtBQU9ELEdBakREO0FBa0REIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsIi8qIGFwcFxuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbmltcG9ydCBzdGF0ZSBmcm9tICcuL2NvbXBvbmVudHMvc3RhdGVzJztcbmltcG9ydCBkaWFsb2cgZnJvbSAnLi9jb21wb25lbnRzL2RpYWxvZ3MnO1xuaW1wb3J0IHRhYlBhbmVsIGZyb20gJy4vY29tcG9uZW50cy90YWJQYW5lbHMnO1xuaW1wb3J0IGFjY29yZGlvbiBmcm9tICcuL2NvbXBvbmVudHMvYWNjb3JkaW9ucyc7XG5cbmNvbnN0IGtleUNvZGVzID0ge1xuICB0YWI6IDksXG4gIGVudGVyOiAxMyxcbiAgZXNjYXBlOiAyNyxcbiAgZW5kOiAzNSxcbiAgaG9tZTogMzYsXG4gIGxlZnQ6IDM3LFxuICB1cDogMzgsXG4gIHJpZ2h0OiAzOSxcbiAgZG93bjogNDAsXG59O1xuXG5jb25zdCB0ZXN0Q29tcG9uZW50VHlwZSA9IGZ1bmN0aW9uIChjb21wb25lbnQpIHtcbiAgY29uc3QgZGF0YUNvbXBvbmVudCA9IGNvbXBvbmVudC5kYXRhc2V0LmNvbXBvbmVudDtcblxuICBpZiAoZGF0YUNvbXBvbmVudCA9PT0gJ3N0YXRlJykge1xuICAgIHN0YXRlKGNvbXBvbmVudCwga2V5Q29kZXMpO1xuICB9XG4gIGlmIChkYXRhQ29tcG9uZW50ID09PSAnZGlhbG9nJykge1xuICAgIGRpYWxvZyhjb21wb25lbnQsIGtleUNvZGVzKTtcbiAgfVxuICBpZiAoZGF0YUNvbXBvbmVudCA9PT0gJ3RhYicpIHtcbiAgICB0YWJQYW5lbChjb21wb25lbnQsIGtleUNvZGVzKTtcbiAgfVxuICBpZiAoZGF0YUNvbXBvbmVudCA9PT0gJ2FjY29yZGlvbicpIHtcbiAgICBhY2NvcmRpb24oY29tcG9uZW50LCBrZXlDb2Rlcyk7XG4gIH1cbn07XG5cbmRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ0RPTUNvbnRlbnRMb2FkZWQnLCAoKSA9PiB7XG4gIGNvbnN0IGNvbXBvbmVudHMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1jb21wb25lbnRdJyk7XG5cbiAgY29tcG9uZW50cy5mb3JFYWNoKChjb21wb25lbnQpID0+IHtcbiAgICB0ZXN0Q29tcG9uZW50VHlwZShjb21wb25lbnQpO1xuICB9KTtcblxuICBjb25zdCBvYnNlcnZlciA9IG5ldyBNdXRhdGlvbk9ic2VydmVyKChtdXRhdGlvbnMpID0+IHtcbiAgICBtdXRhdGlvbnMuZm9yRWFjaCgobXV0YXRpb24pID0+IHtcbiAgICAgIG11dGF0aW9uLmFkZGVkTm9kZXMuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgICAgIGlmICh0eXBlb2YgY29tcG9uZW50LmdldEF0dHJpYnV0ZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgIGlmIChjb21wb25lbnQuZ2V0QXR0cmlidXRlKCdkYXRhLWNvbXBvbmVudCcpKSB7XG4gICAgICAgICAgICB0ZXN0Q29tcG9uZW50VHlwZShjb21wb25lbnQpO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfSk7XG4gICAgfSk7XG4gIH0pO1xuICBvYnNlcnZlci5vYnNlcnZlKGRvY3VtZW50LmJvZHksIHtcbiAgICBjaGlsZExpc3Q6IHRydWUsXG4gICAgc3VidHJlZTogdHJ1ZSxcbiAgfSk7XG59KTtcbiIsIi8qIGFjY29yZGlvbnNcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5jb25zdCBjbG9zZVRhYiA9IGZ1bmN0aW9uICh0YWIsIHBhbmVsKSB7XG4gIHRhYi5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgLTEpO1xuICB0YWIuc2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJywgZmFsc2UpO1xuICBwYW5lbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG59O1xuXG5jb25zdCBjbG9zZVRhYnMgPSBmdW5jdGlvbiAoY3VycmVudFRhYiwgdGFicywgcGFuZWxzKSB7XG4gIHRhYnMuZm9yRWFjaCgodGFiLCBpbmRleCkgPT4ge1xuICAgIGlmICh0YWIgIT09IGN1cnJlbnRUYWIpIHtcbiAgICAgIGNsb3NlVGFiKHRhYiwgcGFuZWxzW2luZGV4XSk7XG4gICAgfVxuICB9KTtcbn07XG5cbmNvbnN0IGRlc2VsZWN0VGFiID0gZnVuY3Rpb24gKHRhYikge1xuICB0YWIuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIC0xKTtcbiAgdGFiLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIGZhbHNlKTtcbn07XG5cbmNvbnN0IGRlc2VsZWN0VGFicyA9IGZ1bmN0aW9uICh0YWJzKSB7XG4gIHRhYnMuZm9yRWFjaCgodGFiKSA9PiB7XG4gICAgZGVzZWxlY3RUYWIodGFiKTtcbiAgfSk7XG59O1xuXG5jb25zdCB0b2dnbGVUYWIgPSBmdW5jdGlvbiAodGFiLCBwYW5lbCwgeyB0YWJzLCBwYW5lbHMgfSwgeyBtdWx0aXNlbGVjdGFibGUgfSkge1xuICBpZiAoIW11bHRpc2VsZWN0YWJsZSkge1xuICAgIGNsb3NlVGFicyh0YWIsIHRhYnMsIHBhbmVscyk7XG4gIH1cblxuICB0YWIuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIDApO1xuICB0YWIuc2V0QXR0cmlidXRlKCdhcmlhLXNlbGVjdGVkJywgdHJ1ZSk7XG4gIHRhYi5zZXRBdHRyaWJ1dGUoJ2FyaWEtZXhwYW5kZWQnLCB0YWIuZ2V0QXR0cmlidXRlKCdhcmlhLWV4cGFuZGVkJykgIT09ICd0cnVlJyk7XG4gIHBhbmVsLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBwYW5lbC5nZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJykgIT09ICd0cnVlJyk7XG59O1xuXG5jb25zdCBzZWxlY3RUYWIgPSBmdW5jdGlvbiAodGFiLCB0YWJzKSB7XG4gIGlmICh0YWJzKSB7XG4gICAgZGVzZWxlY3RUYWJzKHRhYnMpO1xuICAgIHRhYi5mb2N1cygpO1xuICB9XG5cbiAgdGFiLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAwKTtcbiAgdGFiLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIHRydWUpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gYWNjb3JkaW9uKGNvbXBvbmVudCwga2V5Q29kZXMpIHtcbiAgY29uc3QgdGFicyA9IGNvbXBvbmVudC5xdWVyeVNlbGVjdG9yQWxsKCdbcm9sZT1cInRhYlwiJyk7XG4gIGNvbnN0IHBhbmVscyA9IGNvbXBvbmVudC5xdWVyeVNlbGVjdG9yQWxsKCdbcm9sZT1cInRhYnBhbmVsXCInKTtcbiAgY29uc3QgdGFiUGFuZWxzID0geyB0YWJzLCBwYW5lbHMgfTtcbiAgY29uc3QgZmlyc3RUYWIgPSB0YWJzWzBdO1xuICBjb25zdCBsYXN0VGFiID0gdGFic1t0YWJzLmxlbmd0aCAtIDFdO1xuICBjb25zdCBtdWx0aXNlbGVjdGFibGUgPSAoY29tcG9uZW50LmdldEF0dHJpYnV0ZSgnYXJpYS1tdWx0aXNlbGVjdGFibGUnKSB8fCAndHJ1ZScpID09PSAndHJ1ZSc7XG5cbiAgdGFicy5mb3JFYWNoKCh0YWIsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgcHJldlRhYiA9IHRhYnNbaW5kZXggLSAxXSB8fCBsYXN0VGFiO1xuICAgIGNvbnN0IG5leHRUYWIgPSB0YWJzW2luZGV4ICsgMV0gfHwgZmlyc3RUYWI7XG4gICAgY29uc3QgcGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YWIuZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJykpO1xuXG4gICAgLy8gdG9nZ2xlIHRhYlxuICAgIHRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgdG9nZ2xlVGFiKHRhYiwgcGFuZWwsIHRhYlBhbmVscywgeyBtdWx0aXNlbGVjdGFibGUgfSk7XG4gICAgfSk7XG5cbiAgICB0YWIuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LndoaWNoID09PSBrZXlDb2Rlcy5lbnRlciB8fCBldmVudC53aGljaCA9PT0ga2V5Q29kZXMuZXNjYXBlKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgdG9nZ2xlVGFiKHRhYiwgcGFuZWwsIHRhYlBhbmVscywgeyBtdWx0aXNlbGVjdGFibGUgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBzZWxlY3QgdGFiXG4gICAgdGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2ZvY3VzJywgKCkgPT4ge1xuICAgICAgc2VsZWN0VGFiKHRhYik7XG4gICAgfSk7XG5cbiAgICAvLyBzZWxlY3QgcHJldiB0YWJcbiAgICB0YWIuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LndoaWNoID09PSBrZXlDb2Rlcy5sZWZ0IHx8IGV2ZW50LndoaWNoID09PSBrZXlDb2Rlcy51cCkge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIHNlbGVjdFRhYihwcmV2VGFiLCB0YWJzKTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIHNlbGVjdCBuZXh0IHRhYlxuICAgIHRhYi5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQud2hpY2ggPT09IGtleUNvZGVzLnJpZ2h0IHx8IGV2ZW50LndoaWNoID09PSBrZXlDb2Rlcy5kb3duKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgc2VsZWN0VGFiKG5leHRUYWIsIHRhYnMpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gc2VsZWN0IGZpcnN0IHRhYlxuICAgIHRhYi5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQud2hpY2ggPT09IGtleUNvZGVzLmhvbWUpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBzZWxlY3RUYWIoZmlyc3RUYWIsIHRhYnMpO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gc2VsZWN0IGxhc3QgdGFiXG4gICAgdGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC53aGljaCA9PT0ga2V5Q29kZXMuZW5kKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgc2VsZWN0VGFiKGxhc3RUYWIsIHRhYnMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn1cbiIsIi8qIGRpYWxvZ3NcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5jb25zdCBwYWdlID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcignLmpzLXBhZ2UnKTtcbmNvbnN0IGRvYyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1kb2N1bWVudCcpO1xuXG5jb25zdCBvcGVuRGlhbG9nID0gZnVuY3Rpb24gKGNvbXBvbmVudCwga2V5Q29kZXMpIHtcbiAgY29uc3QgZm9jdXNhYmxlRWxlbXMgPSBjb21wb25lbnQucXVlcnlTZWxlY3RvckFsbCgnW2hyZWZdLCBidXR0b24sIGlucHV0LCBzZWxlY3QsIHRleHRhcmVhLCBbdGFiaW5kZXhdOm5vdChbdGFiaW5kZXg9XCItMVwiXScpO1xuICBjb25zdCBmaXJzdEZvY3VzYWJsZUVsZW0gPSBmb2N1c2FibGVFbGVtc1swXTtcbiAgY29uc3Qgc2Vjb25kRm9jdXNhYmxlRWxlbSA9IGZvY3VzYWJsZUVsZW1zWzFdO1xuICBjb25zdCBsYXN0Rm9jdXNhYmxlRWxlbSA9IGZvY3VzYWJsZUVsZW1zW2ZvY3VzYWJsZUVsZW1zLmxlbmd0aCAtIDFdO1xuXG4gIGNvbXBvbmVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZmFsc2UpO1xuICBkb2Muc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHRydWUpO1xuICBwYWdlLmNsYXNzTGlzdC5hZGQoJ2lzLWluYWN0aXZlJyk7XG5cbiAgLy8gcmV0dXJuIGlmIG5vIGZvY3VzYWJsZSBlbGVtZW50XG4gIGlmICghZmlyc3RGb2N1c2FibGVFbGVtKSB7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgd2luZG93LnNldFRpbWVvdXQoKCkgPT4ge1xuICAgIGlmIChzZWNvbmRGb2N1c2FibGVFbGVtKSB7XG4gICAgICBzZWNvbmRGb2N1c2FibGVFbGVtLmZvY3VzKCk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGZpcnN0Rm9jdXNhYmxlRWxlbS5mb2N1cygpO1xuICAgIH1cblxuICAgIC8vIHRyYXBwaW5nIGZvY3VzIGluc2lkZSB0aGUgZGlhbG9nXG4gICAgZm9jdXNhYmxlRWxlbXMuZm9yRWFjaCgoZm9jdXNhYmxlRWxlbSkgPT4ge1xuICAgICAgaWYgKGZvY3VzYWJsZUVsZW0uYWRkRXZlbnRMaXN0ZW5lcikge1xuICAgICAgICBmb2N1c2FibGVFbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICAgICAgICBjb25zdCB0YWIgPSBldmVudC53aGljaCA9PT0ga2V5Q29kZXMudGFiO1xuXG4gICAgICAgICAgaWYgKCF0YWIpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQudGFyZ2V0ID09PSBmaXJzdEZvY3VzYWJsZUVsZW0pIHsgLy8gc2hpZnQgKyB0YWJcbiAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICAgICAgICBsYXN0Rm9jdXNhYmxlRWxlbS5mb2N1cygpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH0gZWxzZSBpZiAoZXZlbnQudGFyZ2V0ID09PSBsYXN0Rm9jdXNhYmxlRWxlbSkgeyAvLyB0YWJcbiAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgIGZpcnN0Rm9jdXNhYmxlRWxlbS5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sIDEwMCk7XG59O1xuXG5jb25zdCBjbG9zZURpYWxvZyA9IGZ1bmN0aW9uIChjb21wb25lbnQsIHNyYykge1xuICBjb25zdCBpbmNlcHRpb24gPSAoc3JjLmRhdGFzZXQuaW5jZXB0aW9uIHx8ICdmYWxzZScpID09PSAndHJ1ZSc7XG5cbiAgLy8gY2hlY2sgaWYgZGlhbG9nIGlzIGluc2lkZSBhbm90aGVyIGRpYWxvZ1xuICBpZiAoIWluY2VwdGlvbikge1xuICAgIGRvYy5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZmFsc2UpO1xuICAgIHBhZ2UuY2xhc3NMaXN0LnJlbW92ZSgnaXMtaW5hY3RpdmUnKTtcbiAgfVxuXG4gIGNvbXBvbmVudC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG5cbiAgLy8gcmVzdG9yaW5nIGZvY3VzXG4gIHNyYy5mb2N1cygpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGlhbG9nKHNyYywga2V5Q29kZXMpIHtcbiAgY29uc3QgY29tcG9uZW50ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLiR7c3JjLmRhdGFzZXQudGFyZ2V0fWApO1xuICBjb25zdCBkaXNtaXNzVGFyZ2V0cyA9IGNvbXBvbmVudC5xdWVyeVNlbGVjdG9yQWxsKCdbZGF0YS1kaXNtaXNzXScpO1xuICBjb25zdCB7IG92ZXJsYXkgfSA9IHNyYy5kYXRhc2V0O1xuXG4gIC8vIG9wZW4gZGlhbG9nXG4gIHNyYy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBvcGVuRGlhbG9nKGNvbXBvbmVudCwga2V5Q29kZXMpO1xuICB9KTtcblxuICBzcmMuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgIGlmIChldmVudC53aGljaCA9PT0ga2V5Q29kZXMuZW50ZXIpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIG9wZW5EaWFsb2coY29tcG9uZW50LCBrZXlDb2Rlcyk7XG4gICAgfVxuICB9KTtcblxuICAvLyBjbG9zZSBkaWFsb2dcbiAgY29tcG9uZW50LmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICBpZiAoZXZlbnQud2hpY2ggPT09IGtleUNvZGVzLmVzY2FwZSkge1xuICAgICAgY2xvc2VEaWFsb2coY29tcG9uZW50LCBzcmMpO1xuICAgIH1cbiAgfSk7XG5cbiAgZGlzbWlzc1RhcmdldHMuZm9yRWFjaCgoZGlzbWlzc1RhcmdldCkgPT4ge1xuICAgIGNvbnN0IHRhcmdldCA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoYC4ke2Rpc21pc3NUYXJnZXQuZGF0YXNldC5kaXNtaXNzfWApO1xuXG4gICAgZGlzbWlzc1RhcmdldC5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgY2xvc2VEaWFsb2codGFyZ2V0LCBzcmMpO1xuICAgIH0pO1xuICAgIGRpc21pc3NUYXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LndoaWNoID09PSBrZXlDb2Rlcy5lbnRlcikge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIGNsb3NlRGlhbG9nKHRhcmdldCwgc3JjKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gY29tcG9uZW50ICYmICghb3ZlcmxheSB8fCBvdmVybGF5ID09PSAndHJ1ZScpKSB7XG4gICAgICBjbG9zZURpYWxvZyhjb21wb25lbnQsIHNyYyk7XG4gICAgfVxuICB9KTtcbn1cbiIsIi8qIHN0YXRlc1xuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbmNvbnN0IGFkZCA9ICdhZGQnO1xuY29uc3QgcmVtb3ZlID0gJ3JlbW92ZSc7XG5jb25zdCB0b2dnbGUgPSAndG9nZ2xlJztcbmNvbnN0IGFyaWFBdHRyaWJ1dGVzID0gW1xuICB7XG4gICAgdHlwZTogJ2FyaWEtaGlkZGVuJyxcbiAgICBpbml0OiB0cnVlLFxuICB9LFxuICB7XG4gICAgdHlwZTogJ2FyaWEtZGlzYWJsZWQnLFxuICAgIGluaXQ6IHRydWUsXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnYXJpYS1zZWxlY3RlZCcsXG4gICAgaW5pdDogZmFsc2UsXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnYXJpYS1leHBhbmRlZCcsXG4gICAgaW5pdDogZmFsc2UsXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnYXJpYS1wcmVzc2VkJyxcbiAgICBpbml0OiBmYWxzZSxcbiAgfSxcbiAge1xuICAgIHR5cGU6ICdhcmlhLWNoZWNrZWQnLFxuICAgIGluaXQ6IGZhbHNlLFxuICB9LFxuXTtcblxuY29uc3Qgc2V0Q2xhc3MgPSBmdW5jdGlvbiAoZWxlbSwgc3RhdGVDbGFzcywgYmVoYXZpb3VyKSB7XG4gIGlmIChzdGF0ZUNsYXNzICE9PSAnZmFsc2UnKSB7XG4gICAgaWYgKGJlaGF2aW91ciA9PT0gYWRkKSB7XG4gICAgICBlbGVtLmNsYXNzTGlzdC5hZGQoc3RhdGVDbGFzcyk7XG4gICAgfSBlbHNlIGlmIChiZWhhdmlvdXIgPT09IHJlbW92ZSkge1xuICAgICAgZWxlbS5jbGFzc0xpc3QucmVtb3ZlKHN0YXRlQ2xhc3MpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtLmNsYXNzTGlzdC50b2dnbGUoc3RhdGVDbGFzcyk7XG4gICAgfVxuICB9XG59O1xuXG5jb25zdCBzZXRBcmlhID0gZnVuY3Rpb24gKGVsZW0sIGJlaGF2aW91cikge1xuICBhcmlhQXR0cmlidXRlcy5mb3JFYWNoKChhcmlhQXR0cmlidXRlKSA9PiB7XG4gICAgY29uc3QgeyB0eXBlLCBpbml0IH0gPSBhcmlhQXR0cmlidXRlO1xuXG4gICAgaWYgKGVsZW0uaGFzQXR0cmlidXRlKHR5cGUpKSB7XG4gICAgICBpZiAoYmVoYXZpb3VyID09PSBhZGQpIHtcbiAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUodHlwZSwgIWluaXQpO1xuICAgICAgfSBlbHNlIGlmIChiZWhhdmlvdXIgPT09IHJlbW92ZSkge1xuICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZSh0eXBlLCBpbml0KTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKHR5cGUsIGVsZW0uZ2V0QXR0cmlidXRlKHR5cGUpICE9PSAndHJ1ZScpO1xuICAgICAgfVxuICAgIH1cbiAgfSk7XG59O1xuXG5jb25zdCBzZXRUYWJpbmRleCA9IGZ1bmN0aW9uIChlbGVtLCB0YWJpbmRleCwgYmVoYXZpb3VyKSB7XG4gIGlmICh0YWJpbmRleCA9PT0gJ3RydWUnKSB7XG4gICAgaWYgKGJlaGF2aW91ciA9PT0gYWRkKSB7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAwKTtcbiAgICB9IGVsc2UgaWYgKGJlaGF2aW91ciA9PT0gcmVtb3ZlKSB7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCAtMSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGVsZW0uc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIGVsZW0uZ2V0QXR0cmlidXRlKCd0YWJpbmRleCcpID09PSAnLTEnID8gMCA6IC0xKTtcbiAgICB9XG4gIH1cbn07XG5cbmNvbnN0IHNldFN0YXRlID0gZnVuY3Rpb24gKHBhcmFtZXRlcnMpIHtcbiAgcGFyYW1ldGVycy5iZWhhdmlvdXJzLmZvckVhY2goKGJlaGF2aW91ciwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBlbGVtcyA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYC4ke3BhcmFtZXRlcnMudGFyZ2V0c1tpbmRleF19YCk7XG4gICAgY29uc3Qgc3RhdGVDbGFzcyA9IHBhcmFtZXRlcnMuc3RhdGVzW2luZGV4XTtcbiAgICBjb25zdCB0YWJpbmRleCA9IHBhcmFtZXRlcnMudGFiaW5kZXhlcyAhPT0gbnVsbCA/IHBhcmFtZXRlcnMudGFiaW5kZXhlc1tpbmRleF0gOiBudWxsO1xuXG4gICAgZWxlbXMuZm9yRWFjaCgoZWxlbSkgPT4ge1xuICAgICAgaWYgKGJlaGF2aW91ciA9PT0gYWRkKSB7XG4gICAgICAgIHNldENsYXNzKGVsZW0sIHN0YXRlQ2xhc3MsIGFkZCk7XG4gICAgICAgIHNldEFyaWEoZWxlbSwgYWRkKTtcbiAgICAgICAgc2V0VGFiaW5kZXgoZWxlbSwgdGFiaW5kZXgsIGFkZCk7XG4gICAgICB9IGVsc2UgaWYgKGJlaGF2aW91ciA9PT0gcmVtb3ZlKSB7XG4gICAgICAgIHNldENsYXNzKGVsZW0sIHN0YXRlQ2xhc3MsIHJlbW92ZSk7XG4gICAgICAgIHNldEFyaWEoZWxlbSwgcmVtb3ZlKTtcbiAgICAgICAgc2V0VGFiaW5kZXgoZWxlbSwgdGFiaW5kZXgsIHJlbW92ZSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBzZXRDbGFzcyhlbGVtLCBzdGF0ZUNsYXNzLCB0b2dnbGUpO1xuICAgICAgICBzZXRBcmlhKGVsZW0sIHRvZ2dsZSk7XG4gICAgICAgIHNldFRhYmluZGV4KGVsZW0sIHRhYmluZGV4LCB0b2dnbGUpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHN0YXRlKGVsZW0sIGtleUNvZGVzKSB7XG4gIGNvbnN0IHBhcmFtZXRlcnMgPSB7XG4gICAgYmVoYXZpb3VyczogZWxlbS5kYXRhc2V0LmJlaGF2aW91ci5zcGxpdCgnLCAnKSxcbiAgICBzdGF0ZXM6IGVsZW0uZGF0YXNldC5zdGF0ZS5zcGxpdCgnLCAnKSxcbiAgICB0YWJpbmRleGVzOiBlbGVtLmRhdGFzZXQudGFiaW5kZXggPyBlbGVtLmRhdGFzZXQudGFiaW5kZXguc3BsaXQoJywgJykgOiBudWxsLFxuICAgIHRhcmdldHM6IGVsZW0uZGF0YXNldC50YXJnZXQuc3BsaXQoJywgJyksXG4gIH07XG5cbiAgZWxlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICBzZXRTdGF0ZShwYXJhbWV0ZXJzKTtcbiAgfSk7XG4gIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgIGlmIChldmVudC53aGljaCA9PT0ga2V5Q29kZXMuZW50ZXIpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgIHNldFN0YXRlKHBhcmFtZXRlcnMpO1xuICAgIH1cbiAgfSk7XG59XG4iLCIvKiB0YWIgcGFuZWxzXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuY29uc3QgY2xvc2VUYWIgPSBmdW5jdGlvbiAodGFiLCBwYW5lbCkge1xuICB0YWIuc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIC0xKTtcbiAgdGFiLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIGZhbHNlKTtcbiAgcGFuZWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHRydWUpO1xufTtcblxuY29uc3QgY2xvc2VUYWJzID0gZnVuY3Rpb24gKHRhYnMsIHBhbmVscykge1xuICB0YWJzLmZvckVhY2goKHRhYiwgaW5kZXgpID0+IHtcbiAgICBjbG9zZVRhYih0YWIsIHBhbmVsc1tpbmRleF0pO1xuICB9KTtcbn07XG5cbmNvbnN0IG9wZW5UYWIgPSBmdW5jdGlvbiAodGFiLCBwYW5lbCwgeyB0YWJzLCBwYW5lbHMgfSwgeyBmb2N1cyA9IGZhbHNlIH0gPSB7fSkge1xuICBjbG9zZVRhYnModGFicywgcGFuZWxzKTtcblxuICBpZiAoZm9jdXMpIHtcbiAgICB0YWIuZm9jdXMoKTtcbiAgfVxuXG4gIHRhYi5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgMCk7XG4gIHRhYi5zZXRBdHRyaWJ1dGUoJ2FyaWEtc2VsZWN0ZWQnLCB0cnVlKTtcbiAgcGFuZWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIGZhbHNlKTtcbn07XG5cbmV4cG9ydCBkZWZhdWx0IGZ1bmN0aW9uIHRhYlBhbmVsKGNvbXBvbmVudCwga2V5Q29kZXMpIHtcbiAgY29uc3QgdGFicyA9IGNvbXBvbmVudC5xdWVyeVNlbGVjdG9yQWxsKCdbcm9sZT1cInRhYlwiJyk7XG4gIGNvbnN0IHBhbmVscyA9IGNvbXBvbmVudC5xdWVyeVNlbGVjdG9yQWxsKCdbcm9sZT1cInRhYnBhbmVsXCInKTtcbiAgY29uc3QgdGFiUGFuZWxzID0geyB0YWJzLCBwYW5lbHMgfTtcbiAgY29uc3QgZmlyc3RUYWIgPSB0YWJzWzBdO1xuICBjb25zdCBsYXN0VGFiID0gdGFic1t0YWJzLmxlbmd0aCAtIDFdO1xuICBjb25zdCBmaXJzdFBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZmlyc3RUYWIuZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJykpO1xuICBjb25zdCBsYXN0UGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChsYXN0VGFiLmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpKTtcblxuICB0YWJzLmZvckVhY2goKHRhYiwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBwcmV2VGFiID0gdGFic1tpbmRleCAtIDFdIHx8IGxhc3RUYWI7XG4gICAgY29uc3QgbmV4dFRhYiA9IHRhYnNbaW5kZXggKyAxXSB8fCBmaXJzdFRhYjtcbiAgICBjb25zdCBwYW5lbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKHRhYi5nZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnKSk7XG4gICAgY29uc3QgcHJldlBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocHJldlRhYi5nZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnKSk7XG4gICAgY29uc3QgbmV4dFBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQobmV4dFRhYi5nZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnKSk7XG5cbiAgICAvLyBvcGVuIHRhYlxuICAgIHRhYi5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgb3BlblRhYih0YWIsIHBhbmVsLCB0YWJQYW5lbHMpO1xuICAgIH0pO1xuXG4gICAgLy8gb3BlbiBwcmV2IHRhYlxuICAgIHRhYi5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQud2hpY2ggPT09IGtleUNvZGVzLmxlZnQgfHwgZXZlbnQud2hpY2ggPT09IGtleUNvZGVzLnVwKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgb3BlblRhYihwcmV2VGFiLCBwcmV2UGFuZWwsIHRhYlBhbmVscywgeyBmb2N1czogdHJ1ZSB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIG9wZW4gbmV4dCB0YWJcbiAgICB0YWIuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LndoaWNoID09PSBrZXlDb2Rlcy5yaWdodCB8fCBldmVudC53aGljaCA9PT0ga2V5Q29kZXMuZG93bikge1xuICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgIG9wZW5UYWIobmV4dFRhYiwgbmV4dFBhbmVsLCB0YWJQYW5lbHMsIHsgZm9jdXM6IHRydWUgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBvcGVuIGZpcnN0IHRhYlxuICAgIHRhYi5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQud2hpY2ggPT09IGtleUNvZGVzLmhvbWUpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBvcGVuVGFiKGZpcnN0VGFiLCBmaXJzdFBhbmVsLCB0YWJQYW5lbHMsIHsgZm9jdXM6IHRydWUgfSk7XG4gICAgICB9XG4gICAgfSk7XG5cbiAgICAvLyBvcGVuIGxhc3QgdGFiXG4gICAgdGFiLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC53aGljaCA9PT0ga2V5Q29kZXMuZW5kKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgb3BlblRhYihsYXN0VGFiLCBsYXN0UGFuZWwsIHRhYlBhbmVscywgeyBmb2N1czogdHJ1ZSB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG4iXX0=
