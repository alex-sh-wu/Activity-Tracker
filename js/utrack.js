'use strict';

window.addEventListener('load', () => {
    let dataModel = new ActivityStoreModel();
    let graphModel = new GraphModel();

    let storedData = window.localStorage.getItem(STORAGE_KEY_DATA_POINTS);
    let storedLastUpdateTime = window.localStorage.getItem(STORAGE_KEY_LAST_DATA_ENTRY_TIME);
    getLastUpdateTime(parseInt(storedLastUpdateTime));
    if (storedData != null) {
        dataModel.dataPointList = JSON.parse(storedData);
    }
    if (storedLastUpdateTime != null) {
        dataModel.mostRecentAddedDate = storedLastUpdateTime;
    }

    let trackDiv = document.getElementById('track_div');
    let analyzeDiv = document.getElementById('analysis_div');
    let tableSummary = document.getElementById('table_summary');
    let graphSummary = document.getElementById('graph_summary');
    let entriesComparison = document.getElementById('entries_graph');
    let activityAverages = document.getElementById('bar_graph');
    let timeSpent = document.getElementById('pie_chart');
    let tableContainer = document.getElementById('activity_table_container');

    analyzeDiv.style.display = 'none';
    activityAverages.style.display = 'none';
    entriesComparison.style.display = 'none';
    timeSpent.style.display = 'none';

    document.getElementById('sidebar_track').addEventListener('click', () => {
        trackDiv.style.display = 'block';
        analyzeDiv.style.display = 'none';
    });

    document.getElementById('sidebar_analyze').addEventListener('click', () => {
        trackDiv.style.display = 'none';
        analyzeDiv.style.display = 'block';
    });

    document.getElementById('table_summary_button').addEventListener('click', () => {
        graphModel.selectGraph(graphModel.getAvailableGraphNames()[0]);
    });

    document.getElementById('entry_graph_button').addEventListener('click', () => {
        graphModel.selectGraph(graphModel.getAvailableGraphNames()[1]);
    });

    document.getElementById('average_summary_button').addEventListener('click', () => {
        graphModel.selectGraph(graphModel.getAvailableGraphNames()[2]);
    });

    document.getElementById('time_spent_button').addEventListener('click', () => {
        graphModel.selectGraph(graphModel.getAvailableGraphNames()[3]);
    });

    dataModel.addListener((eventType, eventTime, activityData) => {
        renderTableSummary(tableContainer, dataModel);
        renderActivityAverages(activityAverages, dataModel);
        renderEntryByEntryComparison(entriesComparison, dataModel);
        renderTimeSpent(timeSpent, dataModel);
        getLastUpdateTime(eventTime);
    });

    graphModel.addListener((eventType, eventTime, graphName) => {
        updateGraphs(graphModel, graphName, tableSummary, graphSummary, entriesComparison, activityAverages, timeSpent);
    })

    
    //entering information into the graph

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

        let activityDataPoint = new ActivityData(
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

    let generateButton = document.getElementById("generate_button");
    generateButton.addEventListener('click', () => {
        generateFakeData(dataModel, 5);
    });

    //information rendering
    renderTableSummary(tableContainer, dataModel);
    renderActivityAverages(activityAverages, dataModel);
    renderEntryByEntryComparison(entriesComparison, dataModel);
    renderTimeSpent(timeSpent, dataModel);
});
