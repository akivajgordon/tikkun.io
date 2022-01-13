# tikkun.io
> The online tikkun you always wanted, but never had.

The mission is to **make better Torah readers** by providing the tools to maximize the reader's efficiency and preparedness. Your good, old-fashioned tikkunim are great, but in the end, they're static papers. With the dynamic nature of computer programs, we can make an even better tikkun.

The source text is pulled from the [Sefaria API](https://github.com/Sefaria/Sefaria-Project/wiki/API-Documentation), with some minor overrides as issues are found (such as פתוחה/סתומה discrepancies).

## Contributing

**Dependencies**: Node.js 10+

Fork, clone, `npm install`.

To start the static web server, run `npm start`, then visit http://localhost:8000 in your browser.

As you make edits, you may need to build for distribution, so run `npm run build`. You can watch for changes to automatically build by running `npm run watch`.

Run unit tests with `npm test`, and watch for changes to automatically run the tests with `npm run test:watch`.

Run the UI tests with `npm run test:ui`.

Pull requests are welcome!

For bug fixes, kindly submit a failing test case that now passes as a result of the fix. For new features, submit test cases as well, which will improve the likelihood that the pull request will be merged. If you cannot write the test cases for whatever reason, add that as a note in the pull request so that we can discuss alternatives.

## License
[MIT](LICENSE)
