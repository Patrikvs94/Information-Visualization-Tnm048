function setChartData() {
    var numOfyears=4;
    var interval = 5;
    var firstYear = parseInt(metadata.variables[3].values[timespan-1]) -numOfyears*interval +1;
    var firstYearIndex = timespan-numOfyears*interval;
    chartData = [];
    for(var i =0; i< numOfyears; ++i) {
        var yearData = {};
        yearData.year = firstYear + i*interval;
        yearData.values = [];
        for(var j = 0; j < clicked_municipality.length; ++j) {
            yearData.values[j] = {
                "popMen": clicked_municipality[j].popDensityMen[firstYearIndex+(i*interval)],
                "popWomen": clicked_municipality[j].popDensityWomen[firstYearIndex+(i*interval)],
                "municipality" : {
                    "name": clicked_municipality[j].KNNAMN,
                    "colorIndex" : clicked_municipality[j].colorIndex
                },
                "year" : yearData.year
            };
        }
        chartData[i] = yearData;
    }
}

var colors = ["#93b5c6","#95edda","#efcf67", "#d7816a", "#bd4f6c"];

var IsColorUsed = [false, false, false, false, false];
//IsColorUsed.fill(0,4, false);


function getColorIndex() {
    for (var i = 0; i < IsColorUsed.length; ++i) {
        if(IsColorUsed[i] == false) {
            IsColorUsed[i] = true;
            console.log(i);
            return i;
        }
    }
    return -1;
}

function clearColorIndex(index) {
    if(IsColorUsed[index]) {
        IsColorUsed[index] = false;
    }
}

//Method that we will use to update the control based on feature properties passed
function update_info_for_chart(props, menOrWomen) {
    document.getElementById("info").innerHTML = '<h4>Sweden Population Density</h4>' +  (props ?
        '<b>' + props.municipality.name + ' ' + props.year + '</b><br />' + (props.popMen + props.popWomen).toFixed(2) + ' people / km<sup>2</sup>' +
        '<br />' + (menOrWomen =="women" ? '<b>': '') + (props.popWomen).toFixed(2) + ' women / km<sup>2</sup>' + (menOrWomen =="women" ? '</b>': '') + 
        '<br />' + (menOrWomen =="men" ? '<b>': '') + (props.popMen).toFixed(2) + ' men / km<sup>2</sup>' + (menOrWomen =="men" ? '</b>': '')
        : 'Hover over a municipality');
};

//Function to initialize our chart
function initializeChart() {
d3.selectAll("#theBarChart > *").remove();

data = chartData;
var years = [2012, 2013, 2014, 2015, 2016, 2017];
  
var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 650 - margin.left - margin.right,
        height = 500 - margin.top - margin.bottom;

    var x0 = d3.scale.ordinal()
        .rangeRoundBands([0, width], .1);

    var x1 = d3.scale.ordinal();

    var y1 = d3.scale.linear()
        .range([height, 0]);

    var xAxis = d3.svg.axis()
        .scale(x0)
        .tickSize(0)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y1)
        .orient("left");

    var svg = d3.select('#theBarChart')
        .attr("width", width + margin.left + margin.right + 100)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //The years
    var yearsNames = chartData.map(function(d) { return d.year; });
    //The regions
    var municipalityNames = chartData[0].values.map(function(d) { return d.municipality.name; });

    //Set limits for x and y axis
    x0.domain(yearsNames);
    x1.domain(municipalityNames).rangeRoundBands([0, x0.rangeBand()]);
    y1.domain([0, d3.max(chartData, function(year) { return d3.max(year.values, function(d) { return d.popMen + d.popWomen; }); })]);

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .style('opacity','0')
        .call(yAxis)
    .append("text")
        .attr("transform", "rotate(-90)")
        .attr("y", 6)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .style('font-weight','bold')
        .text("People/km^2");

    svg.select('.y').transition().duration(500).delay(1300).style('opacity','1');

    var slice = svg.selectAll(".slice")
        .data(chartData)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform",function(d) { return "translate(" + x0(d.year) + ",0)"; });
        
    var group = slice.selectAll("rect")
        .data(function(d) { return d.values; })
        .enter();

    group.append("rect")
        .attr("class", "maleBar")
        .attr("width", x1.rangeBand())
        .attr("x", function(d) { return x1(d.municipality.name); })
        .style("fill", function(d) { return colors[d.municipality.colorIndex]; })
        .attr("y", function(d) { return y1(0); })
        .attr("height", function(d) { return height - y1(0); })
        .on("mouseover", function(d) {
            d3.select(this).style("fill", d3.rgb(colors[d.municipality.colorIndex]).darker(2));
            console.log(d);
            update_info_for_chart(d, "men");
        })
        .on("mouseout", function(d) {
            d3.select(this).style("fill", function(d) { return colors[d.municipality.colorIndex]; });
            update_info_for_chart();
        });

    group.append("rect")
        .attr("class", "femaleBar")
        .attr("width", x1.rangeBand())
        .attr("x", function(d) { return x1(d.municipality.name); })
        .style("fill", function(d) { return d3.rgb(colors[d.municipality.colorIndex]).brighter(0.7) })
        .attr("y", function(d) { return y1(0); })
        .attr("height", function(d) { return height - y1(0); })
        .attr("transform",function(d) { return "translate( 0,-" + (height - y1(d.popMen)) +")"; })
        .on("mouseover", function(d) {
            d3.select(this).style("fill", d3.rgb(colors[d.municipality.colorIndex]).brighter(0.7).darker(2));
            update_info_for_chart(d, "women");
        })
        .on("mouseout", function(d) {
            d3.select(this).style("fill", d3.rgb(colors[d.municipality.colorIndex]).brighter(0.7));
            update_info_for_chart();
        });

        

    slice.selectAll(".maleBar")
        .transition()
        .duration(1000)
        .attr("y", function(d) { return y1(d.popMen); })
        .attr("height", function(d) { return height - y1(d.popMen); });

    slice.selectAll(".femaleBar")
        .transition()
        .delay(1000)
        .duration(1000)
        .attr("y", function(d) { return y1(d.popWomen); })
        .attr("height", function(d) { return height - y1(d.popWomen); });

    //Legend
    var legend = svg.selectAll(".legend")
        .data(chartData[0].values.map(function(d) { return d.municipality; }).reverse())
    .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d,i) { return "translate(90," + i * 20 + ")"; })
        .style("opacity","0");

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) { return colors[d.colorIndex];
        
        });
        legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .attr("transform", "translate( 18,0)")
        .style("fill", function(d) { return d3.rgb(colors[d.colorIndex]).brighter(0.7);
        });


    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .style("opacity","0.7")
        .text(function(d) {return d.name; });

    legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");
}