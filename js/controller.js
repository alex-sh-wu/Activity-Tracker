'use strict';

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