const { PrismaClient } = require("@prisma/client");
const bcrypt = require("bcryptjs");

const db = new PrismaClient();

function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pick(array) {
  return array[Math.floor(Math.random() * array.length)];
}

function setHour(date, hour, minute = 0) {
  const d = new Date(date);
  d.setHours(hour, minute, randomInt(0, 59), 0);
  return d;
}

async function main() {
  console.log("Cleaning existing data (logs, foods, symptoms)…");
  await db.foodLog.deleteMany({});
  await db.symptomLog.deleteMany({});
  await db.food.deleteMany({});
  await db.symptom.deleteMany({});
  // Also clear auth tables to avoid stale credential/provider mismatches
  await db.session.deleteMany({});
  await db.account.deleteMany({});
  await db.verification.deleteMany({});

  // Ensure a user exists (or create a demo user)
  const user = await db.user.upsert({
    where: { email: "test@test.com" },
    update: {},
    create: {
      email: "test@test.com",
      name: "Test User",
      emailVerified: true,
      updatedAt: new Date(),
    },
  });

  // Ensure seeded user can sign in with email+password
  const seededPassword = "password123";
  const passwordHash = await bcrypt.hash(seededPassword, 10);
  // Store hash on User as well (some setups may read from User.password)
  await db.user.update({
    where: { id: user.id },
    data: { password: passwordHash },
  });
  await db.account.upsert({
    where: { id: `seed-email-${user.id}` },
    update: {
      password: passwordHash,
      updatedAt: new Date(),
    },
    create: {
      id: `seed-email-${user.id}`,
      accountId: user.email.toLowerCase(),
      providerId: "email",
      userId: user.id,
      password: passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  // Also create a row with accountId=user.id in case adapter queries by userId
  await db.account.upsert({
    where: { id: `seed-email-userid-${user.id}` },
    update: {
      password: passwordHash,
      updatedAt: new Date(),
    },
    create: {
      id: `seed-email-userid-${user.id}`,
      accountId: user.id,
      providerId: "email",
      userId: user.id,
      password: passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  // Some better-auth versions use providerId "email-password" for credentials
  await db.account.upsert({
    where: { id: `seed-email-password-${user.id}` },
    update: {
      password: passwordHash,
      updatedAt: new Date(),
    },
    create: {
      id: `seed-email-password-${user.id}`,
      accountId: user.email,
      providerId: "email-password",
      userId: user.id,
      password: passwordHash,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });
  console.log("Seeded login:", { email: user.email, password: seededPassword });

  // Seed foods with rough macros per common serving
  const foodProfiles = [
    {
      name: "Chicken Sandwich",
      profile: "well_tolerated",
      calories: 420,
      protein: 32,
      carbs: 44,
      fat: 12,
    },
    {
      name: "Ice cream",
      profile: "bloating_diarrhea",
      calories: 270,
      protein: 4,
      carbs: 31,
      fat: 14,
    },
    {
      name: "Pasta bolognese",
      profile: "usually_fine",
      calories: 560,
      protein: 26,
      carbs: 62,
      fat: 18,
    },
    {
      name: "Fried eggs",
      profile: "mild_bloating_sometimes",
      calories: 180,
      protein: 12,
      carbs: 1,
      fat: 14,
    },
    {
      name: "Avocado toast",
      profile: "bellyache_sometimes",
      calories: 360,
      protein: 8,
      carbs: 34,
      fat: 22,
    },
    {
      name: "White rice with fried salmon",
      profile: "well_tolerated_sometimes_bloating",
      calories: 640,
      protein: 36,
      carbs: 62,
      fat: 24,
    },
    {
      name: "White rice with steamed cod",
      profile: "well_tolerated",
      calories: 500,
      protein: 35,
      carbs: 62,
      fat: 8,
    },
    {
      name: "White Monster energy",
      profile: "well_tolerated",
      calories: 10,
      protein: 0,
      carbs: 2,
      fat: 0,
    },
    {
      name: "Coffee",
      profile: "bloating",
      calories: 2,
      protein: 0,
      carbs: 0,
      fat: 0,
    },
    // Extras
    {
      name: "Yogurt",
      profile: "usually_fine",
      calories: 150,
      protein: 12,
      carbs: 10,
      fat: 5,
    },
    {
      name: "Spicy ramen",
      profile: "bellyache_sometimes",
      calories: 450,
      protein: 12,
      carbs: 60,
      fat: 14,
    },
    {
      name: "Protein shake",
      profile: "well_tolerated",
      calories: 200,
      protein: 25,
      carbs: 6,
      fat: 6,
    },
    {
      name: "Blueberries",
      profile: "well_tolerated",
      calories: 85,
      protein: 1,
      carbs: 21,
      fat: 0.5,
    },
    {
      name: "Pizza",
      profile: "bloating_sometimes",
      calories: 300,
      protein: 12,
      carbs: 33,
      fat: 12,
    },
  ];

  const foods = [];
  for (const f of foodProfiles) {
    const created = await db.food.create({
      data: {
        name: f.name,
        source: "custom",
        calories: f.calories,
        protein: f.protein,
        carbs: f.carbs,
        fat: f.fat,
      },
    });
    foods.push({ ...created, profile: f.profile });
  }

  // Seed symptoms
  const symptomNames = [
    "Bloating",
    "Diarrhea",
    "Bellyache",
    "Heartburn",
    "Nausea",
    "Fatigue",
  ];
  const symptoms = {};
  for (const name of symptomNames) {
    const s = await db.symptom.create({ data: { name } });
    symptoms[name] = s.id;
  }

  // Helper: create symptom logs given a food profile
  const createSymptomsForFood = async (date, profile) => {
    const logs = [];
    const maybe = (prob) => Math.random() < prob;
    switch (profile) {
      case "bloating_diarrhea":
        if (maybe(0.8))
          logs.push({ id: symptoms["Bloating"], severity: randomInt(3, 5) });
        if (maybe(0.6))
          logs.push({ id: symptoms["Diarrhea"], severity: randomInt(2, 4) });
        break;
      case "bloating":
        if (maybe(0.6))
          logs.push({ id: symptoms["Bloating"], severity: randomInt(2, 4) });
        break;
      case "mild_bloating_sometimes":
        if (maybe(0.35))
          logs.push({ id: symptoms["Bloating"], severity: randomInt(1, 2) });
        break;
      case "bellyache_sometimes":
        if (maybe(0.3))
          logs.push({ id: symptoms["Bellyache"], severity: randomInt(1, 3) });
        break;
      case "bloating_sometimes":
        if (maybe(0.4))
          logs.push({ id: symptoms["Bloating"], severity: randomInt(1, 3) });
        break;
      case "well_tolerated_sometimes_bloating":
        if (maybe(0.2))
          logs.push({ id: symptoms["Bloating"], severity: randomInt(1, 2) });
        break;
      case "usually_fine":
      case "well_tolerated":
      default:
        if (maybe(0.1))
          logs.push({ id: symptoms["Fatigue"], severity: randomInt(1, 2) });
        break;
    }

    // Create symptom logs 1-3 hours after the meal time
    for (const l of logs) {
      const when = new Date(date.getTime() + randomInt(60, 180) * 60 * 1000);
      await db.symptomLog.create({
        data: {
          createdAt: when,
          severity: l.severity,
          userId: user.id,
          symptomId: l.id,
        },
      });
    }
  };

  console.log("Seeding 2 months of logs…");
  const today = new Date();
  const start = new Date();
  start.setDate(today.getDate() - 60);

  for (
    let d = new Date(start.getFullYear(), start.getMonth(), start.getDate());
    d <= today;
    d.setDate(d.getDate() + 1)
  ) {
    // Choose 2-4 meals per day at typical hours
    const slots = [
      setHour(d, pick([8, 9, 10]), randomInt(0, 59)),
      setHour(d, pick([12, 13, 14]), randomInt(0, 59)),
      setHour(d, pick([18, 19, 20]), randomInt(0, 59)),
      setHour(d, pick([21, 22]), randomInt(0, 59)),
    ];
    const mealsToday = randomInt(2, 4);
    const times = slots.slice(0, mealsToday).sort((a, b) => a - b);

    for (const time of times) {
      const food = pick(foods);
      await db.foodLog.create({
        data: {
          createdAt: time,
          amount: 1,
          unit: "serving",
          notes: undefined,
          foodId: food.id,
          userId: user.id,
        },
      });

      await createSymptomsForFood(time, food.profile);
    }
  }

  console.log("Done seeding.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
