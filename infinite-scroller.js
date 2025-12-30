var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
let alreadyInFlight = false;
const oneAtATime = (promise) => __awaiter(void 0, void 0, void 0, function* () {
    if (alreadyInFlight)
        return Promise.resolve();
    alreadyInFlight = true;
    const val = yield promise();
    alreadyInFlight = false;
    return val;
});
const InfiniteScroller = {
    new: ({ container, fetchPreviousContent, fetchNextContent, }) => ({
        attach: () => container.addEventListener('scroll', (_e) => {
            const scrollView = container;
            const hiddenAboveHeight = scrollView.scrollTop;
            const visibleHeight = scrollView.clientHeight;
            const hiddenBelowHeight = scrollView.scrollHeight -
                (scrollView.clientHeight + scrollView.scrollTop);
            if (hiddenAboveHeight < 0.5 * visibleHeight) {
                oneAtATime(() => fetchPreviousContent.fetch().then((fetched) => {
                    if (!fetched)
                        return;
                    const belowHeight = scrollView.scrollHeight - scrollView.scrollTop;
                    fetchPreviousContent.render(fetched);
                    scrollView.scrollTop = scrollView.scrollHeight - belowHeight;
                }));
            }
            else if (hiddenBelowHeight < 0.5 * visibleHeight) {
                oneAtATime(() => fetchNextContent.fetch().then((fetched) => {
                    if (fetched)
                        fetchNextContent.render(fetched);
                }));
            }
        }),
    }),
};
export default InfiniteScroller;
//# sourceMappingURL=infinite-scroller.js.map