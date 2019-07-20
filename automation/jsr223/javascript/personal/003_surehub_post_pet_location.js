'use strict';

load(Java.type("java.lang.System").getenv("OPENHAB_CONF")+'/automation/lib/javascript/core/rules.js');

var me = "003_surehub_post_pet_location.js";

JSRule({
	name: "SureHub POST Pet Loc",
	description: "Line: "+__LINE__,
	triggers: [ 
		ItemCommandTrigger("SurePet_WhereCommand_1"),
		ItemCommandTrigger("SurePet_WhereCommand_2")
	],
	execute: function( module, input){
		var triggeringItem = input.event.itemName;
		var itemId = triggeringItem.split("_")[2];
		var petId = items["SurePet_Id_" + itemId];
		var command = input.command;

		if (command == "INSIDE") {
			var loc_where = 1
		}
		else if (command == "OUTSIDE") {
			var loc_where = 2
		}
		var now = new Date();
		var gmtdate = now.toJSON();
		var body = JSON.stringify({where:loc_where, since:gmtdate});
		var token = "YOUR_AUTH_TOKEN_HERE"
		var timeout = 5000;
		var url = "https://app.api.surehub.io/api/pet/" + petId + "/position";

		var request = executeCommandLine("curl@@-H@@Content-Type: application/json@@-H@@Accept: application/json@@-H@@Authorization: Bearer " + token + "@@-d@@" + body + "@@" + url, timeout)

		// TODO error handling request
		logDebug(me, "Surehub Pet (" + petId + ") Location (" + loc_where + ") updated (" + gmtdate + ")");
	}
});
