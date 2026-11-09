export const setVisibility = ({ selector, visible, }) => {
    const classList = document.querySelector(selector).classList;
    classList[visible ? 'remove' : 'add']('u-hidden');
    classList[visible ? 'remove' : 'add']('mod-animated');
};
export const insertBefore = (parent, child) => {
    parent.insertAdjacentElement('afterbegin', child);
};
export const insertAfter = (parent, child) => {
    parent.insertAdjacentElement('beforeend', child);
};
//# sourceMappingURL=dom.js.map