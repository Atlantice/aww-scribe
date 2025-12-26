/**
 * Test Firebase Admin SDK Connection
 * Run with: node test-firebase-connection.js
 */

const admin = require('firebase-admin');
const fs = require('fs');
const path = require('path');

async function testConnection() {
  try {
    console.log('🔍 Testing Firebase Admin SDK connection...\n');

    // Load service account
    const serviceAccountPath = path.join(__dirname, 'service-account-key.json');
    console.log('📄 Service account file:', serviceAccountPath);

    if (!fs.existsSync(serviceAccountPath)) {
      throw new Error('service-account-key.json not found!');
    }

    const serviceAccount = JSON.parse(fs.readFileSync(serviceAccountPath, 'utf8'));
    console.log('✓ Service account loaded');
    console.log('  - Project ID:', serviceAccount.project_id);
    console.log('  - Client Email:', serviceAccount.client_email);
    console.log('');

    // Initialize Firebase Admin
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      projectId: serviceAccount.project_id,
    });

    const db = admin.firestore();
    db.settings({ ignoreUndefinedProperties: true });
    console.log('✓ Firebase Admin initialized\n');

    // Test 1: Read from Firestore
    console.log('📖 Test 1: Reading from patients collection...');
    try {
      const patientsSnapshot = await db.collection('patients').limit(1).get();
      console.log('✓ Successfully read from Firestore');
      console.log(`  - Found ${patientsSnapshot.size} patient(s)\n`);
    } catch (error) {
      console.error('✗ Failed to read from Firestore:', error.message);
      if (error.code === 7) {
        console.error('  → This is a PERMISSION_DENIED error (code 7)');
        console.error('  → Your service account needs IAM roles granted\n');
      }
      throw error;
    }

    // Test 2: Write to Firestore
    console.log('📝 Test 2: Writing test document to appointments collection...');
    try {
      const testDoc = {
        patientId: 'test',
        date: admin.firestore.Timestamp.now(),
        type: 'Test',
        status: 'Test',
        veterinarianName: 'Test',
        aiProcessed: false,
        createdAt: admin.firestore.Timestamp.now(),
        updatedAt: admin.firestore.Timestamp.now(),
        _test: true, // marker to identify test docs
      };

      const docRef = await db.collection('appointments').add(testDoc);
      console.log('✓ Successfully wrote to Firestore');
      console.log('  - Document ID:', docRef.id);

      // Clean up test document
      await docRef.delete();
      console.log('✓ Test document cleaned up\n');
    } catch (error) {
      console.error('✗ Failed to write to Firestore:', error.message);
      if (error.code === 7) {
        console.error('  → This is a PERMISSION_DENIED error (code 7)');
        console.error('  → Your service account needs the "Cloud Datastore User" IAM role\n');
        console.error('Fix this by running:');
        console.error(`  gcloud projects add-iam-policy-binding ${serviceAccount.project_id} \\`);
        console.error(`    --member="serviceAccount:${serviceAccount.client_email}" \\`);
        console.error(`    --role="roles/datastore.user"\n`);
      }
      throw error;
    }

    console.log('✅ All tests passed! Firebase Admin SDK is working correctly.');

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.error('\nFull error:', error);
    process.exit(1);
  }
}

testConnection();
