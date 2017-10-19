/* prevent nested
 ========================================================================== */

export default function preventNested(selectors, component) {
  const elems = [];

  selectors.forEach((selector) => {
    let parent = selector.parentNode;

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
