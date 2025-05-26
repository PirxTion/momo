am5.ready(function () {
    // Make it global so the map can access it
    window.selectedCountry = "All";
    let allNobelData = []; // To store data once loaded

    const root = am5.Root.new("barchartdiv");
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
        am5xy.XYChart.new(root, {
            panX: true,
            panY: true,
            wheelX: "panX",
            wheelY: "zoomX",
            layout: root.verticalLayout
        })
    );

    const xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
            categoryField: "year",
            renderer: am5xy.AxisRendererX.new(root, {}),
            tooltip: am5.Tooltip.new(root, {})
        })
    );

    const yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, {})
        })
    );

    const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
            name: "Winners",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "count",
            categoryXField: "year",
            tooltip: am5.Tooltip.new(root, {
                labelText: "{valueY} winners"
            })
        })
    );

    // Also expose this globally so setSelectedCountry can call it
    window.updateBarChart = function () {
        const selectedType = document.getElementById("type-select").value;
        const countrySelectValue = document.getElementById("country-select").value;
        const country = countrySelectValue === "map" ? window.selectedCountry : countrySelectValue;

        // Use allNobelData and new field names
        const filtered = allNobelData.filter((d) => {
            return (selectedType === "All" || d.category === selectedType) &&
                   (country === "All" || d.bornCountry === country);
        });

        const grouped = {};
        filtered.forEach((d) => {
            const year = d.year;
            // Count each laureate as 1
            grouped[year] = (grouped[year] || 0) + 1;
        });

        const chartData = Object.entries(grouped).map(([year, count]) => ({
            year,
            count
        }));

        xAxis.data.setAll(chartData);
        series.data.setAll(chartData);
        series.appear(1000);
        chart.appear(1000, 100);
    };

    document.getElementById("type-select").addEventListener("change", window.updateBarChart);
    document.getElementById("country-select").addEventListener("change", window.updateBarChart);

    // Load data using the global promise
    if (window.allLaureateDataPromise) {
        window.allLaureateDataPromise.then(data => {
            allNobelData = data; // Store the loaded data
            window.updateBarChart(); // Initial render after data is loaded
        }).catch(error => console.error("Error loading Nobel data for bar chart:", error));
    } else {
        console.error("Bar Chart: Global Nobel data promise not available.");
        // Optionally, render with empty data or show an error message
        window.updateBarChart(); // Attempt to render, will use empty allNobelData
    }
});