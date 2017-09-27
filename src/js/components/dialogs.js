/* dialogs
 ========================================================================== */

const page = document.querySelector('.js-page');
const doc = document.querySelector('.js-document');

const keyCodes = {
  enter: 13,
  escape: 27,
  tab: 9,
};

const showDialog = function (elem) {
  const focusableElems = elem.querySelectorAll('[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"]');
  const firstFocusableElem = focusableElems[0];
  const secondFocusableElem = focusableElems[1];
  const lastFocusableElem = focusableElems[focusableElems.length - 1];

  elem.setAttribute('aria-hidden', false);
  doc.setAttribute('aria-hidden', true);
  page.classList.add('is-inactive');

  // return if no focusable elements
  if (!firstFocusableElem) {
    return;
  }

  window.setTimeout(() => {
    if (secondFocusableElem) {
      secondFocusableElem.focus();
    } else {
      firstFocusableElem.focus();
    }

    // trapping focus inside the dialog
    focusableElems.forEach((focusableElem) => {
      if (focusableElem.addEventListener) {
        focusableElem.addEventListener('keydown', (event) => {
          const isTabPressed = event.which === keyCodes.tab;

          if (!isTabPressed) {
            return;
          }
          if (event.shiftKey) {
            if (event.target === firstFocusableElem) { // shift + tab
              event.preventDefault();

              lastFocusableElem.focus();
            }
          } else if (event.target === lastFocusableElem) { // tab
            event.preventDefault();

            firstFocusableElem.focus();
          }
        });
      }
    });
  }, 100);
};

const hideDialog = function (elem, sourceElem) {
  const { inception } = sourceElem.dataset;

  // check if dialog is inside another dialog
  if (!inception || inception === 'false') {
    doc.setAttribute('aria-hidden', false);
    page.classList.remove('is-inactive');
  }

  elem.setAttribute('aria-hidden', true);

  // restoring focus
  sourceElem.focus();
};

export default function dialog(elem) {
  const target = document.querySelector(`.${elem.dataset.target}`);
  const closes = target.querySelectorAll('[data-dismiss]');

  // show dialog
  elem.addEventListener('click', (event) => {
    event.preventDefault();

    showDialog(target);
  });

  elem.addEventListener('keydown', (event) => {
    if (event.which === keyCodes.enter) {
      event.preventDefault();

      showDialog(target);
    }
  });

  // hide dialog
  target.addEventListener('keydown', (event) => {
    if (event.which === keyCodes.escape) {
      hideDialog(target, elem);
    }
  });

  closes.forEach((close) => {
    const dismiss = document.querySelector(`.${close.dataset.dismiss}`);

    close.addEventListener('click', (event) => {
      event.preventDefault();

      hideDialog(dismiss, elem);
    });
    close.addEventListener('keydown', (event) => {
      if (event.which === keyCodes.enter) {
        event.preventDefault();

        hideDialog(dismiss, elem);
      }
    });
  });

  window.addEventListener('click', (event) => {
    if (event.target === target) {
      hideDialog(target, elem);
    }
  });
}
