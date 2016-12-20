'use strict';

const Setup = require('../helpers/setup.js');

let
	driver = null,
	webdriver = null;

before('suite setup', function () {
	// the webdriver takes a while to setup; mocha timeout is set to 5 minutes
	this.timeout(300000);

	const setup = new Setup();

	webdriver = setup.getWd();

	// appium local server
	driver = webdriver.promiseChainRemote({
		host: 'localhost',
		port: 4723
	});

	// turn on logging for the driver
	setup.logging(driver);

	// specify target test app and ios simulator
	return driver.init({
		automationName: 'Appium',
		platformName: 'Android',
		platformVersion: '6.0',
		deviceName: '192.168.56.101:5555',
		app: '/Users/wluu/github/qe-appium/KitchenSink/build/android/bin/KitchenSink.apk',
		appPackage: 'com.appcelerator.kitchensink',
		appActivity: '.KitchensinkActivity',
		noReset: true // doesn't kill the emulator
	});
});

after('suite teardown', function () {
	return driver.quit();
});

// Controls > Slider > Basic
describe('KS Android Slider', function () {
	// in general, the tests take a while to go through, which will hit mocha's 2 second timeout threshold.
	// set timeout to 5 minutes
	this.timeout(300000);

	it('should change basic slider', function () {
		// https://developer.android.com/reference/android/support/test/uiautomator/UiSelector.html

		return driver
			.elementByAndroidUIAutomator('new UiSelector().text("Slider")')
			.click()
			.elementByAndroidUIAutomator('new UiSelector().text("Basic")')
			.click()
			.elementByAndroidUIAutomator('new UiSelector().text("Change Basic Slider")')
			.click();
	});

	it('should drag the scrubber on the slider to the right', function () {
		// https://github.com/admc/wd/blob/master/test/specs/mjson-actions-specs.js

		const NEW_TEXT = 'Basic Slider - value = 5 act val 5';

		const DRAG_TO_RIGHT = new webdriver.TouchAction()
			.press({x:244, y:273}) // press on the scrubber location
			.moveTo({x:100, y:0}) // drag scrubber to the right
			.release(); // release the scrubber

		return driver
			.performTouchAction(DRAG_TO_RIGHT)
			.elementByAndroidUIAutomator(`new UiSelector().text("${NEW_TEXT}")`)
			.text().should.become(NEW_TEXT); // this part is redundant; the above command will throw an error if text is not found; left this here as an example
	});

	it('go back to beginning of app', function () {
		return driver
			.back()
			.back();
	});
});

// Controls > Label > Basic
describe('KS Android Labels', function () {
	this.timeout(300000);

	it('should check for appcelerator label', function () {
		const APPC_TEXT = 'Appcelerator';

		return driver
			.elementByAndroidUIAutomator('new UiSelector().text("Label")')
			.click()
			.elementByAndroidUIAutomator('new UiSelector().text("Basic")')
			.click()
			.elementByAndroidUIAutomator(`new UiSelector().text("${APPC_TEXT}")`);
	});

	it('should check for appcelerator label 2', function () {
		const APPC_TEXT = 'Appcelerator';

		return driver
			.elementByAndroidUIAutomator('new UiSelector().text("Change Label 2")')
			.click()
			.elementByAndroidUIAutomator(`new UiSelector().text("${APPC_TEXT}")`);
	});

	it('should check for appcelerator label with background', function () {
		const LOREM_TEXT = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat';

		return driver
			.elementByAndroidUIAutomator('new UiSelector().text("Label 1 background")')
			.click()
			.elementByAndroidUIAutomator(`new UiSelector().text("${LOREM_TEXT}")`);
	});

	it('go back to beginning of app', function () {
		return driver
			.back()
			.back();
	});
});

// Controls > Text Area > Basic
describe('KS Android Text Area', function () {
	this.timeout(300000);

	it.skip('should check text in text area', function () {
		return driver
			.elementByAndroidUIAutomator('new UiSelector().text("Text Area")')
			.click()
			.elementByAndroidUIAutomator('new UiSelector().text("Basic")')
			.click()
			.elementByAndroidUIAutomator('new UiSelector().text("I am a textarea")');
	});

	// NOTE: the cursor for some reason doesn't stay at the end of the line like ios; so backspacing multiple times delete random words in the text area
	it.skip('should delete (backspace) default text and enter some text', function () {
		const BACKSPACES = [
			webdriver.SPECIAL_KEYS['Back space'], // yes, backspace is spelled incorrectly
			webdriver.SPECIAL_KEYS['Back space'],
			webdriver.SPECIAL_KEYS['Back space'],
			webdriver.SPECIAL_KEYS['Back space'],
			webdriver.SPECIAL_KEYS['Back space'],
			webdriver.SPECIAL_KEYS['Back space'],
			webdriver.SPECIAL_KEYS['Back space'],
			webdriver.SPECIAL_KEYS['Back space']
		];

		return driver
			.elementByClassName('android.widget.EditText')
			.elementByAndroidUIAutomator('new UiSelector().className("android.widget.EditText")')
			.click() // brings up the soft keyboard
			.keys(BACKSPACES) // looks like this method accepts an array ...
			.keys('monkey') // or a string
			.elementByAndroidUIAutomator('new UiSelector().text("I am a monkey")');
	});

	it('should delete (clear text area) text and enter new text', function () {
		const NEW_TEXT = 'MONKEYLORD WILL RULE THIS WORLD!';

		return driver
			.elementByClassName('android.widget.EditText')
			.clear()
			.click() // brings up the soft keyboard again
			.keys(NEW_TEXT)
			.elementByAndroidUIAutomator(`new UiSelector().text("${NEW_TEXT}")`);
	});

	it('go back to beginning of app', function () {
		const LOSE_FOCUS = new webdriver.TouchAction()
			.press({x:390, y:1008}) // need to lose focus from text area first in order to perform the back action; so, tap outside of the text area
			.release();

		return driver
			.performTouchAction(LOSE_FOCUS)
			.back()
			.back()
			.back() // need another back action to get back to the beginning of the app; hmmm
			.sleep(3000);
	});
});

// Base UI > Views > Image Views > Image File
describe('KS Android Image Views', function () {
	this.timeout(300000);

	it('should find the apple logo by class name', function () {
		return driver
			.elementByAndroidUIAutomator('new UiSelector().className("android.widget.EditText")')
			.waitForElementByName('Base UI', webdriver.asserters.isDisplayed)
			.click()
			.waitForElementByName('Views', webdriver.asserters.isDisplayed)
			.click()
			.waitForElementByName('Image Views', webdriver.asserters.isDisplayed)
			.click()
			.waitForElementByName('Image File', webdriver.asserters.isDisplayed)
			.click()
			.waitForElementByClassName('XCUIElementTypeImage', webdriver.asserters.isDisplayed);
	});

	it.skip('should find the apple logo\'s pixel size', function () {
		return driver
			.waitForElementByClassName('XCUIElementTypeImage', webdriver.asserters.isDisplayed)
			.getSize()
				.should.eventually.eql({'width':24, 'height':24}); // alias for deep equal
	});

	it.skip('should take screenshot and save it to local machine', function () {
		const TO_HERE = '/Users/wluu/Desktop/screenshot.png';

		return driver
			.takeScreenshot()
			.saveScreenshot(TO_HERE);
	});

	it.skip('go back to "views" pane', function () {
		return driver
			.elementByName('Image Views')
			.click()
			.elementByName('Views')
			.click();
	});
});

// Base UI > Views > List View > Built in Templates
describe('KS Android List View', function () {
	this.timeout(300000);

	it.skip('do list view stuff', function () {

	});
});