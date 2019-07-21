'use strict';

load(Java.type("java.lang.System").getenv("OPENHAB_CONF")+'/automation/lib/javascript/core/rules.js');

var me = "001_surehub_start.js";
var json_devices_list = []
var json_user_list = []
var json_pets_list = []

JSRule({
	name: "SureHub START",
	description: "Line: "+__LINE__,
	triggers: [
		// its a big API call, so just lets call this only every 6 hours
		TimerTrigger("0 0 0/6 1/1 * ? *")
	],
	execute: function( module, input){
		var token = "YOUR_AUTH_TOKEN_HERE"
		var timeout = 5000;
		var httpmethod = "GET";
		var url = "https://app.api.surehub.io/api/me/start"

		var json = executeCommandLineAndWaitResponse("/etc/openhab2/scripts/surehub.sh " + httpmethod + " " + token + " " +url, timeout);

		logDebug("results executeCommandLineAndWaitResponse: ", json);

		if (json == "") return;

		// only 1 Hub
		var action = getAction("Transformation").static;

		// count all devices
		json_devices_list = JSON.parse(json).data.devices;
		logDebug(me, "Surehub ALL Devices List: " + json_devices_list.length + " devices were found!");

		var count_hub = 0;
		var count_flap = 0;
		var count_feeder = 0;

		for(var i = 0; i < json_devices_list.length; i++)
        {
            // parse the hub data (product_id = 1)
            var hubData = "$.data.devices["+i+"][?(@.product_id==1)]";
            var hubDataTf = action.transform("JSONPATH", hubData, json);
            if (hubDataTf != NULL) {
				count_hub++;
				logDebug(me, "TEST - " + hubData + " --- " + hubDataTf + " --- " + count_hub);
				var SurePet_HubId = action.transform("JSONPATH", hubData + ".id", json);
				var SurePet_HubProdId = action.transform("JSONPATH", hubData + ".product_id", json);
				var SurePet_HubHouseholdId = action.transform("JSONPATH", hubData + ".household_id", json);
				var SurePet_HubName = action.transform("JSONPATH", hubData + ".name", json);
				var SurePet_HubSerial = action.transform("JSONPATH", hubData + ".serial_number", json);
				var SurePet_HubMac = action.transform("JSONPATH", hubData + ".mac_address", json);
				var SurePet_HubHardware = action.transform("JSONPATH", hubData + ".status.version.device.hardware", json);
				var SurePet_HubFirmware = action.transform("JSONPATH", hubData + ".status.version.device.firmware", json);
				var SurePet_HubOnline = action.transform("JSONPATH", hubData + ".status.online", json);
				var SurePet_HubLedMode = action.transform("JSONPATH", hubData + ".status.led_mode", json);
				var SurePet_HubPairingMode = action.transform("JSONPATH", hubData + ".status.pairing_mode", json);
				// update general information
				var itemHubId = getItem("SurePet_HubId");
				var itemHubProdId = getItem("SurePet_HubProdId");
				var itemHubHouseholdId = getItem("SurePet_HubHouseholdId");
				var itemHubName = getItem("SurePet_HubName");
				var itemHubSerial = getItem("SurePet_HubSerial");
				var itemHubMac = getItem("SurePet_HubMac");
				var itemHubHardware = getItem("SurePet_HubHardware");
				var itemHubFirmware = getItem("SurePet_HubFirmware");
				var itemHubOnline = getItem("SurePet_HubOnline");
				var itemHubLedMode = getItem("SurePet_HubLedMode");
				var itemHubPairingMode = getItem("SurePet_HubPairingMode");
				postUpdate(itemHubId, SurePet_HubId);
				postUpdate(itemHubProdId, SurePet_HubProdId);
				postUpdate(itemHubHouseholdId, SurePet_HubHouseholdId);
				postUpdate(itemHubName, SurePet_HubName);
				postUpdate(itemHubSerial, SurePet_HubSerial);
				postUpdate(itemHubMac, SurePet_HubMac);
				postUpdate(itemHubHardware, SurePet_HubHardware);
				postUpdate(itemHubFirmware, SurePet_HubFirmware);
				postUpdate(itemHubOnline, SurePet_HubOnline);
				postUpdate(itemHubLedMode, SurePet_HubLedMode);
				postUpdate(itemHubPairingMode, SurePet_HubPairingMode);
			}

            // parse the flap data (product_id = 6)
            var flapData = "$.data.devices["+i+"][?(@.product_id==6)]";
            var flapDataTf = action.transform("JSONPATH", flapData, json);
            if (flapDataTf != NULL) {
				count_flap++;
				logDebug(me, "TEST - " + flapData + " --- " + flapDataTf + " --- " + count_flap);
				var SurePet_FlapId = action.transform("JSONPATH", flapData + ".id", json);
				var SurePet_FlapParentDeviceId = action.transform("JSONPATH", flapData + ".parent_device_id", json);
				var SurePet_FlapProductId = action.transform("JSONPATH", flapData + ".product_id", json);
				var SurePet_FlapHouseholdId = action.transform("JSONPATH", flapData + ".household_id", json);
				var SurePet_FlapName = action.transform("JSONPATH", flapData + ".name", json);
				var SurePet_FlapSerial = action.transform("JSONPATH", flapData + ".serial_number", json);
				var SurePet_FlapMac = action.transform("JSONPATH", flapData + ".mac_address", json);
				var SurePet_FlapCreatedAt = action.transform("JSONPATH", flapData + ".created_at", json);
				var SurePet_FlapUpdatedAt = action.transform("JSONPATH", flapData + ".updated_at", json);
				var SurePet_FlapPairingAt = action.transform("JSONPATH", flapData + ".pairing_at", json);
				// ToDo multiple curfew times
				var SurePet_FlapCurfewEnabled = action.transform("JSONPATH", flapData + ".control.curfew[?(@.enabled)].enabled", json);
				var SurePet_FlapCurfewLocktime = action.transform("JSONPATH", flapData + ".control.curfew[?(@.lock_time)].lock_time", json);
				var SurePet_FlapCurfewUnlocktime = action.transform("JSONPATH", flapData + ".control.curfew[?(@.unlock_time)].unlock_time", json);
				var SurePet_FlapStatusHardware = action.transform("JSONPATH", flapData + ".status.version.device.hardware", json);
				var SurePet_FlapStatusFirmware = action.transform("JSONPATH", flapData + ".status.version.device.firmware", json);
				var SurePet_FlapStatusOnline = action.transform("JSONPATH", flapData + ".status.online", json);
				var SurePet_FlapStatusSignal = action.transform("JSONPATH", flapData + ".status.signal.device_rssi", json);
				var SurePet_FlapStatusSignalHub = action.transform("JSONPATH", flapData + ".status.signal.hub_rssi", json);
				var SurePet_FlapBattery = action.transform("JSONPATH", flapData + ".status.battery", json);

				var itemFlapId = getItem("SurePet_FlapId_"+count_flap);
				var itemFlapParentDeviceId = getItem("SurePet_FlapParentDeviceId_"+count_flap);
				var itemFlapProductId = getItem("SurePet_FlapProductId_"+count_flap);
				var itemFlapHouseholdId = getItem("SurePet_FlapHouseholdId_"+count_flap);
				var itemFlapName = getItem("SurePet_FlapName_"+count_flap);
				var itemFlapSerial = getItem("SurePet_FlapSerial_"+count_flap);
				var itemFlapMac = getItem("SurePet_FlapMac_"+count_flap);
				var itemFlapCreatedAt = getItem("SurePet_FlapCreatedAt_"+count_flap);
				var itemFlapUpdatedAt = getItem("SurePet_FlapUpdatedAt_"+count_flap);
				var itemFlapPairingAt = getItem("SurePet_FlapPairingAt_"+count_flap);
				var itemFlapCurfewEnabled = getItem("SurePet_FlapCurfewEnabled_"+count_flap);
				var itemFlapCurfewLocktime = getItem("SurePet_FlapCurfewLocktime_"+count_flap);
				var itemFlapCurfewUnlocktime = getItem("SurePet_FlapCurfewUnlocktime_"+count_flap);
				var itemFlapStatusHardware = getItem("SurePet_FlapStatusHardware_"+count_flap);
				var itemFlapStatusFirmware = getItem("SurePet_FlapStatusFirmware_"+count_flap);
				var itemFlapStatusOnline = getItem("SurePet_FlapStatusOnline_"+count_flap);
				var itemFlapStatusSignal = getItem("SurePet_FlapStatusSignal_"+count_flap);
				var itemFlapStatusSignalHub = getItem("SurePet_FlapStatusSignalHub_"+count_flap);
				var itemFlapBattery = getItem("SurePet_FlapBattery_"+count_flap);

				postUpdate(itemFlapId, SurePet_FlapId);
				postUpdate(itemFlapParentDeviceId, SurePet_FlapParentDeviceId);
				postUpdate(itemFlapProductId, SurePet_FlapProductId);
				postUpdate(itemFlapHouseholdId, SurePet_FlapHouseholdId);
				postUpdate(itemFlapName, SurePet_FlapName);
				postUpdate(itemFlapSerial, SurePet_FlapSerial);
				postUpdate(itemFlapMac, SurePet_FlapMac);
				postUpdate(itemFlapCreatedAt, SurePet_FlapCreatedAt);
				postUpdate(itemFlapUpdatedAt, SurePet_FlapUpdatedAt);
				postUpdate(itemFlapPairingAt, SurePet_FlapPairingAt);
				postUpdate(itemFlapCurfewEnabled, SurePet_FlapCurfewEnabled);
				postUpdate(itemFlapCurfewLocktime, SurePet_FlapCurfewLocktime);
				postUpdate(itemFlapCurfewUnlocktime, SurePet_FlapCurfewUnlocktime);
				postUpdate(itemFlapStatusHardware, SurePet_FlapStatusHardware);
				postUpdate(itemFlapStatusFirmware, SurePet_FlapStatusFirmware);
				postUpdate(itemFlapStatusOnline, SurePet_FlapStatusOnline);
				postUpdate(itemFlapStatusSignal, SurePet_FlapStatusSignal);
				postUpdate(itemFlapStatusSignalHub, SurePet_FlapStatusSignalHub);
				postUpdate(itemFlapBattery, SurePet_FlapBattery);
			}

            // parse the feeder data (product_id = 4)
            var feederData = "$.data.devices["+i+"][?(@.product_id==4)]";
            var feederDataTf = action.transform("JSONPATH", feederData, json);
            if (feederDataTf != NULL) {
				count_feeder++;
				logDebug(me, "TEST - " + feederData + " --- " + feederDataTf + " --- " + count_feeder);
				var SurePet_FeederId = action.transform("JSONPATH", feederData + ".id", json);
				var SurePet_FeederParentDeviceId = action.transform("JSONPATH", feederData + ".parent_device_id", json);
				var SurePet_FeederProductId = action.transform("JSONPATH", feederData + ".product_id", json);
				var SurePet_FeederHouseholdId = action.transform("JSONPATH", feederData + ".household_id", json);
				var SurePet_FeederName = action.transform("JSONPATH", feederData + ".name", json);
				var SurePet_FeederSerial = action.transform("JSONPATH", feederData + ".serial_number", json);
				var SurePet_FeederMac = action.transform("JSONPATH", feederData + ".mac_address", json);
				var SurePet_FeederCreatedAt = action.transform("JSONPATH", feederData + ".created_at", json);
				var SurePet_FeederUpdatedAt = action.transform("JSONPATH", feederData + ".updated_at", json);
				var SurePet_FeederPairingAt = action.transform("JSONPATH", feederData + ".pairing_at", json);
				var SurePet_FeederBowlsType = action.transform("JSONPATH", feederData + ".control.bowls[?(@.type)].type", json);
				var SurePet_FeederBowlsBigFoodtype = NULL;
				var SurePet_FeederBowlsBigFoodtypeMap = NULL;
				var SurePet_FeederBowlsBigTarget = NULL;
				var SurePet_FeederBowlsSmallLeftFoodtype = NULL;
				var SurePet_FeederBowlsSmallLeftFoodtypeMap = NULL;
				var SurePet_FeederBowlsSmallLeftTarget = NULL;
				var SurePet_FeederBowlsSmallRightFoodtype = NULL;
				var SurePet_FeederBowlsSmallRightFoodtypeMap = NULL;
				var SurePet_FeederBowlsSmallRightTarget = NULL;
				if (SurePet_FeederBowlsType == 1) {
					SurePet_FeederBowlsBigFoodtype = action.transform("JSONPATH", feederData + ".control.bowls.settings[0][?(@.food_type)].food_type", json);
					SurePet_FeederBowlsBigFoodtypeMap = action.transform("MAP", "surehub.map", "food_" + SurePet_FeederBowlsBigFoodtype);
					SurePet_FeederBowlsBigTarget = action.transform("JSONPATH", feederData + ".control.bowls.settings[0][?(@.target)].target", json);
				}
				else if (SurePet_FeederBowlsType == 4) {
					SurePet_FeederBowlsSmallLeftFoodtype = action.transform("JSONPATH", feederData + ".control.bowls.settings[0][?(@.food_type)].food_type", json);
					SurePet_FeederBowlsSmallLeftFoodtypeMap = action.transform("MAP", "surehub.map", "food_" + SurePet_FeederBowlsSmallLeftFoodtype);
					SurePet_FeederBowlsSmallLeftTarget = action.transform("JSONPATH", feederData + ".control.bowls.settings[0][?(@.target)].target", json);
					SurePet_FeederBowlsSmallRightFoodtype = action.transform("JSONPATH", feederData + ".control.bowls.settings[1][?(@.food_type)].food_type", json);
					SurePet_FeederBowlsSmallRightFoodtypeMap = action.transform("MAP", "surehub.map", "food_" + SurePet_FeederBowlsSmallRightFoodtype);
					SurePet_FeederBowlsSmallRightTarget = action.transform("JSONPATH", feederData + ".control.bowls.settings[1][?(@.target)].target", json);
				}
				var SurePet_FeederBowlsLidCloseDelay = action.transform("JSONPATH", feederData + ".control.lid[?(@.close_delay)].close_delay", json);
				var SurePet_FeederBowlsTrainingMode = action.transform("JSONPATH", feederData + ".control[?(@.training_mode)].training_mode", json);
				var SurePet_FeederStatusHardware = action.transform("JSONPATH", feederData + ".status.version.device.hardware", json);
				var SurePet_FeederStatusFirmware = action.transform("JSONPATH", feederData + ".status.version.device.firmware", json);
				var SurePet_FeederStatusOnline = action.transform("JSONPATH", feederData + ".status.online", json);
				var SurePet_FeederStatusSignal = action.transform("JSONPATH", feederData + ".status.signal.device_rssi", json);
				var SurePet_FeederStatusSignalHub = action.transform("JSONPATH", feederData + ".status.signal.hub_rssi", json);
				var SurePet_FeederBattery = action.transform("JSONPATH", feederData + ".status.battery", json);

				var itemFeederId = getItem("SurePet_FeederId_"+count_feeder);
				var itemFeederParentDeviceId = getItem("SurePet_FeederParentDeviceId_"+count_feeder);
				var itemFeederProductId = getItem("SurePet_FeederProductId_"+count_feeder);
				var itemFeederHouseholdId = getItem("SurePet_FeederHouseholdId_"+count_feeder);
				var itemFeederName = getItem("SurePet_FeederName_"+count_feeder);
				var itemFeederSerial = getItem("SurePet_FeederSerial_"+count_feeder);
				var itemFeederMac = getItem("SurePet_FeederMac_"+count_feeder);
				var itemFeederCreatedAt = getItem("SurePet_FeederCreatedAt_"+count_feeder);
				var itemFeederUpdatedAt = getItem("SurePet_FeederUpdatedAt_"+count_feeder);
				var itemFeederPairingAt = getItem("SurePet_FeederPairingAt_"+count_feeder);
				var itemFeederBowlsType = getItem("SurePet_FeederBowlsType_"+count_feeder);
				var itemFeederBowlsBigFoodtype = getItem("SurePet_FeederBowlsBigFoodtype_"+count_feeder);
				var itemFeederBowlsBigFoodtypeMap = getItem("SurePet_FeederBowlsBigFoodtypeMap_"+count_feeder);
				var itemFeederBowlsBigTarget = getItem("SurePet_FeederBowlsBigTarget_"+count_feeder);
				var itemFeederBowlsSmallLeftFoodtype = getItem("SurePet_FeederBowlsSmallLeftFoodtype_"+count_feeder);
				var itemFeederBowlsSmallLeftFoodtypeMap = getItem("SurePet_FeederBowlsSmallLeftFoodtypeMap_"+count_feeder);
				var itemFeederBowlsSmallLeftTarget = getItem("SurePet_FeederBowlsSmallLeftTarget_"+count_feeder);
				var itemFeederBowlsSmallRightFoodtype = getItem("SurePet_FeederBowlsSmallRightFoodtype_"+count_feeder);
				var itemFeederBowlsSmallRightFoodtypeMap = getItem("SurePet_FeederBowlsSmallRightFoodtypeMap_"+count_feeder);
				var itemFeederBowlsSmallRightTarget = getItem("SurePet_FeederBowlsSmallRightTarget_"+count_feeder);
				var itemFeederBowlsLidCloseDelay = getItem("SurePet_FeederBowlsLidCloseDelay_"+count_feeder);
				var itemFeederBowlsTrainingMode = getItem("SurePet_FeederBowlsTrainingMode_"+count_feeder);
				var itemFeederStatusHardware = getItem("SurePet_FeederStatusHardware_"+count_feeder);
				var itemFeederStatusFirmware = getItem("SurePet_FeederStatusFirmware_"+count_feeder);
				var itemFeederStatusOnline = getItem("SurePet_FeederStatusOnline_"+count_feeder);
				var itemFeederStatusSignal = getItem("SurePet_FeederStatusSignal_"+count_feeder);
				var itemFeederStatusSignalHub = getItem("SurePet_FeederStatusSignalHub_"+count_feeder);
				var itemFeederBattery = getItem("SurePet_FeederBattery_"+count_feeder);

				postUpdate(itemFeederId, SurePet_FeederId);
				postUpdate(itemFeederParentDeviceId, SurePet_FeederParentDeviceId);
				postUpdate(itemFeederProductId, SurePet_FeederProductId);
				postUpdate(itemFeederHouseholdId, SurePet_FeederHouseholdId);
				postUpdate(itemFeederName, SurePet_FeederName);
				postUpdate(itemFeederSerial, SurePet_FeederSerial);
				postUpdate(itemFeederMac, SurePet_FeederMac);
				postUpdate(itemFeederCreatedAt, SurePet_FeederCreatedAt);
				postUpdate(itemFeederUpdatedAt, SurePet_FeederUpdatedAt);
				postUpdate(itemFeederPairingAt, SurePet_FeederPairingAt);
				postUpdate(itemFeederBowlsType, SurePet_FeederBowlsType);
				postUpdate(itemFeederBowlsBigFoodtype, SurePet_FeederBowlsBigFoodtype);
				postUpdate(itemFeederBowlsBigFoodtypeMap, SurePet_FeederBowlsBigFoodtypeMap);
				postUpdate(itemFeederBowlsBigTarget, SurePet_FeederBowlsBigTarget);
				postUpdate(itemFeederBowlsSmallLeftFoodtype, SurePet_FeederBowlsSmallLeftFoodtype);
				postUpdate(itemFeederBowlsSmallLeftFoodtypeMap, SurePet_FeederBowlsSmallLeftFoodtypeMap);
				postUpdate(itemFeederBowlsSmallLeftTarget, SurePet_FeederBowlsSmallLeftTarget);
				postUpdate(itemFeederBowlsSmallRightFoodtype, SurePet_FeederBowlsSmallRightFoodtype);
				postUpdate(itemFeederBowlsSmallRightFoodtypeMap, SurePet_FeederBowlsSmallRightFoodtypeMap);
				postUpdate(itemFeederBowlsSmallRightTarget, SurePet_FeederBowlsSmallRightTarget);
				postUpdate(itemFeederBowlsLidCloseDelay, SurePet_FeederBowlsLidCloseDelay);
				postUpdate(itemFeederBowlsTrainingMode, SurePet_FeederBowlsTrainingMode);
				postUpdate(itemFeederStatusHardware, SurePet_FeederStatusHardware);
				postUpdate(itemFeederStatusFirmware, SurePet_FeederStatusFirmware);
				postUpdate(itemFeederStatusOnline, SurePet_FeederStatusOnline);
				postUpdate(itemFeederStatusSignal, SurePet_FeederStatusSignal);
				postUpdate(itemFeederStatusSignalHub, SurePet_FeederStatusSignalHub);
				postUpdate(itemFeederBattery, SurePet_FeederBattery);
			}
		}

		// parse the users
		json_user_list = JSON.parse(json).data.households[0].users;
		logDebug(me, "Surehub Users List json_user_list size: " + json_user_list.length);
		for(var i = 0; i < json_user_list.length; i++)
		{
			var SurePet_UserId = action.transform("JSONPATH", "$.data.households[0].users["+i+"]user.id", json);
			var SurePet_UserName = action.transform("JSONPATH", "$.data.households[0].users["+i+"]user.name", json);

			// update general information
			var itemUserId = getItem("SurePet_UserId_"+(i+1));
			var itemUserName = getItem("SurePet_UserName_"+(i+1));

			postUpdate(itemUserId, SurePet_UserId);
			postUpdate(itemUserName, SurePet_UserName);
		}

		// print the pet ids into log tail
		json_pets_list = JSON.parse(json).data.pets;
		logInfo(me, "Surehub Pets List json_pets_list size: " + json_pets_list.length);
		for(var i = 0; i < json_pets_list.length; i++)
		{
			var SurePet_PetId = action.transform("JSONPATH", "$.data.pets["+i+"].id", json);
			var SurePet_PetPhoto = action.transform("JSONPATH", "$.data.pets["+i+"].photo.location", json);

			var itemPetPhoto = getItem("SurePet_Photo_"+(i+1));

			postUpdate(itemPetPhoto, SurePet_PetPhoto);

			logInfo(me, "Found Pet ID " + SurePet_PetId + "!")
		}
	}
});
