import { useEffect } from 'react';
import utils from './components/utils';
const { whenKey } = utils;
const useKey = (upDown, key, callback) => {
    useEffect(() => {
        const listener = whenKey(key, callback);
        document.addEventListener(upDown, listener);
        return () => {
            document.removeEventListener(upDown, listener);
        };
    }, []);
};
export const useKeyDown = (key, callback) => useKey('keydown', key, callback);
export const useKeyUp = (key, callback) => useKey('keyup', key, callback);
//# sourceMappingURL=use-key.js.map