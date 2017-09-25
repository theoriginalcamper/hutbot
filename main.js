var logger = require("winston");
var Discord = require("discord.io");
var request = require("request");
var fs = require('fs');

var configObj = require('./botconfig.json')

var commandStatsObj = require('./command_stats.json')
var hutheroObj = require('./hutheroes18.json')
var dcObj = require('./draftchampions.json')

console.log(commandStatsObj);

var list = ['!help', '!huthero', '!hutprofit', '!dc', '!list', '!synergy', '!synergies'];

// Add colorize to debug console
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize : true
});
logger.level = 'debug';

var ServerID = "218987908709744640";
var ModID = "218988487880343552";
var AdminID = "218988126046126081";
var RoleIDObj = {
  "PS4": "222887121495523330",
  "XB1": "222887094870212610"
}

var HutBot = new Discord.Client({
	autorun: true,
	token: configObj["token"]
});

HutBot.on('ready', function() {
    logger.info(HutBot.username + " - (" + HutBot.id + ")");
    logger.info(configObj['channel']);
});

// HutBot.on('debug', function(event) {
// 	console.log(event);
// });

HutBot.on('message', function(user, userID, channelID, message, event) {
    if (message.startsWith("!huthero")) {
    	var regex = /!huthero (.*)/g;
    	var match = regex.exec(message);
    	logger.log('debug', match[1]);

    	commandStatsObj["!huthero"] += 1;
    	logger.debug('HUT Hero Information requested: ' + commandStatsObj["!huthero"] + ' times');


    	if (typeof hutheroObj[match[1].toLowerCase()] == 'undefined') {
    		HutBot.sendMessage({
	    		to: channelID,
	    		message: "**No match found for:** " + match[1]
	    	});
    	} else {
	    	var hero = hutheroObj[match[1].toLowerCase()];
	    	HutBot.sendMessage({
                to: channelID,
                message: hero["picture_link"]
            });
            HutBot.sendMessage({
	    		to: channelID,
	    		message: hero["text"]
	    	});
	    }
    } else if (message.startsWith("!hh")) {
      var regex = /!hh (.*)/g;
    	var match = regex.exec(message);
    	logger.log('debug', match[1]);

    	commandStatsObj["!huthero"] += 1;
    	logger.debug('HUT Hero Information requested: ' + commandStatsObj["!huthero"] + ' times');


    	if (typeof hutheroObj[match[1].toLowerCase()] == 'undefined') {
    		HutBot.sendMessage({
	    		to: channelID,
	    		message: "**No match found for:** " + match[1]
	    	});
    	} else {
	    	var hero = hutheroObj[match[1].toLowerCase()];
	    	HutBot.sendMessage({
                to: channelID,
                message: hero["picture_link"]
            });
            HutBot.sendMessage({
	    		to: channelID,
	    		message: hero["text"]
	    	});
	    }
    } else if (message.startsWith("!hutprofit")) {
        var regex = /!hutprofit (\d+) (\d+)/g;
        var match = regex.exec(message);
        logger.log('debug', match);

        if (match == null) {
            HutBot.sendMessage({
                to: channelID,
                message: "**Please use this format for !hutprofit**\n\n**Usage:** !hutprofit  *Sell_Price*  *Purchased_For_Price*"
            });
        } else {
            logger.log('debug', match[1]);
            logger.log('debug', match[2]);

            var sellPrice = Number(match[1])
            var purchasePrice = Number(match[2])
            var profit = (sellPrice * 0.95) - purchasePrice

            var profitText = profit.toString();

            HutBot.sendMessage({
                to: channelID,
                message: "**Sell Price:**  " + match[1] + "\n**Purchase Price:**  " + match[2] + "\n\n**Profit:**  " + profitText
            });
        }

        commandStatsObj["!hutprofit"] += 1;

        logger.debug('Hut Profit Calculator requested: ' + commandStatsObj["!hutprofit"] + ' times');
    } else if (message.startsWith("!dc")) {
        var regex = /!dc (\D*) (\d{2})/g;
        var match = regex.exec(message);
        logger.log('debug', match);
        logger.log('debug', match[1]);
        logger.log('debug', match[2]);

        commandStatsObj["!dc"] += 1;
        logger.debug('Draft Champions Information requested: ' + commandStatsObj["!dc"] + ' times');

        if (typeof dcObj[match[1].toLowerCase()] == 'undefined') {
            HutBot.sendMessage({
                to: channelID,
                message: "**No match found for:** " + match[1] + " - " + match[2]
            });
        } else {
            var dc = dcObj[match[1].toLowerCase()];
            logger.log('debug', dc);
            if (typeof dc[match[2]] == 'undefined') {
                HutBot.sendMessage({
                    to: channelID,
                    message: "**No match found for:** " + match[1] + " - " + match[2]
                });
            } else {
                HutBot.sendMessage({
                    to: channelID,
                    message: dc[match[2]]["text"]
                });
                HutBot.sendMessage({
                    to: channelID,
                    message: dc[match[2]]["picture_link"]
                });
            }
        }
    } else if (message.startsWith("!synergy") || message.startsWith("!synergies")) {
        var regex = /!synergy/g;
        commandStatsObj["!synergy"] += 1;
        ind_synergylist = "**Individual Synergy List:** \n\
        **DD** - *Dirty Dangler* - +3  to Deking, Hand-Eye and Puck Control\n\
        **PP** - *Passing Playmaker* - +3 to Passing, Poise and Off. Awareness\n\
        **WW** - *Wicked Wristers* - +3 to Wrist Shot Accuracy and Wrist Shot Power\n\
        **OJ** - *Offensive Juggernaut* - +2 to Slap Shot Power, Slap Shot Accuracy, Off. Awareness and Strength\n\
        **S**  - *Speedsters* - +2 to Acceleration, Speed and Agility\n\
        **NP** - *Net Front Presence* - +3 to Hand Eye, Aggressiveness, Balance and Strength\n\
        **FM** - *Faceoff Master* - +4 to Poise and Faceoffs\n\
        **RF** - *Relentless Forecheck* - +3 to Acceleration, Endurance, Stick Checking and Body Checking\n\
        **DR** - *Defensively Responsible* - +3 to Stick Checking, Body Checking, Def. Awareness and Balance\n\
        **HH** - *Heavy Hitters* - +4 to Body Checking, Strength and Def. Awareness\n\
        **IS** - *Iron Shins* - +4 to Def. Awareness, Shot Blocking and Durability\n\n"

        team_synergylist = "**Team Synergy List:**\n\
        **1T** - *One-timer Effeciency* - +3 to Hand-Eye, Passing, Off. Awareness and Slap Shot Power\n\
        **CG** - *Cycle Game* - +2 to Endurance, Agility, Puck Control and Passing\n\
        **B**  - *Long Range Bombers* - +3 to Slap Shot Power, Slap Shot Accuracy and Off. Awareness\n\
        **TT** - *Tape to Tape* - +3 to Passing, Off. Awareness and Poise\n\
        **TW** - *Team Wheel* - +3 to Acceleration, Agility and Speed\n\
        **SB** - *Team Shot Blocking* - +4 to Agility, Balance, Shot Blocking and Durability\n\
        **T**  - *It's A Trap* - +3 to Stick Checking, Def. Awareness and Discipline\n"

        HutBot.sendMessage({
            to: channelID,
            message: ind_synergylist + team_synergylist
        });
    } else if (message.startsWith("!addtag")) {
      var regex = /!addtag <@(\d*)> (\w{3})/g;
      var match = regex.exec(message);

      logger.debug(match[1])
      logger.debug(match[2])

      var userIDtoTag = match[1];
      var systemTag = match[2].toUpperCase();

      logger.debug(systemTag == "XB1");
      currentUser = HutBot.servers[ServerID].members[userID];

      if (currentUser.roles.includes(AdminID) || currentUser.roles.includes(ModID)) {
        if (match == null) {
      		HutBot.sendMessage({
  	    		to: channelID,
  	    		message: "**Usage:** !addtag *@UserMention* *PS4 or XB1*"
  	    	});

  	    	return;
      	} else if (systemTag != "XB1" && systemTag != "PS4") {
          HutBot.sendMessage({
  	    		to: channelID,
  	    		message: "**Usage:** !addtag *@UserMention* *PS4 or XB1* \nPlease tag the user as PS4 or XB1"
  	    	});
        } else {
          logger.debug(RoleIDObj[systemTag]);

          HutBot.addToRole({
            serverID: ServerID,
            roleID: RoleIDObj[systemTag],
            userID: userIDtoTag
          })

          var taggedUserName;
          logger.info(HutBot.servers[ServerID].members[userIDtoTag])

          HutBot.sendMessage({
            to: channelID,
            message: "Tag added"
          })
        }

      } else {
        HutBot.sendMessage({
          to: channelID,
          message: "Sorry this command is for Mod and Admin use only"
        })
      }


    } else if (message.startsWith("!help")) {
    	var regex = /!help (.*)/g;
    	var match = regex.exec(message);


    	commandStatsObj["!help"] += 1;
    	logger.debug('Help requested: ' + commandStatsObj["!help"] + ' times');


    	if (match == null) {
    		HutBot.sendMessage({
	    		to: channelID,
	    		message: "**Usage:** !help *Command*\n\n**Try !list for more commands**"
	    	});

	    	return;
    	}

    	switch(match[1]) {
    		case "!huthero":
    			HutBot.sendMessage({
		    		to: channelID,
		    		message: "**Usage:** !huthero *Team Location*\n\nReturns Required Players 86+ Ovr, # of Gold Collectibles and # of Carbon Collectibles\n\n**Note: Must type New York Islanders or New York Rangers to see those teams' heroes instead of New York**"
		    	});
    			break;
        case "!hutprofit":
            HutBot.sendMessage({
                to: channelID,
                message: "**Usage:** !hutprofit  *Sell_Price*  *Purchased_For_Price*\n\nReturns the total profit made at the current price\n\nProfit = (Sell_Price * 0.95) - Purchased_For_Price"
            });
            break;
        case "!dc":
            HutBot.sendMessage({
                to: channelID,
                message: "**Usage:** !dc *Player_Name*  *Overall_Rating*\n\n**Example:** !dc *malhotra*  *92*"
            });
            break;
    		default:
    			HutBot.sendMessage({
		    		to: channelID,
		    		message: "**No help found for **" +  match[1]
		    	});
    			break;
    	}
    } else if (message.startsWith('!list')) {
    	commandStatsObj["!list"] += 1;
    	logger.debug('List requested: ' + commandStatsObj["!list"] + ' times');

    	HutBot.sendMessage({
            to: channelID,
            message: '**List of commands:** ' + list.join('  ')
        });
    } else if (channelID == configObj["channel"]) {
        if (message.startsWith("!commandstats")) {
            logger.debug('Command Stats requested');

    		HutBot.sendMessage({
	            to: channelID,
	            message: "**Command Stats:**\n\t\t" + "**Hut Hero:** " + commandStatsObj["!huthero"]
	        });
    	}
    }
});

if (process.platform === "win32") {
	var rl = require("readline").createInterface({
		input: process.stdin,
		output: process.stdout
	});

	rl.on("SIGINT", function () {
		process.emit("SIGINT");
	});
}

process.on("SIGINT", function () {

	logger.info(JSON.stringify(commandStatsObj));
	fs.writeFileSync('./command_stats.json', JSON.stringify(commandStatsObj), 'utf-8');
	logger.info('Command Stats JSON written to file.');
  	logger.info("Shutting Down.");
  	process.exit();
});
