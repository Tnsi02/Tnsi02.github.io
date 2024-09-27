document.addEventListener('DOMContentLoaded', () => {
    // Function to fetch news from a specified file and update the respective news list
    function fetchNews(filePath, newsListId) {
        fetch(filePath)
            .then(response => response.text())
            .then(data => {
                const newsItems = data.split('\n').map(line => line.trim()).filter(line => line);
                const newsList = document.getElementById(newsListId);

                newsItems.forEach(item => {
                    const [title, link] = item.split(' - '); // Split the title and link
                    const article = document.createElement('article');
                    article.innerHTML = `
                        <label>
                            <input type="checkbox" class="news-read-checkbox" />
                            <a href="${link}" target="_blank">${title}</a>
                            <button class="summarize-button" data-url="${link}">Summarize</button>
                        </label>
                    `;
                    
                    const checkbox = article.querySelector('.news-read-checkbox');

                    // Check localStorage for the read state
                    const isRead = JSON.parse(localStorage.getItem(link));
                    if (isRead) {
                        checkbox.checked = true; // Mark checkbox if read
                    }

                    // Save checkbox state to localStorage when toggled
                    checkbox.addEventListener('change', () => {
                        localStorage.setItem(link, JSON.stringify(checkbox.checked));
                    });

                    newsList.appendChild(article);
                });
            })
            .catch(error => console.error(`Error fetching news from ${filePath}:`, error));
    }

    // Function to open Phind with the summary prompt
    function openPhindSummarization(url) {
        // Create the summary query string
        const summaryQuery = `Summarize this: ${url}`;
        // Open Phind with the query string
        const phindUrl = `https://phind.com/?query=${encodeURIComponent(summaryQuery)}`;
        window.open(phindUrl, '_blank'); // Open Phind in a new tab
    }

    // Event listener for summarize buttons
    document.addEventListener('click', function(event) {
        if (event.target.classList.contains('summarize-button')) {
            const url = event.target.getAttribute('data-url'); // Get the URL from the button
            openPhindSummarization(url); // Call the function to open Phind
        }
    });

    // Fetch EP News, Commission News, and External Action News
    fetchNews('EPnews.txt', 'ep-news-list');
    fetchNews('ECnews.txt', 'commission-news-list');
    fetchNews('EEASnews.txt', 'external-action-news-list');

    // Add click event listeners for toggling visibility
    document.querySelectorAll('.toggle-sign').forEach(sign => {
        sign.addEventListener('click', function() {
            const newsList = this.closest('.news-section').querySelector('.news-list'); // Get the news list in the same section
            const isVisible = this.getAttribute('data-visible') === 'true';
            newsList.style.display = isVisible ? 'none' : 'block'; // Toggle display
            this.textContent = isVisible ? '+' : '-'; // Change sign
            this.setAttribute('data-visible', !isVisible); // Update visibility state
        });
    });
});
