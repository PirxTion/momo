    // Controller
window.setSelectedCountry = function (country) {
    if (window.selectedCountry !== undefined) {
        window.selectedCountry = country;
        // Ensure the dropdown for bar chart reflects the map selection
        const barChartCountrySelect = document.getElementById("country-select");
        if (barChartCountrySelect) {
            barChartCountrySelect.value = "map";
        }
        if (window.updateBarChart) {
            updateBarChart();
        }
    }

    if (window.selectedCountryPie !== undefined) {
        window.selectedCountryPie = country;
        // Ensure the dropdown for pie chart reflects the map selection
        const pieChartCountrySelect = document.getElementById("country-pie-select");
        if (pieChartCountrySelect) {
            pieChartCountrySelect.value = "map";
        }
        if (window.updatePieChart) {
            updatePieChart();
        }
    }

    // Add logic for the new age histogram
    if (window.selectedCountryAgeHistogram !== undefined) {
        window.selectedCountryAgeHistogram = country;
        // Ensure the dropdown for age histogram reflects the map selection
        const ageHistogramCountrySelect = document.getElementById("country-age-select");
        if (ageHistogramCountrySelect) {
            ageHistogramCountrySelect.value = "map";
        }
        if (window.updateAgeHistogram) {
            updateAgeHistogram();
        }
    }
};