/* jshint node: true */

// run this script using `mocha ios-local-server.js`

'use strict';

require('./helpers/setup');

var wd = require('wd');
var _ = require('underscore');
var serverConfigs = require('./helpers/appium-servers');
var localServer = require('./helpers/local-server');

// START THE DRIVER
describe('ios local server', function () {
  this.timeout(300000);
  var driver;
  var allPassed = true;

  before(function () {
    localServer.start();
    var serverConfig = serverConfigs.local;
    driver = wd.promiseChainRemote(serverConfig);
    require('./helpers/logging').configure(driver);

    var desired = _.clone(require('./helpers/caps').ios93);
    desired.app = '';
    desired.appPackage = '';
    desired.appActivity = 'MainActivity';
    if (process.env.npm_package_config_sauce) {
      desired.name = 'ios - local server';
      desired.tags = ['sample'];
    }

    return driver.init(desired);
  });

  // CLOSE DRIVER AND CLEANUP
  after(function () {
    localServer.stop();
    return driver
      .quit()
      .finally(function () {
        if (process.env.npm_package_config_sauce) {
          return driver.sauceJobStatus(allPassed);
        }
      });
  });

  afterEach(function () {
    allPassed = allPassed && this.currentTest.state === 'passed';
  });

  // scroll to format and click on it, check for modal webview
  it('Store 1 Ad should open placement webview', function() {
    return driver
      .execute("mobile: scrollTo", { "element": elementByXPath("//android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.support.v4.view.ViewPager[1]/android.widget.LinearLayout[1]/android.widget.ListView[1]/android.widget.LinearLayout[9]/android.widget.RelativeLayout[1]/android.widget.RelativeLayout[1]").value })
      .elementByXPath("//android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.widget.LinearLayout[1]/android.widget.FrameLayout[1]/android.view.ViewGroup[1]/android.support.v4.view.ViewPager[1]/android.widget.LinearLayout[1]/android.widget.ListView[1]/android.widget.LinearLayout[9]/android.widget.RelativeLayout[1]/android.widget.RelativeLayout[1]").click()
      .then(function(contexts) {
        var contextCount = contexts.length;
        return contextCount.should.equal(2);
      });
  });


});
