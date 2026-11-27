'use strict';

const bcrypt = require('bcryptjs');
const { randomUUID } = require('node:crypto');

const DEMO_EMAILS = ['admin@example.com', 'staff@example.com'];

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface) {
    const password = await bcrypt.hash(
      process.env.SEED_USER_PASSWORD || 'ChangeMe@123',
      10,
    );
    const now = new Date();
    const adminId = randomUUID();

    await queryInterface.bulkInsert('users', [
      {
        id: adminId,
        name: 'Admin User',
        email: DEMO_EMAILS[0],
        password,
        role: 'admin',
        created_at: now,
        updated_at: now,
      },
      {
        id: randomUUID(),
        name: 'Staff User',
        email: DEMO_EMAILS[1],
        password,
        role: 'staff',
        created_at: now,
        updated_at: now,
      },
    ]);

    const products = [
      ['Wireless Keyboard', 'KB-1001', 49.99, 120],
      ['USB-C Hub 7-in-1', 'HUB-2040', 34.5, 75],
      ['27" Monitor', 'MON-2701', 219, 18],
      ['Ergonomic Mouse', 'MS-3300', 29.99, 0],
      ['Laptop Sleeve 14"', 'SLV-1400', 19.95, 240],
      ['Noise Cancelling Headset', 'HS-5100', 129, 32],
    ];

    await queryInterface.bulkInsert(
      'products',
      products.map(([name, sku, price, quantity]) => {
        return {
          id: randomUUID(),
          name,
          sku,
          description: null,
          price,
          quantity,
          status: 'active',
          created_by: adminId,
          created_at: now,
          updated_at: now,
        };
      }),
    );
  },

  async down(queryInterface) {
    await queryInterface.sequelize.query(
      'DELETE FROM products WHERE created_by IN (SELECT id FROM users WHERE email IN (:emails))',
      { replacements: { emails: DEMO_EMAILS } },
    );
    await queryInterface.bulkDelete('users', { email: DEMO_EMAILS }, {});
  },
};
