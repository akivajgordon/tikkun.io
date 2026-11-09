import React, { useEffect, useState } from 'react';
import { hideParshaPicker, isShowingParshaPicker, toggleParshaPicker, } from './picker-toggle';
import { useKeyDown, useKeyUp } from './use-key';
export const App = ({ app }) => {
    return React.createElement(Toolbar, { app: app });
};
const Toolbar = ({ app }) => {
    useKeyDown('/', () => toggleParshaPicker(app));
    useKeyDown('Escape', (e) => {
        if (isShowingParshaPicker()) {
            e.preventDefault();
            hideParshaPicker();
        }
    });
    return (React.createElement("header", { className: "app-toolbar" },
        React.createElement(PageWrap, null,
            React.createElement("div", { style: { padding: '0 10px' } },
                React.createElement(FixedCenterLayout, null,
                    React.createElement(Dummy, null),
                    React.createElement("button", { className: "parsha-title", "data-target-id": "parsha-title", "data-tooltip": 'Tip: Press "/" to open quickly', onClick: () => toggleParshaPicker(app) }, "\u05D1\u05E8\u05D0\u05E9\u05D9\u05EA"),
                    React.createElement(GitHubRepo, null))))));
};
const Dummy = () => React.createElement("div", null);
const FixedCenterLayout = ({ children }) => {
    const [leading, center, trailing] = React.Children.toArray(children);
    return (React.createElement("div", { style: {
            position: 'relative',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        } },
        React.createElement("div", null, leading),
        React.createElement("div", { style: {
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)',
            } }, center),
        React.createElement("div", null, trailing)));
};
const PageWrap = ({ children }) => {
    return React.createElement("div", { className: "u-page-wrap" }, children);
};
const GitHubRepo = () => (React.createElement("a", { href: "https://www.github.com/akivajgordon/tikkun.io", target: "_blank", "data-target-id": "repo-link", title: "Go to GitHub repository" },
    React.createElement("img", { className: "toolbar-github", src: "/assets/images/github.svg", alt: "GitHub", height: "32px", width: "32px" })));
export const Annotations = () => {
    const [showAnnotations, setShowAnnotations] = useState(true);
    const toggle = () => setShowAnnotations((v) => !v);
    useKeyDown('Shift', toggle);
    useKeyUp('Shift', toggle);
    useEffect(() => {
        const book = document.querySelector('[data-target-id=tikkun-book]');
        book.classList.toggle('mod-annotations-on', showAnnotations);
        book.classList.toggle('mod-annotations-off', !showAnnotations);
    }, [showAnnotations]);
    return (React.createElement("div", { style: { position: 'fixed', bottom: '1.5em', right: '1.5em' } },
        React.createElement("button", { className: "annotations-toggle", "data-test-id": "annotations-toggle", "data-tooltip": 'Tip: Hold "Shift" to toggle quickly', "data-tooltip-position": "top-left" },
            React.createElement("label", { className: "toggle" },
                React.createElement("div", { className: "shadowed-circle" },
                    React.createElement("input", { "data-target-id": "annotations-toggle", type: "checkbox", checked: showAnnotations, onChange: (e) => setShowAnnotations(e.target.checked) }),
                    React.createElement("span", { className: "toggle-state mod-off" }, "\u05D0"),
                    React.createElement("span", { className: "toggle-state mod-on" }, "\u05D0\u05B6\u05A8"))))));
};
export const Debug = () => {
    useKeyDown('!', () => {
        document.querySelector('#debug').classList.toggle('u-hidden');
    });
    return React.createElement("div", { id: "debug", className: "u-hidden" });
};
//# sourceMappingURL=App.js.map