const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const { MenuItem } = require('./src/models');
const { sequelize } = require('./src/config/db');

const imageUrls = {
    'Chicken Curry': 'https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=800&q=80',
    'Plain Roti': 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Rumali_roti.jpg',
    'Rasmalai': 'https://images.unsplash.com/photo-1541781550486-81b7a2328578?w=800&q=80',
    'Chicken Tikka': 'https://images.unsplash.com/photo-1599487405967-1f498c4a5202?w=800&q=80',
    'Hara Bhara Kabab': 'https://images.unsplash.com/photo-1601314115161-0d32d72110c7?w=800&q=80',
    'Dal Makhani': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=800&q=80',
    'Shahi Paneer': 'https://images.unsplash.com/photo-1631515243349-e0cb75fb8d3a?w=800&q=80',
    'Gulab Jamun': 'https://images.unsplash.com/photo-1534422298391-e4f8c172dddb?w=800&q=80',
    'Spring Rolls': 'https://images.unsplash.com/photo-1544025162-d76694265947?w=800&q=80',
    'Jeera Rice': 'https://images.unsplash.com/photo-1536304929831-ee1ca9d44906?w=800&q=80',
    'Chicken Biryani': 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80',
    'Veg Biryani': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=800&q=80',
    'Chole Masala': 'https://images.unsplash.com/photo-1552590635-27c2c2128ab4?w=800&q=80',
    'veg pulao': 'https://images.unsplash.com/photo-1512058564366-18510be2db19?w=800&q=80',
    'Mango Lassi': 'https://images.unsplash.com/photo-1550505194-4cdcbef7fa88?w=800&q=80',
    'Kadai Paneer': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=800&q=80',
    'Masala Chai': 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=800&q=80',
    'Lachha Paratha': 'https://images.unsplash.com/photo-1565557613262-d25ab29a21ed?w=800&q=80',
    'Garlic Naan': 'https://upload.wikimedia.org/wikipedia/commons/e/ea/Rumali_roti.jpg',
    'Garlic Bread': 'https://images.unsplash.com/photo-1573140247632-f8fd74997d5c?w=800&q=80'
};

const run = async () => {
    try {
        await sequelize.authenticate();
        console.log('Connected to DB');

        const items = await MenuItem.findAll();
        for (const item of items) {
            for (const key of Object.keys(imageUrls)) {
                if (item.name.toLowerCase().includes(key.toLowerCase()) || key.toLowerCase().includes(item.name.toLowerCase())) {
                    await item.update({ image: imageUrls[key] });
                    console.log(`Updated ${item.name} with new specific image`);
                    break;
                }
            }
        }
        console.log('Done!');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
};

run();
