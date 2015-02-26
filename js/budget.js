    // NAME OUR CHARTS
        var budgetRingChart = dc.pieChart("#chart-ring-budget"),
            deptRowChart    = dc.rowChart("#chart-row-dept"),
            actTableChart   = dc.dataTable("#chart-table-activity"),
            numberTotal     = dc.numberDisplay("#chart-number-total");
            fundBarChart    = dc.barChart("#chart-bar-fund");

    // LOAD OUR DATA
        // use static or load via d3.csv("spendData.csv", function(error, spendData) {/* do stuff */});

        var myData = d3.tsv('data/budget.tsv', function(budgetData){
            var numberFormat = d3.format(',');
            console.log(budgetData);
        // normalize/parse data
    //        budgetData.forEach(function(d) {
    //            d.Spent = d.Spent.match(/\d+/);
    //        });

    // SET CROSSFILTER
        var ndx = crossfilter(budgetData),

//            totalDim = ndx.dimension(function(d) {return d.total;}),
            all = ndx.groupAll(),

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


            //TODO dynamic dept title render
            //TODO calc % YoY change
            numberTotal
                .formatNumber(d3.format(".3s"))
                .valueAccessor(function(d) {return '500';})
//                .numberformat(function(d) {return "$" + formatDecimalComma(d);})
                .group(spendPerDeptDim);

            budgetRingChart
                .width(200).height(200)
                .dimension(fundDim)
                .group(spendPerFundDim)
                .colors(['#FBD506', '#FF9F00', '#A8BF12', '#00AAB5', '#0B3746', '#A8BF12'])
                .renderLabel(false)
                .innerRadius(60);

/************
JQuery updates
*************/

//$('#chart-ring-year').on('click', function(){
//    if ($("g.pie-slice._0").is(".deselected")){
//		budgetRingChart_q1.selectAll("g.stack._0").attr("display", "none")
//		budgetRingChart_q1.selectAll("g.dc-tooltip._0").attr("display", "none")
//	}else{
//		budgetRingChart_q1.selectAll("g.stack._0").attr("display", null)
//		budgetRingChart_q1.selectAll("g.dc-tooltip._0").attr("display", null)
//	}
//	if ($("g.pie-slice._1").is(".deselected")){
//		budgetRingChart_q1.selectAll("g.stack._1").attr("display", "none")
//		budgetRingChart_q1.selectAll("g.dc-tooltip._1").attr("display", "none")
//	}else{
//		budgetRingChart_q1.selectAll("g.stack._1").attr("display", null)
//		budgetRingChart_q1.selectAll("g.dc-tooltip._1").attr("display", null)
//	}
//	if ($("g.pie-slice._2").is(".deselected")){
//		budgetRingChart_q1.selectAll("g.stack._2").attr("display", "none")
//		budgetRingChart_q1.selectAll("g.dc-tooltip._2").attr("display", "none")
//	}else{
//		budgetRingChart_q1.selectAll("g.stack._2").attr("display", null)
//		budgetRingChart_q1.selectAll("g.dc-tooltip._2").attr("display", null)
//	}
//});


            deptRowChart
                .width(450).height(800)
                .dimension(deptDim)
                .group(spendPerDeptDim)
                .gap(2)
                .labelOffsetX([2])
                .labelOffsetY([9])
                .elasticX(true);

            fundBarChart
                .width(200).height(200)
                .dimension(fundDim)
                .x(d3.scale.linear().domain([0,1000000000]))
                .colors(['#0B3746', '#00AAB5', '#A8BF12', '#FF9F00', '#FBD506'])
                .gap(1)
                .group(spendPerFundDim)
                .elasticY(true);

            actTableChart
                .size(20)
                .dimension(budgetDim)
                .order(d3.descending)
                .columns([
//                    function(d) { return d.Department_Title;},
                    function(d) { return d.SubObJTitle;},
                    function(d) { return d.Character_Title;},
                    function(d) { return +d.budget;}
                        ])
                .group(function(d) { return +d.Department_Title; });

            dc.renderAll();
        });

