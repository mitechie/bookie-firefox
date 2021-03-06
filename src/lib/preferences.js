var preferenceData = {};

console.log('preferences.js');
console.log(preferenceData);

var init = function(prefs, api, storage) {

    var that = {
        storage: storage
    };

    // Add a listener only when the following changes
    // Changes in cache_content key don't really matter.
    prefs.on("api_key", onPrefChange);
    prefs.on("api_url", onPrefChange);
    prefs.on("api_username", onPrefChange);
    prefs.on('sync', onSyncBmarks);

    function onPrefChange(prefName) {
        api.ping({
            success: function(response) {
                storage.save('savedPrefs', true);
                console.log("The " + prefName + " preference changed.");

                // Force update as preferences have been updated.
                api.checkNew(0, true, 0, that);
            },
            failure: function(response) {
                storage.save('savedPrefs', false);
                console.log(
                    "The ping command failed. " +
                    "Please check your api url, username, and api_key. " +
                    prefName + " was just changed and didn't help.");
            }
        }, this);
        // Update the preferences.
        console.log('updating preferences');
        console.log(prefs.prefs);
        preferenceData = prefs.prefs;
    }

    function onSyncBmarks() {
        console.log('SYNC IT');
        api.sync({
            success: function(resp) {
                resp.json.hash_list.forEach(function(key) {
                    storage.save(key, true);
                });

                storage.save('lastSync', (new Date()).getTime());
            },
            failure: function(resp) {
                console.log('sync fail');
                console.log(resp.json);
            }
        }, this);
    }

    preferenceData = prefs.prefs;
    console.log('returning pref.js');
    console.log(preferenceData);
    return preferenceData;
};

exports.init = init;
