import { seedTestPlans, seedTestCases, seedTestPlanTestCases } from '../src/lib/db.js';

async function main() {
  console.log('🌱 Seeding database...');
  
  await seedTestPlans();
  await seedTestCases();
  await seedTestPlanTestCases();
  
  console.log('✅ Database seeded successfully!');
  process.exit(0);
}

main().catch(error => {
  console.error('❌ Seeding failed:', error);
  process.exit(1);
}); 