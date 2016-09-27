var logger = require("winston");
var DiscordClient = require("discord.io");
var request = require("request");
var fs = require('fs');

var configObj = require('./botconfig.json')

var commandStatsObj = require('./command_stats.json')
var hutheroObj = require('./hutheroes.json')


console.log(commandStatsObj);

var list = ['!help', '!huthero', '!list'];

// Add colorize to debug console
logger.remove(logger.transports.Console);
logger.add(logger.transports.Console, {
    colorize : true
});
logger.level = 'debug';

var HutBot = new DiscordClient({
	autorun: true,
	token: configObj["token"]
});

HutBot.on('ready', function() {
    logger.info(HutBot.username + " - (" + HutBot.id + ")");
    logger.info(configObj['channel'])
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
    } else if (message.startsWith("!synergy")) {
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
    } else if (message.startsWith("!help")) {
    	var regex = /!help (.*)/g;
    	var match = regex.exec(message);


    	commandStatsObj["!help"] += 1;
    	logger.debug('Help requested: ' + commandStatsObj["!help"] + ' times');


    	if (match == null) {
    		HutBot.sendMessage({
	    		to: channelID,
	    		message: "**Usage:** !help *Command*"
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
            message: '**List of commands:** ' + list.join(' ')
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