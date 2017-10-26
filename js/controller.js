'use strict';

const energyColor = '#FAA43A';
const stressColor = '#F15854';
const happinessColor = '#5DA5DA';

function getLastUpdateTime(newTime) {
    let date = null;
    if (newTime != null) {
        date = new Date(newTime);
        //document.getElementById('last_entry').innerHTML = "<em> Last Data Entry: " + date.toLocaleTimeString() + " , " + date.toDateString() + "</em>";
    }
}

function updateLastUpdateTime(newTime) {
    window.localStorage[STORAGE_KEY_LAST_DATA_ENTRY_TIME] = newTime;
}

function resetFormField (activityField, energyField, stressField, happinessField, timeSpentField) {
    activityField.selectedIndex = 0;
    energyField.selectedIndex = 0;
    stressField.selectedIndex = 0;
    happinessField.selectedIndex = 0;
    timeSpentField.value = "";
}

function renderTableSummary (tableElement, dataModel) {
    tableElement.innerHTML = "<tr> <th>Entry</th> <th>Activity</th>    <th>Time Spent (minutes)</th>    <th>Energy</th>    <th>Stress</th>    <th>Happiness</th> <th>Delete</th></tr>";
    let dataPoints = dataModel.getActivityDataPoints();
    for (let i = 0; i < dataPoints.length; i++) {
        let row = tableElement.insertRow();
        let entry = row.insertCell();
        entry.innerHTML = (i + 1);
        let activity = row.insertCell();
        activity.innerHTML = dataPoints[i]["activityType"];
        let timeSpent = row.insertCell();
        timeSpent.innerHTML = dataPoints[i]["activityDurationInMinutes"];
        let energy = row.insertCell();
        energy.innerHTML = dataPoints[i]["activityDataDict"]["energyLevel"];
        let stress = row.insertCell();
        stress.innerHTML = dataPoints[i]["activityDataDict"]["stressLevel"];
        let happiness = row.insertCell();
        happiness.innerHTML = dataPoints[i]["activityDataDict"]["happinessLevel"];
        let deleteCell = row.insertCell();

        var button = document.createElement('input');
        button.setAttribute('type', 'button');
        button.setAttribute('name', 'X');
        button.setAttribute('value', 'X');
        button.className = 'btn btn-danger';
        button.onclick = function () {
            dataModel.removeActivityDataPoint(dataPoints[i]);
        }
        deleteCell.appendChild(button);
    }
}

function updateGraphs(graphModel, graphName, tableSummary, graphSummary, entriesComparison, activityAverages) {
    if (graphName.valueOf() == graphModel.getAvailableGraphNames()[0].valueOf()) {
        showTableSummary(tableSummary, graphSummary);
    }
    //Entry by Entry
    else if (graphName.valueOf() == graphModel.getAvailableGraphNames()[1].valueOf()) {
        showEntries(tableSummary, graphSummary, entriesComparison, activityAverages);
    }
    //Averages
    else if (graphName.valueOf() == graphModel.getAvailableGraphNames()[2].valueOf()) {
        showActivityAverages(tableSummary, graphSummary, entriesComparison, activityAverages);
    }
}

function showTableSummary(tableSummary, graphSummary) {
    tableSummary.style.display = 'table';
    graphSummary.style.display = 'none';
}

function showEntries(tableSummary, graphSummary, entriesComparison, activityAverages) {
    tableSummary.style.display = 'none';
    graphSummary.style.display = 'table';
    entriesComparison.style.display = 'block';
    activityAverages.style.display = 'none';
}

function showActivityAverages(tableSummary, graphSummary, entriesComparison, activityAverages) {
    tableSummary.style.display = 'none';
    graphSummary.style.display = 'table';
    entriesComparison.style.display = 'none';
    activityAverages.style.display = 'block';
}

/*
function responsivefy(svg) {
    // get container + svg aspect ratio
    var container = d3.select(svg.node().parentNode),
        width = parseInt(svg.style("width")),
        height = parseInt(svg.style("height")),
        aspect = width / height;

    // add viewBox and preserveAspectRatio properties,
    // and call resize so that svg resizes on inital page load
    svg.attr("viewBox", "0 0 " + width + " " + height)
        .attr("perserveAspectRatio", "xMinYMid")
        .call(resize);

    // to register multiple listeners for same event type, 
    // you need to add namespace, i.e., 'click.foo'
    // necessary if you call invoke this function for multiple svgs
    // api docs: https://github.com/mbostock/d3/wiki/Selections#on
    d3.select(window).on("resize." + container.attr("id"), resize);

    // get width of container and resize svg to fit it
    function resize() {
        var targetWidth = parseInt(container.style("width"));
        svg.attr("width", targetWidth);
        svg.attr("height", Math.round(targetWidth / aspect));
    }
}

function renderScatterPlot () {
    var svg = d3.select("#scatter_plot_container")
        .append("div")
        .append("svg")
        .attr("width", 960)
        .attr("height", 500)
        .call(responsivefy);

    var dataSet = [
                            [5, 20], [480, 90], [250, 50], [100, 33], [330, 95],
                            [410, 12], [475, 44], [25, 67], [85, 21], [220, 88]
                          ];

    svg.selectAll("circle")
        .data(dataSet)
        .enter()
        .append("circle")
        .attr("cx", function(d) {
            return d[0];
        })
        .attr("cy", function(d) {
            return d[1];
        })
        .attr("r", 5);
}
*/

