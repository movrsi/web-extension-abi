/**
 * This file is part of web-extension-abi.
 *
 * Copyright 2023 movrsi
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to
 * deal in the Software without restriction, including without limitation the
 * rights to use, copy, modify, merge, publish, distribute, sublicense, and/or
 * sell copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING
 * FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */
/** @type Integer */
const CHROME = 1;
/** @type Integer */
const FIREFOX = 0;
const browserDetection = () => +(window.chrome !== undefined);
const determineApi = (chrome, firefox) => {
    return window.chrome ? chrome : firefox;
};
/** @type Object */
const abi = Object.freeze({
    alarms: determineApi(chrome.alarms, browser.alarms),
    bookmarks: determineApi(chrome.bookmarks, browser.bookmarks),
    browserAction: determineApi(chrome.browserAction, browser.browserAction),
    browsingData: determineApi(chrome.browsingData, browser.browsingData),
    commands: determineApi(chrome.commands, browser.commands),
    contextMenus: determineApi(chrome.contextMenus, browser.menus),
    cookies: determineApi(chrome.cookies, browser.cookies),
    clipboard: Object.freeze({
        writeText: async text => {
            const write = async data => {
                const copy = async data => {
                    await navigator.clipboard.writeText(data).then(() => {
                        return true;
                    }).catch(e => {
                        console.error(e);
                        return false;
                    });
                };
                await navigator.permissions.query({
                    name: /** @type PermissionName */ 'clipboard-write',
                }).then(async result => {
                    switch (result.state) {
                        case 'granted':
                        case 'prompt':
                            return await copy(data);
                    }
                    throw Error();
                }).catch(async e => {
                    // Firefox throws a TypeError due to clipboard-write not existing.
                    if (e instanceof TypeError)
                        return await copy(data);
                    console.error(e);
                });
            };
            return await write(text);
        }
    }),
    declarativeNetRequest: determineApi(chrome.declarativeNetRequest, browser.declarativeNetRequest),
    devtools: determineApi(chrome.devtools, browser.devtools),
    dom: determineApi(chrome.dom, browser.dom),
    downloads: determineApi(chrome.downloads, browser.downloads),
    events: determineApi(chrome.events, browser.events),
    extension: determineApi(chrome.extension, browser.extension),
    extensionTypes: determineApi(chrome.extensionTypes, browser.extensionTypes),
    history: determineApi(chrome.history, browser.history),
    i18n: determineApi(chrome.i18n, browser.i18n),
    identity: determineApi(chrome.identity, browser.identity),
    idle: determineApi(chrome.idle, browser.idle),
    management: determineApi(chrome.management, browser.management),
    notifications: determineApi(chrome.notifications, browser.notifications),
    omnibox: determineApi(chrome.omnibox, browser.omnibox),
    pageAction: determineApi(chrome.pageAction, browser.pageAction),
    permissions: determineApi(chrome.permissions, browser.permissions),
    privacy: determineApi(chrome.privacy, browser.privacy),
    runtime: determineApi(chrome.runtime, browser.runtime),
    scripting: determineApi(chrome.scripting, browser.scripting),
    search: determineApi(chrome.search, browser.search),
    sessions: determineApi(chrome.sessions, browser.sessions),
    storage: determineApi(chrome.storage, browser.storage),
    tabs: determineApi(chrome.tabs, browser.tabs),
    topSites: determineApi(chrome.topSites, browser.topSites),
    types: determineApi(chrome.types, browser.types),
    webNavigation: determineApi(chrome.webNavigation, browser.webNavigation),
    webRequest: determineApi(chrome.webRequest, browser.webRequest),
    windows: determineApi(chrome.windows, browser.windows)
});
const createContextMenu = data => {
    const method = data => {
        switch (Object.prototype.toString.call(data)) {
            case '[object Array]':
                data.forEach(element => {
                    abi.contextMenus.create(element);
                });
                break;
            case '[object Object]':
                abi.contextMenus.create(data);
                break;
        }
    };
    switch (browserDetection()) {
        case CHROME:
            chrome.runtime.onInstalled.addListener(() => {
                method(data.chrome);
            });
            break;
        case FIREFOX:
            method(data.firefox);
            break;
    }
};
export { abi, createContextMenu };