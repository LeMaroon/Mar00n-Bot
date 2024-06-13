let prefix = '^';
let userRanks = JSON.parse(localStorage.getItem('userRanks')) || {};
let bannedUsers = JSON.parse(localStorage.getItem('bannedUsers')) || [];

w.on('chatmod', msg => {
  let chat = str => {
    OWOT.chat.send(str);
  };
  if (!msg.message.startsWith(prefix)) return;

  const args = msg.message.slice(prefix.length).split(' ');
  const cmd = args[0];

  if (msg.nickname === YourWorld.Nickname) {
    userRanks[msg.nickname] = 3;
  }

  if (!isBanned(msg.nickname)) {
    switch (cmd) {
      case 'help':
        chat(`Main Commands: ${prefix}help, ${prefix}about, ${prefix}listranks. | 
			  Admin Commands: ${prefix}setrank, ${prefix}removerank, ${prefix}ban, ${prefix}unban, ${prefix}js |
      		  Owner Commands: ${prefix}changeprefix`);
        break;
      case 'about':
        chat('This bot was created by Mar00n.');
        break;
      case 'listranks':
        handleListRanksCommand();
        break;
      //Admin
      case 'setrank':
        handleSetRankCommand(msg.nickname, args[1], args[2]);
        break;
      case 'removerank':
        handleRemoveRankCommand(msg.nickname, args[1]);
        break;
      case 'ban':
        handleBanCommand(msg.nickname, args[1]);
        break;
      case 'unban':
        handleUnbanCommand(msg.nickname, args[1]);
        break;
      case 'js':
        handleJsCommand(msg.nickname, args[1]);
        break;
      //Owner
      case 'changeprefix':
        handleChangePrefixCommand(msg.nickname, args[1]);
        break;
      default:
        chat('Unknown command. Type `^help` for a list of commands.');
    }
  }
});

function handleSetRankCommand(nickname, targetUser, rank) {
  if (targetUser && rank) {
    if (userRanks[nickname] >= 2) {
      if (/^[0-2]$/.test(rank)) {
        userRanks[targetUser] = parseInt(rank);
        localStorage.setItem('userRanks', JSON.stringify(userRanks));
        chat(
          `${targetUser}'s rank set to: ${rankToName(userRanks[targetUser])}`
        );
      } else {
        chat(
          'Invalid rank. Please provide a valid number (0 [Zero], 1 [One], or 2 [Two.])'
        );
      }
    } else {
      chat("You do not have permission to set other users' ranks.");
    }
  } else {
    chat('Usage: ^setrank <user/id> <rank>');
  }
}

function handleRemoveRankCommand(nickname, targetUser) {
  if (targetUser) {
    if (userRanks[nickname] >= 2) {
      if (userRanks.hasOwnProperty(targetUser)) {
        delete userRanks[targetUser];
        localStorage.setItem('userRanks', JSON.stringify(userRanks));
        chat(`${targetUser}'s rank has been removed.`);
      } else {
        chat(`${targetUser} does not have a rank.`);
      }
    } else {
      chat("You do not have permission to remove other users' ranks.");
    }
  } else {
    chat('Usage: ^removerank <user/id>');
  }
}

function handleBanCommand(nickname, targetUser) {
  if (targetUser) {
    if (userRanks[nickname] >= 2) {
      if (!bannedUsers.includes(targetUser)) {
        bannedUsers.push(targetUser);
        localStorage.setItem('bannedUsers', JSON.stringify(bannedUsers));
        chat(`${targetUser} has been permanently banned from this bot.`);
      } else {
        chat(`${targetUser} is already banned from this bot.`);
      }
    } else {
      chat('You do not have permission to ban users from this bot.');
    }
  } else {
    chat('Usage: ^ban <user/id>');
  }
}

function handleUnbanCommand(nickname, targetUser) {
  if (targetUser) {
    if (userRanks[nickname] >= 2) {
      if (bannedUsers.includes(targetUser)) {
        bannedUsers = bannedUsers.filter(
          bannedUser => bannedUser !== targetUser
        );
        localStorage.setItem('bannedUsers', JSON.stringify(bannedUsers));
        chat(`${targetUser} has been unbanned from the bot.`);
      } else {
        chat(`${targetUser} is not currently banned from this bot.`);
      }
    } else {
      chat('You do not have permission to unban users from this bot.');
    }
  } else {
    chat('Usage: ^unban <user/id>');
  }
}

function handleListRanksCommand() {
  const rankList = Object.entries(userRanks)
    .map(([user, rank]) => `${user}: ${rankToName(rank)}`)
    .join(', ');
  chat(`Current Ranks: ${rankList}`);
}

function handleChangePrefixCommand(nickname, newPrefix) {
  if (userRanks[nickname] === 3) {
    if (newPrefix) {
      prefix = newPrefix;
      localStorage.setItem('prefix', prefix);
      chat(`Prefix changed to: ${prefix}`);
    } else {
      chat('Please provide a new prefix.');
    }
  } else {
    chat(
      'You do not have permission to change the prefix, as this is an owner-only command.'
    );
  }
}

function handleJsCommand(nickname, str) {
  if (userRanks[nickname] >= 2) {
    // Check if user is Admin or higher
    try {
      const result = eval(str);
      chat(`☑ ${result}`);
    } catch (error) {
      chat(`(┛◉Д◉)┛彡┻━┻ ${typeof error} ${error}`);
    }
  } else {
    chat('You do not have permission to use this command.');
  }
}

function isBanned(user) {
  return bannedUsers.includes(user);
}

function rankToName(rank) {
  switch (rank) {
    case 3:
      return 'Owner';
    case 2:
      return 'Admin';
    case 1:
      return 'Moderator';
    default:
      return 'User';
  }
}
