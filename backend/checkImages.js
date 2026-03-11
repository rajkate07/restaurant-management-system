const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { MenuItem } = require('./src/models');
const { sequelize } = require('./src/config/db');

const run = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB');

        await sequelize.sync();

        const items = await MenuItem.findAll();
        for (const item of items) {
            console.log(`[${item.name}]: ${item.image}`);
        }
        console.log('Done!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

run();
