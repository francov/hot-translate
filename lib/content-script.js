'use strict'

browser.runtime.onMessage.addListener(request => {
  let selection = window
    .getSelection()
    .toString()
    .trim()
  if (selection) {
    return browser.runtime.sendMessage({ selectedText: encodeURIComponent(selection), openTab: request.openTab })
  }
})
