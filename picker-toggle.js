import ParshaPicker from './components/ParshaPicker';
import { setVisibility } from './dom';
export const hideParshaPicker = () => {
    ;
    [
        { selector: '[data-test-id="annotations-toggle"]', visible: true },
        { selector: '[data-target-id="repo-link"]', visible: true },
        { selector: '[data-target-id="tikkun-book"]', visible: true },
    ].forEach(({ selector, visible }) => setVisibility({ selector, visible }));
    document.querySelector('.parsha-picker') &&
        document
            .querySelector('#js-app')
            .removeChild(document.querySelector('.parsha-picker'));
};
export const showParshaPicker = (app) => {
    ;
    [
        { selector: '[data-test-id="annotations-toggle"]', visible: false },
        { selector: '[data-target-id="repo-link"]', visible: false },
        { selector: '[data-target-id="tikkun-book"]', visible: false },
    ].forEach(({ selector, visible }) => setVisibility({ selector, visible }));
    const picker = ParshaPicker(({ ref, key, source }) => {
        app.jumpTo({ ref });
        const { scroll } = ref;
        const hashBySource = {
            comingUp: (key) => (key === 'next' ? `#/next` : `#/p/${key}`),
            browse: (key) => `#/${scroll === 'torah' ? 'p' : 'h'}/${key}`,
            search: (key) => `#/${scroll === 'torah' ? 'p' : 'h'}/${key}`,
        }[source](key);
        window.location.hash = hashBySource;
    });
    document.querySelector('#js-app').appendChild(picker.node);
    gtag('event', 'view', {
        event_category: 'navigation',
    });
    picker.onMount();
};
export const isShowingParshaPicker = () => Boolean(document.querySelector('.parsha-picker'));
export const toggleParshaPicker = (app) => {
    if (isShowingParshaPicker()) {
        hideParshaPicker();
    }
    else {
        showParshaPicker(app);
    }
};
//# sourceMappingURL=picker-toggle.js.map