'use strict';

load(Java.type("java.lang.System").getenv("OPENHAB_CONF")+'/automation/lib/javascript/core/rules.js');

var me = "001_surehub_start.js";
var json_flap_list = []
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

		// parse the hub data (product_id = 1)
		var hubData = "$.data.devices[?(@.product_id==1)]";
		var hubDataTf = action.transform("JSONPATH", hubData, json);
		if (hubDataTf != null) {
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

		// parse the cat flap data (product_id = 6)
		json_flap_list = JSON.parse(json).data.devices.filter(function(item){
			return item.product_id==6;         
		});
		logDebug(me, "Surehub Device List json_flap_list size: " + json_flap_list.length);
		logDebug(me, "Surehub Device List json_flap_list STRING: " + json_flap_list);
		var flapData = "$.data.devices[?(@.product_id==6)]";
		var flapDataTf = action.transform("JSONPATH", flapData, json);
		if (flapDataTf != null) {
			for(var i = 0; i < json_flap_list.length; i++)
			{
				// position 0 is the hub, skip this
				var SurePet_FlapId = action.transform("JSONPATH", "$.data.devices["+(i+1)+"].id", json);
				var SurePet_FlapParentDeviceId = action.transform("JSONPATH", "$.data.devices["+(i+1)+"].parent_device_id", json);
				var SurePet_FlapProductId = action.transform("JSONPATH", "$.data.devices["+(i+1)+"].product_id", json);
				var SurePet_FlapHouseholdId = action.transform("JSONPATH", "$.data.devices["+(i+1)+"].household_id", json);
				var SurePet_FlapName = action.transform("JSONPATH", "$.data.devices["+(i+1)+"].name", json);
				var SurePet_FlapSerial = action.transform("JSONPATH", "$.data.devices["+(i+1)+"].serial_number", json);
				var SurePet_FlapMac = action.transform("JSONPATH", "$.data.devices["+(i+1)+"].mac_address", json);
				var SurePet_FlapCreatedAt = action.transform("JSONPATH", "$.data.devices["+(i+1)+"].created_at", json);
				var SurePet_FlapUpdatedAt = action.transform("JSONPATH", "$.data.devices["+(i+1)+"].updated_at", json);
				var SurePet_FlapPairingAt = action.transform("JSONPATH", "$.data.devices["+(i+1)+"].pairing_at", json);
				// ToDo multiple curfew times
				var SurePet_FlapCurfewEnabled = action.transform("JSONPATH", "$.data.devices["+(i+1)+"].control.curfew[?(@.enabled)].enabled", json);
				var SurePet_FlapCurfewLocktime = action.transform("JSONPATH", "$.data.devices["+(i+1)+"].control.curfew[?(@.lock_time)].lock_time", json);
				var SurePet_FlapCurfewUnlocktime = action.transform("JSONPATH", "$.data.devices["+(i+1)+"].control.curfew[?(@.unlock_time)].unlock_time", json);
				var SurePet_FlapStatusHardware = action.transform("JSONPATH", "$.data.devices["+(i+1)+"].status.version.device.hardware", json);
				var SurePet_FlapStatusFirmware = action.transform("JSONPATH", "$.data.devices["+(i+1)+"].status.version.device.firmware", json);
				var SurePet_FlapStatusOnline = action.transform("JSONPATH", "$.data.devices["+(i+1)+"].status.online", json);
				var SurePet_FlapStatusSignal = action.transform("JSONPATH", "$.data.devices["+(i+1)+"].status.signal.device_rssi", json);
				var SurePet_FlapStatusSignalHub = action.transform("JSONPATH", "$.data.devices["+(i+1)+"].status.signal.hub_rssi", json);
				var SurePet_FlapBattery = action.transform("JSONPATH", "$.data.devices["+(i+1)+"].status.battery", json);

				var itemFlapId = getItem("SurePet_FlapId_"+(i+1));
				var itemFlapParentDeviceId = getItem("SurePet_FlapParentDeviceId_"+(i+1));
				var itemFlapProductId = getItem("SurePet_FlapProductId_"+(i+1));
				var itemFlapHouseholdId = getItem("SurePet_FlapHouseholdId_"+(i+1));
				var itemFlapName = getItem("SurePet_FlapName_"+(i+1));
				var itemFlapSerial = getItem("SurePet_FlapSerial_"+(i+1));
				var itemFlapMac = getItem("SurePet_FlapMac_"+(i+1));
				var itemFlapCreatedAt = getItem("SurePet_FlapCreatedAt_"+(i+1));
				var itemFlapUpdatedAt = getItem("SurePet_FlapUpdatedAt_"+(i+1));
				var itemFlapPairingAt = getItem("SurePet_FlapPairingAt_"+(i+1));
				var itemFlapCurfewEnabled = getItem("SurePet_FlapCurfewEnabled_"+(i+1));
				var itemFlapCurfewLocktime = getItem("SurePet_FlapCurfewLocktime_"+(i+1));
				var itemFlapCurfewUnlocktime = getItem("SurePet_FlapCurfewUnlocktime_"+(i+1));
				var itemFlapStatusHardware = getItem("SurePet_FlapStatusHardware_"+(i+1));
				var itemFlapStatusFirmware = getItem("SurePet_FlapStatusFirmware_"+(i+1));
				var itemFlapStatusOnline = getItem("SurePet_FlapStatusOnline_"+(i+1));
				var itemFlapStatusSignal = getItem("SurePet_FlapStatusSignal_"+(i+1));
				var itemFlapStatusSignalHub = getItem("SurePet_FlapStatusSignalHub_"+(i+1));
				var itemFlapBattery = getItem("SurePet_FlapBattery_"+(i+1));

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