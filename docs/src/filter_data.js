// Add this at the beginning of docs/src/filter_data.js
window.allLaureateDataPromise = fetch('../nobel_laureates_data.csv') // Adjusted path
    .then(response => {
        if (!response.ok) {
            throw new Error('Network response was not ok: ' + response.statusText);
        }
        return response.text();
    })
    .then(csvText => {
        const lines = csvText.trim().split('\n');
        const headers = lines[0].split(',').map(header => header.trim());
        return lines.slice(1).map(line => {
            const values = line.split(',');
            let obj = {};
            headers.forEach((header, index) => {
                obj[header] = values[index] ? values[index].trim() : undefined;
            });
            return obj;
        }).filter(obj => obj.year); // Basic filter for valid rows
    })
    .catch(error => {
        console.error("Failed to load Nobel laureate data:", error);
        return []; // Return empty array on error to prevent other scripts from breaking
    });

// Timeline Slider
const timelineSlider = document.getElementById('timeline-slider');
const currentYearDisplay = document.getElementById('current-year');

timelineSlider.addEventListener('input', function () {
    const year = this.value;
    currentYearDisplay.textContent = year;
    filterDataByYear(year);
});

// Dropdown Category Filter
const dropdown = document.querySelector('.dropdown');
const dropdownToggle = document.querySelector('.dropdown-toggle');
const dropdownItems = document.querySelectorAll('.dropdown-item');
let selectedCategory = 'all';

// Toggle dropdown visibility
dropdownToggle.addEventListener('click', function () {
    dropdown.classList.toggle('show');
});

// Close dropdown when clicking outside
document.addEventListener('click', function (event) {
    if (!dropdown.contains(event.target)) {
        dropdown.classList.remove('show');
    }
});

// Handle category selection
dropdownItems.forEach(item => {
    item.addEventListener('click', function () {
        selectedCategory = this.dataset.category;
        dropdownToggle.textContent = this.textContent + ' ▼';
        dropdown.classList.remove('show');
        filterDataByCategory(selectedCategory);
    });
});

// Filter functions (implement according to your needs)
function filterDataByYear(year) {
    console.log('Filtering by year:', year);
    // Your implementation
}

function filterDataByCategory(category) {
    console.log('Filtering by category:', category);
    // Your implementation
}
