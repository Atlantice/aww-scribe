import { adminDb } from '../lib/firebase-admin'

async function cleanupDuplicates() {
  console.log('🧹 Starting cleanup of duplicate lab results and invoices...')

  // Get all patients
  const patientsSnapshot = await adminDb.collection('patients').get()

  for (const patientDoc of patientsSnapshot.docs) {
    const patientId = patientDoc.id
    const patientData = patientDoc.data()
    console.log(`\nChecking patient: ${patientData.name} (${patientId})`)

    // Clean up lab results
    console.log('  🧪 Checking lab results...')
    const labsSnapshot = await adminDb
      .collection('labResults')
      .where('patientId', '==', patientId)
      .get()

    if (!labsSnapshot.empty) {
      const labGroups = new Map<string, any[]>()

      for (const doc of labsSnapshot.docs) {
        const lab = { id: doc.id, ...doc.data() }
        const key = `${lab.testType}-${lab.orderDate?.toDate?.()?.toISOString() || 'no-date'}`

        if (!labGroups.has(key)) {
          labGroups.set(key, [])
        }
        labGroups.get(key)!.push(lab)
      }

      // Remove duplicates (keep the oldest by createdAt)
      for (const [key, labs] of labGroups.entries()) {
        if (labs.length > 1) {
          console.log(`    Found ${labs.length} duplicates of: ${key}`)

          labs.sort((a, b) => {
            const aTime = a.createdAt?.toDate?.()?.getTime() || 0
            const bTime = b.createdAt?.toDate?.()?.getTime() || 0
            return aTime - bTime
          })

          for (let i = 1; i < labs.length; i++) {
            await adminDb.collection('labResults').doc(labs[i].id).delete()
            console.log(`      ✓ Deleted duplicate lab: ${labs[i].id}`)
          }
        }
      }
    }

    // Clean up invoices
    console.log('  💰 Checking invoices...')
    const invoicesSnapshot = await adminDb
      .collection('invoices')
      .where('patientId', '==', patientId)
      .get()

    if (!invoicesSnapshot.empty) {
      const invoiceGroups = new Map<string, any[]>()

      for (const doc of invoicesSnapshot.docs) {
        const invoice = { id: doc.id, ...doc.data() }
        const key = `${invoice.invoiceNumber}-${invoice.amount}`

        if (!invoiceGroups.has(key)) {
          invoiceGroups.set(key, [])
        }
        invoiceGroups.get(key)!.push(invoice)
      }

      // Remove duplicates (keep the oldest by createdAt)
      for (const [key, invoices] of invoiceGroups.entries()) {
        if (invoices.length > 1) {
          console.log(`    Found ${invoices.length} duplicates of: ${key}`)

          invoices.sort((a, b) => {
            const aTime = a.createdAt?.toDate?.()?.getTime() || 0
            const bTime = b.createdAt?.toDate?.()?.getTime() || 0
            return aTime - bTime
          })

          for (let i = 1; i < invoices.length; i++) {
            await adminDb.collection('invoices').doc(invoices[i].id).delete()
            console.log(`      ✓ Deleted duplicate invoice: ${invoices[i].id}`)
          }
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
