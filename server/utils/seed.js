require('dotenv').config();
const mongoose = require('mongoose');
const User = require('../models/User');
const Item = require('../models/Item');
const Request = require('../models/Request');

// Sample data
const users = [
    { email: 'admin@college.edu', password: 'admin123', role: 'Admin', department: 'Admin' },
    { email: 'lab@college.edu', password: 'lab123', role: 'Staff', department: 'Lab' },
    { email: 'library@college.edu', password: 'library123', role: 'Staff', department: 'Library' },
    { email: 'sports@college.edu', password: 'sports123', role: 'Staff', department: 'Sports' },
    { email: 'hostel@college.edu', password: 'hostel123', role: 'Staff', department: 'Hostel' }
];

const items = [
    // Lab items
    { name: 'Microscope', category: 'Equipment', quantity: 15, minStockLevel: 5, maxStockLevel: 20, location: 'Lab Room 101', department: 'Lab', description: 'Digital microscope for biology lab' },
    { name: 'Laptop', category: 'Electronics', quantity: 25, minStockLevel: 10, maxStockLevel: 40, location: 'Lab Room 102', department: 'Lab', description: 'Dell laptops for computer lab' },
    { name: 'Test Tubes', category: 'Supplies', quantity: 200, minStockLevel: 50, maxStockLevel: 300, location: 'Lab Storage', department: 'Lab', description: 'Glass test tubes for chemistry' },
    { name: 'Safety Goggles', category: 'Safety', quantity: 50, minStockLevel: 20, maxStockLevel: 80, location: 'Lab Room 101', department: 'Lab', description: 'Protective eyewear' },
    // Library items
    { name: 'Physics Textbook', category: 'Books', quantity: 80, minStockLevel: 30, maxStockLevel: 120, location: 'Library Shelf A1', department: 'Library', description: 'Advanced Physics textbooks' },
    { name: 'Study Tables', category: 'Furniture', quantity: 40, minStockLevel: 30, maxStockLevel: 50, location: 'Library Reading Hall', department: 'Library', description: 'Wooden study tables' },
    { name: 'Reference Books', category: 'Books', quantity: 150, minStockLevel: 50, maxStockLevel: 200, location: 'Library Shelf B1', department: 'Library', description: 'Various reference materials' },
    { name: 'Magazines', category: 'Periodicals', quantity: 100, minStockLevel: 30, maxStockLevel: 150, location: 'Library Magazine Rack', department: 'Library', description: 'Monthly magazines' },
    // Sports items
    { name: 'Basketball', category: 'Sports Equipment', quantity: 20, minStockLevel: 10, maxStockLevel: 30, location: 'Sports Room', department: 'Sports', description: 'Official size basketballs' },
    { name: 'Cricket Bat', category: 'Sports Equipment', quantity: 15, minStockLevel: 8, maxStockLevel: 25, location: 'Sports Room', department: 'Sports', description: 'Professional cricket bats' },
    { name: 'Football', category: 'Sports Equipment', quantity: 18, minStockLevel: 10, maxStockLevel: 30, location: 'Sports Room', department: 'Sports', description: 'FIFA approved footballs' },
    { name: 'Tennis Racket', category: 'Sports Equipment', quantity: 12, minStockLevel: 6, maxStockLevel: 20, location: 'Sports Room', department: 'Sports', description: 'Professional tennis rackets' },
    // Hostel items
    { name: 'Bed', category: 'Furniture', quantity: 200, minStockLevel: 180, maxStockLevel: 250, location: 'Hostel Blocks A-D', department: 'Hostel', description: 'Single beds for students' },
    { name: 'Wardrobe', category: 'Furniture', quantity: 200, minStockLevel: 180, maxStockLevel: 250, location: 'Hostel Blocks A-D', department: 'Hostel', description: 'Personal wardrobes' },
    { name: 'Study Lamp', category: 'Electronics', quantity: 150, minStockLevel: 100, maxStockLevel: 200, location: 'Hostel Storage', department: 'Hostel', description: 'LED study lamps' },
    { name: 'Mattress', category: 'Furniture', quantity: 180, minStockLevel: 170, maxStockLevel: 250, location: 'Hostel Storage', department: 'Hostel', description: 'Foam mattresses' },
    // Admin items
    { name: 'Office Chair', category: 'Furniture', quantity: 30, minStockLevel: 20, maxStockLevel: 50, location: 'Admin Building', department: 'Admin', description: 'Ergonomic office chairs' },
    { name: 'Printer', category: 'Electronics', quantity: 10, minStockLevel: 5, maxStockLevel: 15, location: 'Admin Building', department: 'Admin', description: 'Laser printers' },
    { name: 'Stationery Supplies', category: 'Supplies', quantity: 500, minStockLevel: 200, maxStockLevel: 800, location: 'Admin Storage', department: 'Admin', description: 'Pens, papers, folders' },
    { name: 'Filing Cabinet', category: 'Furniture', quantity: 15, minStockLevel: 10, maxStockLevel: 25, location: 'Admin Building', department: 'Admin', description: 'Metal filing cabinets' }
];

