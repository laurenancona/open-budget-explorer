// NAME OUR CHARTS
var dataCountTop    = dc.dataCount("#data-count-top"),
    budgetRingChart = dc.pieChart("#chart-ring-budget"),
    deptRowChart    = dc.rowChart("#chart-row-dept"),
    dataCount       = dc.dataCount("#data-count"),
    actTableChart   = dc.dataTable("#chart-table-activity"),
    numberTotal     = dc.numberDisplay("#chart-number-total"),
    charBarChart    = dc.rowChart("#chart-bar-char"),
    fundRowChart    = dc.rowChart("#chart-row-fund");

// LOAD OUR DATA
// use static or load via d3.csv("spendData.csv", function(error, spendData) {/* do stuff */});

var myData = d3.csv('data/14budget.csv', function(budgetData){
    //            var numberFormat = d3.format(' ^$,.r');
    //            console.log(budgetData);
    // normalize/parse data
    //        budgetData.forEach(function(d) {
    //            d.Spent = d.Spent.match(/\d+/);
    //        });

    // SET CROSSFILTER
    var ndx = crossfilter(budgetData),

    //          totalDim            = ndx.dimension(function(d) {return d.total;}),
        all                 = ndx.groupAll(),
        sumAll              = ndx.groupAll().reduceSum(function(d) {return +d.budget}),

    //            FYDim             = ndx.dimension(function(d) {return +d.FY;}),
        budgetDim           = ndx.dimension(function(d) {return Math.floor(d.budget/1000000);}),
        deptDim             = ndx.dimension(function(d) {return d.Department_Title;}),
        charDim             = ndx.dimension(function(d) {return d.Character_Title;}),
        actDim              = ndx.dimension(function(d) {return d.SubObjTitle;}),
        fundDim             = ndx.dimension(function(d) {return d.Fund_Title;}),

    //            spendPerFYDim     = FYDim.group().reduceSum(function(d) {return +d.budget;}),
        totalBudget         = budgetDim.group().reduceSum(function(d) {return +d.budget}),
        spendPerDeptDim     = deptDim.group().reduceSum(function(d) {return +d.budget;}),
        spendPerCharDim     = charDim.group().reduceSum(function(d) {return +d.budget;}),
        spendPerActDim      = actDim.group().reduceSum(function(d) {return +d.budget;}),
        spendPerFundDim     = fundDim.group().reduceSum(function(d) {return +d.budget;});

    var format = d3.format(' ^$,.0f');
    var formatRight = d3.format(' >$,.0f');
    var min                 = budgetDim.bottom(1)[0].budget,
        max                 = budgetDim.top(1)[0].budget;
    console.log(min);
    console.log(max);

    //TODO dynamic dept title renderal
    //TODO calc % YoY change
    numberTotal
        .formatNumber(d3.format(" ^$,.r"))
        .valueAccessor(function(d) {return sumAll.value();})
        .group(spendPerDeptDim);
//                .renderlet(function(chart){
//                    if (deptRowChart.filters().length) {
//                        $("#filters").text(deptRowChart.filters()[0]);
//                    }
//                });

    budgetRingChart
        .width(200).height(200)
        .dimension(fundDim)
        .group(spendPerFundDim)
        .colors(['#A8BF12'])
        .renderLabel(false)
        .innerRadius(70);

    deptRowChart
        .width(340).height(1100)
        .dimension(deptDim)
        .colors(['#008cba'])
//                .x(d3.scale.log())
//                    .base(2)
//                    .domain([62000, 1600000000])
//                    .range([0, 10000])
        .group(spendPerDeptDim)
        .margins({top: 0, right: 20, bottom: 20, left: 0})
//                .renderVerticalGridLines([false]) <--broken method v1.7.3
        .ordering(function(d) { return -d.value; }) //this was buried in docs, not in API reference for v1.7.0, submitted PR
        .gap(3)
        .labelOffsetX([5])
        .labelOffsetY([13]);

    fundRowChart
        .width(340).height(450)
        .dimension(fundDim)
        .group(spendPerFundDim)
        .colors(['#008cba'])
        .ordering(function(d) { return -d.value; })
//                .xUnits(dc.units.ordinal)
//                .x(d3.scale.ordinal())
////                .y(d3.scale.linear().domain([0, myData.length + 1]))
        .elasticX(true)
        .labelOffsetX([5])
        .labelOffsetY([20])
        .margins({top: 0, right: 20, bottom: 0, left: 0})
        .gap(3);

    charBarChart
        .width(340).height(450)
        .dimension(charDim)
        .group(spendPerCharDim)
        .colors(['#008cba'])
        .ordering(function(d) { return -d.value; })
        .labelOffsetX([5])
        .labelOffsetY([35])
        .margins({top: 0, right: 0, bottom: 0, left: 0})
        .gap(3);

    dataCount
        .dimension(ndx) // set dimension to all data
        .group(all); // set group to ndx.groupAll()

    dataCountTop
        .dimension(ndx) // set dimension to all data
        .group(all); // set group to ndx.groupAll()

    actTableChart
        .dimension(budgetDim)
        .group(function(d) { return null; })
        .size(12)
        .columns([
            function(d) { return d.Department_Title;},
            function(d) { return d.Fund_Title; },
            function(d) { return d.Character_Title; },
            function(d) { return d.SubObjTitle; },
            function(d) { return formatRight(d.budget); }
                ])
        .sortBy(function(d) {
                return d.Department_Title;
            })
        .order(d3.ascending);
    dc.renderAll();
});