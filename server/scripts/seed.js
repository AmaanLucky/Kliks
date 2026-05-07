/**
 * One-time seed script — imports the 36 existing hardcoded photos into MongoDB.
 * Run: node scripts/seed.js
 */
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Image = require('../models/Image');

const existingPhotos = [
  { title: 'Top of the World',      src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20251106090050.jpg?updatedAt=1762498417675' },
  { title: 'Krishna Leela',         src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20250831182341.jpg?updatedAt=1758111187864' },
  { title: 'Sunset Glow',           src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20250318174302.jpg?updatedAt=17581111876740' },
  { title: 'Car Ride',              src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG_2402.HEIC?updatedAt=1758111186804' },
  { title: 'Red Snake in Green Fields', src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/Picture.jpg?updatedAt=1758111186028' },
  { title: 'Clouds and Peaks',      src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20230918082316.jpg?updatedAt=1758111165976' },
  { title: 'Dual Sky Role',         src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20241015174201.jpg?updatedAt=1758111182197' },
  { title: 'SpotCat',               src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20241105115340.jpg?updatedAt=1758111182073' },
  { title: 'Gods Paintings',        src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20241011182501.jpg?updatedAt=1758111178802' },
  { title: 'Empty Rakes',           src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20240728194728.jpg?updatedAt=1758111178132' },
  { title: 'Lone Tree',             src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20240616132935.jpg?updatedAt=1758111177909' },
  { title: 'BroBuilding',           src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20240917180833.jpg?updatedAt=1758111177602' },
  { title: 'Floating Metals',       src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20240523174802.jpg?updatedAt=1758111177431' },
  { title: 'Gajaraja Visarjan',     src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20240916210943.jpg?updatedAt=1758111176979' },
  { title: 'Luxury Coasts',         src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20240523190553.jpg?updatedAt=1758111176416' },
  { title: 'Street Bells',          src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20240523175718.jpg?updatedAt=1758111175982' },
  { title: 'Vintage Buildings',     src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20240523174620.jpg?updatedAt=1758111173065' },
  { title: 'Lights Out',            src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20240519200329.jpg?updatedAt=1758111171662' },
  { title: 'Gateway',               src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20240523173141.jpg?updatedAt=1758111170356' },
  { title: 'Datson 240Z',           src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20250723152656.jpg?updatedAt=1758111184875' },
  { title: 'Clouds with Eye',       src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20240507173850.jpg?updatedAt=1758111165888' },
  { title: 'Autmun Evening',        src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20240114182428.jpg?updatedAt=1758111165767' },
  { title: 'Reflection Lake',       src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20231001155152.jpg?updatedAt=1758111165486' },
  { title: 'Happy Buddha',          src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20230514185510.jpg?updatedAt=1758111165166' },
  { title: 'PinkishBlue Sky',       src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20221017182800.jpg?updatedAt=1758111164743' },
  { title: 'Ramzan Nights',         src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20230423185256.jpg?updatedAt=1758111164619' },
  { title: 'BluishOrange',          src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20230118182905.jpg?updatedAt=1758111164553' },
  { title: '4-Minar',               src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20230126184556.jpg?updatedAt=1758111164136' },
  { title: 'Clouds and Rays',       src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG-20240930-WA0027.jpg?updatedAt=1758111163673' },
  { title: 'LocoBros',              src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20230518140632.jpg?updatedAt=1758186751882' },
  { title: 'Mystery Clouds',        src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20240514164207.jpg?updatedAt=1758186701406' },
  { title: 'Straight Iron',         src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20220515180808.jpg?updatedAt=1758186701090' },
  { title: 'Ghosted Vruksh',        src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20240114183335.jpg?updatedAt=1758186701101' },
  { title: 'Life Lessons',          src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20220327014551.jpg?updatedAt=1758186700685' },
  { title: 'Larger Platforms',      src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20230111195521.jpg?updatedAt=1758186700092' },
  { title: 'The Lord',              src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG-20241003-WA0004.jpg?updatedAt=1758186697318' },
  { title: 'Looks like a painting', src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20220729154649.jpg?updatedAt=1758192592422' },
  { title: 'Afternoon Bliss',       src: 'https://ik.imagekit.io/AmaanAhmed/KliksImages/IMG20250906123046.jpg?updatedAt=1758111188983' },
];

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  const existing = await Image.countDocuments();
  if (existing > 0) {
    console.log(`DB already has ${existing} images — skipping seed to avoid duplicates.`);
    console.log('Delete the collection manually first if you want to re-seed.');
    process.exit(0);
  }

  // Assign createdAt timestamps spread out over the past year (oldest first)
  const now = Date.now();
  const oneYear = 365 * 24 * 60 * 60 * 1000;
  const step = Math.floor(oneYear / existingPhotos.length);

  const docs = existingPhotos.map((p, i) => ({
    title:     p.title,
    imageUrl:  p.src,
    fileId:    '',
    createdAt: new Date(now - oneYear + i * step),
  }));

  await Image.insertMany(docs);
  console.log(`Seeded ${docs.length} images successfully.`);
  process.exit(0);
}

seed().catch(err => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
