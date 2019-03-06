
//This data isn't used for anything it's just here to show how the bar chart data structure should look like
var chartData = [
    {
        "year" : 2017,
        "values" : [
            {
                "popMen": 1.1,
                "popWomen": 1.1,
                "municipality": "Norrköping"
            },
            {
                "popMen": 1.1,
                "popWomen": 1.1,
                "municipality": "Norrköping"
            },
            {
                "popMen": 1.1,
                "popWomen": 1.1,
                "municipality": "Norrköping"
            }
        ]
    }
];

function setChartData() {
    var numOfyears=4;
    var firstYear = parseInt(metadata.variables[3].values[timespan-1]) -numOfyears +1;
    var firstYearIndex = timespan-numOfyears;
    chartData = [];
    for(var i =0; i< numOfyears; ++i) {
        var yearData = {};
        yearData.year = firstYear + i;
        yearData.values = [];
        for(var j = 0; j < clicked_municipality.length; ++j) {
            yearData.values[j] = {
                "popMen": clicked_municipality[j].popDensityMen[firstYearIndex+i],
                "popWomen": clicked_municipality[j].popDensityWomen[firstYearIndex+i],
                "municipality" : clicked_municipality[j].KNNAMN
            };
        }
        chartData[i] = yearData;
    }
}
//Function to initialize our chart
function initializeChart() {
d3.selectAll("#theBarChart > *").remove();
var data = [
  {
      "year": "2013", 
      "values": [
          {
              "popMen": 1,
              "popWomen": 2,
              "municipality": "Uddevalla"
          }, 
          {
              "popMen": 4, 
              "popWomen": 2,
              "municipality": "Lilla Edet"
          }, 
          {
              "popMen": 12, 
              "popWomen": 2,
              "municipality": "Kungälv"
          }
      ]
  }, 
  {
      "year": "2014", 
      "values": [
          {
              "popMen": 1, 
              "popWomen": 2,
              "municipality": "Uddevalla"
          }, 
          {
              "popMen": 21, 
              "popWomen": 2,
              "municipality": "Lilla Edet"
          }, 
          {
              "popMen": 13, 
              "popWomen": 2,
              "municipality": "Kungälv"
          }
      ]
  }, 
  {
      "year": "2015", 
      "values": [
          {
              "popMen": 3, 
              "popWomen": 2,
              "municipality": "Uddevalla"
          }, 
          {
              "popMen": 22, 
              "popWomen": 2,
              "municipality": "Lilla Edet"
          }, 
          {
              "popMen": 6, 
              "popWomen": 2,
              "municipality": "Kungälv"
          }
      ]
  }, 
  {
      "year": "2016", 
      "values": [
          {
              "popMen": 12, 
              "popWomen": 2,
              "municipality": "Uddevalla"
          }, 
          {
              "popMen": 7, 
              "popWomen": 2,
              "municipality": "Lilla Edet"
          }, 
          {
              "popMen": 18, 
              "popWomen": 2,
              "municipality": "Kungälv"
          }
      ]
  }, 
  {
      "year": "2017", 
      "values": [
          {
              "popMen": 6, 
              "popWomen": 2,
              "municipality": "Uddevalla"
          }, 
          {
              "popMen": 15, 
              "popWomen": 2,
              "municipality": "Lilla Edet"
          }, 
          {
              "popMen": 9, 
              "popWomen": 2,
              "municipality": "Kungälv"
          }
      ]
  }, 
  {
      "year": "2018", 
      "values": [
          {
              "popMen": 6, 
              "popWomen": 2,
              "municipality": "Uddevalla"
          }, 
          {
              "popMen": 6, 
              "popWomen": 2,
              "municipality": "Lilla Edet"
          }, 
          {
              "popMen": 7, 
              "popWomen": 2,
              "municipality": "Kungälv"
          }
      ]
  }
];

data = chartData;
var years = [2012, 2013, 2014, 2015, 2016, 2017];
  
var margin = {top: 20, right: 20, bottom: 30, left: 40},
        width = 960 - margin.left - margin.right,
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

    var color = d3.scale.ordinal()
        .range(["#ffa801","#ff3f34","#3c40c6", "#00d8d6", "#575fcf"]);

    var svg = d3.select('#theBarChart')
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
    .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //The years
    var yearsNames = data.map(function(d) { return d.year; });
    //The regions
    var municipalityNames = data[0].values.map(function(d) { return d.municipality; });

    //Set limits for x and y axis
    x0.domain(yearsNames);
    x1.domain(municipalityNames).rangeRoundBands([0, x0.rangeBand()]);
    y1.domain([0, d3.max(data, function(year) { return d3.max(year.values, function(d) { return d.popMen + d.popWomen; }); })]);

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
        .text("People/mi2");

    svg.select('.y').transition().duration(500).delay(1300).style('opacity','1');

    var slice = svg.selectAll(".slice")
        .data(data)
        .enter().append("g")
        .attr("class", "g")
        .attr("transform",function(d) { return "translate(" + x0(d.year) + ",0)"; });
        
    var group = slice.selectAll("rect")
        .data(function(d) { return d.values; })
        .enter();

    group.append("rect")
        .attr("class", "maleBar")
        .attr("width", x1.rangeBand())
        .attr("x", function(d) { return x1(d.municipality); })
        .style("fill", function(d) { return color(d.municipality) })
        .attr("y", function(d) { return y1(0); })
        .attr("height", function(d) { return height - y1(0); })
        .on("mouseover", function(d) {
            d3.select(this).style("fill", d3.rgb(color(d.municipality)).darker(2));
        })
        .on("mouseout", function(d) {
            d3.select(this).style("fill", color(d.municipality));
        });

    group.append("rect")
        .attr("class", "femaleBar")
        .attr("width", x1.rangeBand())
        .attr("x", function(d) { return x1(d.municipality); })
        .style("fill", function(d) { return d3.rgb(color(d.municipality)).brighter(0.7) })
        .attr("y", function(d) { return y1(0); })
        .attr("height", function(d) { return height - y1(0); })
        .attr("transform",function(d) { return "translate( 0,-" + (height - y1(d.popMen)) +")"; })
        .on("mouseover", function(d) {
            d3.select(this).style("fill", d3.rgb(color(d.municipality)).brighter(0.7).darker(2));
        })
        .on("mouseout", function(d) {
            d3.select(this).style("fill", d3.rgb(color(d.municipality)).brighter(0.7));
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
        .data(data[0].values.map(function(d) { return d.municipality; }).reverse())
    .enter().append("g")
        .attr("class", "legend")
        .attr("transform", function(d,i) { return "translate(0," + i * 20 + ")"; })
        .style("opacity","0");

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", function(d) { return color(d); });

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function(d) {return d; });

    legend.transition().duration(500).delay(function(d,i){ return 1300 + 100 * i; }).style("opacity","1");
}