// Fetch rating
async function fetchProfessorRating(profName) {
    return new Promise((resolve) => {
        chrome.storage.local.get(['ratingsData'], (result) => {
            const ratingsData = result.ratingsData;
            resolve(ratingsData?.[profName] || "No rating found");
        });
    });
}

// Add rating in Emory Course Atlas
async function injectRatingForCourseAtlas() {
    const instructorElements = document.querySelectorAll('.instructor-detail');

    for (const instructorElement of instructorElements) {
        const nameElement = instructorElement.querySelector('.instructor-name');

        if (nameElement && !nameElement.querySelector('.rmp-rating')) { 
            const profName = nameElement.innerText.trim();
            const rating = await fetchProfessorRating(profName);

            const ratingElement = document.createElement('span');
            ratingElement.classList.add('rmp-rating'); 
            ratingElement.innerText = ` | RMP Rating: ${rating}`;
            ratingElement.style.fontWeight = 'bold';
            ratingElement.style.marginLeft = '5px';

            // Color Ratings
            if (rating === "No rating found") {
                ratingElement.style.color = 'gray';
            } else {
                const ratingValue = Number.parseFloat(rating);
                if (ratingValue >= 4.0) {
                    ratingElement.style.color = 'green';
                } else if (ratingValue > 3.5) {
                    ratingElement.style.color = 'orange';
                } else {
                    ratingElement.style.color = 'red';
                }
            }

            nameElement.appendChild(ratingElement);
        }
    }
}

// OPUS Search Rating
async function injectRatingForNewSite() {
    const instructorElements = document.querySelectorAll('.ps_box-value.psc_display-block.psc_padding-bottom0_5em');

    for (const instructorElement of instructorElements) {
        if (instructorElement.id.startsWith('SSR_CLSRCH_F_WK_SSR_INSTR_LONG_1') && !instructorElement.querySelector('.rmp-rating')) {
            const profName = instructorElement.innerText.trim();
            const rating = await fetchProfessorRating(profName);

            const ratingElement = document.createElement('span');
            ratingElement.classList.add('rmp-rating');
            ratingElement.innerText = ` ${rating}`;  

            // Color Ratings
            if (rating === "No rating") {
                ratingElement.style.color = 'gray';
            } else {
                const ratingValue = Number.parseFloat(rating);
                if (ratingValue >= 4.0) {
                    ratingElement.style.color = 'green';
                } else if (ratingValue > 3.5) {
                    ratingElement.style.color = 'orange';
                } else {
                    ratingElement.style.color = 'red';
                }
            }

            instructorElement.appendChild(ratingElement);
        }
    }
}

function observeAllSites() {
    const targetNode = document.body;
    const config = { childList: true, subtree: true };

    const observer = new MutationObserver(async (mutationsList) => {
    
        observer.disconnect();

        for (const mutation of mutationsList) {
            if (mutation.type === 'childList') {
            
                await injectRatingForNewSite();
            }
        }

        observer.observe(targetNode, config);
    });

    observer.observe(targetNode, config);
}


observeAllSites();
