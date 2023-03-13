var data = null;

chrome.storage.onChanged.addListener(function (changes, namespace) {
    console.log("Chrome Storage has changed");

    for (const key in changes) {
        if (changes[key].newValue === undefined) {
            // Key has been removed from storage
            console.log(`Content Script : Key '${key}' has been deleted`);
            data.delete(key);
        } else {
            // Key has been added or modified in storage
            console.log(`Content Script : Key '${key}' has been updated in storage with value '${changes[key].newValue}'`);
            data.set(key, changes[key].newValue);
        }
    }
});

window.addEventListener('load', function () {
    console.log(`Content Script : Window Loaded`);
    chrome.storage.sync.get(null, function (items) {
        data = new Map();
        for (const key in items) {
            data.set(key, items[key]);
        }
        console.log(`Content Script : Loaded data from storage`);

        // Register to Input Event Listener
        registerToAllTextBox();

        const currentUrl = location.href;
        console.log('currentUrl=', currentUrl);
        switch (true) {
            case currentUrl.includes('docs.google.com/document'):
                registerToGoogleDocTextBox();
                break;
            case currentUrl.includes('mail.google.com'):
                registerToGoogleMailMessageBody();
                break;
        }
    });
});

function registerToAllTextBox() {
    console.log(`Content Script : Register All Text Box Event Listener`);

    document.addEventListener('input', (event) => {
        const value = event.target.value;
        const words = value.split(' ');
        let replaceOffset = 0;

        for (let i = 0; i < words.length; i++) {
            const currentWord = words[i];
            if (data && data.has(currentWord)) {
                console.log(`Content Script : Found matched abbreviation in Text Box: ${value}`);
                const replaceStart = value.indexOf(currentWord, replaceOffset);
                const replaceEnd = replaceStart + currentWord.length;
                words[i] = data.get(currentWord);
                const newValue = words.join(' ');
                event.target.value = newValue;
                const cursorPosition = replaceStart + words[i].length;
                event.target.setSelectionRange(cursorPosition, cursorPosition);
                replaceOffset = replaceEnd + 1;
            } else {
                replaceOffset += currentWord.length + 1;
            }
        }
    });
}

function registerToGoogleMailMessageBody() {
    console.log(`Content Script : Register Google Mail Event Listener`);

    function registerInputEventListeners() {
        const messageBodyBoxes = document.querySelectorAll('div[aria-label="Message Body"]');
        messageBodyBoxes.forEach(function (messageBodyBox) {
            messageBodyBox.addEventListener("input", function (event) {
                const value = event.target.innerHTML;
                const words = value.split(" ");
                let replaceOffset = 0;

                for (let i = 0; i < words.length; i++) {
                    const currentWord = words[i];
                    if (data && data.has(currentWord)) {
                        console.log(`Content Script : Found matched abbreviation in Text Box: ${value}`);
                        const replaceStart = value.indexOf(currentWord, replaceOffset);
                        const replaceEnd = replaceStart + currentWord.length;
                        words[i] = data.get(currentWord);
                        const newValue = words.join(" ");
                        event.target.innerHTML = newValue;
                        const range = document.createRange();
                        const sel = window.getSelection();
                        range.setStart(event.target.childNodes[0], replaceStart + words[i].length);
                        range.setEnd(event.target.childNodes[0], replaceStart + words[i].length);
                        sel.removeAllRanges();
                        sel.addRange(range);
                        replaceOffset = replaceEnd + 1;
                    } else {
                        replaceOffset += currentWord.length + 1;
                    }
                }
            });
        });
    }

    // Run initially
    registerInputEventListeners();

    // Check for new elements every second
    setInterval(registerInputEventListeners, 1000);
}