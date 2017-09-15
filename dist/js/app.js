(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

var _states = require('./components/states');

var _states2 = _interopRequireDefault(_states);

var _dialogs = require('./components/dialogs');

var _dialogs2 = _interopRequireDefault(_dialogs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/* app
 ========================================================================== */

var isComponent = function isComponent(component) {
  var dataComponent = component.dataset.component;

  if (dataComponent === 'state') {
    (0, _states2.default)(component);
  }
  if (dataComponent === 'dialog') {
    (0, _dialogs2.default)(component);
  }
};

document.addEventListener('DOMContentLoaded', function () {
  var components = document.querySelectorAll('[data-component]');

  components.forEach(function (component) {
    isComponent(component);
  });

  var observer = new MutationObserver(function (mutations) {
    mutations.forEach(function (mutation) {
      mutation.addedNodes.forEach(function (component) {
        if (typeof component.getAttribute === 'function') {
          if (component.getAttribute('data-component')) {
            isComponent(component);
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

},{"./components/dialogs":2,"./components/states":3}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = dialog;
/* dialogs
 ========================================================================== */

var showDialog = function showDialog(elem) {
  var focusableElems = elem.querySelectorAll('[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"]');
  var firstFocusableElem = focusableElems[0];
  var lastFocusableElem = focusableElems[focusableElems.length - 1];

  elem.setAttribute('aria-hidden', false);

  window.setTimeout(function () {
    firstFocusableElem.focus();

    focusableElems.forEach(function (focusableElem) {
      if (focusableElem.addEventListener) {
        focusableElem.addEventListener('keydown', function (event) {
          var isTabPressed = event.which === 9;

          if (!isTabPressed) {
            return;
          }
          if (event.shiftKey) {
            if (event.target === firstFocusableElem) {
              // shift + tab
              event.preventDefault();
              event.stopPropagation();

              lastFocusableElem.focus();
            }
          } else if (event.target === lastFocusableElem) {
            // tab
            event.preventDefault();
            event.stopPropagation();

            firstFocusableElem.focus();
          }
        });
      }
    });
  }, 100);
};

var hideDialog = function hideDialog(elem, sourceElem) {
  elem.setAttribute('aria-hidden', true);

  sourceElem.focus();
};

function dialog(elem) {
  var target = document.querySelector('.' + elem.dataset.target);
  var closes = target.querySelectorAll('[data-dismiss]');

  // elem events
  elem.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopPropagation();

    showDialog(target);
  });

  elem.addEventListener('keydown', function (event) {
    if (event.which === 13) {
      event.preventDefault();
      event.stopPropagation();

      showDialog(target);
    }
  });

  // dialog events
  target.addEventListener('keydown', function (event) {
    if (event.which === 27) {
      hideDialog(target, elem);
    }
  });

  closes.forEach(function (close) {
    close.addEventListener('click', function (event) {
      event.preventDefault();
      event.stopPropagation();

      hideDialog(target, elem);
    });
  });

  window.addEventListener('click', function (event) {
    if (event.target === target) {
      hideDialog(target, elem);
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
var arias = [{
  type: 'aria-hidden',
  init: false
}, {
  type: 'aria-disabled',
  init: false
}, {
  type: 'aria-selected',
  init: true
}, {
  type: 'aria-expanded',
  init: true
}, {
  type: 'aria-pressed',
  init: true
}, {
  type: 'aria-checked',
  init: true
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
  arias.forEach(function (aria) {
    var type = aria.type;
    var init = aria.init;


    if (elem.hasAttribute(type)) {
      if (behaviour === add) {
        if (!init) {
          elem.setAttribute(type, false);
        } else {
          elem.setAttribute(type, true);
        }
      } else if (behaviour === remove) {
        if (!init) {
          elem.setAttribute(type, true);
        } else {
          elem.setAttribute(type, false);
        }
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

function state(elem) {
  var parameters = {
    behaviours: elem.dataset.behaviour.split(', '),
    states: elem.dataset.state.split(', '),
    tabindexes: elem.dataset.tabindex ? elem.dataset.tabindex.split(', ') : null,
    targets: elem.dataset.target.split(', ')
  };

  elem.addEventListener('click', function (event) {
    event.preventDefault();
    event.stopPropagation();

    setState(parameters);
  });
  elem.addEventListener('keydown', function (event) {
    if (event.which === 13) {
      event.preventDefault();
      event.stopPropagation();

      setState(parameters);
    }
  });
}

},{}]},{},[1])
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJzcmMvanMvYXBwLmpzIiwic3JjL2pzL2NvbXBvbmVudHMvZGlhbG9ncy5qcyIsInNyYy9qcy9jb21wb25lbnRzL3N0YXRlcy5qcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFBQTs7O0FDR0E7Ozs7QUFDQTs7Ozs7O0FBSkE7OztBQU1BLElBQU0sY0FBYyxTQUFkLFdBQWMsQ0FBVSxTQUFWLEVBQXFCO0FBQ3ZDLE1BQU0sZ0JBQWdCLFVBQVUsT0FBVixDQUFrQixTQUF4Qzs7QUFFQSxNQUFJLGtCQUFrQixPQUF0QixFQUErQjtBQUM3QiwwQkFBTSxTQUFOO0FBQ0Q7QUFDRCxNQUFJLGtCQUFrQixRQUF0QixFQUFnQztBQUM5QiwyQkFBTyxTQUFQO0FBQ0Q7QUFDRixDQVREOztBQVdBLFNBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLEVBQThDLFlBQU07QUFDbEQsTUFBTSxhQUFhLFNBQVMsZ0JBQVQsQ0FBMEIsa0JBQTFCLENBQW5COztBQUVBLGFBQVcsT0FBWCxDQUFtQixVQUFDLFNBQUQsRUFBZTtBQUNoQyxnQkFBWSxTQUFaO0FBQ0QsR0FGRDs7QUFJQSxNQUFNLFdBQVcsSUFBSSxnQkFBSixDQUFxQixVQUFDLFNBQUQsRUFBZTtBQUNuRCxjQUFVLE9BQVYsQ0FBa0IsVUFBQyxRQUFELEVBQWM7QUFDOUIsZUFBUyxVQUFULENBQW9CLE9BQXBCLENBQTRCLFVBQUMsU0FBRCxFQUFlO0FBQ3pDLFlBQUksT0FBTyxVQUFVLFlBQWpCLEtBQWtDLFVBQXRDLEVBQWtEO0FBQ2hELGNBQUksVUFBVSxZQUFWLENBQXVCLGdCQUF2QixDQUFKLEVBQThDO0FBQzVDLHdCQUFZLFNBQVo7QUFDRDtBQUNGO0FBQ0YsT0FORDtBQU9ELEtBUkQ7QUFTRCxHQVZnQixDQUFqQjtBQVdBLFdBQVMsT0FBVCxDQUFpQixTQUFTLElBQTFCLEVBQWdDO0FBQzlCLGVBQVcsSUFEbUI7QUFFOUIsYUFBUztBQUZxQixHQUFoQztBQUlELENBdEJEOzs7Ozs7OztrQkM2QndCLE07QUE5Q3hCOzs7QUFHQSxJQUFNLGFBQWEsU0FBYixVQUFhLENBQVUsSUFBVixFQUFnQjtBQUNqQyxNQUFNLGlCQUFpQixLQUFLLGdCQUFMLENBQXNCLHlFQUF0QixDQUF2QjtBQUNBLE1BQU0scUJBQXFCLGVBQWUsQ0FBZixDQUEzQjtBQUNBLE1BQU0sb0JBQW9CLGVBQWUsZUFBZSxNQUFmLEdBQXdCLENBQXZDLENBQTFCOztBQUVBLE9BQUssWUFBTCxDQUFrQixhQUFsQixFQUFpQyxLQUFqQzs7QUFFQSxTQUFPLFVBQVAsQ0FBa0IsWUFBTTtBQUN0Qix1QkFBbUIsS0FBbkI7O0FBRUEsbUJBQWUsT0FBZixDQUF1QixVQUFDLGFBQUQsRUFBbUI7QUFDeEMsVUFBSSxjQUFjLGdCQUFsQixFQUFvQztBQUNsQyxzQkFBYyxnQkFBZCxDQUErQixTQUEvQixFQUEwQyxVQUFDLEtBQUQsRUFBVztBQUNuRCxjQUFNLGVBQWUsTUFBTSxLQUFOLEtBQWdCLENBQXJDOztBQUVBLGNBQUksQ0FBQyxZQUFMLEVBQW1CO0FBQ2pCO0FBQ0Q7QUFDRCxjQUFJLE1BQU0sUUFBVixFQUFvQjtBQUNsQixnQkFBSSxNQUFNLE1BQU4sS0FBaUIsa0JBQXJCLEVBQXlDO0FBQUU7QUFDekMsb0JBQU0sY0FBTjtBQUNBLG9CQUFNLGVBQU47O0FBRUEsZ0NBQWtCLEtBQWxCO0FBQ0Q7QUFDRixXQVBELE1BT08sSUFBSSxNQUFNLE1BQU4sS0FBaUIsaUJBQXJCLEVBQXdDO0FBQUU7QUFDL0Msa0JBQU0sY0FBTjtBQUNBLGtCQUFNLGVBQU47O0FBRUEsK0JBQW1CLEtBQW5CO0FBQ0Q7QUFDRixTQW5CRDtBQW9CRDtBQUNGLEtBdkJEO0FBd0JELEdBM0JELEVBMkJHLEdBM0JIO0FBNEJELENBbkNEOztBQXFDQSxJQUFNLGFBQWEsU0FBYixVQUFhLENBQVUsSUFBVixFQUFnQixVQUFoQixFQUE0QjtBQUM3QyxPQUFLLFlBQUwsQ0FBa0IsYUFBbEIsRUFBaUMsSUFBakM7O0FBRUEsYUFBVyxLQUFYO0FBQ0QsQ0FKRDs7QUFNZSxTQUFTLE1BQVQsQ0FBZ0IsSUFBaEIsRUFBc0I7QUFDbkMsTUFBTSxTQUFTLFNBQVMsYUFBVCxPQUEyQixLQUFLLE9BQUwsQ0FBYSxNQUF4QyxDQUFmO0FBQ0EsTUFBTSxTQUFTLE9BQU8sZ0JBQVAsQ0FBd0IsZ0JBQXhCLENBQWY7O0FBRUE7QUFDQSxPQUFLLGdCQUFMLENBQXNCLE9BQXRCLEVBQStCLFVBQUMsS0FBRCxFQUFXO0FBQ3hDLFVBQU0sY0FBTjtBQUNBLFVBQU0sZUFBTjs7QUFFQSxlQUFXLE1BQVg7QUFDRCxHQUxEOztBQU9BLE9BQUssZ0JBQUwsQ0FBc0IsU0FBdEIsRUFBaUMsVUFBQyxLQUFELEVBQVc7QUFDMUMsUUFBSSxNQUFNLEtBQU4sS0FBZ0IsRUFBcEIsRUFBd0I7QUFDdEIsWUFBTSxjQUFOO0FBQ0EsWUFBTSxlQUFOOztBQUVBLGlCQUFXLE1BQVg7QUFDRDtBQUNGLEdBUEQ7O0FBU0E7QUFDQSxTQUFPLGdCQUFQLENBQXdCLFNBQXhCLEVBQW1DLFVBQUMsS0FBRCxFQUFXO0FBQzVDLFFBQUksTUFBTSxLQUFOLEtBQWdCLEVBQXBCLEVBQXdCO0FBQ3RCLGlCQUFXLE1BQVgsRUFBbUIsSUFBbkI7QUFDRDtBQUNGLEdBSkQ7O0FBTUEsU0FBTyxPQUFQLENBQWUsVUFBQyxLQUFELEVBQVc7QUFDeEIsVUFBTSxnQkFBTixDQUF1QixPQUF2QixFQUFnQyxVQUFDLEtBQUQsRUFBVztBQUN6QyxZQUFNLGNBQU47QUFDQSxZQUFNLGVBQU47O0FBRUEsaUJBQVcsTUFBWCxFQUFtQixJQUFuQjtBQUNELEtBTEQ7QUFNRCxHQVBEOztBQVNBLFNBQU8sZ0JBQVAsQ0FBd0IsT0FBeEIsRUFBaUMsVUFBQyxLQUFELEVBQVc7QUFDMUMsUUFBSSxNQUFNLE1BQU4sS0FBaUIsTUFBckIsRUFBNkI7QUFDM0IsaUJBQVcsTUFBWCxFQUFtQixJQUFuQjtBQUNEO0FBQ0YsR0FKRDtBQUtEOzs7Ozs7OztrQkNrQnVCLEs7QUExR3hCOzs7QUFHQSxJQUFNLE1BQU0sS0FBWjtBQUNBLElBQU0sU0FBUyxRQUFmO0FBQ0EsSUFBTSxTQUFTLFFBQWY7QUFDQSxJQUFNLFFBQVEsQ0FDWjtBQUNFLFFBQU0sYUFEUjtBQUVFLFFBQU07QUFGUixDQURZLEVBS1o7QUFDRSxRQUFNLGVBRFI7QUFFRSxRQUFNO0FBRlIsQ0FMWSxFQVNaO0FBQ0UsUUFBTSxlQURSO0FBRUUsUUFBTTtBQUZSLENBVFksRUFhWjtBQUNFLFFBQU0sZUFEUjtBQUVFLFFBQU07QUFGUixDQWJZLEVBaUJaO0FBQ0UsUUFBTSxjQURSO0FBRUUsUUFBTTtBQUZSLENBakJZLEVBcUJaO0FBQ0UsUUFBTSxjQURSO0FBRUUsUUFBTTtBQUZSLENBckJZLENBQWQ7O0FBMkJBLElBQU0sV0FBVyxTQUFYLFFBQVcsQ0FBVSxJQUFWLEVBQWdCLFVBQWhCLEVBQTRCLFNBQTVCLEVBQXVDO0FBQ3RELE1BQUksZUFBZSxPQUFuQixFQUE0QjtBQUMxQixRQUFJLGNBQWMsR0FBbEIsRUFBdUI7QUFDckIsV0FBSyxTQUFMLENBQWUsR0FBZixDQUFtQixVQUFuQjtBQUNELEtBRkQsTUFFTyxJQUFJLGNBQWMsTUFBbEIsRUFBMEI7QUFDL0IsV0FBSyxTQUFMLENBQWUsTUFBZixDQUFzQixVQUF0QjtBQUNELEtBRk0sTUFFQTtBQUNMLFdBQUssU0FBTCxDQUFlLE1BQWYsQ0FBc0IsVUFBdEI7QUFDRDtBQUNGO0FBQ0YsQ0FWRDs7QUFZQSxJQUFNLFVBQVUsU0FBVixPQUFVLENBQVUsSUFBVixFQUFnQixTQUFoQixFQUEyQjtBQUN6QyxRQUFNLE9BQU4sQ0FBYyxVQUFDLElBQUQsRUFBVTtBQUFBLFFBQ2QsSUFEYyxHQUNMLElBREssQ0FDZCxJQURjO0FBQUEsUUFFZCxJQUZjLEdBRUwsSUFGSyxDQUVkLElBRmM7OztBQUl0QixRQUFJLEtBQUssWUFBTCxDQUFrQixJQUFsQixDQUFKLEVBQTZCO0FBQzNCLFVBQUksY0FBYyxHQUFsQixFQUF1QjtBQUNyQixZQUFJLENBQUMsSUFBTCxFQUFXO0FBQ1QsZUFBSyxZQUFMLENBQWtCLElBQWxCLEVBQXdCLEtBQXhCO0FBQ0QsU0FGRCxNQUVPO0FBQ0wsZUFBSyxZQUFMLENBQWtCLElBQWxCLEVBQXdCLElBQXhCO0FBQ0Q7QUFDRixPQU5ELE1BTU8sSUFBSSxjQUFjLE1BQWxCLEVBQTBCO0FBQy9CLFlBQUksQ0FBQyxJQUFMLEVBQVc7QUFDVCxlQUFLLFlBQUwsQ0FBa0IsSUFBbEIsRUFBd0IsSUFBeEI7QUFDRCxTQUZELE1BRU87QUFDTCxlQUFLLFlBQUwsQ0FBa0IsSUFBbEIsRUFBd0IsS0FBeEI7QUFDRDtBQUNGLE9BTk0sTUFNQTtBQUNMLGFBQUssWUFBTCxDQUFrQixJQUFsQixFQUF3QixLQUFLLFlBQUwsQ0FBa0IsSUFBbEIsTUFBNEIsTUFBcEQ7QUFDRDtBQUNGO0FBQ0YsR0FyQkQ7QUFzQkQsQ0F2QkQ7O0FBeUJBLElBQU0sY0FBYyxTQUFkLFdBQWMsQ0FBVSxJQUFWLEVBQWdCLFFBQWhCLEVBQTBCLFNBQTFCLEVBQXFDO0FBQ3ZELE1BQUksYUFBYSxNQUFqQixFQUF5QjtBQUN2QixRQUFJLGNBQWMsR0FBbEIsRUFBdUI7QUFDckIsV0FBSyxZQUFMLENBQWtCLFVBQWxCLEVBQThCLENBQTlCO0FBQ0QsS0FGRCxNQUVPLElBQUksY0FBYyxNQUFsQixFQUEwQjtBQUMvQixXQUFLLFlBQUwsQ0FBa0IsVUFBbEIsRUFBOEIsQ0FBQyxDQUEvQjtBQUNELEtBRk0sTUFFQTtBQUNMLFdBQUssWUFBTCxDQUFrQixVQUFsQixFQUE4QixLQUFLLFlBQUwsQ0FBa0IsVUFBbEIsTUFBa0MsSUFBbEMsR0FBeUMsQ0FBekMsR0FBNkMsQ0FBQyxDQUE1RTtBQUNEO0FBQ0Y7QUFDRixDQVZEOztBQVlBLElBQU0sV0FBVyxTQUFYLFFBQVcsQ0FBVSxVQUFWLEVBQXNCO0FBQ3JDLGFBQVcsVUFBWCxDQUFzQixPQUF0QixDQUE4QixVQUFDLFNBQUQsRUFBWSxLQUFaLEVBQXNCO0FBQ2xELFFBQU0sUUFBUSxTQUFTLGdCQUFULE9BQThCLFdBQVcsT0FBWCxDQUFtQixLQUFuQixDQUE5QixDQUFkO0FBQ0EsUUFBTSxhQUFhLFdBQVcsTUFBWCxDQUFrQixLQUFsQixDQUFuQjtBQUNBLFFBQU0sV0FBVyxXQUFXLFVBQVgsS0FBMEIsSUFBMUIsR0FBaUMsV0FBVyxVQUFYLENBQXNCLEtBQXRCLENBQWpDLEdBQWdFLElBQWpGOztBQUVBLFVBQU0sT0FBTixDQUFjLFVBQUMsSUFBRCxFQUFVO0FBQ3RCLFVBQUksY0FBYyxHQUFsQixFQUF1QjtBQUNyQixpQkFBUyxJQUFULEVBQWUsVUFBZixFQUEyQixHQUEzQjtBQUNBLGdCQUFRLElBQVIsRUFBYyxHQUFkO0FBQ0Esb0JBQVksSUFBWixFQUFrQixRQUFsQixFQUE0QixHQUE1QjtBQUNELE9BSkQsTUFJTyxJQUFJLGNBQWMsTUFBbEIsRUFBMEI7QUFDL0IsaUJBQVMsSUFBVCxFQUFlLFVBQWYsRUFBMkIsTUFBM0I7QUFDQSxnQkFBUSxJQUFSLEVBQWMsTUFBZDtBQUNBLG9CQUFZLElBQVosRUFBa0IsUUFBbEIsRUFBNEIsTUFBNUI7QUFDRCxPQUpNLE1BSUE7QUFDTCxpQkFBUyxJQUFULEVBQWUsVUFBZixFQUEyQixNQUEzQjtBQUNBLGdCQUFRLElBQVIsRUFBYyxNQUFkO0FBQ0Esb0JBQVksSUFBWixFQUFrQixRQUFsQixFQUE0QixNQUE1QjtBQUNEO0FBQ0YsS0FkRDtBQWVELEdBcEJEO0FBcUJELENBdEJEOztBQXdCZSxTQUFTLEtBQVQsQ0FBZSxJQUFmLEVBQXFCO0FBQ2xDLE1BQU0sYUFBYTtBQUNqQixnQkFBWSxLQUFLLE9BQUwsQ0FBYSxTQUFiLENBQXVCLEtBQXZCLENBQTZCLElBQTdCLENBREs7QUFFakIsWUFBUSxLQUFLLE9BQUwsQ0FBYSxLQUFiLENBQW1CLEtBQW5CLENBQXlCLElBQXpCLENBRlM7QUFHakIsZ0JBQVksS0FBSyxPQUFMLENBQWEsUUFBYixHQUF3QixLQUFLLE9BQUwsQ0FBYSxRQUFiLENBQXNCLEtBQXRCLENBQTRCLElBQTVCLENBQXhCLEdBQTRELElBSHZEO0FBSWpCLGFBQVMsS0FBSyxPQUFMLENBQWEsTUFBYixDQUFvQixLQUFwQixDQUEwQixJQUExQjtBQUpRLEdBQW5COztBQU9BLE9BQUssZ0JBQUwsQ0FBc0IsT0FBdEIsRUFBK0IsVUFBQyxLQUFELEVBQVc7QUFDeEMsVUFBTSxjQUFOO0FBQ0EsVUFBTSxlQUFOOztBQUVBLGFBQVMsVUFBVDtBQUNELEdBTEQ7QUFNQSxPQUFLLGdCQUFMLENBQXNCLFNBQXRCLEVBQWlDLFVBQUMsS0FBRCxFQUFXO0FBQzFDLFFBQUksTUFBTSxLQUFOLEtBQWdCLEVBQXBCLEVBQXdCO0FBQ3RCLFlBQU0sY0FBTjtBQUNBLFlBQU0sZUFBTjs7QUFFQSxlQUFTLFVBQVQ7QUFDRDtBQUNGLEdBUEQ7QUFRRCIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCIvKiBhcHBcbiA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAqL1xuXG5pbXBvcnQgc3RhdGUgZnJvbSAnLi9jb21wb25lbnRzL3N0YXRlcyc7XG5pbXBvcnQgZGlhbG9nIGZyb20gJy4vY29tcG9uZW50cy9kaWFsb2dzJztcblxuY29uc3QgaXNDb21wb25lbnQgPSBmdW5jdGlvbiAoY29tcG9uZW50KSB7XG4gIGNvbnN0IGRhdGFDb21wb25lbnQgPSBjb21wb25lbnQuZGF0YXNldC5jb21wb25lbnQ7XG5cbiAgaWYgKGRhdGFDb21wb25lbnQgPT09ICdzdGF0ZScpIHtcbiAgICBzdGF0ZShjb21wb25lbnQpO1xuICB9XG4gIGlmIChkYXRhQ29tcG9uZW50ID09PSAnZGlhbG9nJykge1xuICAgIGRpYWxvZyhjb21wb25lbnQpO1xuICB9XG59O1xuXG5kb2N1bWVudC5hZGRFdmVudExpc3RlbmVyKCdET01Db250ZW50TG9hZGVkJywgKCkgPT4ge1xuICBjb25zdCBjb21wb25lbnRzID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvckFsbCgnW2RhdGEtY29tcG9uZW50XScpO1xuXG4gIGNvbXBvbmVudHMuZm9yRWFjaCgoY29tcG9uZW50KSA9PiB7XG4gICAgaXNDb21wb25lbnQoY29tcG9uZW50KTtcbiAgfSk7XG5cbiAgY29uc3Qgb2JzZXJ2ZXIgPSBuZXcgTXV0YXRpb25PYnNlcnZlcigobXV0YXRpb25zKSA9PiB7XG4gICAgbXV0YXRpb25zLmZvckVhY2goKG11dGF0aW9uKSA9PiB7XG4gICAgICBtdXRhdGlvbi5hZGRlZE5vZGVzLmZvckVhY2goKGNvbXBvbmVudCkgPT4ge1xuICAgICAgICBpZiAodHlwZW9mIGNvbXBvbmVudC5nZXRBdHRyaWJ1dGUgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICBpZiAoY29tcG9uZW50LmdldEF0dHJpYnV0ZSgnZGF0YS1jb21wb25lbnQnKSkge1xuICAgICAgICAgICAgaXNDb21wb25lbnQoY29tcG9uZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH0pO1xuICB9KTtcbiAgb2JzZXJ2ZXIub2JzZXJ2ZShkb2N1bWVudC5ib2R5LCB7XG4gICAgY2hpbGRMaXN0OiB0cnVlLFxuICAgIHN1YnRyZWU6IHRydWUsXG4gIH0pO1xufSk7XG4iLCIvKiBkaWFsb2dzXG4gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gKi9cblxuY29uc3Qgc2hvd0RpYWxvZyA9IGZ1bmN0aW9uIChlbGVtKSB7XG4gIGNvbnN0IGZvY3VzYWJsZUVsZW1zID0gZWxlbS5xdWVyeVNlbGVjdG9yQWxsKCdbaHJlZl0sIGJ1dHRvbiwgaW5wdXQsIHNlbGVjdCwgdGV4dGFyZWEsIFt0YWJpbmRleF06bm90KFt0YWJpbmRleD1cIi0xXCJdJyk7XG4gIGNvbnN0IGZpcnN0Rm9jdXNhYmxlRWxlbSA9IGZvY3VzYWJsZUVsZW1zWzBdO1xuICBjb25zdCBsYXN0Rm9jdXNhYmxlRWxlbSA9IGZvY3VzYWJsZUVsZW1zW2ZvY3VzYWJsZUVsZW1zLmxlbmd0aCAtIDFdO1xuXG4gIGVsZW0uc2V0QXR0cmlidXRlKCdhcmlhLWhpZGRlbicsIGZhbHNlKTtcblxuICB3aW5kb3cuc2V0VGltZW91dCgoKSA9PiB7XG4gICAgZmlyc3RGb2N1c2FibGVFbGVtLmZvY3VzKCk7XG5cbiAgICBmb2N1c2FibGVFbGVtcy5mb3JFYWNoKChmb2N1c2FibGVFbGVtKSA9PiB7XG4gICAgICBpZiAoZm9jdXNhYmxlRWxlbS5hZGRFdmVudExpc3RlbmVyKSB7XG4gICAgICAgIGZvY3VzYWJsZUVsZW0uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgICAgICAgIGNvbnN0IGlzVGFiUHJlc3NlZCA9IGV2ZW50LndoaWNoID09PSA5O1xuXG4gICAgICAgICAgaWYgKCFpc1RhYlByZXNzZWQpIHtcbiAgICAgICAgICAgIHJldHVybjtcbiAgICAgICAgICB9XG4gICAgICAgICAgaWYgKGV2ZW50LnNoaWZ0S2V5KSB7XG4gICAgICAgICAgICBpZiAoZXZlbnQudGFyZ2V0ID09PSBmaXJzdEZvY3VzYWJsZUVsZW0pIHsgLy8gc2hpZnQgKyB0YWJcbiAgICAgICAgICAgICAgZXZlbnQucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgICAgICAgbGFzdEZvY3VzYWJsZUVsZW0uZm9jdXMoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICB9IGVsc2UgaWYgKGV2ZW50LnRhcmdldCA9PT0gbGFzdEZvY3VzYWJsZUVsZW0pIHsgLy8gdGFiXG4gICAgICAgICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgICAgICAgIGZpcnN0Rm9jdXNhYmxlRWxlbS5mb2N1cygpO1xuICAgICAgICAgIH1cbiAgICAgICAgfSk7XG4gICAgICB9XG4gICAgfSk7XG4gIH0sIDEwMCk7XG59O1xuXG5jb25zdCBoaWRlRGlhbG9nID0gZnVuY3Rpb24gKGVsZW0sIHNvdXJjZUVsZW0pIHtcbiAgZWxlbS5zZXRBdHRyaWJ1dGUoJ2FyaWEtaGlkZGVuJywgdHJ1ZSk7XG5cbiAgc291cmNlRWxlbS5mb2N1cygpO1xufTtcblxuZXhwb3J0IGRlZmF1bHQgZnVuY3Rpb24gZGlhbG9nKGVsZW0pIHtcbiAgY29uc3QgdGFyZ2V0ID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLiR7ZWxlbS5kYXRhc2V0LnRhcmdldH1gKTtcbiAgY29uc3QgY2xvc2VzID0gdGFyZ2V0LnF1ZXJ5U2VsZWN0b3JBbGwoJ1tkYXRhLWRpc21pc3NdJyk7XG5cbiAgLy8gZWxlbSBldmVudHNcbiAgZWxlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICBzaG93RGlhbG9nKHRhcmdldCk7XG4gIH0pO1xuXG4gIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgIGlmIChldmVudC53aGljaCA9PT0gMTMpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgc2hvd0RpYWxvZyh0YXJnZXQpO1xuICAgIH1cbiAgfSk7XG5cbiAgLy8gZGlhbG9nIGV2ZW50c1xuICB0YXJnZXQuYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgIGlmIChldmVudC53aGljaCA9PT0gMjcpIHtcbiAgICAgIGhpZGVEaWFsb2codGFyZ2V0LCBlbGVtKTtcbiAgICB9XG4gIH0pO1xuXG4gIGNsb3Nlcy5mb3JFYWNoKChjbG9zZSkgPT4ge1xuICAgIGNsb3NlLmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgICBldmVudC5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICAgIGhpZGVEaWFsb2codGFyZ2V0LCBlbGVtKTtcbiAgICB9KTtcbiAgfSk7XG5cbiAgd2luZG93LmFkZEV2ZW50TGlzdGVuZXIoJ2NsaWNrJywgKGV2ZW50KSA9PiB7XG4gICAgaWYgKGV2ZW50LnRhcmdldCA9PT0gdGFyZ2V0KSB7XG4gICAgICBoaWRlRGlhbG9nKHRhcmdldCwgZWxlbSk7XG4gICAgfVxuICB9KTtcbn1cbiIsIi8qIHN0YXRlc1xuID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09ICovXG5cbmNvbnN0IGFkZCA9ICdhZGQnO1xuY29uc3QgcmVtb3ZlID0gJ3JlbW92ZSc7XG5jb25zdCB0b2dnbGUgPSAndG9nZ2xlJztcbmNvbnN0IGFyaWFzID0gW1xuICB7XG4gICAgdHlwZTogJ2FyaWEtaGlkZGVuJyxcbiAgICBpbml0OiBmYWxzZSxcbiAgfSxcbiAge1xuICAgIHR5cGU6ICdhcmlhLWRpc2FibGVkJyxcbiAgICBpbml0OiBmYWxzZSxcbiAgfSxcbiAge1xuICAgIHR5cGU6ICdhcmlhLXNlbGVjdGVkJyxcbiAgICBpbml0OiB0cnVlLFxuICB9LFxuICB7XG4gICAgdHlwZTogJ2FyaWEtZXhwYW5kZWQnLFxuICAgIGluaXQ6IHRydWUsXG4gIH0sXG4gIHtcbiAgICB0eXBlOiAnYXJpYS1wcmVzc2VkJyxcbiAgICBpbml0OiB0cnVlLFxuICB9LFxuICB7XG4gICAgdHlwZTogJ2FyaWEtY2hlY2tlZCcsXG4gICAgaW5pdDogdHJ1ZSxcbiAgfSxcbl07XG5cbmNvbnN0IHNldENsYXNzID0gZnVuY3Rpb24gKGVsZW0sIHN0YXRlQ2xhc3MsIGJlaGF2aW91cikge1xuICBpZiAoc3RhdGVDbGFzcyAhPT0gJ2ZhbHNlJykge1xuICAgIGlmIChiZWhhdmlvdXIgPT09IGFkZCkge1xuICAgICAgZWxlbS5jbGFzc0xpc3QuYWRkKHN0YXRlQ2xhc3MpO1xuICAgIH0gZWxzZSBpZiAoYmVoYXZpb3VyID09PSByZW1vdmUpIHtcbiAgICAgIGVsZW0uY2xhc3NMaXN0LnJlbW92ZShzdGF0ZUNsYXNzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgZWxlbS5jbGFzc0xpc3QudG9nZ2xlKHN0YXRlQ2xhc3MpO1xuICAgIH1cbiAgfVxufTtcblxuY29uc3Qgc2V0QXJpYSA9IGZ1bmN0aW9uIChlbGVtLCBiZWhhdmlvdXIpIHtcbiAgYXJpYXMuZm9yRWFjaCgoYXJpYSkgPT4ge1xuICAgIGNvbnN0IHsgdHlwZSB9ID0gYXJpYTtcbiAgICBjb25zdCB7IGluaXQgfSA9IGFyaWE7XG5cbiAgICBpZiAoZWxlbS5oYXNBdHRyaWJ1dGUodHlwZSkpIHtcbiAgICAgIGlmIChiZWhhdmlvdXIgPT09IGFkZCkge1xuICAgICAgICBpZiAoIWluaXQpIHtcbiAgICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZSh0eXBlLCBmYWxzZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUodHlwZSwgdHJ1ZSk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSBpZiAoYmVoYXZpb3VyID09PSByZW1vdmUpIHtcbiAgICAgICAgaWYgKCFpbml0KSB7XG4gICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUodHlwZSwgdHJ1ZSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUodHlwZSwgZmFsc2UpO1xuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBlbGVtLnNldEF0dHJpYnV0ZSh0eXBlLCBlbGVtLmdldEF0dHJpYnV0ZSh0eXBlKSAhPT0gJ3RydWUnKTtcbiAgICAgIH1cbiAgICB9XG4gIH0pO1xufTtcblxuY29uc3Qgc2V0VGFiaW5kZXggPSBmdW5jdGlvbiAoZWxlbSwgdGFiaW5kZXgsIGJlaGF2aW91cikge1xuICBpZiAodGFiaW5kZXggPT09ICd0cnVlJykge1xuICAgIGlmIChiZWhhdmlvdXIgPT09IGFkZCkge1xuICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgMCk7XG4gICAgfSBlbHNlIGlmIChiZWhhdmlvdXIgPT09IHJlbW92ZSkge1xuICAgICAgZWxlbS5zZXRBdHRyaWJ1dGUoJ3RhYmluZGV4JywgLTEpO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtLnNldEF0dHJpYnV0ZSgndGFiaW5kZXgnLCBlbGVtLmdldEF0dHJpYnV0ZSgndGFiaW5kZXgnKSA9PT0gJy0xJyA/IDAgOiAtMSk7XG4gICAgfVxuICB9XG59O1xuXG5jb25zdCBzZXRTdGF0ZSA9IGZ1bmN0aW9uIChwYXJhbWV0ZXJzKSB7XG4gIHBhcmFtZXRlcnMuYmVoYXZpb3Vycy5mb3JFYWNoKChiZWhhdmlvdXIsIGluZGV4KSA9PiB7XG4gICAgY29uc3QgZWxlbXMgPSBkb2N1bWVudC5xdWVyeVNlbGVjdG9yQWxsKGAuJHtwYXJhbWV0ZXJzLnRhcmdldHNbaW5kZXhdfWApO1xuICAgIGNvbnN0IHN0YXRlQ2xhc3MgPSBwYXJhbWV0ZXJzLnN0YXRlc1tpbmRleF07XG4gICAgY29uc3QgdGFiaW5kZXggPSBwYXJhbWV0ZXJzLnRhYmluZGV4ZXMgIT09IG51bGwgPyBwYXJhbWV0ZXJzLnRhYmluZGV4ZXNbaW5kZXhdIDogbnVsbDtcblxuICAgIGVsZW1zLmZvckVhY2goKGVsZW0pID0+IHtcbiAgICAgIGlmIChiZWhhdmlvdXIgPT09IGFkZCkge1xuICAgICAgICBzZXRDbGFzcyhlbGVtLCBzdGF0ZUNsYXNzLCBhZGQpO1xuICAgICAgICBzZXRBcmlhKGVsZW0sIGFkZCk7XG4gICAgICAgIHNldFRhYmluZGV4KGVsZW0sIHRhYmluZGV4LCBhZGQpO1xuICAgICAgfSBlbHNlIGlmIChiZWhhdmlvdXIgPT09IHJlbW92ZSkge1xuICAgICAgICBzZXRDbGFzcyhlbGVtLCBzdGF0ZUNsYXNzLCByZW1vdmUpO1xuICAgICAgICBzZXRBcmlhKGVsZW0sIHJlbW92ZSk7XG4gICAgICAgIHNldFRhYmluZGV4KGVsZW0sIHRhYmluZGV4LCByZW1vdmUpO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgc2V0Q2xhc3MoZWxlbSwgc3RhdGVDbGFzcywgdG9nZ2xlKTtcbiAgICAgICAgc2V0QXJpYShlbGVtLCB0b2dnbGUpO1xuICAgICAgICBzZXRUYWJpbmRleChlbGVtLCB0YWJpbmRleCwgdG9nZ2xlKTtcbiAgICAgIH1cbiAgICB9KTtcbiAgfSk7XG59O1xuXG5leHBvcnQgZGVmYXVsdCBmdW5jdGlvbiBzdGF0ZShlbGVtKSB7XG4gIGNvbnN0IHBhcmFtZXRlcnMgPSB7XG4gICAgYmVoYXZpb3VyczogZWxlbS5kYXRhc2V0LmJlaGF2aW91ci5zcGxpdCgnLCAnKSxcbiAgICBzdGF0ZXM6IGVsZW0uZGF0YXNldC5zdGF0ZS5zcGxpdCgnLCAnKSxcbiAgICB0YWJpbmRleGVzOiBlbGVtLmRhdGFzZXQudGFiaW5kZXggPyBlbGVtLmRhdGFzZXQudGFiaW5kZXguc3BsaXQoJywgJykgOiBudWxsLFxuICAgIHRhcmdldHM6IGVsZW0uZGF0YXNldC50YXJnZXQuc3BsaXQoJywgJyksXG4gIH07XG5cbiAgZWxlbS5hZGRFdmVudExpc3RlbmVyKCdjbGljaycsIChldmVudCkgPT4ge1xuICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgZXZlbnQuc3RvcFByb3BhZ2F0aW9uKCk7XG5cbiAgICBzZXRTdGF0ZShwYXJhbWV0ZXJzKTtcbiAgfSk7XG4gIGVsZW0uYWRkRXZlbnRMaXN0ZW5lcigna2V5ZG93bicsIChldmVudCkgPT4ge1xuICAgIGlmIChldmVudC53aGljaCA9PT0gMTMpIHtcbiAgICAgIGV2ZW50LnByZXZlbnREZWZhdWx0KCk7XG4gICAgICBldmVudC5zdG9wUHJvcGFnYXRpb24oKTtcblxuICAgICAgc2V0U3RhdGUocGFyYW1ldGVycyk7XG4gICAgfVxuICB9KTtcbn1cbiJdfQ==
