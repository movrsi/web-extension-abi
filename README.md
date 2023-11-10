# web-extension-abi
Web Extension ABI solves the issue browser extension developers may face when porting an extension from `Chrome`->`Firefox` or `Firefox`->`Chrome`.

# Motivation
I was working on open-in-mpv's extension re-write and this seemed to be the most logical way to deal with handling both `Chrome` and `Firefox` together to keep a clean singular codebase.

# Broken Standards
Obviously disagreements occur with API designing, however the differences between the web extension api boils down to an object name and property differences.

```Javascript
// Google Chrome
chrome.contextMenus.create
// Mozilla Firefox
browser.menus.create
```
This creates an issue for extension developers when it comes time to port it to said browser, also creates a dilema in terms of redesigning the extension to work with both;
```Javascript
let func = undefined;
if (window.chrome) {
    func = chrome.contextMenus.create;
} else {
    func = browser.menus.create;
}
```
a method like this would need to be used in order to provide the same functionality if the extension is supposed to support both Chrome and Firefox.

The following code is using web-extension-abi:
```Javascript
import {abi} from './abi.js';
abi.contextMenus.create(/** Context menu option object */);
```

However this may not cut it for Chrome as it must be installed at runtime.

```Javascript
import {createContextMenu} from './abi.js';
// The parameters can be an object for a single context menu and array of object for multiple.
createContextMenu({
    chrome: ...,
    firefox: ...,
});
```

A consistent abi for creating a browser extension.

# License
Web Extension ABI is released under the BSD-2 Clause License.
