Super simple pushState implementation bundled as a jQuery plugin.

```javascript
$.shovel.enable();
$.shovel.addRoute('/foo/bar', function(url, params, catalyst) {
    console.log('route handled for ' + url);
});
$.shovel.addRoute(/\/foo\/bar\/(\d+)/, function(url, params, catalyst) {
    console.log('route handled for ' + url + ' for id ' + params[0]);
});
```

Each route handler function takes three arguments:

- `url`: the matched URL (usually equivalent to `window.location.pathname`)
- `params`: the evaluated route paramters, which are specified as groups in a route
  defined by a regular expression
- `catalyst`: the catalyst of the `popstate` event: either a reference to an `<a>`
  element, or the string `"popstate"`, indicating that the event was triggered by
  the browser (e.g. the back button)

*shovel* binds to every `<a>` element's click handler. If a route matches the
`href` attribute, default behavior is prevented and shovel's route handling
takes place. Otherwise, the link passes through as normal. You can prevent
shovel from doing anything by adding a `data-no-shovel` attribute to the anchor
element.
