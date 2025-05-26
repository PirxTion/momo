am5.ready(function () {
    // Global variable to be updated by map or dropdown
    window.selectedCountryAgeHistogram = "All";

    // Mock data for age histogram
    const allLaureateData = [
        { name: "Laureate A", awardYear: 2020, bornYear: 1960, country: "USA" }, // Age 60
        { name: "Laureate B", awardYear: 2018, bornYear: 1950, country: "USA" }, // Age 68
        { name: "Laureate C", awardYear: 2022, bornYear: 1970, country: "Canada" }, // Age 52
        { name: "Laureate D", awardYear: 2021, bornYear: 1985, country: "Germany" }, // Age 36
        { name: "Laureate E", awardYear: 2019, bornYear: 1975, country: "USA" }, // Age 44
        { name: "Laureate F", awardYear: 2023, bornYear: 1963, country: "UK" }, // Age 60
        { name: "Laureate G", awardYear: 2020, bornYear: 1955, country: "Canada" }, // Age 65
        { name: "Laureate H", awardYear: 2017, bornYear: 1940, country: "Germany" }, // Age 77
        { name: "Laureate I", awardYear: 2022, bornYear: 1990, country: "USA" }, // Age 32
        { name: "Laureate J", awardYear: 2020, bornYear: 1980, country: "UK" }, // Age 40
        { name: "Laureate K", awardYear: 2018, bornYear: 1965, country: "Canada" }, // Age 53
        { name: "Laureate L", awardYear: 2019, bornYear: 1958, country: "Germany" }, // Age 61
        { name: "Laureate M", awardYear: 2023, bornYear: 1978, country: "USA" }, // Age 45
        { name: "Laureate N", awardYear: 2021, bornYear: 1968, country: "UK" }, // Age 53
        { name: "Laureate O", awardYear: 2022, bornYear: 1982, country: "Canada" }, // Age 40
    ];

    const root = am5.Root.new("agehistogramdiv");
    root.setThemes([am5themes_Animated.new(root)]);

    const chart = root.container.children.push(
        am5xy.XYChart.new(root, {
            panX: false,
            panY: false,
            wheelX: "panX",
            wheelY: "zoomX",
            layout: root.verticalLayout
        })
    );

    // Define age groups
    const ageGroups = [
        { min: 30, max: 39, label: "30-39" },
        { min: 40, max: 49, label: "40-49" },
        { min: 50, max: 59, label: "50-59" },
        { min: 60, max: 69, label: "60-69" },
        { min: 70, max: 79, label: "70-79" },
        { min: 80, max: 89, label: "80-89" },
    ];

    const xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
            categoryField: "ageGroup",
            renderer: am5xy.AxisRendererX.new(root, {
                minGridDistance: 30
            }),
            tooltip: am5.Tooltip.new(root, {})
        })
    );

    const yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, {}),
            min: 0, // Ensure Y axis starts at 0
            title: am5.Label.new(root, { // Add Y-axis title
                text: "Number of Laureates",
                rotation: -90,
                y: am5.p50,
                centerX: am5.p50
            })
        })
    );
    yAxis.get("renderer").labels.template.setAll({
        minGridDistance: 20 // Ensure integer values by adjusting grid distance
    });


    const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
            name: "Laureates by Age",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "count",
            categoryXField: "ageGroup",
            tooltip: am5.Tooltip.new(root, {
                labelText: "{valueY} laureates"
            })
        })
    );
    
    series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5 });
    series.columns.template.adapters.add("fill", function (fill, target) {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });

    series.columns.template.adapters.add("stroke", function (stroke, target) {
      return chart.get("colors").getIndex(series.columns.indexOf(target));
    });


    window.updateAgeHistogram = function () {
        const countrySelectValue = document.getElementById("country-age-select") ? document.getElementById("country-age-select").value : "All";
        const country = countrySelectValue === "map" ? window.selectedCountryAgeHistogram : countrySelectValue;

        const filteredLaureates = allLaureateData.filter(laureate => {
            return country === "All" || laureate.country === country;
        });

        const ageData = filteredLaureates.map(laureate => ({
            ...laureate,
            age: laureate.awardYear - laureate.bornYear
        }));

        // Group by age ranges
        const groupedByAge = {};
        ageGroups.forEach(group => {
            groupedByAge[group.label] = 0; // Initialize all defined groups
        });

        ageData.forEach(laureate => {
            for (const group of ageGroups) {
                if (laureate.age >= group.min && laureate.age <= group.max) {
                    groupedByAge[group.label]++;
                    break;
                }
            }
        });
        
        const chartData = Object.entries(groupedByAge).map(([ageGroup, count]) => ({
            ageGroup,
            count
        }));

        xAxis.data.setAll(chartData);
        series.data.setAll(chartData);
        series.appear(1000);
        chart.appear(1000, 100);
    };

    // Initial render
    // Check if the country-age-select element exists before adding event listener
    if (document.getElementById("country-age-select")) {
        document.getElementById("country-age-select").addEventListener("change", function () {
            const val = this.value;
            window.selectedCountryAgeHistogram = val === "map" ? window.selectedCountryAgeHistogram : val;
            window.updateAgeHistogram();
        });
    }


    // Call updateAgeHistogram initially to render the chart with "All" data or default selection
    window.updateAgeHistogram(); 
});