const generateUsageHistory = (quantity) => {
    const history = [];
    const now = new Date();
    history.push({ date: new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000), quantity, action: 'added', notes: 'Initial stock' });
    for (let i = 0; i < 15; i++) {
        const daysAgo = Math.floor(Math.random() * 60);
        const usageQuantity = Math.floor(Math.random() * 10) + 1;
        history.push({ date: new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000), quantity: usageQuantity, action: 'requested', notes: 'Regular usage' });
    }
    return history;
};

const seedDatabase = async () => {
    try {
        console.log('🌱 Starting database seeding...');
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('✅ Connected to MongoDB');

        await User.deleteMany({});
        await Item.deleteMany({});
        await Request.deleteMany({});
        console.log('🗑️  Cleared existing data');

        const createdUsers = await User.create(users);
        console.log(`✅ Created ${createdUsers.length} users`);

        const itemsWithHistory = items.map(item => ({ ...item, usageHistory: generateUsageHistory(item.quantity) }));
        const createdItems = await Item.create(itemsWithHistory);
        console.log(`✅ Created ${createdItems.length} items`);

        const sampleRequests = [
            { item: createdItems.find(i => i.name === 'Laptop')._id, quantity: 5, requester: createdUsers.find(u => u.email === 'lab@college.edu')._id, department: 'Lab', status: 'pending', reason: 'Need for new computer science course' },
            { item: createdItems.find(i => i.name === 'Basketball')._id, quantity: 3, requester: createdUsers.find(u => u.email === 'sports@college.edu')._id, department: 'Sports', status: 'approved', approver: createdUsers.find(u => u.role === 'Admin')._id, approvalDate: new Date(), approvalNotes: 'Approved for inter-college tournament' },
            { item: createdItems.find(i => i.name === 'Physics Textbook')._id, quantity: 20, requester: createdUsers.find(u => u.email === 'library@college.edu')._id, department: 'Library', status: 'pending', reason: 'New semester requirements' }
        ];

        const createdRequests = await Request.create(sampleRequests);
        console.log(`✅ Created ${createdRequests.length} sample requests`);

        console.log('\n🎉 Database seeding completed successfully!');
        console.log('\n📝 Demo User Credentials:');
        console.log('Admin: admin@college.edu / admin123');
        console.log('Lab Staff: lab@college.edu / lab123');
        console.log('Library Staff: library@college.edu / library123');
        console.log('Sports Staff: sports@college.edu / sports123');
        console.log('Hostel Staff: hostel@college.edu / hostel123');

        process.exit(0);
    } catch (error) {
        console.error('❌ Seeding error:', error);
        process.exit(1);
    }
};

seedDatabase();
