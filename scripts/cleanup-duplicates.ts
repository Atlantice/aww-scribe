import { adminDb } from '../lib/firebase-admin'

async function cleanupDuplicates() {
  console.log('🧹 Starting cleanup of duplicate medications...')

  // Get all patients
  const patientsSnapshot = await adminDb.collection('patients').get()

  for (const patientDoc of patientsSnapshot.docs) {
    const patientId = patientDoc.id
    const patientData = patientDoc.data()
    console.log(`\nChecking patient: ${patientData.name} (${patientId})`)

    // Get all medications for this patient (no orderBy to avoid index requirement)
    const medsSnapshot = await adminDb
      .collection('medications')
      .where('patientId', '==', patientId)
      .get()

    if (medsSnapshot.empty) {
      console.log('  No medications found')
      continue
    }

    // Group medications by name+dosage to find duplicates
    const medGroups = new Map<string, any[]>()

    for (const doc of medsSnapshot.docs) {
      const med = { id: doc.id, ...doc.data() }
      const key = `${med.name}-${med.dosage}`

      if (!medGroups.has(key)) {
        medGroups.set(key, [])
      }
      medGroups.get(key)!.push(med)
    }

    // Remove duplicates (keep the oldest one by createdAt)
    for (const [key, meds] of medGroups.entries()) {
      if (meds.length > 1) {
        console.log(`  Found ${meds.length} duplicates of: ${key}`)

        // Sort by createdAt to keep the oldest
        meds.sort((a, b) => {
          const aTime = a.createdAt?.toDate?.()?.getTime() || 0
          const bTime = b.createdAt?.toDate?.()?.getTime() || 0
          return aTime - bTime
        })

        // Keep the first (oldest), delete the rest
        for (let i = 1; i < meds.length; i++) {
          await adminDb.collection('medications').doc(meds[i].id).delete()
          console.log(`    ✓ Deleted duplicate: ${meds[i].id}`)
        }
      }
    }
  }

  console.log('\n✅ Cleanup complete!')
}

// Run the cleanup function
cleanupDuplicates()
  .then(() => {
    console.log('\n🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error during cleanup:', error)
    process.exit(1)
  })
