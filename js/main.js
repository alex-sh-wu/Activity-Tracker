'use strict';

let dataModel;
let graphModel;

window.addEventListener('load', () => {
    dataModel = new ActivityStoreModel();
    graphModel = new GraphModel();

    let storedData = window.localStorage.getItem(STORAGE_KEY_DATA_POINTS);
    let storedLastUpdateTime = window.localStorage.getItem(STORAGE_KEY_LAST_DATA_ENTRY_TIME);
    getLastUpdateTime(storedLastUpdateTime);
    if (storedData != null) {
        dataModel.dataPointList = JSON.parse(storedData);
    }

    let trackDiv = document.getElementById('track_div');
    let analyzeDiv = document.getElementById('analysis_div');
    let tableSummary = document.getElementById('table_summary');
    let graphSummary = document.getElementById('graph_summary');

    analyzeDiv.style.display = 'none';
    document.getElementById('bar_graph_container').style.display = 'none';
    document.getElementById('scatter_plot_container').style.display = 'none';

    document.getElementById('sidebar_track').addEventListener('click', function () {
        trackDiv.style.display = 'block';
        analyzeDiv.style.display = 'none';
    });

    document.getElementById('sidebar_analyze').addEventListener('click', function () {
        trackDiv.style.display = 'none';
        analyzeDiv.style.display = 'block';
    });

    document.getElementById('table_summary_button').addEventListener('click', function () {
        graphModel.selectGraph(graphModel.getAvailableGraphNames()[0]);
    });

    document.getElementById('entry_graph_button').addEventListener('click', function () {
        graphModel.selectGraph(graphModel.getAvailableGraphNames()[1]);
    });

    document.getElementById('average_summary_button').addEventListener('click', function () {
        graphModel.selectGraph(graphModel.getAvailableGraphNames()[2]);
    });

    dataModel.addListener(function (eventType, eventTime, activityData) {
        renderTableSummary(tableSummary, dataModel);
    });

    let activityField = document.getElementById("inputActivityType");
    let energyField = document.getElementById("inputEnergyLevel");
    let stressField = document.getElementById("inputStressLevel");
    let happinessField = document.getElementById("inputHappinessLevel");
    let timeSpentField = document.getElementById("inputTimeSpent");
    let submitButton = document.getElementById("submit_button");
    let tableSummaryButton = document.getElementById("table_summary_button");
    let entriesComparisonButton = document.getElementById("entry_graph_button");
    let activityAveragesButton = document.getElementById("average_summary_button");
    submitButton.addEventListener("click", () => {
        if (timeSpentField.value === "") {
            alert("Please enter a number in the Time Spent field.")
            return;
        }

        var activityDataPoint = new ActivityData(
            activityField.value,
            {
                energyLevel: parseInt(energyField.value),
                stressLevel: parseInt(stressField.value),
                happinessLevel: parseInt(happinessField.value)
            },
            parseInt(timeSpentField.value)
        );
        dataModel.addActivityDataPoint(activityDataPoint);
        resetFormField (activityField, energyField, stressField, happinessField, timeSpentField);
    });

    renderTableSummary(tableSummary, dataModel);
});