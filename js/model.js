'use strict';

const ACTIVITY_DATA_ADDED_EVENT = 'ACTIVITY_DATA_ADDED_EVENT';
const ACTIVITY_DATA_REMOVED_EVENT = 'ACTIVITY_DATA_REMOVED_EVENT';

const GRAPH_SELECTED_EVENT = 'GRAPH_SELECTED_EVENT';
const STORAGE_KEY_DATA_POINTS = 'STORAGE_KEY_DATA_POINTS';
const STORAGE_KEY_LAST_DATA_ENTRY_TIME = 'STORAGE_KEY_LAST_DATA_ENTRY_TIME';

/**
 * Represents a single activity data point.
 * @param activityType The type of activity. A string
 * @param healthMetricsDict A dictionary of different health metrics. The key is the
 * health data type (e.g., energy level, stress level, etc.), while the value is
 * the value the user gave to that activity.
 * @param activityDurationInMinutes A number
 * @param date The time this was recorded
 * @constructor
 */
let ActivityData = function (activityType, healthMetricsDict, activityDurationInMinutes, fake = false) {
    this.activityType = activityType;
    this.activityDataDict = healthMetricsDict;
    this.activityDurationInMinutes = activityDurationInMinutes;
    if (fake) {
        this.fake = true; //to indicate fake data
    }
};

/**
 * An object which tracks all of the data
 * @constructor
 */
let ActivityStoreModel = function () {
    this.listenerList = [];
    this.dataPointList = [];
    this.trackedActivitiesList = ["Writing Code", "Eating Dinner", "Playing Sports", "Studying for Exams", "Watching TV"];
    this.mostRecentAddedDate = "";
};

// _ is the Underscore library
// This extends the JavaScript prototype with additional methods
// This is a common idiom for defining JavaScript classes
_.extend(ActivityStoreModel.prototype, {

    /**
     * Add a listener to the listeners we track
     * @param listener The listener is a callback function with the following signature:
     * (eventType, eventTime, activityData) where eventType is a string indicating
     * the event type (one of ACTIVITY_DATA_ADDED_EVENT or ACTIVITY_DATA_REMOVED_EVENT), and
     * activityData the ActivityData added or removed.
     */
    addListener: function (listener) {
        this.listenerList.push(listener);
    },

    /**
     * Should remove the given listener.
     * @param listener
     */
    removeListener: function (listener) {
        let index = this.listenerList.indexOf(listener);
        if (index >= 0) {
            this.listenerList.splice(index, 1);
        }
    },

    /**
     * Should add the given data point, and alert listeners that a new data point has
     * been added.
     * @param activityDataPoint
     */
    addActivityDataPoint: function (activityDataPoint) {
        let activityText = activityDataPoint.activityType;
        let happiness = activityDataPoint.activityDataDict.happinessLevel;
        let energy = activityDataPoint.activityDataDict.energyLevel;
        let stress = activityDataPoint.activityDataDict.stressLevel;
        let timeSpent = activityDataPoint.activityDurationInMinutes;
        if (_.isNaN(happiness) || _.isNaN(energy)
            || _.isNaN(stress) || _.isNaN(timeSpent)
            || !_.isNumber(happiness) || !_.isNumber(energy)
            || !_.isNumber(stress) || !_.isNumber(timeSpent)
            || !_.isString(activityText) || timeSpent <= 0) {
            this.showInvalidInputMessage();
        } else {
            this.dataPointList.push(JSON.stringify(activityDataPoint));
            window.localStorage.setItem(STORAGE_KEY_DATA_POINTS,
                JSON.stringify(this.dataPointList));
            this.mostRecentAddedDate = new Date().getTime();
            window.localStorage.setItem(STORAGE_KEY_LAST_DATA_ENTRY_TIME, this.mostRecentAddedDate);
            this.notifyListeners(ACTIVITY_DATA_ADDED_EVENT, this.mostRecentAddedDate, activityDataPoint);
        }
    },
    /**
     Listener Function should have signature (eventType, eventTime, activityData) where eventType is a string indicating
     * the event type (one of ACTIVITY_DATA_ADDED_EVENT or ACTIVITY_DATA_REMOVED_EVENT), and
     * activityData the ActivityData added or removed.
     */
    notifyListeners: function (eventType, eventTime, activityData) {
        _.each(this.listenerList, function (listenerFn) {
            listenerFn(eventType, eventTime, activityData);
        });
    },

    /**
     * Should remove the given data point (if it exists), and alert listeners that
     * it was removed. It should not alert listeners if that data point did not
     * exist in the data store
     * @param activityDataPoint
     */
    removeActivityDataPoint: function (activityDataPoint) {
        let data = JSON.stringify(activityDataPoint);
        let index = this.dataPointList.indexOf(data);
        if (index >= 0) {
            this.dataPointList.splice(index, 1);
            window.localStorage.setItem(STORAGE_KEY_DATA_POINTS,
                JSON.stringify(this.dataPointList));
            this.notifyListeners(ACTIVITY_DATA_REMOVED_EVENT, new Date().getTime(), activityDataPoint);
        }
    },

    /**
     * Should return an array of all activity data points
     */
    getActivityDataPoints: function () {
        return _.map(this.dataPointList, function (dataPointString) {
            return JSON.parse(dataPointString);
        });
    },

    getTrackedActivitiesList: function () {
        return this.trackedActivitiesList;
    },

    showInvalidInputMessage: function () {
        alert("Invalid input! Please make sure the input is not empty or negative.");
    }
});

