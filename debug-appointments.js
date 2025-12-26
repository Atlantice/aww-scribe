/**
 * Debug script to check appointments and patient IDs
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

async function debugAppointments() {
  try {
    console.log('🔍 Debugging appointments and patient IDs...\n');

    // Load service account
    const serviceAccountPath = path.join(__dirname, 'service-account-key.json');
    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error('service-account-key.json not found!');
    }

    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));

    // Initialize Firebase Admin
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });

    const db = admin.firestore();
    db.settings({ ignoreUndefinedProperties: true });

    // Get all patients
    console.log('📋 PATIENTS:');
    const patientsSnapshot = await db.collection('patients').get();
    console.log(`Found ${patientsSnapshot.size} patient(s)\n`);

    patientsSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`  ID: ${doc.id}`);
      console.log(`  Name: ${data.name}`);
      console.log(`  Species: ${data.species}`);
      console.log('');
    });

    // Get all appointments
    console.log('\n📅 APPOINTMENTS:');
    const appointmentsSnapshot = await db.collection('appointments').orderBy('createdAt', 'desc').limit(10).get();
    console.log(`Found ${appointmentsSnapshot.size} appointment(s)\n`);

    appointmentsSnapshot.forEach(doc => {
      const data = doc.data();
      console.log(`  ID: ${doc.id}`);
      console.log(`  Patient ID: ${data.patientId}`);
      console.log(`  Type: ${data.type}`);
      console.log(`  Status: ${data.status}`);
      console.log(`  Date: ${data.date?.toDate?.() || data.date}`);
      console.log(`  Has SOAP: ${!!data.soap}`);
      console.log(`  Created: ${data.createdAt?.toDate?.() || data.createdAt}`);
      console.log('');
    });

    // Check for patient ID mismatches
    console.log('\n🔍 CHECKING FOR MISMATCHES:');
    const patientIds = patientsSnapshot.docs.map(doc => doc.id);
    const appointmentPatientIds = appointmentsSnapshot.docs.map(doc => doc.data().patientId);

    const unmatchedAppointments = appointmentPatientIds.filter(id => !patientIds.includes(id));
    if (unmatchedAppointments.length > 0) {
      console.log('⚠️  Found appointments with patient IDs that don\'t exist:');
      unmatchedAppointments.forEach(id => console.log(`  - ${id}`));
    } else {
      console.log('✓ All appointments have valid patient IDs');
    }

    console.log('\n✅ Debug complete!');

  } catch (error) {
    console.error('\n❌ Debug failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

debugAppointments();
