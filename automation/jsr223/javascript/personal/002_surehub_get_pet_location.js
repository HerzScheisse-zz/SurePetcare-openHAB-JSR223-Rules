'use strict';

load(Java.type("java.lang.System").getenv("OPENHAB_CONF")+'/automation/lib/javascript/core/rules.js');

var me = "002_surehub_get_pet_location.js";
var json_pet_list = []

JSRule({
	name: "SureHub GET Pet Loc",
	description: "Line: "+__LINE__,
	triggers: [ 
		TimerTrigger("0 0/5 * * * ?") // every 5 minutes
	],
	execute: function( module, input){
		// Enter your pet ids here (see how to in the openhab community thread)
		var pet1Str = "YOUR_PET_ID_HERE"
		var pet2Str = "YOUR_PET_ID_HERE"
		var token = "YOUR_AUTH_TOKEN_HERE"
		var timeout = 5000;
		var httpmethod = "GET";
		// you may adjust this url
		var url = "https://app.api.surehub.io/api/pet/?pet=" + pet1Str + "&pet=" + pet2Str + "&with%5B%5D=status"

		var json = executeCommandLineAndWaitResponse("/etc/openhab2/scripts/surehub.sh " + httpmethod + " " + token + " " +url, timeout);

		logDebug("results executeCommandLineAndWaitResponse: ", json);

		if (json == "") return;

		json_pet_list = JSON.parse(json).data;
		logDebug(me, "Surehub Pets List json_pet_list size: " + json_pet_list.length);
		for(var i = 0; i < json_pet_list.length; i++)
		{
			var action = getAction("Transformation").static;

			var SurePet_Id = action.transform("JSONPATH", "$.data["+i+"][?(@.id)].id", json);
			var SurePet_Name = action.transform("JSONPATH", "$.data["+i+"][?(@.name)].name", json);
			var SurePet_Gender = action.transform("JSONPATH", "$.data["+i+"][?(@.gender)].gender", json);
			var SurePet_Birthday = action.transform("JSONPATH", "$.data["+i+"][?(@.date_of_birth)].date_of_birth", json);
			var SurePet_Weight = action.transform("JSONPATH", "$.data["+i+"][?(@.weight)].weight", json);
			var SurePet_Comments = action.transform("JSONPATH", "$.data["+i+"][?(@.comments)].comments", json);
			var SurePet_HouseholdId = action.transform("JSONPATH", "$.data["+i+"][?(@.household_id)].household_id", json);
			var SurePet_BreedId = action.transform("JSONPATH", "$.data["+i+"][?(@.breed_id)].breed_id", json);
			var SurePet_FoodTypeId = action.transform("JSONPATH", "$.data["+i+"][?(@.food_type_id)].food_type_id", json);
			var SurePet_PhotoId = action.transform("JSONPATH", "$.data["+i+"][?(@.photo_id)].photo_id", json);
			var SurePet_SpeciesId = action.transform("JSONPATH", "$.data["+i+"][?(@.species_id)].species_id", json);
			var SurePet_TagId = action.transform("JSONPATH", "$.data["+i+"][?(@.tag_id)].tag_id", json);
			var SurePet_Version = action.transform("JSONPATH", "$.data["+i+"][?(@.version)].version", json);
			var SurePet_CreatedAt = action.transform("JSONPATH", "$.data["+i+"][?(@.created_at)].created_at", json);
			var SurePet_UpdatedAt = action.transform("JSONPATH", "$.data["+i+"][?(@.updated_at)].updated_at", json);
			// ToDo Add conditions. there can be multiple ones.
			// JSON response is either user_id (manuell setting) or device_id
			var SurePet_User = action.transform("JSONPATH", "$.data["+i+"].status.activity[?(@.user_id)].user_id", json);
			var SurePet_Device = action.transform("JSONPATH", "$.data["+i+"].status.activity[?(@.device_id)].device_id", json);
			var SurePet_Where = action.transform("JSONPATH", "$.data["+i+"].status.activity[?(@.where)].where", json);
			var SurePet_Since = action.transform("JSONPATH", "$.data["+i+"].status.activity[?(@.since)].since", json);
			// converted Values with MAP
			var SurePet_WhereMap = action.transform("MAP", "surehub.map", "location_" + SurePet_Where);
			var SurePet_BreedIdMap = action.transform("MAP", "surehub.map", "breed_" + SurePet_BreedId);
			var SurePet_GenderMap = action.transform("MAP", "surehub.map", "gender_" + SurePet_Gender);
			var SurePet_FoodTypeMap = action.transform("MAP", "surehub.map", "food_" + SurePet_FoodTypeId);

			// Feeder Data
			var SurePet_FeedDevice = action.transform("JSONPATH", "$.data["+i+"].status.feeding[?(@.device_id)].device_id", json);
			var SurePet_FeedChangeLeft = action.transform("JSONPATH", "$.data["+i+"].status.feeding[?(@.change[0])].change[0]", json);
			var SurePet_FeedChangeRight = action.transform("JSONPATH", "$.data["+i+"].status.feeding[?(@.change[1])].change[1]", json);
			var SurePet_FeedAt = action.transform("JSONPATH", "$.data["+i+"].status.feeding[?(@.at)].at", json);

			// update general information
			var itemId = getItem("SurePet_Id_"+(i+1));
			var itemName = getItem("SurePet_Name_"+(i+1));
			var itemGender = getItem("SurePet_Gender_"+(i+1));
			var itemBirthday = getItem("SurePet_Birthday_"+(i+1));
			var itemWeight = getItem("SurePet_Weight_"+(i+1));
			var itemComments = getItem("SurePet_Comments_"+(i+1));
			var itemHouseholdId = getItem("SurePet_HouseholdId_"+(i+1));
			var itemBreedId = getItem("SurePet_BreedId_"+(i+1));
			var itemFoodTypeId = getItem("SurePet_FoodTypeId_"+(i+1));
			var itemPhotoId = getItem("SurePet_PhotoId_"+(i+1));
			var itemSpeciesId = getItem("SurePet_SpeciesId_"+(i+1));
			var itemTagId = getItem("SurePet_TagId_"+(i+1));
			var itemVersionId = getItem("SurePet_Version_"+(i+1));
			var itemCreatedAt = getItem("SurePet_CreatedAt_"+(i+1));
			var itemUpdatedAt = getItem("SurePet_UpdatedAt_"+(i+1));
			var itemUserId = getItem("SurePet_User_"+(i+1));
			var itemDeviceId = getItem("SurePet_Device_"+(i+1));
			var itemEnteredThrough = getItem("SurePet_EnteredThrough_"+(i+1));
			var itemWhere = getItem("SurePet_Where_"+(i+1));
			var itemSince = getItem("SurePet_Since_"+(i+1));
			//
			var itemWhereMap = getItem("SurePet_WhereMap_"+(i+1));
			var itemBreedIdMap = getItem("SurePet_BreedIdMap_"+(i+1));
			var itemGenderMap = getItem("SurePet_GenderMap_"+(i+1));
			var itemFoodTypeMap = getItem("SurePet_FoodTypeMap_"+(i+1));
			// Feeder Data
			var itemFeedDevice = getItem("SurePet_FeedDevice_"+(i+1));
			var itemFeedChangeLeft = getItem("SurePet_FeedChangeLeft_"+(i+1));
			var itemFeedChangeRight = getItem("SurePet_FeedChangeRight_"+(i+1));
			var itemFeedAt = getItem("SurePet_FeedAt_"+(i+1));

			postUpdate(itemId, SurePet_Id);
			postUpdate(itemName, SurePet_Name);
			postUpdate(itemGender, SurePet_Gender);
			postUpdate(itemBirthday, SurePet_Birthday);
			postUpdate(itemWeight, SurePet_Weight);
			postUpdate(itemComments, SurePet_Comments);
			postUpdate(itemHouseholdId, SurePet_HouseholdId);
			postUpdate(itemBreedId, SurePet_BreedId);
			postUpdate(itemFoodTypeId, SurePet_FoodTypeId);
			postUpdate(itemPhotoId, SurePet_PhotoId);
			postUpdate(itemSpeciesId, SurePet_SpeciesId);
			postUpdate(itemTagId, SurePet_TagId);
			postUpdate(itemVersionId, SurePet_Version);
			postUpdate(itemCreatedAt, SurePet_CreatedAt);
			postUpdate(itemUpdatedAt, SurePet_UpdatedAt);
			postUpdate(itemUserId, SurePet_User);
			postUpdate(itemDeviceId, SurePet_Device);
			postUpdate(itemWhere, SurePet_Where);
			postUpdate(itemSince, SurePet_Since);
			if (SurePet_User != null) {
				var UUserId_1 = items["SurePet_UserId_1"];
				var UUserName_1 = items["SurePet_UserName_1"];
				var UUserId_2 = items["SurePet_UserId_2"];
				var UUserName_2 = items["SurePet_UserName_2"];
				var UUserId_3 = items["SurePet_UserId_3"];
				var UUserName_3 = items["SurePet_UserName_3"];

				if (SurePet_User == UUserId_1) { postUpdate(itemEnteredThrough, UUserName_1); }
				else if (SurePet_User == UUserId_2) { postUpdate(itemEnteredThrough, UUserName_2); }
				else if (SurePet_User == UUserId_3) { postUpdate(itemEnteredThrough, UUserName_3); }
			}
			if (SurePet_Device != null) {
				var DDeviceId = items["SurePet_FlapId_1"];
				var DDeviceName = items["SurePet_FlapName_1"];

				if (SurePet_Device == DDeviceId) {
					postUpdate(itemEnteredThrough, DDeviceName);
				}
			}
			//
			postUpdate(itemWhereMap, SurePet_WhereMap);
			postUpdate(itemBreedIdMap, SurePet_BreedIdMap);
			postUpdate(itemGenderMap, SurePet_GenderMap);
			postUpdate(itemFoodTypeMap, SurePet_FoodTypeMap);

			// Feeder Data
			postUpdate(itemFeedDevice, SurePet_FeedDevice);
			postUpdate(itemFeedChangeLeft, SurePet_FeedChangeLeft);
			postUpdate(itemFeedChangeRight, SurePet_FeedChangeRight);
			postUpdate(itemFeedAt, SurePet_FeedAt);
			logDebug(me, "The pet " + (i + 1) + " information was updated!")
		}
	}
});