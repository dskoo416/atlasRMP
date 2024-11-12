const fileUrl = chrome.runtime.getURL('ratings.json');
console.log("Loading ratings from:", fileUrl);

fetch(fileUrl)
    .then(response => {
        if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
        return response.json();
    })
    .then(data => {
        
        
        chrome.storage.local.set({ ratingsData: data }, () => {
            console.log("Ratings data successfully loaded into local storage.");
        });
    })
    .catch(error => console.error("Error loading ratings data:", error));
