/* dialogs
 ========================================================================== */

const page = document.querySelector('.js-page');
const doc = document.querySelector('.js-document');

const openDialog = function (dialogWidget, keyCodes) {
  const focusableElems = dialogWidget.querySelectorAll('[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"]');
  const firstFocusableElem = focusableElems[0];
  const secondFocusableElem = focusableElems[1];
  const lastFocusableElem = focusableElems[focusableElems.length - 1];

  dialogWidget.setAttribute('aria-hidden', false);
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

const closeDialog = function (dialogWidget, dialogSrc) {
  const { inception } = dialogSrc.dataset;

  // check if dialog is inside another dialog
  if (!inception || inception === 'false') {
    doc.setAttribute('aria-hidden', false);
    page.classList.remove('is-inactive');
  }

  dialogWidget.setAttribute('aria-hidden', true);

  // restoring focus
  dialogSrc.focus();
};

export default function dialog(dialogSrc, keyCodes) {
  const dialogWidget = document.querySelector(`.${dialogSrc.dataset.target}`);
  const dialogsToDismiss = dialogWidget.querySelectorAll('[data-dismiss]');
  const { overlay } = dialogSrc.dataset;
  const overlayIsEnabled = !overlay || overlay === 'true';

  // open dialog
  dialogSrc.addEventListener('click', (event) => {
    event.preventDefault();

    openDialog(dialogWidget, keyCodes);
  });

  dialogSrc.addEventListener('keydown', (event) => {
    if (event.which === keyCodes.enter) {
      event.preventDefault();

      openDialog(dialogWidget, keyCodes);
    }
  });

  // close dialog
  dialogWidget.addEventListener('keydown', (event) => {
    if (event.which === keyCodes.escape) {
      closeDialog(dialogWidget, dialogSrc);
    }
  });

  dialogsToDismiss.forEach((dialogToDismiss) => {
    const dialogWidgetToDismiss = document.querySelector(`.${dialogToDismiss.dataset.dismiss}`);

    dialogToDismiss.addEventListener('click', (event) => {
      event.preventDefault();

      closeDialog(dialogWidgetToDismiss, dialogSrc);
    });
    dialogToDismiss.addEventListener('keydown', (event) => {
      if (event.which === keyCodes.enter) {
        event.preventDefault();

        closeDialog(dialogWidgetToDismiss, dialogSrc);
      }
    });
  });

  window.addEventListener('click', (event) => {
    if (event.target === dialogWidget && overlayIsEnabled) {
      closeDialog(dialogWidget, dialogSrc);
    }
  });
}
