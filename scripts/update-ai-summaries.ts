import { adminDb } from '../lib/firebase-admin'
import { updatePatientAISummary } from '../lib/firestore-helpers'

async function updateAllAISummaries() {
  console.log('🤖 Updating AI Clinical Summaries for all patients...')

  // Get all patients
  const patientsSnapshot = await adminDb.collection('patients').get()

  console.log(`\nFound ${patientsSnapshot.size} patient(s)`)

  for (const patientDoc of patientsSnapshot.docs) {
    const patientId = patientDoc.id
    const patientData = patientDoc.data()
    console.log(`\n📝 Updating summary for: ${patientData.name} (${patientId})`)

    try {
      await updatePatientAISummary(patientId)
      console.log(`  ✅ Successfully updated AI summary`)
    } catch (error) {
      console.error(`  ❌ Error updating summary:`, error)
    }
  }

  console.log('\n✅ All AI summaries updated!')
}

// Run the update function
updateAllAISummaries()
  .then(() => {
    console.log('\n🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error updating summaries:', error)
    process.exit(1)
  })
