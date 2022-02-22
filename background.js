console.log("hi");

function removeDuplicates(originalArray, prop) {
  var newArray = [];
  var lookupObject = {};

  for (var i in originalArray) {
    lookupObject[originalArray[i][prop]] = originalArray[i];
  }

  for (i in lookupObject) {
    newArray.push(lookupObject[i]);
  }
  return newArray;
}

chrome.action.onClicked.addListener(() => {
  chrome.tabs.query(
    {
      currentWindow: true,
    },
    (tabs) => {
      let map = new Map();
      // let domains = tabs.map((tab) => new URL(tab.url).hostname);
      // tabs.map((tab) => {
      // let domain = new URL(tab.url).hostname;
      // map.set(domain, (map.get(domain) || 0) + 1);
      // });
      tabs.map((tab) => {
        tab.domain = new URL(tab.url).hostname;
      });
      tabs.forEach((a) => map.set(a.domain, (map.get(a.domain) || 0) + 1));
      let grouped = tabs.filter((a) => map.get(a.domain) > 1);
      let domains = removeDuplicates(grouped, "domain");

      domains.map((tab) => {
        let children = grouped.filter((x) => x.domain == tab.domain);
        chrome.tabs.group(
          {
            tabIds: children.map((x) => x.id),
          },
          (id) => {
            console.log(id);
            chrome.tabGroups.update(id, { collapsed: true, title: tab.domain });
          }
        );
        // console.log(tab.domain);
        // console.log(children);
      });
      // let groups = [];
      // console.log(grouped);
      // console.log(domains);
      // for(let i = 0; i < domains.length; i++) {
      // let domains[i]
      // }

      // console.log(domains);
      // obj.arr = obj.arr.filter((value, index, self) => index === self.findIndex((t) => t.url === value.url));
      // console.log(uniq(domains, 'url'));
      // console.log();
    }
  );
  // console.log('bye');
});
// chrome.action.onClicked.addListener((tab) => {

// 	chrome.tabs.create({ url: 'http://www.stackoverflow.com' });
// 	// chrome.scripting.executeScript({
// 	//   target: {tabId: tab.id},
// 	//   files: ['content.js']
// 	// });
// });
