/* dialogs
 ========================================================================== */

const showDialog = function (elem) {
  const focusableElems = elem.querySelectorAll('[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"]');
  const firstFocusableElem = focusableElems[0];
  const lastFocusableElem = focusableElems[focusableElems.length - 1];

  elem.setAttribute('aria-hidden', false);

  window.setTimeout(() => {
    firstFocusableElem.focus();

    focusableElems.forEach((focusableElem) => {
      if (focusableElem.addEventListener) {
        focusableElem.addEventListener('keydown', (event) => {
          if (event.which === 9) {
            if (event.target === lastFocusableElem) {
              event.preventDefault();
              event.stopPropagation();

              firstFocusableElem.focus();
            }
            /*if (event.shiftKey) {
              if (event.target === firstFocusableElem) {
                lastFocusableElem.focus();
              }
            }*/
          }
        });
      }
    });
    /*if (lastFocusableElem.addEventListener) {
      lastFocusableElem.addEventListener('keydown', (event) => {
        if (event.which === 9) {
          event.preventDefault();
          event.stopPropagation();

          firstFocusableElem.focus();
        }
      });
    }*/
  }, 100);
};

const hideDialog = function (elem, sourceElem) {
  elem.setAttribute('aria-hidden', true);

  sourceElem.focus();
};

export default function dialog(elem) {
  const target = document.querySelector(`.${elem.dataset.target}`);
  const closes = target.querySelectorAll('[data-dismiss]');

  // elem events
  elem.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();

    showDialog(target);
  });

  elem.addEventListener('keydown', (event) => {
    if (event.which === 13) {
      event.preventDefault();
      event.stopPropagation();

      showDialog(target);
    }
  });

  // dialog events
  target.addEventListener('keydown', (event) => {
    if (event.which === 27) {
      hideDialog(target, elem);
    }
  });

  closes.forEach((close) => {
    close.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();

      hideDialog(target, elem);
    });
  });

  window.addEventListener('click', (event) => {
    if (event.target === target) {
      hideDialog(target, elem);
    }
  });
}
