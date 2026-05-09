import mongoose from 'mongoose'
import bcrypt from 'bcryptjs'
import dotenv from 'dotenv'
import User from './models/user.js'
import Card from './models/trading_card.js'
dotenv.config({ path: "./config.env" });

const seed = async () => {
  await mongoose.connect(process.env.ATLAS_URI, { dbName: "tcs" })
  console.log('Connected to MongoDB')

  const deletedUsers = await User.deleteMany({})
  console.log('Deleted users:', deletedUsers.deletedCount)
  await Card.deleteMany({})

  const hashedPassword = await bcrypt.hash('password123', 10)

  const [alice, bob, charlie, diana, ethan, fiona, george, hannah] = await User.create([
    { username: 'alice', email: 'alice@demo.com', hashedPassword, balance: 500.00 },
    { username: 'bob', email: 'bob@demo.com', hashedPassword, balance: 500.00 },
    { username: 'charlie', email: 'charlie@demo.com', hashedPassword, balance: 500.00 },
    { username: 'diana', email: 'diana@demo.com', hashedPassword, balance: 500.00 },
    { username: 'ethan', email: 'ethan@demo.com', hashedPassword, balance: 500.00 },
    { username: 'fiona', email: 'fiona@demo.com', hashedPassword, balance: 500.00 },
    { username: 'george', email: 'george@demo.com', hashedPassword, balance: 500.00 },
    { username: 'hannah', email: 'hannah@demo.com', hashedPassword, balance: 500.00 },
  ])

const cards = await Card.create([
    { title: 'Luke Skywalker', description: 'The last Jedi Knight and son of Anakin Skywalker. Destroyed the Death Star with a single proton torpedo and brought balance back to the Force.', price: 49.99, imageUrl: '/uploads/card1.jpg', ownerId: alice._id, status: 'market' },
    { title: 'Darth Vader', description: 'Once the Chosen One, now the Emperor\'s most feared enforcer. Commands the Imperial fleet and wields the dark side with terrifying precision.', price: 89.99, imageUrl: '/uploads/card2.jpg', ownerId: alice._id, status: 'market' },
    { title: 'Yoda', description: 'Nine hundred years of wisdom and combat mastery. Trained generations of Jedi and faced Darth Sidious himself in the halls of the Senate.', price: 74.99, imageUrl: '/uploads/card3.jpg', ownerId: alice._id, status: 'market' },
    { title: 'Han Solo', description: 'Made the Kessel Run in less than twelve parsecs. Reluctant hero who became one of the Rebellion\'s most pivotal commanders.', price: 54.99, imageUrl: '/uploads/card4.jpg', ownerId: bob._id, status: 'market' },
    { title: 'Princess Leia', description: 'Diplomat, spy, and founding leader of the Rebel Alliance. Carried the stolen Death Star plans and the hope of the entire galaxy.', price: 44.99, imageUrl: '/uploads/card5.jpg', ownerId: bob._id, status: 'market' },
    { title: 'Boba Fett', description: 'The most feared bounty hunter in the galaxy. Clad in Mandalorian armor and armed with an arsenal of deadly weapons, he always gets his mark.', price: 69.99, imageUrl: '/uploads/card6.jpg', ownerId: bob._id, status: 'market' },
    { title: 'Darth Maul', description: 'Trained from childhood by Darth Sidious to be the perfect killing machine. Wielded a double-bladed lightsaber with terrifying speed and cut down Qui-Gon Jinn in single combat on Naboo.', price: 79.99, imageUrl: '/uploads/card7.jpg', ownerId: charlie._id, status: 'market' },
    { title: 'Darth Revan', description: 'Once a celebrated Jedi hero, Revan fell to the dark side and became a Sith Lord before being redeemed and fighting for the Republic once more. One of the most complex and powerful Force users in galactic history.', price: 119.99, imageUrl: '/uploads/card8.jpg', ownerId: charlie._id, status: 'market' },
    { title: 'Obi-Wan Kenobi', description: 'Jedi Master and general of the Grand Army of the Republic. Trained both Anakin and Luke Skywalker, and became more powerful than Vader could imagine.', price: 64.99, imageUrl: '/uploads/card9.jpg', ownerId: charlie._id, status: 'market' },
    { title: 'Emperor Palpatine', description: 'The phantom menace behind decades of galactic manipulation. Rose from senator to Supreme Chancellor to Emperor, orchestrating the fall of the Jedi.', price: 94.99, imageUrl: '/uploads/card10.jpg', ownerId: diana._id, status: 'market' },
    { title: 'Spider-Man', description: 'Bitten by a radioactive spider, Peter Parker gained incredible powers and a sense of responsibility that drives him to protect New York at all costs.', price: 39.99, imageUrl: '/uploads/card11.jpg', ownerId: diana._id, status: 'market' },
    { title: 'Iron Man', description: 'Tony Stark built a suit of armor in a cave with a box of scraps. Went on to become the cornerstone of the Avengers and sacrifice himself to save the universe.', price: 84.99, imageUrl: '/uploads/card12.jpg', ownerId: diana._id, status: 'market' },
    { title: 'Thor', description: 'Crown prince of Asgard and wielder of Mjolnir. Commands lightning and has fought frost giants, dark elves, and Thanos himself without flinching.', price: 59.99, imageUrl: '/uploads/card13.jpg', ownerId: ethan._id, status: 'market' },
    { title: 'The Hulk', description: 'Dr. Bruce Banner\'s gamma-irradiated alter ego. The angrier he gets, the stronger he becomes — and there is no upper limit to his rage.', price: 54.99, imageUrl: '/uploads/card14.jpg', ownerId: ethan._id, status: 'market' },
    { title: 'Captain America', description: 'A scrawny kid from Brooklyn turned super soldier. Steve Rogers carried his shield through World War II and into the modern era without ever losing his values.', price: 64.99, imageUrl: '/uploads/card15.jpg', ownerId: ethan._id, status: 'market' },
    { title: 'Thanos', description: 'Assembled the Infinity Gauntlet and erased half of all life in the universe with a single snap. Believed he was doing the cosmos a favor.', price: 109.99, imageUrl: '/uploads/card16.jpg', ownerId: fiona._id, status: 'market' },
    { title: 'Black Panther', description: 'T\'Challa rules the most technologically advanced nation on Earth and defends it with the power of the Black Panther, enhanced by the heart-shaped herb.', price: 74.99, imageUrl: '/uploads/card17.jpg', ownerId: fiona._id, status: 'market' },
    { title: 'Doctor Strange', description: 'Former neurosurgeon turned master of the mystic arts. Guards the sanctums of the multiverse and has bargained with Dormammu across infinite time loops.', price: 69.99, imageUrl: '/uploads/card18.jpg', ownerId: fiona._id, status: 'market' },
    { title: 'Wolverine', description: 'Over a century of war, loss, and survival has made Logan the most dangerous mutant alive. His adamantium claws and healing factor make him nearly unkillable.', price: 79.99, imageUrl: '/uploads/card19.jpg', ownerId: george._id, status: 'market' },
    { title: 'Black Widow', description: 'Natasha Romanoff is a world-class spy, martial artist, and former KGB operative. No powers, no armor — just decades of training and an unbreakable will.', price: 44.99, imageUrl: '/uploads/card20.jpg', ownerId: george._id, status: 'market' },
    { title: 'Magneto', description: 'Holocaust survivor turned mutant supremacist. Erik Lehnsherr controls metal with his mind and has clashed with the X-Men for decades over the fate of mutantkind.', price: 84.99, imageUrl: '/uploads/card21.jpg', ownerId: george._id, status: 'market' },
    { title: 'Deadpool', description: 'Wade Wilson\'s cancer was cured by a experimental mutation that gave him Wolverine-level regeneration and absolutely zero filter. Breaks the fourth wall, annoys everyone, and somehow always wins.', price: 64.99, imageUrl: '/uploads/card22.jpg', ownerId: hannah._id, status: 'market' },
    { title: 'Venom', description: 'The alien symbiote bonded with Eddie Brock to create one of Spider-Man\'s most iconic foes. Lethal protector of the innocent, terror to those who prey on the weak.', price: 59.99, imageUrl: '/uploads/card23.jpg', ownerId: hannah._id, status: 'market' },
    { title: 'Galactus', description: 'An entity older than the current universe itself. Galactus consumes entire planets to sustain his existence and is regarded as a force of nature rather than a villain.', price: 149.99, imageUrl: '/uploads/card24.jpg', ownerId: hannah._id, status: 'market' },
  ])

  console.log('Created cards:', cards.length)
  console.log('Seeded successfully')
  await mongoose.disconnect()
}

seed().catch((err) => {
  console.error('Seed failed:', err)
  process.exit(1)
})