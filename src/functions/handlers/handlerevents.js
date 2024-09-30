const fs = require('fs');

module.exports = (client) => {
    client.handleEvents = async () => {
        const eventFolders = fs.readdirSync(`./src/events`);

        for (const folder of eventFolders) {
            const eventFiles = fs.readdirSync(`./src/events/${folder}`);

            for (const file of eventFiles) {
                const event = require(`../../events/${folder}/${file}`);
                const eventName = file.split(".")[0];
                if (event.once) {
                    client.once(eventName, (...args) => event.execute(...args, client));
                } else {
                    client.on(eventName, (...args) => event.execute(...args, client));
                    client.distube.on(event.name, (...args) => event.execute(...args, client));
                }
                console.log(`Events | Loaded: ${file}`);
            }
        }
    }
}