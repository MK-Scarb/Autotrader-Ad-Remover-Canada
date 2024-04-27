// ==UserScript==
// @name         AutoTrader Ad Blocker
// @namespace    http://tampermonkey.net/
// @version      0.4
// @description  Automatically remove advertised listings from AutoTrader listings. Canada only (US is untested)
// @author       MK
// @match        *://*.autotrader.ca/*
// @grant        none
// ==/UserScript==


(function() {
    'use strict';

    function removeUnwantedListings() {
        const divs = document.querySelectorAll('div');
        let isRemoving = false;
        let headingSRPCount = 0; // Counter to keep track of 'col-sm-12 listingHeadingNewSRP' divs

        divs.forEach(div => { // God bless the man who invented if statements
            if (div.id.startsWith('SRP_Billboard_')) {
                div.style.display = 'none';
            }

            if (div.className === "listingHeading ") {
                div.style.display = 'none';
            }

            if (div.id.startsWith('adv_Disclaimer_')) {
                isRemoving = true;
            } else if (div.className.includes('col-sm-12 listingHeadingNewSRP')) {
                headingSRPCount++;
                if (headingSRPCount > 1) { // Hide all but the first instance of this heading so that the next page buttons don't get blocked
                    div.style.display = 'none';
                }
                isRemoving = false;
            }

            if (div.className === 'col-xs-12 result-item enhanced   priority-qa listing-redesign-dt' ||
                div.className === 'col-xs-12 result-item enhanced  ppl-qa priority-qa listing-redesign-dt') {
                div.style.display = 'none';
            }

            if (isRemoving) { // Hide all divs between start and stop markers set by 'adv_Disclaimer_' and 'col-sm-12 listingHeadingNewSRP'.
                div.style.display = 'none';
            }
        });
    }

    // Uses MutationObserver to handle AJAX-loaded content and dynamically loaded elements so that Autotrader can't try dynamically reloading the content
    let observer = new MutationObserver(() => {
        removeUnwantedListings();
    });

    observer.observe(document.body, {
        childList: true,
        subtree: true
    });

    // Initial run
    removeUnwantedListings();
})();
