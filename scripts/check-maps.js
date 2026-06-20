// Script to check if there are maps in Firestore
// Run with: node scripts/check-maps.js

const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs, query, limit } = require('firebase/firestore');
require('dotenv').config({ path: '.env.local' });

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

async function checkMaps() {
  try {
    console.log('Initializing Firebase...');
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('Fetching maps from Firestore...');
    const mapsRef = collection(db, 'maps');
    const q = query(mapsRef, limit(10));
    const querySnapshot = await getDocs(q);
    
    console.log(`\nFound ${querySnapshot.size} maps in database\n`);
    
    if (querySnapshot.empty) {
      console.log('❌ No maps found in database!');
      console.log('\nTo fix this:');
      console.log('1. Submit a map through the /submit page');
      console.log('2. Or check your Firestore security rules');
      console.log('3. Or verify your Firebase configuration');
    } else {
      console.log('✅ Maps found:\n');
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        console.log(`ID: ${doc.id}`);
        console.log(`Name: ${data.name}`);
        console.log(`Code: ${data.mapCode}`);
        console.log(`Region: ${data.region}`);
        console.log(`---`);
      });
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'permission-denied') {
      console.log('\n⚠️  Permission denied! Check your Firestore security rules.');
      console.log('You may need to update rules to allow read access.');
    }
  }
}

checkMaps();
