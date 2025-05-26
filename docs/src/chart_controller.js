    // Controller
window.selectedCountryAgeHistogram = "All"; // Initialize for Age Histogram

window.setSelectedCountry = function (country) {
    if (window.selectedCountry !== undefined) {
        window.selectedCountry = country;
        document.getElementById("country-select").value = "map";
        if (window.updateBarChart) updateBarChart();
    }

    if (window.selectedCountryPie !== undefined) {
        window.selectedCountryPie = country;
        document.getElementById("country-pie-select").value = "map";
        if (window.updatePieChart) updatePieChart();
    }

    if (window.selectedCountryAgeHistogram !== undefined) { // Check if the global var is set
        window.selectedCountryAgeHistogram = country;
        // No specific dropdown for age histogram country to update via "map" selection
        if (window.updateAgeHistogram) window.updateAgeHistogram();
    }
    };