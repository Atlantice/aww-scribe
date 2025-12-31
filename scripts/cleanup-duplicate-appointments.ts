import { adminDb } from '../lib/firebase-admin'

async function cleanupDuplicateAppointments() {
  console.log('🧹 Starting cleanup of duplicate appointments...')

  // Get all patients
  const patientsSnapshot = await adminDb.collection('patients').get()

  for (const patientDoc of patientsSnapshot.docs) {
    const patientId = patientDoc.id
    const patientData = patientDoc.data()
    console.log(`\nChecking patient: ${patientData.name} (${patientId})`)

    // Get all appointments for this patient
    const appointmentsSnapshot = await adminDb
      .collection('appointments')
      .where('patientId', '==', patientId)
      .get()

    if (!appointmentsSnapshot.empty) {
      console.log(`  Found ${appointmentsSnapshot.size} appointments`)

      // Group by date + type + chief complaint (to find true duplicates)
      const appointmentGroups = new Map<string, any[]>()

      for (const doc of appointmentsSnapshot.docs) {
        const appointment = { id: doc.id, ...doc.data() }

        // Create a key based on date, type, and chief complaint
        const date = appointment.date?.toDate?.()?.toISOString().split('T')[0] || 'no-date'
        const type = appointment.type || 'unknown'
        const complaint = appointment.chiefComplaint?.substring(0, 50) || 'no-complaint'
        const key = `${date}-${type}-${complaint}`

        if (!appointmentGroups.has(key)) {
          appointmentGroups.set(key, [])
        }
        appointmentGroups.get(key)!.push(appointment)
      }

      // Remove duplicates (keep the one with SOAP notes if available, otherwise keep oldest)
      for (const [key, appointments] of appointmentGroups.entries()) {
        if (appointments.length > 1) {
          console.log(`    Found ${appointments.length} duplicates of: ${key}`)

          // Sort: SOAP notes first, then by createdAt
          appointments.sort((a, b) => {
            // Prioritize appointments with SOAP notes
            if (a.soap && !b.soap) return -1
            if (!a.soap && b.soap) return 1

            // Then sort by creation time (keep oldest)
            const aTime = a.createdAt?.toDate?.()?.getTime() || 0
            const bTime = b.createdAt?.toDate?.()?.getTime() || 0
            return aTime - bTime
          })

          // Keep the first one (has SOAP or is oldest), delete the rest
          console.log(`      ✓ Keeping: ${appointments[0].id} (has SOAP: ${!!appointments[0].soap})`)

          for (let i = 1; i < appointments.length; i++) {
            await adminDb.collection('appointments').doc(appointments[i].id).delete()
            console.log(`      ✓ Deleted duplicate: ${appointments[i].id}`)
          }
        }
      }
    }
  }

  console.log('\n✅ Cleanup complete!')
}

// Run the cleanup function
cleanupDuplicateAppointments()
  .then(() => {
    console.log('\n🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error during cleanup:', error)
    process.exit(1)
  })
