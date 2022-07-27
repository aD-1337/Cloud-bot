//粘贴代码 来自@
var https = require("https");
var qs = require("querystring");


// CHANGE THESE TO YOUR CLOUD API STUFF OTHERWISE IT WILL RETURN GOBBLEDEGOOK!!!
const otapiid = "X-Api-Id";
const otapisecret = "X-Api-Secret";
const otapikey = "X-Api-Key";

var sent = [];
function onetapAPI(method, endpoint, parameters) {
    return new Promise((resolve, reject) => {
        if (sent.length > 0) {
            if (Date.now() - sent[0].time >= 10000)
                sent = [];
            if (sent.length >= 5) {
                if (Date.now() - sent[0].time < 10000) {
                    reject("Rate limited!");
                    return;
                }
            }
        }

        let options = {
            hostname: "api.onetap.com",
            port: 443,
            path: "/cloud",
            method: method,
            headers: {
                "X-Api-Id": otapiid,
                "X-Api-Secret": otapisecret,
                "X-Api-Key": otapikey
            }
        };

        // safely add endpoint to path
        if (endpoint[0] == '/')
            options.path += endpoint;
        else
            options.path += '/' + endpoint;

        if (endpoint[endpoint.length - 1] != '/')
            options.path += '/';

        // only if its a POST/DELETE should we change content type
        if (method != "GET")
            options.headers["Content-Type"] = "application/x-www-form-urlencoded";

        const req = https.request(options, res => {
            let fullstring = "";
            res.on("data", d => { fullstring += d; });
            res.on("error", reject);
            res.on("close", () => {
                resolve(fullstring);
            });
        })
        if (method != "GET")
            req.write(qs.stringify(parameters)); // either a POST or DELETE request

        req.on("error", reject);

        req.end();

        sent.push({
            time: Date.now()
        });
    });
}