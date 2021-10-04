fx_version 'adamant'

game 'gta5'

ui_page 'client/html/index.html'

shared_scripts {
	'Config.lua'
}

server_scripts {
	'@mysql-async/lib/MySQL.lua',
	'server/server.lua'
}

client_scripts {
	'client/client.lua'
}

files {
	'client/html/images/*',
	'client/html/images/Brakes/*',
	'client/html/images/Engine/*',
	'client/html/images/Suspension/*',
	'client/html/images/Transmission/*',
	'client/html/images/Tune/*',
	'client/html/index.html',
	'client/html/style.css',
	'client/html/javascript.js',
}