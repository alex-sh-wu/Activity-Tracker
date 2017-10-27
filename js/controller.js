'use strict';

const energyColor = '#FAA43A';
const stressColor = '#F15854';
const happinessColor = '#5DA5DA';

const activity1Color = '#EC4401';
const activity2Color = '#CC9B25';
const activity3Color = '#13CD4A';
const activity4Color = '#7B6ED6';
const activity5Color = '#5E525C';

const metric1 = 'Energy';
const metric2 = 'Stress';
const metric3 = 'Happiness';

const legendFont = '16px Arial';
const fontColor = 'black';

const axisColor = 'black';

function getLastUpdateTime(newTime) {
    let date = null;
    if (newTime != null) {
        date = new Date(newTime);
        document.getElementById('last_entry').innerHTML = "<em> Last Data Entry: " + date.toLocaleTimeString() + " , " + date.toDateString() + "</em>";
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

        let button = document.createElement('input');
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

function updateGraphs(graphModel, graphName, tableSummary, graphSummary, entriesComparison, activityAverages, timeSpent) {
    if (graphName.valueOf() == graphModel.getAvailableGraphNames()[0].valueOf()) {
        showTableSummary(tableSummary, graphSummary);
    }
    //Entry by Entry
    else if (graphName.valueOf() == graphModel.getAvailableGraphNames()[1].valueOf()) {
        showEntries(tableSummary, graphSummary, entriesComparison, activityAverages, timeSpent);
    }
    //Averages
    else if (graphName.valueOf() == graphModel.getAvailableGraphNames()[2].valueOf()) {
        showActivityAverages(tableSummary, graphSummary, entriesComparison, activityAverages, timeSpent);
    }

    //Pie chart
    else if (graphName.valueOf() == graphModel.getAvailableGraphNames()[3].valueOf()) {
        showPieChart(tableSummary, graphSummary, entriesComparison, activityAverages, timeSpent);
    }
}

function showTableSummary(tableSummary, graphSummary) {
    tableSummary.style.display = 'table';
    graphSummary.style.display = 'none';
}

function showEntries(tableSummary, graphSummary, entriesComparison, activityAverages, pieChart) {
    tableSummary.style.display = 'none';
    graphSummary.style.display = 'table';
    entriesComparison.style.display = 'block';
    activityAverages.style.display = 'none';
    pieChart.style.display = 'none';
}

function showActivityAverages(tableSummary, graphSummary, entriesComparison, activityAverages, pieChart) {
    tableSummary.style.display = 'none';
    graphSummary.style.display = 'table';
    entriesComparison.style.display = 'none';
    activityAverages.style.display = 'block';
    pieChart.style.display = 'none';
}

function showPieChart(tableSummary, graphSummary, entriesComparison, activityAverages, pieChart) {
    tableSummary.style.display = 'none';
    graphSummary.style.display = 'table';
    entriesComparison.style.display = 'none';
    activityAverages.style.display = 'none';
    pieChart.style.display = 'block';
}

/**
 * This function can live outside the window load event handler, because it is
 * only called in response to a button click event
 */
function renderActivityAverages(canvas, dataModel) {
    let context = canvas.getContext('2d');
    let horizontalSpacing = 10;
    let leftMargin = 75;
    let labelMargin = 25;
    canvas.width = screen.availWidth / 1.25 + leftMargin;
    canvas.height = screen.availHeight / 1.25;
    let bottomMargin = screen.availHeight - canvas.height;
    let heightDivider = 7;
    let maxYValue = 5;

    let width = canvas.width - leftMargin;
    let height = canvas.height - bottomMargin - labelMargin;

    let activityNames = dataModel.getTrackedActivitiesList();

    let groupBarWidth = (width / activityNames.length);

    let indivBarWidth = ( groupBarWidth - (horizontalSpacing * 2)) / 3;

    let maxBarHeight = height / heightDivider;

    //Set up graph axis
    context.font = "25px Arial";
    context.fillStyle = fontColor;
    context.textAlign = 'center';
    context.fillText("Activity Averages", canvas.width / 2, 30);
    //YAxis Label
    context.save();
    context.translate(leftMargin / 3, (height + bottomMargin) / 2);
    context.rotate(-0.5 * Math.PI);
    context.fillStyle = fontColor;
    context.font = "25px Arial";
    context.fillText("Level", 0, 0);
    context.restore();

    //Y Axis
    context.strokeStyle = axisColor;
    context.moveTo(leftMargin, maxBarHeight * 2);
    context.lineTo(leftMargin, canvas.height - bottomMargin - labelMargin);
    context.stroke();

    //Y Axis data Points
    for (let i = heightDivider - maxYValue; i <= heightDivider - 1; i++) {
        context.font = "16px Arial";
        context.fillStyle = fontColor;
        context.fillText("" + (heightDivider - i), leftMargin / 1.25, (maxBarHeight * i) + 3);
        context.fillRect(leftMargin, (maxBarHeight * i), -5, 2);
    }
    //Xaxis Label
    context.font = "25px Arial";
    context.fillStyle = fontColor;
    context.textAlign = 'center';
    context.fillText("Activity", canvas.width / 2, canvas.height - labelMargin / 4);

    //X axis
    context.moveTo(leftMargin, canvas.height - bottomMargin - labelMargin);
    context.lineTo(canvas.width, canvas.height - bottomMargin - labelMargin);
    context.stroke();

    //Legend
    context.font = legendFont;
    context.fillStyle = fontColor;
    context.textAlign = 'center';
    context.fillText(metric1, canvas.width - leftMargin, 30);
    context.fillText(metric2, canvas.width - leftMargin, 50);
    context.fillText(metric3, canvas.width - leftMargin, 70);

    context.fillStyle = energyColor;
    context.fillRect(canvas.width - leftMargin * 2, 20, 10, 10);
    context.fillStyle = stressColor;
    context.fillRect(canvas.width - leftMargin * 2, 40, 10, 10);
    context.fillStyle = happinessColor;
    context.fillRect(canvas.width - leftMargin * 2, 60, 10, 10);

    activityNames.sort(function (s1, s2) {
        return s1.localeCompare(s2);
    });

    let index = 0;
    _.each(activityNames, function (activityName) {
        let x = leftMargin + index * groupBarWidth + horizontalSpacing;

        context.save();
        context.translate(x + groupBarWidth / 2, height + bottomMargin / 2);
        context.rotate(-0.5 * Math.PI);
        context.fillStyle = fontColor;
        context.font = "18px Arial";
        context.fillText(activityName, 0, 0, bottomMargin - labelMargin);
        context.restore();
        let energyLevelTotal = 0;
        let stressLevelTotal = 0;
        let happinesLevelTotal = 0;
        let dataPoints = _.filter(dataModel.getActivityDataPoints(), function (dataPoint) {
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
    let context = canvas.getContext('2d');
    let horizontalSpacing = 10;
    let leftMargin = 75;
    let labelMargin = 25;
    canvas.width = screen.availWidth / 1.25 + leftMargin;
    canvas.height = screen.availHeight / 1.25;
    let bottomMargin = screen.availHeight - canvas.height;
    let heightDivider = 7;
    let maxYValue = 5;

    let width = canvas.width - leftMargin;
    let height = canvas.height - bottomMargin - labelMargin;

    let dataPoints = dataModel.getActivityDataPoints();

    let groupBarWidth = (width / dataPoints.length);
    if (dataPoints.length <= 7) {
        groupBarWidth = 100;
    }

    let indivBarWidth = ( groupBarWidth - (horizontalSpacing * 2)) / 3;

    let maxBarHeight = height / heightDivider;

    //Set up graph axis
    context.font = "25px Arial";
    context.fillStyle = fontColor;
    context.textAlign = 'center';
    context.fillText("Entry By Entry Comparison", canvas.width / 2, 30);

    //YAxis Label
    context.save();
    context.translate(leftMargin / 3, (height + bottomMargin) / 2);
    context.rotate(-0.5 * Math.PI);
    context.fillStyle = fontColor;
    context.font = "25px Arial";
    context.fillText("Level", 0, 0);
    context.restore();


    //Y Axis
    context.strokeStyle = axisColor;
    context.moveTo(leftMargin, maxBarHeight * 2);
    context.lineTo(leftMargin, canvas.height - bottomMargin - labelMargin);
    context.stroke();

    //XAxis Label
    context.font = "25px Arial";
    context.fillStyle = fontColor;
    context.textAlign = 'center';
    context.fillText("Entry - Activity", canvas.width / 2, canvas.height - labelMargin / 4);

    //X axis
    context.moveTo(leftMargin, canvas.height - bottomMargin - labelMargin);
    context.lineTo(canvas.width, canvas.height - bottomMargin - labelMargin);
    context.stroke();


    //Legend
    context.font = legendFont;
    context.fillStyle = fontColor;
    context.textAlign = 'center';
    context.fillText(metric1, canvas.width - leftMargin, 30);
    context.fillText(metric2, canvas.width - leftMargin, 50);
    context.fillText(metric3, canvas.width - leftMargin, 70);

    context.fillStyle = energyColor;
    context.fillRect(canvas.width - leftMargin * 2, 20, 10, 10);
    context.fillStyle = stressColor;
    context.fillRect(canvas.width - leftMargin * 2, 40, 10, 10);
    context.fillStyle = happinessColor;
    context.fillRect(canvas.width - leftMargin * 2, 60, 10, 10);

    //Y Axis data Points
    for (let i = heightDivider - maxYValue; i <= heightDivider - 1; i++) {
        context.font = "16px Arial";
        context.fillStyle = fontColor;
        context.fillText("" + (heightDivider - i), leftMargin / 1.25, (maxBarHeight * i) + 3);
        context.fillRect(leftMargin, (maxBarHeight * i), -5, 2);
    }

    let index = 0;
    _.each(dataPoints, function (dataPoint) {
        let x = leftMargin + index * groupBarWidth + horizontalSpacing;

        context.save();
        context.translate(x + groupBarWidth / 2, height + bottomMargin / 2);
        context.rotate(-0.5 * Math.PI);
        context.fillStyle = fontColor;
        context.font = " 18px Arial";
        context.fillText(index + 1 + " - " + dataPoint.activityType, 0, 0, bottomMargin - labelMargin);
        context.restore();

        let dictionary = dataPoint.activityDataDict;
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

function renderTimeSpent(canvas, dataModel) {
    //algorithm borrowed from https://stackoverflow.com/questions/6995797/html5-canvas-pie-chart
    let context = canvas.getContext('2d');
    let horizontalSpacing = 10;
    let leftMargin = 75;
    let labelMargin = 25;
    canvas.width = screen.availWidth / 1.25 + leftMargin;
    canvas.height = screen.availHeight / 1.25;
    let bottomMargin = screen.availHeight - canvas.height;
    let heightDivider = 7;
    let maxYValue = 5;

    let width = canvas.width - leftMargin;
    let height = canvas.height - bottomMargin - labelMargin;

    let dataPoints = dataModel.getActivityDataPoints();

    let activity1DataPoints = _.filter(dataPoints, (element) => { return element["activityType"] === dataModel.trackedActivitiesList[0]; } );
    let activity2DataPoints = _.filter(dataPoints, (element) => { return element["activityType"] === dataModel.trackedActivitiesList[1]; } );
    let activity3DataPoints = _.filter(dataPoints, (element) => { return element["activityType"] === dataModel.trackedActivitiesList[2]; } );
    let activity4DataPoints = _.filter(dataPoints, (element) => { return element["activityType"] === dataModel.trackedActivitiesList[3]; } );
    let activity5DataPoints = _.filter(dataPoints, (element) => { return element["activityType"] === dataModel.trackedActivitiesList[4]; } );


    //Legend
    context.font = legendFont;
    context.fillStyle = fontColor;
    context.textAlign = 'left';
    context.fillText(dataModel.trackedActivitiesList[0], canvas.width - leftMargin - 80, 30);
    context.fillText(dataModel.trackedActivitiesList[1], canvas.width - leftMargin - 80, 50);
    context.fillText(dataModel.trackedActivitiesList[2], canvas.width - leftMargin - 80, 70);
    context.fillText(dataModel.trackedActivitiesList[3], canvas.width - leftMargin - 80, 90);
    context.fillText(dataModel.trackedActivitiesList[4], canvas.width - leftMargin - 80, 110);

    context.fillStyle = activity1Color;
    context.fillRect(canvas.width - leftMargin * 2 - 40, 20, 10, 10);
    context.fillStyle = activity2Color;
    context.fillRect(canvas.width - leftMargin * 2 - 40, 40, 10, 10);
    context.fillStyle = activity3Color;
    context.fillRect(canvas.width - leftMargin * 2 - 40, 60, 10, 10);
    context.fillStyle = activity4Color;
    context.fillRect(canvas.width - leftMargin * 2 - 40, 80, 10, 10);
    context.fillStyle = activity5Color;
    context.fillRect(canvas.width - leftMargin * 2 - 40, 100, 10, 10);

    let lastAngle = 0;
    let aggregatedData = [
                _.reduce(activity1DataPoints, (memo, element) => { return memo + element["activityDurationInMinutes"]}, 0),
                _.reduce(activity2DataPoints, (memo, element) => { return memo + element["activityDurationInMinutes"]}, 0),
                _.reduce(activity3DataPoints, (memo, element) => { return memo + element["activityDurationInMinutes"]}, 0),
                _.reduce(activity4DataPoints, (memo, element) => { return memo + element["activityDurationInMinutes"]}, 0),
                _.reduce(activity5DataPoints, (memo, element) => { return memo + element["activityDurationInMinutes"]}, 0)
                ];
    let totalMinutes = 0;
    let colors = [activity1Color, activity2Color, activity3Color, activity4Color, activity5Color];

    for (let i = 0; i < aggregatedData.length; i++) {
        totalMinutes += aggregatedData[i];
    }

    for (let i = 0; i < aggregatedData.length; i++) {
        context.fillStyle = colors[i];
        context.beginPath();
        context.moveTo(canvas.width/2, canvas.height/2);
        context.arc(canvas.width/2, canvas.height/2, canvas.height/2, lastAngle, lastAngle+(Math.PI*2*(aggregatedData[i]/totalMinutes)), false);
        context.lineTo(canvas.width/2, canvas.height/2);
        context.fill();
        lastAngle += Math.PI * 2 * (aggregatedData[i]/totalMinutes);
    }
}

