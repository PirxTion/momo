am5.ready(function () {
    // Global variable to be updated by map
    window.selectedCountryPie = "All";
    let allNobelData = []; // To store data once loaded

    const root = am5.Root.new("piechartdiv");
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
        am5percent.PieChart.new(root, {
            layout: root.verticalLayout
        })
    );

    const series = chart.series.push(
        am5percent.PieSeries.new(root, {
            valueField: "value",
            categoryField: "category"
        })
    );

    // ✅ Expose this function globally so it can be called from the map
    window.updatePieChart = function () {
        const dropdown = document.getElementById("country-pie-select");
        const selected = dropdown.value;
        const country = selected === "map" ? window.selectedCountryPie : selected;

        // Use allNobelData and new field names, exclude organizations
        const filtered = allNobelData.filter((d) =>
            (country === "All" || d.bornCountry === country) && d.gender !== 'org'
        );

        const grouped = {};
        filtered.forEach(d => {
            // Group by actual category from CSV, count each laureate as 1
            grouped[d.category] = (grouped[d.category] || 0) + 1;
        });

        const chartData = Object.entries(grouped).map(([category, value]) => ({
            category,
            value
        }));

        series.data.setAll(chartData);
        series.appear(1000, 100);
    };

    // Dropdown listener
    document.getElementById("country-pie-select").addEventListener("change", function () {
        const val = this.value;
        window.selectedCountryPie = val === "map" ? window.selectedCountryPie : val;
        window.updatePieChart();
    });

    // Load data using the global promise
    if (window.allLaureateDataPromise) {
        window.allLaureateDataPromise.then(data => {
            allNobelData = data; // Store the loaded data
            window.updatePieChart(); // Initial render after data is loaded
        }).catch(error => console.error("Error loading Nobel data for pie chart:", error));
    } else {
        console.error("Pie Chart: Global Nobel data promise not available.");
        // Optionally, render with empty data or show an error message
        window.updatePieChart(); // Attempt to render, will use empty allNobelData
    }
});