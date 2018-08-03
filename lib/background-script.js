const notifyImg = 'data/icon-32-white.png'
const apiKey = ''

browser.runtime.onMessage.addListener(async message => {
  let selectedText = message.selectedText
  const optionItem = await browser.storage.local.get('translateTo')
  const langTo = optionItem.translateTo || 'it'
  try {
    if (message.openTab) {
      const detectLangUrl = `https://translate.yandex.net/api/v1.5/tr.json/detect?key=${apiKey}&text=${selectedText}`
      const jsonRes = await (await fetch(detectLangUrl)).json()
      browser.tabs.create({
        url: `https://translate.yandex.com/?text=${selectedText}&lang=${jsonRes['lang']}-${langTo}`,
      })
    } else {
      const apiUrl = `https://translate.yandex.net/api/v1.5/tr.json/translate?key=${apiKey}&lang=${langTo}&text=${selectedText}`
      const jsonRes = await (await fetch(apiUrl)).json()
      browser.notifications.create('hot-translate-notification', {
        type: 'basic',
        iconUrl: notifyImg,
        title: ''
        message: jsonRes.text[0],
      })
    }
    selectedText = ''
  } catch (err) {
    selectedText = ''
    console.log(`Error: ${err}`)
  }
})

browser.commands.onCommand.addListener(async command => {
  try {
    const tabs = await browser.tabs.query({
      currentWindow: true,
      active: true,
    })
    return browser.tabs.sendMessage(tabs[0].id, { openTab: false })
  } catch (err) {
    console.log(err)
  }
})

browser.browserAction.onClicked.addListener(async state => {
  try {
    const tabs = await browser.tabs.query({
      currentWindow: true,
      active: true,
    })
    return browser.tabs.sendMessage(tabs[0].id, { openTab: true })
  } catch (err) {
    console.log(err)
  }
})
