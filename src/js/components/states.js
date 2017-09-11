/* states
 ========================================================================== */

const add = 'add';
const remove = 'remove';
const toggle = 'toggle';
const arias = [
    {
        type: 'aria-hidden',
        init: false,
    },
    {
        type: 'aria-disabled',
        init: false,
    },
    {
        type: 'aria-selected',
        init: true,
    },
    {
        type: 'aria-expanded',
        init: true,
    },
    {
        type: 'aria-pressed',
        init: true,
    },
    {
        type: 'aria-checked',
        init: true,
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
    arias.forEach((aria) => {
        const { type } = aria;
        const { init } = aria;

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

export default function state(component) {
    const parameters = {
        behaviours: component.dataset.behaviour.split(', '),
        states: component.dataset.state.split(', '),
        tabindexes: component.dataset.tabindex ? component.dataset.tabindex.split(', ') : null,
        targets: component.dataset.target.split(', '),
    };

    component.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();

        setState(parameters);
    });
    component.addEventListener('keypress', (event) => {
        if (event.which === 13) {
            event.preventDefault();
            event.stopPropagation();

            setState(parameters);
        }
    });
}
