const { sequelize, Order, MenuItem } = require('./models');

async function debug() {
    try {
        const orders = await Order.findAll({ include: [MenuItem] });
        console.log('Total Orders:', orders.length);
        if (orders.length > 0) {
            console.log('Sample Order JSON:', JSON.stringify(orders[0].get({ plain: true }), null, 2));
        }
        process.exit(0);
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
}

debug();