/**
 * The GraphModel tracks what the currently selected graph is.
 * You should structure your architecture so that when the user chooses
 * a new graph, the event handling code for choosing that graph merely
 * sets the new graph here, in the GraphModel. The graph handling code
 * should then update to show the selected graph, along with any components
 * necessary to configure that graph.
 * @constructor
 */
let GraphModel = function () {
    this.listenerList = [];
    this.graphNameList = ["TableSummary", "EntryByEntry", "Averages", "Time Spent"];
    this.selectedGraphName = "TableSummary";
};

_.extend(GraphModel.prototype, {

    /**
     * Add a listener to the listeners we track
     * @param listener The listener is a callback function with the following signature:
     * (eventType, eventTime, eventData) where eventType is a string indicating
     * the event type (specifically, GRAPH_SELECTED_EVENT),
     * and eventData indicates the name of the new graph.
     */
    addListener: function (listener) {
        this.listenerList.push(listener);
    },

    /**
     * Should remove the given listener.
     * @param listener
     */
    removeListener: function (listener) {
        let index = this.listenerList.indexOf(listener);
        if (index >= 0) {
            this.listenerList.splice(index, 1);
        }
    },

    /**
     * Returns a list of graphs (strings) that can be selected by the user
     */
    getAvailableGraphNames: function () {
        return this.graphNameList;
    },

    /**
     * Should return the name of the currently selected graph. There should
     * *always* be one graph that is currently available.
     */
    getNameOfCurrentlySelectedGraph: function () {
        return this.selectedGraphName;
    },

    /**
     * Changes the currently selected graph to the graph name given. Should
     * broadcast an event to all listeners that the graph changed.
     * @param graphName
     */
    selectGraph: function (graphName) {
        if (this.graphNameList.indexOf(graphName) == -1) {
            console.log("Graph name was not in graph List???");

        } else if (graphName.valueOf() != this.getNameOfCurrentlySelectedGraph().valueOf()) {
            this.selectedGraphName = graphName;
            this.notifyListeners(this.selectedGraphName);
        }
    },

    notifyListeners: function (graphName) {
        _.each(
            this.listenerList,
            function (listener_fn) {
                listener_fn(GRAPH_SELECTED_EVENT, new Date().getTime(), graphName);
            }
        );
    }
});

/**
 * Will generate a number of random data points and add them to the model provided.
 * If numDataPointsToGenerate is not provided, will generate and add 100 data points.
 * @param activityModel The model to add data to
 * @param numDataPointsToGenerate The number of points to generate.
 *
 * Example:
 *
 * generateFakeData(new ActivityStoreModel(), 10);
 */
function generateFakeData(activityModel, numDataPointsToGenerate) {

    numDataPointsToGenerate = (!_.isNumber(numDataPointsToGenerate) || numDataPointsToGenerate < 0) ? 100 : numDataPointsToGenerate;
    _.times(
        numDataPointsToGenerate,
        function () {
            let activityDataPoint = new ActivityData(
                activityModel.trackedActivitiesList[_.random(activityModel.trackedActivitiesList.length - 1)],
                {
                    energyLevel: _.random(1, 5),
                    stressLevel: _.random(1, 5),
                    happinessLevel: _.random(1, 5)
                },
                _.random(300),
                true
            );
            activityModel.addActivityDataPoint(activityDataPoint);
        }
    );
}