/**
 * This function can live outside the window load event handler, because it is
 * only called in response to a button click event
 */
function renderActivityAverages(canvas, dataModel) {
    var context = canvas.getContext('2d');
    var horizontalSpacing = 10;
    var leftMargin = 75;
    var labelMargin = 25;
    canvas.width = screen.availWidth / 1.25 + leftMargin;
    canvas.height = screen.availHeight / 1.25;
    var bottomMargin = screen.availHeight - canvas.height;
    var heightDivider = 7;
    var maxYValue = 5;

    var width = canvas.width - leftMargin;
    var height = canvas.height - bottomMargin - labelMargin;

    var activityNames = dataModel.getTrackedActivitiesList();

    var groupBarWidth = (width / activityNames.length);

    var indivBarWidth = ( groupBarWidth - (horizontalSpacing * 2)) / 3;

    var maxBarHeight = height / heightDivider;

    //Set up graph axis
    context.font = "25px Arial";
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.fillText("Activity Averages", canvas.width / 2, 30);
    //YAxis Label
    context.save();
    context.translate(leftMargin / 3, (height + bottomMargin) / 2);
    context.rotate(-0.5 * Math.PI);
    context.fillStyle = 'black';
    context.font = "25px Arial";
    context.fillText("Level", 0, 0);
    context.restore();

    //Y Axis
    context.strokeStyle = 'black';
    context.moveTo(leftMargin, maxBarHeight * 2);
    context.lineTo(leftMargin, canvas.height - bottomMargin - labelMargin);
    context.stroke();

    var i;
    //Y Axis data Points
    for (i = heightDivider - maxYValue; i <= heightDivider - 1; i++) {
        context.font = "16px Arial";
        context.fillStyle = 'black';
        context.fillText("" + (heightDivider - i), leftMargin / 1.25, (maxBarHeight * i) + 3);
        context.fillRect(leftMargin, (maxBarHeight * i), -5, 2);
    }
    //Xaxis Label
    context.font = "25px Arial";
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.fillText("Activity", canvas.width / 2, canvas.height - labelMargin / 4);

    //X axis
    context.moveTo(leftMargin, canvas.height - bottomMargin - labelMargin);
    context.lineTo(canvas.width, canvas.height - bottomMargin - labelMargin);
    context.stroke();

    //Legend
    context.font = "14px Arial";
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.fillText("Energy", canvas.width - leftMargin, 30);
    context.fillText("Stress", canvas.width - leftMargin, 50);
    context.fillText("Happiness", canvas.width - leftMargin, 70);

    context.fillStyle = energyColor;
    context.fillRect(canvas.width - leftMargin * 2, 20, 10, 10);
    context.fillStyle = stressColor;
    context.fillRect(canvas.width - leftMargin * 2, 40, 10, 10);
    context.fillStyle = happinessColor;
    context.fillRect(canvas.width - leftMargin * 2, 60, 10, 10);

    activityNames.sort(function (s1, s2) {
        return s1.localeCompare(s2);
    });

    var index = 0;
    _.each(activityNames, function (activityName) {
        var x = leftMargin + index * groupBarWidth + horizontalSpacing;

        context.save();
        context.translate(x + groupBarWidth / 2, height + bottomMargin / 2);
        context.rotate(-0.5 * Math.PI);
        context.fillStyle = 'black';
        context.font = "18px Arial";
        context.fillText(activityName, 0, 0, bottomMargin - labelMargin);
        context.restore();
        var energyLevelTotal = 0;
        var stressLevelTotal = 0;
        var happinesLevelTotal = 0;
        var dataPoints = _.filter(dataModel.getActivityDataPoints(), function (dataPoint) {
            return dataPoint.activityType.valueOf() == activityName.valueOf();
        });

        _.each(dataPoints, function (dataPoint) {
            energyLevelTotal += dataPoint.activityDataDict.energyLevel;
            stressLevelTotal += dataPoint.activityDataDict.stressLevel;
            happinesLevelTotal += dataPoint.activityDataDict.happinessLevel;
        });

        context.fillStyle = energyColor;
        context.fillRect(x, height, indivBarWidth, -1 * energyLevelTotal / dataPoints.length * maxBarHeight);
        x += indivBarWidth;

        context.fillStyle = stressColor;
        context.fillRect(x, height, indivBarWidth, -1 * stressLevelTotal / dataPoints.length * maxBarHeight);
        x += indivBarWidth;

        context.fillStyle = happinessColor;
        context.fillRect(x, height, indivBarWidth, -1 * happinesLevelTotal / dataPoints.length * maxBarHeight);
        index += 1;
    });
}

