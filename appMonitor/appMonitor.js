/**
 * App Monitor
 * 
 * This is a simple Node.js application which integrates with the IBM Cloud Monitoring services. The app
 * uses Express.js to provide a simple UI that can be used to send Metrics to the Monitoring service.
 * 
 * In order to execute this code succesfully you will need to set the following variables. These variables 
 * are located directly beneath the 'require' statements in the source code.
 * 
 * cloudAPIKey - Your IBM Cloud API Key. To generate an API Key, see 'Related Links' below.
 * spaceGUID - The UUID of the IBM Cloud space in your account.
 * monitorEndPoint - Endpoint of monitor for your selected IBM Cloud region.
 * 
 * Related Links:
 * Sending data by using the Metrics API: https://cloud.ibm.com/docs/services/cloud-monitoring/security?topic=cloud-monitoring-send_data_api
 * 
 * @author David A. Lentz (dlentz@us.ibm.com)
 * (c)2019 IBM Corp.
 *  IBM INTERNAL USE ONLY
 * 
 */
global.Monitoring = require('ibm-cloud-monitoring');
global.express = require('express');
global.fs = require('fs');
global.path = require('path');

// Original Cloud API Key
const cloudAPIKey = "YOUR API KEY";
const spaceGUID = "YOUR MONITOR SPACE UUID";
const monitorEndPoint = "metrics.ng.bluemix.net";

/**
 * Our App Monitor object which holds the methods
 * which respond to the REST API calls from
 * the UI
 */
function AppMonitor() {
}

/**
 * This method is executed when the UI sends a /sendMetric REST API.
 * 
 * This method will send a metric to the IBM Cloud Monitoring service
 * and will respond with a JSON object which contains:
 * 
 * returnCode: String
 * 
 */
AppMonitor.prototype.sendMetric = function (req, res, next) {
    var returnData = new Object();

    returnData.returnCode = "";

    try {
        client.save({ name: 'appMonitor.demo', value: 0.05 })
            .then(function (data) {
                returnData.data = data;
                res.status(200);
                res.send(returnData);
            })
            .catch(function (err) {
                console.error("Encountered the following error:\n", err);
                returnData.error = err;
                res.status(200);
                res.send(returnData);
            });

        returnData.returnCode = "Passed";
    } catch (e) {
        console.error(e);
        returnData.returnCode = "Failed, check AppMonitor stderr";
        res.status(200);
        res.send(returnData);
    }


}




/**
* Create the Express Server and server the static
* content located under the /WebContent directory
*/
var appMonitor = new AppMonitor();
var client = new Monitoring({ host: monitorEndPoint, scope: 's-' + spaceGUID, api_key: cloudAPIKey });
var app = express();
app.use(express.static(path.join(process.cwd(), '/WebContent')));

app.get('/sendMetric', appMonitor.sendMetric);

/**
 * Listen on port 6001
 */
app.listen(6001, function () {
    console.log("App Monitor started. To send a metric to your IBM Cloud Monitoring service: curl http://localhost:6001/sendMetric");
});