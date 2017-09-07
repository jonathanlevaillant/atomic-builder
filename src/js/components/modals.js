/* modals
 ========================================================================== */

export default function modal(component) {
    component.addEventListener('click', (event) => {
        event.preventDefault();
        event.stopPropagation();
    });
}