function renderEntryByEntryComparison(canvas, dataModel) {
    var context = canvas.getContext('2d');
    var horizontalSpacing = 10;
    var leftMargin = 75;
    var labelMargin = 25;
    canvas.width = screen.availWidth / 1.25 + leftMargin;
    canvas.height = screen.availHeight / 1.25;
    var bottomMargin = screen.availHeight - canvas.height;
    var heightDivider = 7;
    var maxYValue = 5;

    var width = canvas.width - leftMargin;
    var height = canvas.height - bottomMargin - labelMargin;

    var dataPoints = dataModel.getActivityDataPoints();

    var groupBarWidth = (width / dataPoints.length);
    if (dataPoints.length <= 7) {
        groupBarWidth = 100;
    }

    var indivBarWidth = ( groupBarWidth - (horizontalSpacing * 2)) / 3;

    var maxBarHeight = height / heightDivider;

    //Set up graph axis
    context.font = "25px Arial";
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.fillText("Entry By Entry Comparison", canvas.width / 2, 30);

    //YAxis Label
    context.save();
    context.translate(leftMargin / 3, (height + bottomMargin) / 2);
    context.rotate(-0.5 * Math.PI);
    context.fillStyle = 'black';
    context.font = "25px Arial";
    context.fillText("Level", 0, 0);
    context.restore();


    //Y Axis
    context.strokeStyle = 'black';
    context.moveTo(leftMargin, maxBarHeight * 2);
    context.lineTo(leftMargin, canvas.height - bottomMargin - labelMargin);
    context.stroke();

    //XAxis Label
    context.font = "25px Arial";
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.fillText("Entry - Activity", canvas.width / 2, canvas.height - labelMargin / 4);

    //X axis
    context.moveTo(leftMargin, canvas.height - bottomMargin - labelMargin);
    context.lineTo(canvas.width, canvas.height - bottomMargin - labelMargin);
    context.stroke();


    //Legend
    context.font = "14px Arial";
    context.fillStyle = 'black';
    context.textAlign = 'center';
    context.fillText("Energy", canvas.width - leftMargin, 30);
    context.fillText("Stress", canvas.width - leftMargin, 50);
    context.fillText("Happiness", canvas.width - leftMargin, 70);

    context.fillStyle = energyColor;
    context.fillRect(canvas.width - leftMargin * 2, 20, 10, 10);
    context.fillStyle = stressColor;
    context.fillRect(canvas.width - leftMargin * 2, 40, 10, 10);
    context.fillStyle = happinessColor;
    context.fillRect(canvas.width - leftMargin * 2, 60, 10, 10);


    var i;
    //Y Axis data Points
    for (i = heightDivider - maxYValue; i <= heightDivider - 1; i++) {
        context.font = "16px Arial";
        context.fillStyle = 'black';
        context.fillText("" + (heightDivider - i), leftMargin / 1.25, (maxBarHeight * i) + 3);
        context.fillRect(leftMargin, (maxBarHeight * i), -5, 2);
    }

    var index = 0;
    _.each(dataPoints, function (dataPoint) {
        var x = leftMargin + index * groupBarWidth + horizontalSpacing;

        context.save();
        context.translate(x + groupBarWidth / 2, height + bottomMargin / 2);
        context.rotate(-0.5 * Math.PI);
        context.fillStyle = 'black';
        context.font = " 18px Arial";
        context.fillText(index + 1 + " - " + dataPoint.activityType, 0, 0, bottomMargin - labelMargin);
        context.restore();

        var dictionary = dataPoint.activityDataDict;
        context.fillStyle = energyColor;
        context.fillRect(x, height, indivBarWidth, -1 * dictionary.energyLevel * maxBarHeight);
        x += indivBarWidth;

        context.fillStyle = stressColor;
        context.fillRect(x, height, indivBarWidth, -1 * dictionary.stressLevel * maxBarHeight);
        x += indivBarWidth;

        context.fillStyle = happinessColor;
        context.fillRect(x, height, indivBarWidth, -1 * dictionary.happinessLevel * maxBarHeight);
        index += 1;
    });
}
