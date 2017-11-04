/* dialogs
 ========================================================================== */

const page = document.querySelector('.js-page');
const doc = document.querySelector('.js-document');

const openDialog = function (component, keyCodes) {
  const focusableElems = component.querySelectorAll('[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"]');
  const firstFocusableElem = focusableElems[0];
  const secondFocusableElem = focusableElems[1];
  const lastFocusableElem = focusableElems[focusableElems.length - 1];

  component.setAttribute('aria-hidden', false);
  doc.setAttribute('aria-hidden', true);
  page.classList.add('is-inactive');

  // return if no focusable element
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
          const tab = event.which === keyCodes.tab;

          if (!tab) {
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

const closeDialog = function (component, src) {
  const nested = (src.dataset.nested || 'false') === 'true';

  // check if dialog is inside another dialog
  if (!nested) {
    doc.setAttribute('aria-hidden', false);
    page.classList.remove('is-inactive');
  }

  component.setAttribute('aria-hidden', true);

  // restoring focus
  src.focus();
};

export default function dialog(src, keyCodes) {
  const component = document.querySelector(`.${src.dataset.target}`);
  const dismissTargets = component.querySelectorAll('[data-dismiss]');
  const { overlay } = src.dataset;

  // open dialog
  src.addEventListener('click', (event) => {
    event.preventDefault();

    openDialog(component, keyCodes);
  });

  src.addEventListener('keydown', (event) => {
    if (event.which === keyCodes.enter) {
      event.preventDefault();

      openDialog(component, keyCodes);
    }
  });

  // close dialog
  component.addEventListener('keydown', (event) => {
    if (event.which === keyCodes.escape) {
      closeDialog(component, src);
    }
  });

  dismissTargets.forEach((dismissTarget) => {
    const target = document.querySelector(`.${dismissTarget.dataset.dismiss}`);

    dismissTarget.addEventListener('click', (event) => {
      event.preventDefault();

      closeDialog(target, src);
    });
    dismissTarget.addEventListener('keydown', (event) => {
      if (event.which === keyCodes.enter) {
        event.preventDefault();

        closeDialog(target, src);
      }
    });
  });

  window.addEventListener('click', (event) => {
    if (event.target === component && (!overlay || overlay === 'true')) {
      closeDialog(component, src);
    }
  });
}
