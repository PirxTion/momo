am5.ready(function () {
    // Global variable to be updated by map/controller
    window.selectedCountryAgeHistogram = "All"; // Or a suitable default

    // Placeholder for all Nobel laureate data (to be loaded from CSV)
    let allNobelData = []; 

    // Initialize the amCharts Root element
    const root = am5.Root.new("agehistogramdiv");
    root.setThemes([am5themes_Animated.new(root)]);

    // Create the chart
    const chart = root.container.children.push(
        am5xy.XYChart.new(root, {
            panX: false,
            panY: false,
            wheelX: "panX",
            wheelY: "zoomX",
            layout: root.verticalLayout,
            tooltip: am5.Tooltip.new(root, {}) // Add a chart-level tooltip
        })
    );

    // Create X-axis for age categories (bins)
    const xAxis = chart.xAxes.push(
        am5xy.CategoryAxis.new(root, {
            categoryField: "ageCategory",
            renderer: am5xy.AxisRendererX.new(root, {
                minGridDistance: 30 // Adjust as needed for label visibility
            }),
            tooltip: am5.Tooltip.new(root, { labelText: "{categoryX}" })
        })
    );

    // Create Y-axis for laureate count
    const yAxis = chart.yAxes.push(
        am5xy.ValueAxis.new(root, {
            renderer: am5xy.AxisRendererY.new(root, {}),
            tooltip: am5.Tooltip.new(root, { labelText: "{valueY}" })
        })
    );
    yAxis.children.moveValue(am5.Label.new(root, { text: "Number of Laureates", rotation: -90, y: am5.p50, centerX: am5.p50 }), 0);


    // Create series (columns for the histogram)
    const series = chart.series.push(
        am5xy.ColumnSeries.new(root, {
            name: "Laureates by Age",
            xAxis: xAxis,
            yAxis: yAxis,
            valueYField: "count",
            categoryXField: "ageCategory",
            tooltip: am5.Tooltip.new(root, {
                labelText: "{categoryX}: {valueY} laureates"
            })
        })
    );
    series.columns.template.setAll({ cornerRadiusTL: 5, cornerRadiusTR: 5 });


    // Function to parse birth dates (handle YYYY-MM-DD, YYYY-00-00, MM/DD/YYYY)
    function parseBirthYear(bornDateStr) {
        if (!bornDateStr || bornDateStr === "0000-00-00") return null;

        let year;
        if (bornDateStr.includes('-')) { // YYYY-MM-DD or YYYY-00-00
            year = parseInt(bornDateStr.split('-')[0], 10);
        } else if (bornDateStr.includes('/')) { // MM/DD/YYYY
            const parts = bornDateStr.split('/');
            year = parseInt(parts[2], 10);
        } else if (/^\d{4}$/.test(bornDateStr)) { // YYYY
             year = parseInt(bornDateStr, 10);
        } else {
            return null; // Unknown format
        }
        return isNaN(year) ? null : year;
    }

    // Function to calculate age at award and prepare data for histogram
    function prepareHistogramData(data, country) {
        const ageData = data.map(laureate => {
            const awardYear = parseInt(laureate.year, 10);
            const birthYear = parseBirthYear(laureate.born);

            if (laureate.gender === 'org') return null; // Skip organizations

            if (!isNaN(awardYear) && birthYear) {
                const age = awardYear - birthYear;
                if (age >= 0 && age < 120) { // Filter out unreasonable ages
                    return { ...laureate, ageAtAward: age };
                }
            }
            return null;
        }).filter(laureate => laureate !== null); // Remove nulls (missing data, orgs, or bad age)

        const filteredByCountry = country === "All" ? ageData : ageData.filter(l => l.bornCountry === country);

        // Group by age bins (e.g., 20-29, 30-39, ...)
        const ageBins = {
            "20-29": 0, "30-39": 0, "40-49": 0, "50-59": 0,
            "60-69": 0, "70-79": 0, "80-89": 0, "90+": 0
        };

        filteredByCountry.forEach(laureate => {
            const age = laureate.ageAtAward;
            if (age >= 20 && age <= 29) ageBins["20-29"]++;
            else if (age >= 30 && age <= 39) ageBins["30-39"]++;
            else if (age >= 40 && age <= 49) ageBins["40-49"]++;
            else if (age >= 50 && age <= 59) ageBins["50-59"]++;
            else if (age >= 60 && age <= 69) ageBins["60-69"]++;
            else if (age >= 70 && age <= 79) ageBins["70-79"]++;
            else if (age >= 80 && age <= 89) ageBins["80-89"]++;
            else if (age >= 90) ageBins["90+"]++;
        });

        return Object.entries(ageBins).map(([ageCategory, count]) => ({
            ageCategory,
            count
        }));
    }

    // Global function to update the histogram
    window.updateAgeHistogram = function () {
        const country = window.selectedCountryAgeHistogram || "All"; // Use global country
        const histogramChartData = prepareHistogramData(allNobelData, country);

        xAxis.data.setAll(histogramChartData);
        series.data.setAll(histogramChartData);

        series.appear(1000);
        chart.appear(1000, 100);
    };

    // Load the CSV data (using d3 or fetch API)
    // This part will be refined in step 4 (Update filter_data.js)
    // For now, we'll use a placeholder or assume data is loaded elsewhere.
    // If 'filter_data.js' makes data globally available (e.g. window.allNobelData), use that.
    // Otherwise, we might need to fetch it here.
    
    // Example of how it might be loaded if filter_data.js is updated:
    if (window.allLaureateDataPromise) {
        window.allLaureateDataPromise.then(data => {
            allNobelData = data;
            window.updateAgeHistogram(); // Initial render after data is loaded
        }).catch(error => {
            console.error("Error loading Nobel data for age histogram:", error);
        });
    } else {
        // Fallback or simplified loading for now if global promise isn't ready
        // This will be replaced by proper data loading in step 4
        console.warn("Age Histogram: Global Nobel data not yet available. Using empty data or mock.");
        // fetch("nobel_laureates_data.csv") // Relative path might be tricky from here
        //     .then(response => response.text())
        //     .then(csvData => {
        //         // Basic CSV parsing (replace with a robust library like d3-dsv if possible)
        //         const parsed = csvData.split('\n').map(row => row.split(','));
        //         const headers = parsed[0];
        //         allNobelData = parsed.slice(1).map(row => {
        //             let obj = {};
        //             headers.forEach((header, i) => obj[header.trim()] = row[i] ? row[i].trim() : undefined);
        //             return obj;
        //         }).filter(row => row.year); // Basic filter for valid rows
        //         window.updateAgeHistogram(); // Initial render
        //     }).catch(error => console.error("Error fetching CSV for age histogram:", error));
         window.updateAgeHistogram(); // Call with empty data for now
    }

});
