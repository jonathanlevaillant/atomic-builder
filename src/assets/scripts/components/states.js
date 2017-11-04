/* states
 ========================================================================== */

const add = 'add';
const remove = 'remove';
const toggle = 'toggle';
const ariaAttributes = [
  {
    type: 'aria-hidden',
    init: true,
  },
  {
    type: 'aria-disabled',
    init: true,
  },
  {
    type: 'aria-selected',
    init: false,
  },
  {
    type: 'aria-expanded',
    init: false,
  },
  {
    type: 'aria-pressed',
    init: false,
  },
  {
    type: 'aria-checked',
    init: false,
  },
];

const setClass = function (elem, stateClass, behaviour) {
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

const setAria = function (elem, behaviour) {
  ariaAttributes.forEach((ariaAttribute) => {
    const { type, init } = ariaAttribute;

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

const setTabindex = function (elem, tabindex, behaviour) {
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

const setState = function (parameters) {
  parameters.behaviours.forEach((behaviour, index) => {
    const elems = document.querySelectorAll(`.${parameters.targets[index]}`);
    const stateClass = parameters.states[index];
    const tabindex = parameters.tabindexes !== null ? parameters.tabindexes[index] : null;

    elems.forEach((elem) => {
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

export default function state(elem, keyCodes) {
  const parameters = {
    behaviours: elem.dataset.behaviour.split(', '),
    states: elem.dataset.state.split(', '),
    tabindexes: elem.dataset.tabindex ? elem.dataset.tabindex.split(', ') : null,
    targets: elem.dataset.target.split(', '),
  };

  elem.addEventListener('click', (event) => {
    event.preventDefault();

    setState(parameters);
  });
  elem.addEventListener('keydown', (event) => {
    if (event.which === keyCodes.enter) {
      event.preventDefault();

      setState(parameters);
    }
  });
}
