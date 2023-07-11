// ==UserScript==
// @name         Youtube Shorts Toggle
// @namespace    https://github.com/mrcrhn/Youtube-Short-Toggle
// @version      1
// @description  Hides / Shows YouTube Shorts Videos from your current page (Button is next to 'create' button in the top right corner). LocalStorage remembers the choice you left with.
// @author       Marc
// @match        http://*.youtube.com/feed/subscriptions
// @icon         https://www.google.com/s2/favicons?sz=64&domain=youtube.com
// @grant        none
// @run-at document-end

// ==/UserScript==
(
    () =>
    {

        const sleep = (milliseconds) => {
            return new Promise(resolve => setTimeout(resolve, milliseconds));
        }

        const createToggleButton = () => {
            const buttonDiv = document.querySelector('div#end')
            const checkBox = document.createElement('input')
            checkBox.type = 'checkbox'
            checkBox.id = 'shortsToggle'
            checkBox.style.height = checkBox.style.width = '20px'
            checkBox.addEventListener('change', handleToggle)
            checkBox.checked = localStorage.getItem('hidden') != 'true'
            buttonDiv.insertBefore(checkBox, buttonDiv.firstChild)
        }


        const handleToggle = () => {
            const isToggled = document.getElementById('shortsToggle').checked
            isToggled ? localStorage.removeItem('hidden') : localStorage.setItem('hidden', 'true')
            toggleShorts(isToggled)
        }

        const toggleShorts = (isToggled) =>
        {
            Array
                .from(document.querySelectorAll(`a[href^="/shorts"]`))
                .forEach
            (
                a =>
                {
                    let parent = a.parentElement;

                    while (parent && (!parent.tagName.startsWith('YTD-') || parent.tagName === 'YTD-THUMBNAIL'))
                    {
                        parent = parent.parentElement;
                    }

                    if (parent)
                    {
                        parent.style.visibility = isToggled ? 'visible' : 'hidden'
                    }
                }
            )
            ;
        }
        createToggleButton()
        const loadLastChoice = async () => {
            const hidden = localStorage.getItem('hidden') != 'true'
            await sleep(1000)
            toggleShorts(hidden)
        }
        loadLastChoice()

        const observer = new MutationObserver(localStorage.getItem('hidden') != 'true');
        observer.observe
        (
            document,
            {
                childList:  true,
                subtree:    true,
            }
        );
    }
)();
