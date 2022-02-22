console.log("hi");
function getHostName(url) {
  var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
  if (
    match != null &&
    match.length > 2 &&
    typeof match[2] === "string" &&
    match[2].length > 0
  ) {
    var hostname = match[2].split(".");
    return hostname[0];
  } else {
    return null;
  }
}

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

const groupMatching = () => {
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
        // tab.domain = new URL(tab.url).hostname;
        let domain = new URL(tab.url).hostname;
        domain = domain
          .split(".")
          .filter((x) => x != "www")
          .join(".");
        console.log(domain);
        tab.domain = domain;
      });
      tabs.forEach((a) => map.set(a.domain, (map.get(a.domain) || 0) + 1));
      let grouped = tabs.filter((a) => map.get(a.domain) > 1);
      let domains = removeDuplicates(grouped, "domain");

      domains.map((tab) => {
        let children = grouped.filter((x) => x.domain == tab.domain);
        // console.log(tab.domain);
        // console.log(children.some((x) => x.active));
        // children.map((child) => {
        // 	if (child.pinned) {
        // 		child.wasPinned = true;
        // 	}
        // });
        // console.log(children);
        chrome.tabs.group(
          {
            tabIds: children.map((x) => x.id),
          },
          (id) => {
            // console.log(id);
            chrome.tabGroups.update(id, {
              collapsed: !children.some((x) => x.active),
              title: tab.domain,
            });
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
};

const ungroupAll = () => {
  chrome.tabs.query(
    {
      currentWindow: true,
    },
    (tabs) => {
      chrome.tabs.ungroup(
        tabs.map((x) => x.id),
        // () => {
        // 	tabs.map((x) => {
        // 		console.log(x);
        // 		if (x.wasPinned) {
        // 			chrome.tabs.update(x.id, { pinned: true });
        // 			x.wasPinned = false;
        // 		}
        // 	});
        // 	// 	console.log('ungrouped');
        // 	// 	// var updateProperties = { active: true };
        // 	// 	chrome.tabs.query({ currentWindow: true }, (tabs) => {
        // 	// 		console.log(tabs[6].id);
        // 	// 		chrome.tabs.highlight({ tabs: tabs[6].index }, function () {});
        // 	// 		// chrome.tabs.update(tabs[4].id, { active: true }, (tab) => {});
        // 	// 	});
        // }
        () => {
          // chrome.tabs.query({ currentWindow: true, index: tabs.length - 1 }, ([tab]) => {
          // 	for (var i = arr.length - 1; i >= 0; i--) {
          // 		console.log(arr[i]);
          // 	}
          // 	chrome.tabs.move(tab.id, { index: 0 }, () => {});
          // });
        }
      );
    }
  );
};

document.querySelector("#group").addEventListener("click", groupMatching);
document.querySelector("#ungroup").addEventListener("click", ungroupAll);
// chrome.action.onClicked.addListener((tab) => {

// 	chrome.tabs.create({ url: 'http://www.stackoverflow.com' });
// 	// chrome.scripting.executeScript({
// 	//   target: {tabId: tab.id},
// 	//   files: ['content.js']
// 	// });
// });
