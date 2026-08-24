// This will store data
let heartData = [];

// Load and clean the data
d3.csv("heart_disease_uci.csv").then(function(rawData) {
  // Clean the data
    heartData = rawData.map(function(d) {
        return {
            age: +d.age,
            sex: d.sex,
            cp: d.cp,
            chol: +d.chol || 0,  // Convert to number and use 0 if missing value
            trestbps: +d.trestbps || 0,
            num: +d.num
        };
    });

    // Sets up dashboard with the cleaned data
    setupDashboard(heartData);
});

function setupDashboard(data) {
    // Set up the chest pain type filter dropdown
    const cpTypes = ["All"];
    data.forEach(function(d) {
        if (!cpTypes.includes(d.cp)) {
            cpTypes.push(d.cp);
        }
    });

    const cpFilter = d3.select("#cp-filter")
    cpTypes.forEach(function(type) {
        cpFilter.append("option").text(type).attr("value", type);
    });

    // Create the charts
    createBarChart(data);
    createScatterPlot(data);

    // Set up for filters
    d3.select("#gender-filter").on("change", function() {
        updateCharts();
    });
    d3.select("#cp-filter").on("change", function() {
        updateCharts();
    });
}

// Update charts when filters are active
function updateCharts() {
    // Get current filter values
    const gender = d3.select("#gender-filter").property("value");
    const cpType = d3.select("#cp-filter").property("value");

    // Filter the data
    const filteredData = heartData.filter(function(d) {
        return (gender === "all" || d.sex === gender) && (cpType === "all" || d.cp === cpType);
    });

    // Update charts with filtered data
    createBarChart(filteredData);
    createScatterPlot(filteredData);
}

function createBarChart(data) {
    // Clear the previous chart
    d3.select("#bar-chart").html("");
  
    const margin = { top: 40, right: 20, bottom: 50, left: 50 };
    const width = 400;
    const height = 300;
  
    // Create SVG
    const svg = d3.select("#bar-chart")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
  
    // Count males and females
    const maleCount = data.filter(d => d.sex === "Male").length;
    const femaleCount = data.filter(d => d.sex === "Female").length;
  
    // Create scales
    const xScale = d3.scaleBand()
        .domain(["Male", "Female"])
        .range([margin.left, width - margin.right])
        .padding(0.2);
  
    const yScale = d3.scaleLinear()
        .domain([0, Math.max(maleCount, femaleCount) * 1.1])
        .range([height - margin.bottom, margin.top]);
  
    // Create bars
    svg.selectAll("rect")
        .data([["Male", maleCount], ["Female", femaleCount]])
        .enter()
        .append("rect")
        .attr("x", d => xScale(d[0]))
        .attr("y", d => yScale(d[1]))
        .attr("width", xScale.bandwidth())
        .attr("height", d => height - margin.bottom - yScale(d[1]))
        .attr("fill", "steelblue");
  
    // Add tooltips to bars
    svg.selectAll("rect")
    .on("mouseover", function(event, d) {
        tooltip
            .style("opacity", 1)
            .html(`${d[0]}: ${d[1]} patients`)
            .style("left", `${event.pageX + 10}px`)
            .style("top", `${event.pageY - 28}px`);
    })
    .on("mouseout", function() {
        tooltip.style("opacity", 0);
    });

    // Add x-axis
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale));
  
    // Add x-axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .text("Gender");
    // Add y-axis
    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale));
  
    // Add y-axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .text("Number of Patients");
  
    // Add chart title
    svg.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .text("Patient Gender");
}

function createScatterPlot(data) {
    // Clear the previous chart
    d3.select("#scatter-plot").html("");
  
    const margin = { top: 40, right: 30, bottom: 60, left: 60 };
    const width = 650;
    const height = 400;
  
    // Create SVG
    const svg = d3.select("#scatter-plot")
        .append("svg")
        .attr("width", width)
        .attr("height", height);
  
    // Filter out the data
    const filteredData = data.filter(d => d.chol > 0 && d.trestbps > 0);
  
    // Create scales
    const xScale = d3.scaleLinear()
        .domain([0, d3.max(filteredData, d => d.chol)])
        .range([margin.left, width - margin.right]);
    
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(filteredData, d => d.trestbps)])
        .range([height - margin.bottom, margin.top]);
  
    // Draw circles
    svg.selectAll("circle")
        .data(filteredData)
        .enter()
        .append("circle")
        .attr("cx", d => xScale(d.chol))
        .attr("cy", d => yScale(d.trestbps))
        .attr("r", 5)
        .attr("fill", d => d.num > 0 ? "red" : "green")
        .on("mouseover", showTooltip)
        .on("mouseout", hideTooltip);
  
    // Add x-axis
    svg.append("g")
        .attr("transform", `translate(0,${height - margin.bottom})`)
        .call(d3.axisBottom(xScale))
  
    // Add x-axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("x", width / 2)
        .attr("y", height - 10)
        .attr("text-anchor", "middle")
        .text("Cholesterol Level (mg/dL)");
  
    // Add y-axis
    svg.append("g")
        .attr("transform", `translate(${margin.left},0)`)
        .call(d3.axisLeft(yScale))
  
    // Add y-axis label
    svg.append("text")
        .attr("class", "axis-label")
        .attr("transform", "rotate(-90)")
        .attr("x", -height / 2)
        .attr("y", 15)
        .attr("text-anchor", "middle")
        .text("Resting Blood Pressure (mmHg)");
  
    // Add chart title
    svg.append("text")
        .attr("class", "chart-title")
        .attr("x", width / 2)
        .attr("y", 20)
        .attr("text-anchor", "middle")
        .text("Cholesterol vs. Blood Pressure");

    svg.append("text")
        .attr("x", width - 30)
        .attr("y", 20)
        .text("Info")
        .style("cursor", "pointer")
        .on("click", function() {
            if (legend.style("display") === "none") {
                legend.style("display", "block");
            } else {
                legend.style("display", "none");
            }
        });

    // Add legend for scatterplot
    const legend = svg.append("g")
        .attr("transform", `translate(${width - 120}, ${margin.top + 20})`)
        .style("display", "none");
  
    legend.append("circle")
        .attr("cx", 0)
        .attr("cy", 0)
        .attr("r", 5)
        .attr("fill", "green");
  
    legend.append("text")
        .attr("x", 10)
        .attr("y", 5)
        .text("No Heart Disease")
        .style("font-size", "10px");
  
    legend.append("circle")
        .attr("cx", 0)
        .attr("cy", 20)
        .attr("r", 5)
        .attr("fill", "red");
  
    legend.append("text")
        .attr("x", 10)
        .attr("y", 25)
        .text("Heart Disease Present")
        .style("font-size", "10px");
}

// Tooltips
const tooltip = d3.select("body").append("div")
    .attr("class", "tooltip")
    .style("opacity", 0);

function showTooltip(event, d) {
    tooltip
        .style("opacity", 1)
        .html(`
            <strong>Patient Details:</strong><br>
            Age: ${d.age}<br>
            Sex: ${d.sex}<br>
            Cholesterol: ${d.chol} mg/dL<br>
            BP: ${d.trestbps} mmHg<br>
            Disease: ${d.num > 0 ? "Yes" : "No"}
        `)
        .style("left", `${event.pageX + 10}px`)
        .style("top", `${event.pageY - 10}px`);
}

function hideTooltip() {
    tooltip.style("opacity", 0);
}