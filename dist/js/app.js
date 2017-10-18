(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _states = require('./components/states');

var _states2 = _interopRequireDefault(_states);

var _dialogs = require('./components/dialogs');

var _dialogs2 = _interopRequireDefault(_dialogs);

var _tabs = require('./components/tabs');

var _tabs2 = _interopRequireDefault(_tabs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

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
}; /* app
    ========================================================================== */

var testComponentType = function testComponentType(component) {
  var dataComponent = component.dataset.component;

  if (dataComponent === 'state') {
    (0, _states2.default)(component, keyCodes);
  }
  if (dataComponent === 'dialog') {
    (0, _dialogs2.default)(component, keyCodes);
  }
  if (dataComponent === 'tabs') {
    (0, _tabs2.default)(component, keyCodes);
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

},{"./components/dialogs":2,"./components/states":3,"./components/tabs":4}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = dialog;
/* dialogs
 ========================================================================== */

var page = document.querySelector('.js-page');
var doc = document.querySelector('.js-document');

var openDialog = function openDialog(dialogWidget, keyCodes) {
  var focusableElems = dialogWidget.querySelectorAll('[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"]');
  var firstFocusableElem = focusableElems[0];
  var secondFocusableElem = focusableElems[1];
  var lastFocusableElem = focusableElems[focusableElems.length - 1];

  dialogWidget.setAttribute('aria-hidden', false);
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
          var isTabPressed = event.which === keyCodes.tab;

          if (!isTabPressed) {
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

var closeDialog = function closeDialog(dialogWidget, dialogSrc) {
  var inception = dialogSrc.dataset.inception;

  // check if dialog is inside another dialog

  if (!inception || inception === 'false') {
    doc.setAttribute('aria-hidden', false);
    page.classList.remove('is-inactive');
  }

  dialogWidget.setAttribute('aria-hidden', true);

  // restoring focus
  dialogSrc.focus();
};

function dialog(dialogSrc, keyCodes) {
  var dialogWidget = document.querySelector('.' + dialogSrc.dataset.target);
  var dialogsToDismiss = dialogWidget.querySelectorAll('[data-dismiss]');
  var overlay = dialogSrc.dataset.overlay;

  var overlayIsEnabled = !overlay || overlay === 'true';

  // open dialog
  dialogSrc.addEventListener('click', function (event) {
    event.preventDefault();

    openDialog(dialogWidget, keyCodes);
  });

  dialogSrc.addEventListener('keydown', function (event) {
    if (event.which === keyCodes.enter) {
      event.preventDefault();

      openDialog(dialogWidget, keyCodes);
    }
  });

  // close dialog
  dialogWidget.addEventListener('keydown', function (event) {
    if (event.which === keyCodes.escape) {
      closeDialog(dialogWidget, dialogSrc);
    }
  });

  dialogsToDismiss.forEach(function (dialogToDismiss) {
    var dialogWidgetToDismiss = document.querySelector('.' + dialogToDismiss.dataset.dismiss);

    dialogToDismiss.addEventListener('click', function (event) {
      event.preventDefault();

      closeDialog(dialogWidgetToDismiss, dialogSrc);
    });
    dialogToDismiss.addEventListener('keydown', function (event) {
      if (event.which === keyCodes.enter) {
        event.preventDefault();

        closeDialog(dialogWidgetToDismiss, dialogSrc);
      }
    });
  });

  window.addEventListener('click', function (event) {
    if (event.target === dialogWidget && overlayIsEnabled) {
      closeDialog(dialogWidget, dialogSrc);
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
    var type = ariaAttribute.type;
    var init = ariaAttribute.init;


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
exports.default = tabs;
/* tabs
 ========================================================================== */

var openTab = function openTab(tabItem, panel) {
  var parameters = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : { focus: false };
  var focus = parameters.focus;


  if (focus) {
    tabItem.focus();
  }

  tabItem.setAttribute('tabindex', 0);
  tabItem.setAttribute('aria-selected', true);
  panel.setAttribute('aria-hidden', false);
};

var closeTab = function closeTab(tabItem, panel) {
  tabItem.setAttribute('tabindex', -1);
  tabItem.setAttribute('aria-selected', false);
  panel.setAttribute('aria-hidden', true);
};

var closeTabs = function closeTabs(tabItems, panels) {
  tabItems.forEach(function (tabItem, index) {
    closeTab(tabItem, panels[index]);
  });
};

function tabs(tabsWidget, keyCodes) {
  var tabItems = tabsWidget.querySelectorAll('[role="tab"');
  var panels = tabsWidget.querySelectorAll('[role="tabpanel"');

  tabItems.forEach(function (tabItem, index) {
    var firstTabItem = tabItems[0];
    var lastTabItem = tabItems[tabItems.length - 1];
    var prevTabItem = tabItems[index - 1] ? tabItems[index - 1] : tabItems[tabItems.length - 1];
    var nextTabItem = tabItems[index + 1] ? tabItems[index + 1] : tabItems[0];
    var panel = document.getElementById(tabItem.getAttribute('aria-controls'));
    var firstPanel = document.getElementById(firstTabItem.getAttribute('aria-controls'));
    var lastPanel = document.getElementById(lastTabItem.getAttribute('aria-controls'));
    var prevPanel = document.getElementById(prevTabItem.getAttribute('aria-controls'));
    var nextPanel = document.getElementById(nextTabItem.getAttribute('aria-controls'));

    // open current tab
    tabItem.addEventListener('click', function (event) {
      event.preventDefault();

      closeTabs(tabItems, panels);
      openTab(tabItem, panel);
    });

    // open prev tab
    tabItem.addEventListener('keydown', function (event) {
      if (event.which === keyCodes.left || event.which === keyCodes.up) {
        event.preventDefault();

        closeTabs(tabItems, panels);
        openTab(prevTabItem, prevPanel, { focus: true });
      }
    });

    // open next tab
    tabItem.addEventListener('keydown', function (event) {
      if (event.which === keyCodes.right || event.which === keyCodes.down) {
        event.preventDefault();

        closeTabs(tabItems, panels);
        openTab(nextTabItem, nextPanel, { focus: true });
      }
    });

    // open first tab
    tabItem.addEventListener('keydown', function (event) {
      if (event.which === keyCodes.home) {
        event.preventDefault();

        closeTabs(tabItems, panels);
        openTab(firstTabItem, firstPanel, { focus: true });
      }
    });

    // open last tab
    tabItem.addEventListener('keydown', function (event) {
      if (event.which === keyCodes.end) {
        event.preventDefault();

        closeTabs(tabItems, panels);
        openTab(lastTabItem, lastPanel, { focus: true });
      }
    });
  });
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYXBwLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvZGlhbG9ncy5qcyIsInNyYy9qcy9jb21wb25lbnRzL3N0YXRlcy5qcyIsInNyYy9qcy9jb21wb25lbnRzL3RhYnMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7OztBQ0dBOzs7O0FBQ0E7Ozs7QUFDQTs7Ozs7O0FBRUEsSUFBTSxXQUFXO0FBQ2YsT0FBSyxDQURVO0FBRWYsU0FBTyxFQUZRO0FBR2YsVUFBUSxFQUhPO0FBSWYsT0FBSyxFQUpVO0FBS2YsUUFBTSxFQUxTO0FBTWYsUUFBTSxFQU5TO0FBT2YsTUFBSSxFQVBXO0FBUWYsU0FBTyxFQVJRO0FBU2YsUUFBTTtBQVRTLENBQWpCLEMsQ0FQQTs7O0FBbUJBLElBQU0sb0JBQW9CLFNBQXBCLGlCQUFvQixDQUFVLFNBQVYsRUFBcUI7QUFDN0MsTUFBTSxnQkFBZ0IsVUFBVSxPQUFWLENBQWtCLFNBQXhDOztBQUVBLE1BQUksa0JBQWtCLE9BQXRCLEVBQStCO0FBQzdCLDBCQUFNLFNBQU4sRUFBaUIsUUFBakI7QUFDRDtBQUNELE1BQUksa0JBQWtCLFFBQXRCLEVBQWdDO0FBQzlCLDJCQUFPLFNBQVAsRUFBa0IsUUFBbEI7QUFDRDtBQUNELE1BQUksa0JBQWtCLE1BQXRCLEVBQThCO0FBQzVCLHdCQUFLLFNBQUwsRUFBZ0IsUUFBaEI7QUFDRDtBQUNGLENBWkQ7O0FBY0EsU0FBUyxnQkFBVCxDQUEwQixrQkFBMUIsRUFBOEMsWUFBTTtBQUNsRCxNQUFNLGFBQWEsU0FBUyxnQkFBVCxDQUEwQixrQkFBMUIsQ0FBbkI7O0FBRUEsYUFBVyxPQUFYLENBQW1CLFVBQUMsU0FBRCxFQUFlO0FBQ2hDLHNCQUFrQixTQUFsQjtBQUNELEdBRkQ7O0FBSUEsTUFBTSxXQUFXLElBQUksZ0JBQUosQ0FBcUIsVUFBQyxTQUFELEVBQWU7QUFDbkQsY0FBVSxPQUFWLENBQWtCLFVBQUMsUUFBRCxFQUFjO0FBQzlCLGVBQVMsVUFBVCxDQUFvQixPQUFwQixDQUE0QixVQUFDLFNBQUQsRUFBZTtBQUN6QyxZQUFJLE9BQU8sVUFBVSxZQUFqQixLQUFrQyxVQUF0QyxFQUFrRDtBQUNoRCxjQUFJLFVBQVUsWUFBVixDQUF1QixnQkFBdkIsQ0FBSixFQUE4QztBQUM1Qyw4QkFBa0IsU0FBbEI7QUFDRDtBQUNGO0FBQ0YsT0FORDtBQU9ELEtBUkQ7QUFTRCxHQVZnQixDQUFqQjtBQVdBLFdBQVMsT0FBVCxDQUFpQixTQUFTLElBQTFCLEVBQWdDO0FBQzlCLGVBQVcsSUFEbUI7QUFFOUIsYUFBUztBQUZxQixHQUFoQztBQUlELENBdEJEOzs7Ozs7OztrQkNvQ3dCLE07QUFyRXhCOzs7QUFHQSxJQUFNLE9BQU8sU0FBUyxhQUFULENBQXVCLFVBQXZCLENBQWI7QUFDQSxJQUFNLE1BQU0sU0FBUyxhQUFULENBQXVCLGNBQXZCLENBQVo7O0FBRUEsSUFBTSxhQUFhLFNBQWIsVUFBYSxDQUFVLFlBQVYsRUFBd0IsUUFBeEIsRUFBa0M7QUFDbkQsTUFBTSxpQkFBaUIsYUFBYSxnQkFBYixDQUE4Qix5RUFBOUIsQ0FBdkI7QUFDQSxNQUFNLHFCQUFxQixlQUFlLENBQWYsQ0FBM0I7QUFDQSxNQUFNLHNCQUFzQixlQUFlLENBQWYsQ0FBNUI7QUFDQSxNQUFNLG9CQUFvQixlQUFlLGVBQWUsTUFBZixHQUF3QixDQUF2QyxDQUExQjs7QUFFQSxlQUFhLFlBQWIsQ0FBMEIsYUFBMUIsRUFBeUMsS0FBekM7QUFDQSxNQUFJLFlBQUosQ0FBaUIsYUFBakIsRUFBZ0MsSUFBaEM7QUFDQSxPQUFLLFNBQUwsQ0FBZSxHQUFmLENBQW1CLGFBQW5COztBQUVBO0FBQ0EsTUFBSSxDQUFDLGtCQUFMLEVBQXlCO0FBQ3ZCO0FBQ0Q7O0FBRUQsU0FBTyxVQUFQLENBQWtCLFlBQU07QUFDdEIsUUFBSSxtQkFBSixFQUF5QjtBQUN2QiwwQkFBb0IsS0FBcEI7QUFDRCxLQUZELE1BRU87QUFDTCx5QkFBbUIsS0FBbkI7QUFDRDs7QUFFRDtBQUNBLG1CQUFlLE9BQWYsQ0FBdUIsVUFBQyxhQUFELEVBQW1CO0FBQ3hDLFVBQUksY0FBYyxnQkFBbEIsRUFBb0M7QUFDbEMsc0JBQWMsZ0JBQWQsQ0FBK0IsU0FBL0IsRUFBMEMsVUFBQyxLQUFELEVBQVc7QUFDbkQsY0FBTSxlQUFlLE1BQU0sS0FBTixLQUFnQixTQUFTLEdBQTlDOztBQUVBLGNBQUksQ0FBQyxZQUFMLEVBQW1CO0FBQ2pCO0FBQ0Q7QUFDRCxjQUFJLE1BQU0sUUFBVixFQUFvQjtBQUNsQixnQkFBSSxNQUFNLE1BQU4sS0FBaUIsa0JBQXJCLEVBQXlDO0FBQUU7QUFDekMsb0JBQU0sY0FBTjs7QUFFQSxnQ0FBa0IsS0FBbEI7QUFDRDtBQUNGLFdBTkQsTUFNTyxJQUFJLE1BQU0sTUFBTixLQUFpQixpQkFBckIsRUFBd0M7QUFBRTtBQUMvQyxrQkFBTSxjQUFOOztBQUVBLCtCQUFtQixLQUFuQjtBQUNEO0FBQ0YsU0FqQkQ7QUFrQkQ7QUFDRixLQXJCRDtBQXNCRCxHQTlCRCxFQThCRyxHQTlCSDtBQStCRCxDQTlDRDs7QUFnREEsSUFBTSxjQUFjLFNBQWQsV0FBYyxDQUFVLFlBQVYsRUFBd0IsU0FBeEIsRUFBbUM7QUFBQSxNQUM3QyxTQUQ2QyxHQUMvQixVQUFVLE9BRHFCLENBQzdDLFNBRDZDOztBQUdyRDs7QUFDQSxNQUFJLENBQUMsU0FBRCxJQUFjLGNBQWMsT0FBaEMsRUFBeUM7QUFDdkMsUUFBSSxZQUFKLENBQWlCLGFBQWpCLEVBQWdDLEtBQWhDO0FBQ0EsU0FBSyxTQUFMLENBQWUsTUFBZixDQUFzQixhQUF0QjtBQUNEOztBQUVELGVBQWEsWUFBYixDQUEwQixhQUExQixFQUF5QyxJQUF6Qzs7QUFFQTtBQUNBLFlBQVUsS0FBVjtBQUNELENBYkQ7O0FBZWUsU0FBUyxNQUFULENBQWdCLFNBQWhCLEVBQTJCLFFBQTNCLEVBQXFDO0FBQ2xELE1BQU0sZUFBZSxTQUFTLGFBQVQsT0FBMkIsVUFBVSxPQUFWLENBQWtCLE1BQTdDLENBQXJCO0FBQ0EsTUFBTSxtQkFBbUIsYUFBYSxnQkFBYixDQUE4QixnQkFBOUIsQ0FBekI7QUFGa0QsTUFHMUMsT0FIMEMsR0FHOUIsVUFBVSxPQUhvQixDQUcxQyxPQUgwQzs7QUFJbEQsTUFBTSxtQkFBbUIsQ0FBQyxPQUFELElBQVksWUFBWSxNQUFqRDs7QUFFQTtBQUNBLFlBQVUsZ0JBQVYsQ0FBMkIsT0FBM0IsRUFBb0MsVUFBQyxLQUFELEVBQVc7QUFDN0MsVUFBTSxjQUFOOztBQUVBLGVBQVcsWUFBWCxFQUF5QixRQUF6QjtBQUNELEdBSkQ7O0FBTUEsWUFBVSxnQkFBVixDQUEyQixTQUEzQixFQUFzQyxVQUFDLEtBQUQsRUFBVztBQUMvQyxRQUFJLE1BQU0sS0FBTixLQUFnQixTQUFTLEtBQTdCLEVBQW9DO0FBQ2xDLFlBQU0sY0FBTjs7QUFFQSxpQkFBVyxZQUFYLEVBQXlCLFFBQXpCO0FBQ0Q7QUFDRixHQU5EOztBQVFBO0FBQ0EsZUFBYSxnQkFBYixDQUE4QixTQUE5QixFQUF5QyxVQUFDLEtBQUQsRUFBVztBQUNsRCxRQUFJLE1BQU0sS0FBTixLQUFnQixTQUFTLE1BQTdCLEVBQXFDO0FBQ25DLGtCQUFZLFlBQVosRUFBMEIsU0FBMUI7QUFDRDtBQUNGLEdBSkQ7O0FBTUEsbUJBQWlCLE9BQWpCLENBQXlCLFVBQUMsZUFBRCxFQUFxQjtBQUM1QyxRQUFNLHdCQUF3QixTQUFTLGFBQVQsT0FBMkIsZ0JBQWdCLE9BQWhCLENBQXdCLE9BQW5ELENBQTlCOztBQUVBLG9CQUFnQixnQkFBaEIsQ0FBaUMsT0FBakMsRUFBMEMsVUFBQyxLQUFELEVBQVc7QUFDbkQsWUFBTSxjQUFOOztBQUVBLGtCQUFZLHFCQUFaLEVBQW1DLFNBQW5DO0FBQ0QsS0FKRDtBQUtBLG9CQUFnQixnQkFBaEIsQ0FBaUMsU0FBakMsRUFBNEMsVUFBQyxLQUFELEVBQVc7QUFDckQsVUFBSSxNQUFNLEtBQU4sS0FBZ0IsU0FBUyxLQUE3QixFQUFvQztBQUNsQyxjQUFNLGNBQU47O0FBRUEsb0JBQVkscUJBQVosRUFBbUMsU0FBbkM7QUFDRDtBQUNGLEtBTkQ7QUFPRCxHQWZEOztBQWlCQSxTQUFPLGdCQUFQLENBQXdCLE9BQXhCLEVBQWlDLFVBQUMsS0FBRCxFQUFXO0FBQzFDLFFBQUksTUFBTSxNQUFOLEtBQWlCLFlBQWpCLElBQWlDLGdCQUFyQyxFQUF1RDtBQUNyRCxrQkFBWSxZQUFaLEVBQTBCLFNBQTFCO0FBQ0Q7QUFDRixHQUpEO0FBS0Q7Ozs7Ozs7O2tCQ3JCdUIsSztBQWxHeEI7OztBQUdBLElBQU0sTUFBTSxLQUFaO0FBQ0EsSUFBTSxTQUFTLFFBQWY7QUFDQSxJQUFNLFNBQVMsUUFBZjtBQUNBLElBQU0saUJBQWlCLENBQ3JCO0FBQ0UsUUFBTSxhQURSO0FBRUUsUUFBTTtBQUZSLENBRHFCLEVBS3JCO0FBQ0UsUUFBTSxlQURSO0FBRUUsUUFBTTtBQUZSLENBTHFCLEVBU3JCO0FBQ0UsUUFBTSxlQURSO0FBRUUsUUFBTTtBQUZSLENBVHFCLEVBYXJCO0FBQ0UsUUFBTSxlQURSO0FBRUUsUUFBTTtBQUZSLENBYnFCLEVBaUJyQjtBQUNFLFFBQU0sY0FEUjtBQUVFLFFBQU07QUFGUixDQWpCcUIsRUFxQnJCO0FBQ0UsUUFBTSxjQURSO0FBRUUsUUFBTTtBQUZSLENBckJxQixDQUF2Qjs7QUEyQkEsSUFBTSxXQUFXLFNBQVgsUUFBVyxDQUFVLElBQVYsRUFBZ0IsVUFBaEIsRUFBNEIsU0FBNUIsRUFBdUM7QUFDdEQsTUFBSSxlQUFlLE9BQW5CLEVBQTRCO0FBQzFCLFFBQUksY0FBYyxHQUFsQixFQUF1QjtBQUNyQixXQUFLLFNBQUwsQ0FBZSxHQUFmLENBQW1CLFVBQW5CO0FBQ0QsS0FGRCxNQUVPLElBQUksY0FBYyxNQUFsQixFQUEwQjtBQUMvQixXQUFLLFNBQUwsQ0FBZSxNQUFmLENBQXNCLFVBQXRCO0FBQ0QsS0FGTSxNQUVBO0FBQ0wsV0FBSyxTQUFMLENBQWUsTUFBZixDQUFzQixVQUF0QjtBQUNEO0FBQ0Y7QUFDRixDQVZEOztBQVlBLElBQU0sVUFBVSxTQUFWLE9BQVUsQ0FBVSxJQUFWLEVBQWdCLFNBQWhCLEVBQTJCO0FBQ3pDLGlCQUFlLE9BQWYsQ0FBdUIsVUFBQyxhQUFELEVBQW1CO0FBQUEsUUFDaEMsSUFEZ0MsR0FDdkIsYUFEdUIsQ0FDaEMsSUFEZ0M7QUFBQSxRQUVoQyxJQUZnQyxHQUV2QixhQUZ1QixDQUVoQyxJQUZnQzs7O0FBSXhDLFFBQUksS0FBSyxZQUFMLENBQWtCLElBQWxCLENBQUosRUFBNkI7QUFDM0IsVUFBSSxjQUFjLEdBQWxCLEVBQXVCO0FBQ3JCLGFBQUssWUFBTCxDQUFrQixJQUFsQixFQUF3QixDQUFDLElBQXpCO0FBQ0QsT0FGRCxNQUVPLElBQUksY0FBYyxNQUFsQixFQUEwQjtBQUMvQixhQUFLLFlBQUwsQ0FBa0IsSUFBbEIsRUFBd0IsSUFBeEI7QUFDRCxPQUZNLE1BRUE7QUFDTCxhQUFLLFlBQUwsQ0FBa0IsSUFBbEIsRUFBd0IsS0FBSyxZQUFMLENBQWtCLElBQWxCLE1BQTRCLE1BQXBEO0FBQ0Q7QUFDRjtBQUNGLEdBYkQ7QUFjRCxDQWZEOztBQWlCQSxJQUFNLGNBQWMsU0FBZCxXQUFjLENBQVUsSUFBVixFQUFnQixRQUFoQixFQUEwQixTQUExQixFQUFxQztBQUN2RCxNQUFJLGFBQWEsTUFBakIsRUFBeUI7QUFDdkIsUUFBSSxjQUFjLEdBQWxCLEVBQXVCO0FBQ3JCLFdBQUssWUFBTCxDQUFrQixVQUFsQixFQUE4QixDQUE5QjtBQUNELEtBRkQsTUFFTyxJQUFJLGNBQWMsTUFBbEIsRUFBMEI7QUFDL0IsV0FBSyxZQUFMLENBQWtCLFVBQWxCLEVBQThCLENBQUMsQ0FBL0I7QUFDRCxLQUZNLE1BRUE7QUFDTCxXQUFLLFlBQUwsQ0FBa0IsVUFBbEIsRUFBOEIsS0FBSyxZQUFMLENBQWtCLFVBQWxCLE1BQWtDLElBQWxDLEdBQXlDLENBQXpDLEdBQTZDLENBQUMsQ0FBNUU7QUFDRDtBQUNGO0FBQ0YsQ0FWRDs7QUFZQSxJQUFNLFdBQVcsU0FBWCxRQUFXLENBQVUsVUFBVixFQUFzQjtBQUNyQyxhQUFXLFVBQVgsQ0FBc0IsT0FBdEIsQ0FBOEIsVUFBQyxTQUFELEVBQVksS0FBWixFQUFzQjtBQUNsRCxRQUFNLFFBQVEsU0FBUyxnQkFBVCxPQUE4QixXQUFXLE9BQVgsQ0FBbUIsS0FBbkIsQ0FBOUIsQ0FBZDtBQUNBLFFBQU0sYUFBYSxXQUFXLE1BQVgsQ0FBa0IsS0FBbEIsQ0FBbkI7QUFDQSxRQUFNLFdBQVcsV0FBVyxVQUFYLEtBQTBCLElBQTFCLEdBQWlDLFdBQVcsVUFBWCxDQUFzQixLQUF0QixDQUFqQyxHQUFnRSxJQUFqRjs7QUFFQSxVQUFNLE9BQU4sQ0FBYyxVQUFDLElBQUQsRUFBVTtBQUN0QixVQUFJLGNBQWMsR0FBbEIsRUFBdUI7QUFDckIsaUJBQVMsSUFBVCxFQUFlLFVBQWYsRUFBMkIsR0FBM0I7QUFDQSxnQkFBUSxJQUFSLEVBQWMsR0FBZDtBQUNBLG9CQUFZLElBQVosRUFBa0IsUUFBbEIsRUFBNEIsR0FBNUI7QUFDRCxPQUpELE1BSU8sSUFBSSxjQUFjLE1BQWxCLEVBQTBCO0FBQy9CLGlCQUFTLElBQVQsRUFBZSxVQUFmLEVBQTJCLE1BQTNCO0FBQ0EsZ0JBQVEsSUFBUixFQUFjLE1BQWQ7QUFDQSxvQkFBWSxJQUFaLEVBQWtCLFFBQWxCLEVBQTRCLE1BQTVCO0FBQ0QsT0FKTSxNQUlBO0FBQ0wsaUJBQVMsSUFBVCxFQUFlLFVBQWYsRUFBMkIsTUFBM0I7QUFDQSxnQkFBUSxJQUFSLEVBQWMsTUFBZDtBQUNBLG9CQUFZLElBQVosRUFBa0IsUUFBbEIsRUFBNEIsTUFBNUI7QUFDRDtBQUNGLEtBZEQ7QUFlRCxHQXBCRDtBQXFCRCxDQXRCRDs7QUF3QmUsU0FBUyxLQUFULENBQWUsSUFBZixFQUFxQixRQUFyQixFQUErQjtBQUM1QyxNQUFNLGFBQWE7QUFDakIsZ0JBQVksS0FBSyxPQUFMLENBQWEsU0FBYixDQUF1QixLQUF2QixDQUE2QixJQUE3QixDQURLO0FBRWpCLFlBQVEsS0FBSyxPQUFMLENBQWEsS0FBYixDQUFtQixLQUFuQixDQUF5QixJQUF6QixDQUZTO0FBR2pCLGdCQUFZLEtBQUssT0FBTCxDQUFhLFFBQWIsR0FBd0IsS0FBSyxPQUFMLENBQWEsUUFBYixDQUFzQixLQUF0QixDQUE0QixJQUE1QixDQUF4QixHQUE0RCxJQUh2RDtBQUlqQixhQUFTLEtBQUssT0FBTCxDQUFhLE1BQWIsQ0FBb0IsS0FBcEIsQ0FBMEIsSUFBMUI7QUFKUSxHQUFuQjs7QUFPQSxPQUFLLGdCQUFMLENBQXNCLE9BQXRCLEVBQStCLFVBQUMsS0FBRCxFQUFXO0FBQ3hDLFVBQU0sY0FBTjs7QUFFQSxhQUFTLFVBQVQ7QUFDRCxHQUpEO0FBS0EsT0FBSyxnQkFBTCxDQUFzQixTQUF0QixFQUFpQyxVQUFDLEtBQUQsRUFBVztBQUMxQyxRQUFJLE1BQU0sS0FBTixLQUFnQixTQUFTLEtBQTdCLEVBQW9DO0FBQ2xDLFlBQU0sY0FBTjs7QUFFQSxlQUFTLFVBQVQ7QUFDRDtBQUNGLEdBTkQ7QUFPRDs7Ozs7Ozs7a0JDM0Z1QixJO0FBM0J4Qjs7O0FBR0EsSUFBTSxVQUFVLFNBQVYsT0FBVSxDQUFVLE9BQVYsRUFBbUIsS0FBbkIsRUFBeUQ7QUFBQSxNQUEvQixVQUErQix1RUFBbEIsRUFBRSxPQUFPLEtBQVQsRUFBa0I7QUFBQSxNQUMvRCxLQUQrRCxHQUNyRCxVQURxRCxDQUMvRCxLQUQrRDs7O0FBR3ZFLE1BQUksS0FBSixFQUFXO0FBQ1QsWUFBUSxLQUFSO0FBQ0Q7O0FBRUQsVUFBUSxZQUFSLENBQXFCLFVBQXJCLEVBQWlDLENBQWpDO0FBQ0EsVUFBUSxZQUFSLENBQXFCLGVBQXJCLEVBQXNDLElBQXRDO0FBQ0EsUUFBTSxZQUFOLENBQW1CLGFBQW5CLEVBQWtDLEtBQWxDO0FBQ0QsQ0FWRDs7QUFZQSxJQUFNLFdBQVcsU0FBWCxRQUFXLENBQVUsT0FBVixFQUFtQixLQUFuQixFQUEwQjtBQUN6QyxVQUFRLFlBQVIsQ0FBcUIsVUFBckIsRUFBaUMsQ0FBQyxDQUFsQztBQUNBLFVBQVEsWUFBUixDQUFxQixlQUFyQixFQUFzQyxLQUF0QztBQUNBLFFBQU0sWUFBTixDQUFtQixhQUFuQixFQUFrQyxJQUFsQztBQUNELENBSkQ7O0FBTUEsSUFBTSxZQUFZLFNBQVosU0FBWSxDQUFVLFFBQVYsRUFBb0IsTUFBcEIsRUFBNEI7QUFDNUMsV0FBUyxPQUFULENBQWlCLFVBQUMsT0FBRCxFQUFVLEtBQVYsRUFBb0I7QUFDbkMsYUFBUyxPQUFULEVBQWtCLE9BQU8sS0FBUCxDQUFsQjtBQUNELEdBRkQ7QUFHRCxDQUpEOztBQU1lLFNBQVMsSUFBVCxDQUFjLFVBQWQsRUFBMEIsUUFBMUIsRUFBb0M7QUFDakQsTUFBTSxXQUFXLFdBQVcsZ0JBQVgsQ0FBNEIsYUFBNUIsQ0FBakI7QUFDQSxNQUFNLFNBQVMsV0FBVyxnQkFBWCxDQUE0QixrQkFBNUIsQ0FBZjs7QUFFQSxXQUFTLE9BQVQsQ0FBaUIsVUFBQyxPQUFELEVBQVUsS0FBVixFQUFvQjtBQUNuQyxRQUFNLGVBQWUsU0FBUyxDQUFULENBQXJCO0FBQ0EsUUFBTSxjQUFjLFNBQVMsU0FBUyxNQUFULEdBQWtCLENBQTNCLENBQXBCO0FBQ0EsUUFBTSxjQUFjLFNBQVMsUUFBUSxDQUFqQixJQUFzQixTQUFTLFFBQVEsQ0FBakIsQ0FBdEIsR0FBNEMsU0FBUyxTQUFTLE1BQVQsR0FBa0IsQ0FBM0IsQ0FBaEU7QUFDQSxRQUFNLGNBQWMsU0FBUyxRQUFRLENBQWpCLElBQXNCLFNBQVMsUUFBUSxDQUFqQixDQUF0QixHQUE0QyxTQUFTLENBQVQsQ0FBaEU7QUFDQSxRQUFNLFFBQVEsU0FBUyxjQUFULENBQXdCLFFBQVEsWUFBUixDQUFxQixlQUFyQixDQUF4QixDQUFkO0FBQ0EsUUFBTSxhQUFhLFNBQVMsY0FBVCxDQUF3QixhQUFhLFlBQWIsQ0FBMEIsZUFBMUIsQ0FBeEIsQ0FBbkI7QUFDQSxRQUFNLFlBQVksU0FBUyxjQUFULENBQXdCLFlBQVksWUFBWixDQUF5QixlQUF6QixDQUF4QixDQUFsQjtBQUNBLFFBQU0sWUFBWSxTQUFTLGNBQVQsQ0FBd0IsWUFBWSxZQUFaLENBQXlCLGVBQXpCLENBQXhCLENBQWxCO0FBQ0EsUUFBTSxZQUFZLFNBQVMsY0FBVCxDQUF3QixZQUFZLFlBQVosQ0FBeUIsZUFBekIsQ0FBeEIsQ0FBbEI7O0FBRUE7QUFDQSxZQUFRLGdCQUFSLENBQXlCLE9BQXpCLEVBQWtDLFVBQUMsS0FBRCxFQUFXO0FBQzNDLFlBQU0sY0FBTjs7QUFFQSxnQkFBVSxRQUFWLEVBQW9CLE1BQXBCO0FBQ0EsY0FBUSxPQUFSLEVBQWlCLEtBQWpCO0FBQ0QsS0FMRDs7QUFPQTtBQUNBLFlBQVEsZ0JBQVIsQ0FBeUIsU0FBekIsRUFBb0MsVUFBQyxLQUFELEVBQVc7QUFDN0MsVUFBSSxNQUFNLEtBQU4sS0FBZ0IsU0FBUyxJQUF6QixJQUFpQyxNQUFNLEtBQU4sS0FBZ0IsU0FBUyxFQUE5RCxFQUFrRTtBQUNoRSxjQUFNLGNBQU47O0FBRUEsa0JBQVUsUUFBVixFQUFvQixNQUFwQjtBQUNBLGdCQUFRLFdBQVIsRUFBcUIsU0FBckIsRUFBZ0MsRUFBRSxPQUFPLElBQVQsRUFBaEM7QUFDRDtBQUNGLEtBUEQ7O0FBU0E7QUFDQSxZQUFRLGdCQUFSLENBQXlCLFNBQXpCLEVBQW9DLFVBQUMsS0FBRCxFQUFXO0FBQzdDLFVBQUksTUFBTSxLQUFOLEtBQWdCLFNBQVMsS0FBekIsSUFBa0MsTUFBTSxLQUFOLEtBQWdCLFNBQVMsSUFBL0QsRUFBcUU7QUFDbkUsY0FBTSxjQUFOOztBQUVBLGtCQUFVLFFBQVYsRUFBb0IsTUFBcEI7QUFDQSxnQkFBUSxXQUFSLEVBQXFCLFNBQXJCLEVBQWdDLEVBQUUsT0FBTyxJQUFULEVBQWhDO0FBQ0Q7QUFDRixLQVBEOztBQVNBO0FBQ0EsWUFBUSxnQkFBUixDQUF5QixTQUF6QixFQUFvQyxVQUFDLEtBQUQsRUFBVztBQUM3QyxVQUFJLE1BQU0sS0FBTixLQUFnQixTQUFTLElBQTdCLEVBQW1DO0FBQ2pDLGNBQU0sY0FBTjs7QUFFQSxrQkFBVSxRQUFWLEVBQW9CLE1BQXBCO0FBQ0EsZ0JBQVEsWUFBUixFQUFzQixVQUF0QixFQUFrQyxFQUFFLE9BQU8sSUFBVCxFQUFsQztBQUNEO0FBQ0YsS0FQRDs7QUFTQTtBQUNBLFlBQVEsZ0JBQVIsQ0FBeUIsU0FBekIsRUFBb0MsVUFBQyxLQUFELEVBQVc7QUFDN0MsVUFBSSxNQUFNLEtBQU4sS0FBZ0IsU0FBUyxHQUE3QixFQUFrQztBQUNoQyxjQUFNLGNBQU47O0FBRUEsa0JBQVUsUUFBVixFQUFvQixNQUFwQjtBQUNBLGdCQUFRLFdBQVIsRUFBcUIsU0FBckIsRUFBZ0MsRUFBRSxPQUFPLElBQVQsRUFBaEM7QUFDRDtBQUNGLEtBUEQ7QUFRRCxHQTFERDtBQTJERCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBhcHBcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5pbXBvcnQgc3RhdGUgZnJvbSAnLi9jb21wb25lbnRzL3N0YXRlcyc7XG5pbXBvcnQgZGlhbG9nIGZyb20gJy4vY29tcG9uZW50cy9kaWFsb2dzJztcbmltcG9ydCB0YWJzIGZyb20gJy4vY29tcG9uZW50cy90YWJzJztcblxuY29uc3Qga2V5Q29kZXMgPSB7XG4gIHRhYjogOSxcbiAgZW50ZXI6IDEzLFxuICBlc2NhcGU6IDI3LFxuICBlbmQ6IDM1LFxuICBob21lOiAzNixcbiAgbGVmdDogMzcsXG4gIHVwOiAzOCxcbiAgcmlnaHQ6IDM5LFxuICBkb3duOiA0MCxcbn07XG5cbmNvbnN0IHRlc3RDb21wb25lbnRUeXBlID0gZnVuY3Rpb24gKGNvbXBvbmVudCkge1xuICBjb25zdCBkYXRhQ29tcG9uZW50ID0gY29tcG9uZW50LmRhdGFzZXQuY29tcG9uZW50O1xuXG4gIGlmIChkYXRhQ29tcG9uZW50ID09PSAnc3RhdGUnKSB7XG4gICAgc3RhdGUoY29tcG9uZW50LCBrZXlDb2Rlcyk7XG4gIH1cbiAgaWYgKGRhdGFDb21wb25lbnQgPT09ICdkaWFsb2cnKSB7XG4gICAgZGlhbG9nKGNvbXBvbmVudCwga2V5Q29kZXMpO1xuICB9XG4gIGlmIChkYXRhQ29tcG9uZW50ID09PSAndGFicycpIHtcbiAgICB0YWJzKGNvbXBvbmVudCwga2V5Q29kZXMpO1xuICB9XG59O1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICBjb25zdCBjb21wb25lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtY29tcG9uZW50XScpO1xuXG4gIGNvbXBvbmVudHMuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgdGVzdENvbXBvbmVudFR5cGUoY29tcG9uZW50KTtcbiAgfSk7XG5cbiAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XG4gICAgbXV0YXRpb25zLmZvckVhY2goKG11dGF0aW9uKSA9PiB7XG4gICAgICBtdXRhdGlvbi5hZGRlZE5vZGVzLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5nZXRBdHRyaWJ1dGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBpZiAoY29tcG9uZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1jb21wb25lbnQnKSkge1xuICAgICAgICAgICAgdGVzdENvbXBvbmVudFR5cGUoY29tcG9uZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbiAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCB7XG4gICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgIHN1YnRyZWU6IHRydWUsXG4gIH0pO1xufSk7XG4iLCIvKiBkaWFsb2dzXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuY29uc3QgcGFnZSA9IGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3IoJy5qcy1wYWdlJyk7XG5jb25zdCBkb2MgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKCcuanMtZG9jdW1lbnQnKTtcblxuY29uc3Qgb3BlbkRpYWxvZyA9IGZ1bmN0aW9uIChkaWFsb2dXaWRnZXQsIGtleUNvZGVzKSB7XG4gIGNvbnN0IGZvY3VzYWJsZUVsZW1zID0gZGlhbG9nV2lkZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tocmVmXSwgYnV0dG9uLCBpbnB1dCwgc2VsZWN0LCB0ZXh0YXJlYSwgW3RhYmluZGV4XTpub3QoW3RhYmluZGV4PVwiLTFcIl0nKTtcbiAgY29uc3QgZmlyc3RGb2N1c2FibGVFbGVtID0gZm9jdXNhYmxlRWxlbXNbMF07XG4gIGNvbnN0IHNlY29uZEZvY3VzYWJsZUVsZW0gPSBmb2N1c2FibGVFbGVtc1sxXTtcbiAgY29uc3QgbGFzdEZvY3VzYWJsZUVsZW0gPSBmb2N1c2FibGVFbGVtc1tmb2N1c2FibGVFbGVtcy5sZW5ndGggLSAxXTtcblxuICBkaWFsb2dXaWRnZXQuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIGZhbHNlKTtcbiAgZG9jLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcbiAgcGFnZS5jbGFzc0xpc3QuYWRkKCdpcy1pbmFjdGl2ZScpO1xuXG4gIC8vIHJldHVybiBpZiBubyBmb2N1c2FibGUgZWxlbWVudFxuICBpZiAoIWZpcnN0Rm9jdXNhYmxlRWxlbSkge1xuICAgIHJldHVybjtcbiAgfVxuXG4gIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcbiAgICBpZiAoc2Vjb25kRm9jdXNhYmxlRWxlbSkge1xuICAgICAgc2Vjb25kRm9jdXNhYmxlRWxlbS5mb2N1cygpO1xuICAgIH0gZWxzZSB7XG4gICAgICBmaXJzdEZvY3VzYWJsZUVsZW0uZm9jdXMoKTtcbiAgICB9XG5cbiAgICAvLyB0cmFwcGluZyBmb2N1cyBpbnNpZGUgdGhlIGRpYWxvZ1xuICAgIGZvY3VzYWJsZUVsZW1zLmZvckVhY2goKGZvY3VzYWJsZUVsZW0pID0+IHtcbiAgICAgIGlmIChmb2N1c2FibGVFbGVtLmFkZEV2ZW50TGlzdGVuZXIpIHtcbiAgICAgICAgZm9jdXNhYmxlRWxlbS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgICAgICAgY29uc3QgaXNUYWJQcmVzc2VkID0gZXZlbnQud2hpY2ggPT09IGtleUNvZGVzLnRhYjtcblxuICAgICAgICAgIGlmICghaXNUYWJQcmVzc2VkKSB7XG4gICAgICAgICAgICByZXR1cm47XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChldmVudC5zaGlmdEtleSkge1xuICAgICAgICAgICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gZmlyc3RGb2N1c2FibGVFbGVtKSB7IC8vIHNoaWZ0ICsgdGFiXG4gICAgICAgICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgICAgICAgbGFzdEZvY3VzYWJsZUVsZW0uZm9jdXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LnRhcmdldCA9PT0gbGFzdEZvY3VzYWJsZUVsZW0pIHsgLy8gdGFiXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICAgICAgICBmaXJzdEZvY3VzYWJsZUVsZW0uZm9jdXMoKTtcbiAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgICAgfVxuICAgIH0pO1xuICB9LCAxMDApO1xufTtcblxuY29uc3QgY2xvc2VEaWFsb2cgPSBmdW5jdGlvbiAoZGlhbG9nV2lkZ2V0LCBkaWFsb2dTcmMpIHtcbiAgY29uc3QgeyBpbmNlcHRpb24gfSA9IGRpYWxvZ1NyYy5kYXRhc2V0O1xuXG4gIC8vIGNoZWNrIGlmIGRpYWxvZyBpcyBpbnNpZGUgYW5vdGhlciBkaWFsb2dcbiAgaWYgKCFpbmNlcHRpb24gfHwgaW5jZXB0aW9uID09PSAnZmFsc2UnKSB7XG4gICAgZG9jLnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCBmYWxzZSk7XG4gICAgcGFnZS5jbGFzc0xpc3QucmVtb3ZlKCdpcy1pbmFjdGl2ZScpO1xuICB9XG5cbiAgZGlhbG9nV2lkZ2V0LnNldEF0dHJpYnV0ZSgnYXJpYS1oaWRkZW4nLCB0cnVlKTtcblxuICAvLyByZXN0b3JpbmcgZm9jdXNcbiAgZGlhbG9nU3JjLmZvY3VzKCk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBkaWFsb2coZGlhbG9nU3JjLCBrZXlDb2Rlcykge1xuICBjb25zdCBkaWFsb2dXaWRnZXQgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKGAuJHtkaWFsb2dTcmMuZGF0YXNldC50YXJnZXR9YCk7XG4gIGNvbnN0IGRpYWxvZ3NUb0Rpc21pc3MgPSBkaWFsb2dXaWRnZXQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtZGlzbWlzc10nKTtcbiAgY29uc3QgeyBvdmVybGF5IH0gPSBkaWFsb2dTcmMuZGF0YXNldDtcbiAgY29uc3Qgb3ZlcmxheUlzRW5hYmxlZCA9ICFvdmVybGF5IHx8IG92ZXJsYXkgPT09ICd0cnVlJztcblxuICAvLyBvcGVuIGRpYWxvZ1xuICBkaWFsb2dTcmMuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgb3BlbkRpYWxvZyhkaWFsb2dXaWRnZXQsIGtleUNvZGVzKTtcbiAgfSk7XG5cbiAgZGlhbG9nU3JjLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICBpZiAoZXZlbnQud2hpY2ggPT09IGtleUNvZGVzLmVudGVyKSB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBvcGVuRGlhbG9nKGRpYWxvZ1dpZGdldCwga2V5Q29kZXMpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gY2xvc2UgZGlhbG9nXG4gIGRpYWxvZ1dpZGdldC5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgaWYgKGV2ZW50LndoaWNoID09PSBrZXlDb2Rlcy5lc2NhcGUpIHtcbiAgICAgIGNsb3NlRGlhbG9nKGRpYWxvZ1dpZGdldCwgZGlhbG9nU3JjKTtcbiAgICB9XG4gIH0pO1xuXG4gIGRpYWxvZ3NUb0Rpc21pc3MuZm9yRWFjaCgoZGlhbG9nVG9EaXNtaXNzKSA9PiB7XG4gICAgY29uc3QgZGlhbG9nV2lkZ2V0VG9EaXNtaXNzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLiR7ZGlhbG9nVG9EaXNtaXNzLmRhdGFzZXQuZGlzbWlzc31gKTtcblxuICAgIGRpYWxvZ1RvRGlzbWlzcy5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgY2xvc2VEaWFsb2coZGlhbG9nV2lkZ2V0VG9EaXNtaXNzLCBkaWFsb2dTcmMpO1xuICAgIH0pO1xuICAgIGRpYWxvZ1RvRGlzbWlzcy5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQud2hpY2ggPT09IGtleUNvZGVzLmVudGVyKSB7XG4gICAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG5cbiAgICAgICAgY2xvc2VEaWFsb2coZGlhbG9nV2lkZ2V0VG9EaXNtaXNzLCBkaWFsb2dTcmMpO1xuICAgICAgfVxuICAgIH0pO1xuICB9KTtcblxuICB3aW5kb3cuYWRkRXZlbnRMaXN0ZW5lcignY2xpY2snLCAoZXZlbnQpID0+IHtcbiAgICBpZiAoZXZlbnQudGFyZ2V0ID09PSBkaWFsb2dXaWRnZXQgJiYgb3ZlcmxheUlzRW5hYmxlZCkge1xuICAgICAgY2xvc2VEaWFsb2coZGlhbG9nV2lkZ2V0LCBkaWFsb2dTcmMpO1xuICAgIH1cbiAgfSk7XG59XG4iLCIvKiBzdGF0ZXNcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5jb25zdCBhZGQgPSAnYWRkJztcbmNvbnN0IHJlbW92ZSA9ICdyZW1vdmUnO1xuY29uc3QgdG9nZ2xlID0gJ3RvZ2dsZSc7XG5jb25zdCBhcmlhQXR0cmlidXRlcyA9IFtcbiAge1xuICAgIHR5cGU6ICdhcmlhLWhpZGRlbicsXG4gICAgaW5pdDogdHJ1ZSxcbiAgfSxcbiAge1xuICAgIHR5cGU6ICdhcmlhLWRpc2FibGVkJyxcbiAgICBpbml0OiB0cnVlLFxuICB9LFxuICB7XG4gICAgdHlwZTogJ2FyaWEtc2VsZWN0ZWQnLFxuICAgIGluaXQ6IGZhbHNlLFxuICB9LFxuICB7XG4gICAgdHlwZTogJ2FyaWEtZXhwYW5kZWQnLFxuICAgIGluaXQ6IGZhbHNlLFxuICB9LFxuICB7XG4gICAgdHlwZTogJ2FyaWEtcHJlc3NlZCcsXG4gICAgaW5pdDogZmFsc2UsXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnYXJpYS1jaGVja2VkJyxcbiAgICBpbml0OiBmYWxzZSxcbiAgfSxcbl07XG5cbmNvbnN0IHNldENsYXNzID0gZnVuY3Rpb24gKGVsZW0sIHN0YXRlQ2xhc3MsIGJlaGF2aW91cikge1xuICBpZiAoc3RhdGVDbGFzcyAhPT0gJ2ZhbHNlJykge1xuICAgIGlmIChiZWhhdmlvdXIgPT09IGFkZCkge1xuICAgICAgZWxlbS5jbGFzc0xpc3QuYWRkKHN0YXRlQ2xhc3MpO1xuICAgIH0gZWxzZSBpZiAoYmVoYXZpb3VyID09PSByZW1vdmUpIHtcbiAgICAgIGVsZW0uY2xhc3NMaXN0LnJlbW92ZShzdGF0ZUNsYXNzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbS5jbGFzc0xpc3QudG9nZ2xlKHN0YXRlQ2xhc3MpO1xuICAgIH1cbiAgfVxufTtcblxuY29uc3Qgc2V0QXJpYSA9IGZ1bmN0aW9uIChlbGVtLCBiZWhhdmlvdXIpIHtcbiAgYXJpYUF0dHJpYnV0ZXMuZm9yRWFjaCgoYXJpYUF0dHJpYnV0ZSkgPT4ge1xuICAgIGNvbnN0IHsgdHlwZSB9ID0gYXJpYUF0dHJpYnV0ZTtcbiAgICBjb25zdCB7IGluaXQgfSA9IGFyaWFBdHRyaWJ1dGU7XG5cbiAgICBpZiAoZWxlbS5oYXNBdHRyaWJ1dGUodHlwZSkpIHtcbiAgICAgIGlmIChiZWhhdmlvdXIgPT09IGFkZCkge1xuICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZSh0eXBlLCAhaW5pdCk7XG4gICAgICB9IGVsc2UgaWYgKGJlaGF2aW91ciA9PT0gcmVtb3ZlKSB7XG4gICAgICAgIGVsZW0uc2V0QXR0cmlidXRlKHR5cGUsIGluaXQpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUodHlwZSwgZWxlbS5nZXRBdHRyaWJ1dGUodHlwZSkgIT09ICd0cnVlJyk7XG4gICAgICB9XG4gICAgfVxuICB9KTtcbn07XG5cbmNvbnN0IHNldFRhYmluZGV4ID0gZnVuY3Rpb24gKGVsZW0sIHRhYmluZGV4LCBiZWhhdmlvdXIpIHtcbiAgaWYgKHRhYmluZGV4ID09PSAndHJ1ZScpIHtcbiAgICBpZiAoYmVoYXZpb3VyID09PSBhZGQpIHtcbiAgICAgIGVsZW0uc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIDApO1xuICAgIH0gZWxzZSBpZiAoYmVoYXZpb3VyID09PSByZW1vdmUpIHtcbiAgICAgIGVsZW0uc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIC0xKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgZWxlbS5nZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JykgPT09ICctMScgPyAwIDogLTEpO1xuICAgIH1cbiAgfVxufTtcblxuY29uc3Qgc2V0U3RhdGUgPSBmdW5jdGlvbiAocGFyYW1ldGVycykge1xuICBwYXJhbWV0ZXJzLmJlaGF2aW91cnMuZm9yRWFjaCgoYmVoYXZpb3VyLCBpbmRleCkgPT4ge1xuICAgIGNvbnN0IGVsZW1zID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbChgLiR7cGFyYW1ldGVycy50YXJnZXRzW2luZGV4XX1gKTtcbiAgICBjb25zdCBzdGF0ZUNsYXNzID0gcGFyYW1ldGVycy5zdGF0ZXNbaW5kZXhdO1xuICAgIGNvbnN0IHRhYmluZGV4ID0gcGFyYW1ldGVycy50YWJpbmRleGVzICE9PSBudWxsID8gcGFyYW1ldGVycy50YWJpbmRleGVzW2luZGV4XSA6IG51bGw7XG5cbiAgICBlbGVtcy5mb3JFYWNoKChlbGVtKSA9PiB7XG4gICAgICBpZiAoYmVoYXZpb3VyID09PSBhZGQpIHtcbiAgICAgICAgc2V0Q2xhc3MoZWxlbSwgc3RhdGVDbGFzcywgYWRkKTtcbiAgICAgICAgc2V0QXJpYShlbGVtLCBhZGQpO1xuICAgICAgICBzZXRUYWJpbmRleChlbGVtLCB0YWJpbmRleCwgYWRkKTtcbiAgICAgIH0gZWxzZSBpZiAoYmVoYXZpb3VyID09PSByZW1vdmUpIHtcbiAgICAgICAgc2V0Q2xhc3MoZWxlbSwgc3RhdGVDbGFzcywgcmVtb3ZlKTtcbiAgICAgICAgc2V0QXJpYShlbGVtLCByZW1vdmUpO1xuICAgICAgICBzZXRUYWJpbmRleChlbGVtLCB0YWJpbmRleCwgcmVtb3ZlKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHNldENsYXNzKGVsZW0sIHN0YXRlQ2xhc3MsIHRvZ2dsZSk7XG4gICAgICAgIHNldEFyaWEoZWxlbSwgdG9nZ2xlKTtcbiAgICAgICAgc2V0VGFiaW5kZXgoZWxlbSwgdGFiaW5kZXgsIHRvZ2dsZSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0pO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gc3RhdGUoZWxlbSwga2V5Q29kZXMpIHtcbiAgY29uc3QgcGFyYW1ldGVycyA9IHtcbiAgICBiZWhhdmlvdXJzOiBlbGVtLmRhdGFzZXQuYmVoYXZpb3VyLnNwbGl0KCcsICcpLFxuICAgIHN0YXRlczogZWxlbS5kYXRhc2V0LnN0YXRlLnNwbGl0KCcsICcpLFxuICAgIHRhYmluZGV4ZXM6IGVsZW0uZGF0YXNldC50YWJpbmRleCA/IGVsZW0uZGF0YXNldC50YWJpbmRleC5zcGxpdCgnLCAnKSA6IG51bGwsXG4gICAgdGFyZ2V0czogZWxlbS5kYXRhc2V0LnRhcmdldC5zcGxpdCgnLCAnKSxcbiAgfTtcblxuICBlbGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgIHNldFN0YXRlKHBhcmFtZXRlcnMpO1xuICB9KTtcbiAgZWxlbS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgaWYgKGV2ZW50LndoaWNoID09PSBrZXlDb2Rlcy5lbnRlcikge1xuICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgc2V0U3RhdGUocGFyYW1ldGVycyk7XG4gICAgfVxuICB9KTtcbn1cbiIsIi8qIHRhYnNcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5jb25zdCBvcGVuVGFiID0gZnVuY3Rpb24gKHRhYkl0ZW0sIHBhbmVsLCBwYXJhbWV0ZXJzID0geyBmb2N1czogZmFsc2UgfSkge1xuICBjb25zdCB7IGZvY3VzIH0gPSBwYXJhbWV0ZXJzO1xuXG4gIGlmIChmb2N1cykge1xuICAgIHRhYkl0ZW0uZm9jdXMoKTtcbiAgfVxuXG4gIHRhYkl0ZW0uc2V0QXR0cmlidXRlKCd0YWJpbmRleCcsIDApO1xuICB0YWJJdGVtLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIHRydWUpO1xuICBwYW5lbC5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgZmFsc2UpO1xufTtcblxuY29uc3QgY2xvc2VUYWIgPSBmdW5jdGlvbiAodGFiSXRlbSwgcGFuZWwpIHtcbiAgdGFiSXRlbS5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgLTEpO1xuICB0YWJJdGVtLnNldEF0dHJpYnV0ZSgnYXJpYS1zZWxlY3RlZCcsIGZhbHNlKTtcbiAgcGFuZWwuc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIHRydWUpO1xufTtcblxuY29uc3QgY2xvc2VUYWJzID0gZnVuY3Rpb24gKHRhYkl0ZW1zLCBwYW5lbHMpIHtcbiAgdGFiSXRlbXMuZm9yRWFjaCgodGFiSXRlbSwgaW5kZXgpID0+IHtcbiAgICBjbG9zZVRhYih0YWJJdGVtLCBwYW5lbHNbaW5kZXhdKTtcbiAgfSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiB0YWJzKHRhYnNXaWRnZXQsIGtleUNvZGVzKSB7XG4gIGNvbnN0IHRhYkl0ZW1zID0gdGFic1dpZGdldC5xdWVyeVNlbGVjdG9yQWxsKCdbcm9sZT1cInRhYlwiJyk7XG4gIGNvbnN0IHBhbmVscyA9IHRhYnNXaWRnZXQucXVlcnlTZWxlY3RvckFsbCgnW3JvbGU9XCJ0YWJwYW5lbFwiJyk7XG5cbiAgdGFiSXRlbXMuZm9yRWFjaCgodGFiSXRlbSwgaW5kZXgpID0+IHtcbiAgICBjb25zdCBmaXJzdFRhYkl0ZW0gPSB0YWJJdGVtc1swXTtcbiAgICBjb25zdCBsYXN0VGFiSXRlbSA9IHRhYkl0ZW1zW3RhYkl0ZW1zLmxlbmd0aCAtIDFdO1xuICAgIGNvbnN0IHByZXZUYWJJdGVtID0gdGFiSXRlbXNbaW5kZXggLSAxXSA/IHRhYkl0ZW1zW2luZGV4IC0gMV0gOiB0YWJJdGVtc1t0YWJJdGVtcy5sZW5ndGggLSAxXTtcbiAgICBjb25zdCBuZXh0VGFiSXRlbSA9IHRhYkl0ZW1zW2luZGV4ICsgMV0gPyB0YWJJdGVtc1tpbmRleCArIDFdIDogdGFiSXRlbXNbMF07XG4gICAgY29uc3QgcGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0YWJJdGVtLmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpKTtcbiAgICBjb25zdCBmaXJzdFBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZmlyc3RUYWJJdGVtLmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpKTtcbiAgICBjb25zdCBsYXN0UGFuZWwgPSBkb2N1bWVudC5nZXRFbGVtZW50QnlJZChsYXN0VGFiSXRlbS5nZXRBdHRyaWJ1dGUoJ2FyaWEtY29udHJvbHMnKSk7XG4gICAgY29uc3QgcHJldlBhbmVsID0gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQocHJldlRhYkl0ZW0uZ2V0QXR0cmlidXRlKCdhcmlhLWNvbnRyb2xzJykpO1xuICAgIGNvbnN0IG5leHRQYW5lbCA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKG5leHRUYWJJdGVtLmdldEF0dHJpYnV0ZSgnYXJpYS1jb250cm9scycpKTtcblxuICAgIC8vIG9wZW4gY3VycmVudCB0YWJcbiAgICB0YWJJdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuXG4gICAgICBjbG9zZVRhYnModGFiSXRlbXMsIHBhbmVscyk7XG4gICAgICBvcGVuVGFiKHRhYkl0ZW0sIHBhbmVsKTtcbiAgICB9KTtcblxuICAgIC8vIG9wZW4gcHJldiB0YWJcbiAgICB0YWJJdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC53aGljaCA9PT0ga2V5Q29kZXMubGVmdCB8fCBldmVudC53aGljaCA9PT0ga2V5Q29kZXMudXApIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBjbG9zZVRhYnModGFiSXRlbXMsIHBhbmVscyk7XG4gICAgICAgIG9wZW5UYWIocHJldlRhYkl0ZW0sIHByZXZQYW5lbCwgeyBmb2N1czogdHJ1ZSB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIG9wZW4gbmV4dCB0YWJcbiAgICB0YWJJdGVtLmFkZEV2ZW50TGlzdGVuZXIoJ2tleWRvd24nLCAoZXZlbnQpID0+IHtcbiAgICAgIGlmIChldmVudC53aGljaCA9PT0ga2V5Q29kZXMucmlnaHQgfHwgZXZlbnQud2hpY2ggPT09IGtleUNvZGVzLmRvd24pIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBjbG9zZVRhYnModGFiSXRlbXMsIHBhbmVscyk7XG4gICAgICAgIG9wZW5UYWIobmV4dFRhYkl0ZW0sIG5leHRQYW5lbCwgeyBmb2N1czogdHJ1ZSB9KTtcbiAgICAgIH1cbiAgICB9KTtcblxuICAgIC8vIG9wZW4gZmlyc3QgdGFiXG4gICAgdGFiSXRlbS5hZGRFdmVudExpc3RlbmVyKCdrZXlkb3duJywgKGV2ZW50KSA9PiB7XG4gICAgICBpZiAoZXZlbnQud2hpY2ggPT09IGtleUNvZGVzLmhvbWUpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBjbG9zZVRhYnModGFiSXRlbXMsIHBhbmVscyk7XG4gICAgICAgIG9wZW5UYWIoZmlyc3RUYWJJdGVtLCBmaXJzdFBhbmVsLCB7IGZvY3VzOiB0cnVlIH0pO1xuICAgICAgfVxuICAgIH0pO1xuXG4gICAgLy8gb3BlbiBsYXN0IHRhYlxuICAgIHRhYkl0ZW0uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgaWYgKGV2ZW50LndoaWNoID09PSBrZXlDb2Rlcy5lbmQpIHtcbiAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcblxuICAgICAgICBjbG9zZVRhYnModGFiSXRlbXMsIHBhbmVscyk7XG4gICAgICAgIG9wZW5UYWIobGFzdFRhYkl0ZW0sIGxhc3RQYW5lbCwgeyBmb2N1czogdHJ1ZSB9KTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59XG4iXX0=
