import { adminDb } from '../lib/firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'

async function seedSampleData() {
  console.log('🌱 Starting to seed sample data...')

  // Get Luna's patient ID (assuming she's the first patient)
  const patientsSnapshot = await adminDb.collection('patients').limit(1).get()
  if (patientsSnapshot.empty) {
    console.error('❌ No patients found. Please create a patient first.')
    return
  }

  const patient = patientsSnapshot.docs[0]
  const patientId = patient.id
  const patientData = patient.data()
  console.log(`✅ Found patient: ${patientData.name} (${patientId})`)

  // Seed medications
  console.log('\n💊 Seeding medications...')

  // Check for existing medications first
  const existingMedsSnapshot = await adminDb
    .collection('medications')
    .where('patientId', '==', patientId)
    .get()

  if (!existingMedsSnapshot.empty) {
    console.log(`  ℹ️  Found ${existingMedsSnapshot.size} existing medications, skipping...`)
  } else {
    const medications = [
      {
        patientId,
        name: 'Carprofen',
        dosage: '75mg',
        frequency: 'BID',
        route: 'PO',
        startDate: Timestamp.fromDate(new Date('2025-12-26')),
        endDate: Timestamp.fromDate(new Date('2026-01-02')), // 7 days treatment
        status: 'Active',
        instructions: 'Give with food',
        prescribedBy: 'Dr. Sarah Chen, DVM',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        autoExtracted: false
      },
      {
        patientId,
        name: 'Heartgard Plus',
        dosage: '26-50 lbs',
        frequency: 'Monthly',
        route: 'PO',
        startDate: Timestamp.fromDate(new Date('2025-12-15')),
        status: 'Active',
        instructions: 'Give on the 15th of each month',
        prescribedBy: 'Dr. Sarah Chen, DVM',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
        autoExtracted: false
      }
    ]

    for (const med of medications) {
      const docRef = await adminDb.collection('medications').add(med)
      console.log(`  ✓ Added medication: ${med.name} ${med.dosage} (${docRef.id})`)
    }
  }

  // Seed lab results
  console.log('\n🧪 Seeding lab results...')

  const existingLabsSnapshot = await adminDb
    .collection('labResults')
    .where('patientId', '==', patientId)
    .get()

  if (!existingLabsSnapshot.empty) {
    console.log(`  ℹ️  Found ${existingLabsSnapshot.size} existing lab results, skipping...`)
  } else {
    const labResults = [
      {
        patientId,
        testType: 'CBC (Complete Blood Count)',
        orderDate: Timestamp.fromDate(new Date('2025-12-24')),
        status: 'Pending',
        orderedBy: 'Dr. Sarah Chen, DVM',
        notes: 'Check for infection or inflammation',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      },
      {
        patientId,
        testType: 'Chemistry Panel',
        orderDate: Timestamp.fromDate(new Date('2025-12-24')),
        status: 'Pending',
        orderedBy: 'Dr. Sarah Chen, DVM',
        notes: 'Baseline metabolic panel',
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
    ]

    for (const lab of labResults) {
      const docRef = await adminDb.collection('labResults').add(lab)
      console.log(`  ✓ Added lab result: ${lab.testType} (${docRef.id})`)
    }
  }

  // Seed invoices
  console.log('\n💰 Seeding invoices...')

  const existingInvoicesSnapshot = await adminDb
    .collection('invoices')
    .where('patientId', '==', patientId)
    .get()

  if (!existingInvoicesSnapshot.empty) {
    console.log(`  ℹ️  Found ${existingInvoicesSnapshot.size} existing invoices, skipping...`)
  } else {
    const invoices = [
      {
        patientId,
        invoiceNumber: 'INV-2025-1234',
        amount: 233.00,
        date: Timestamp.fromDate(new Date('2025-12-26')),
        status: 'Pending',
        items: [
          { name: 'Office Visit - Sick', cost: 75.00 },
          { name: 'Carprofen 75mg (14 tablets)', cost: 45.00 },
          { name: 'Physical Examination', cost: 50.00 },
          { name: 'Lab Work - CBC', cost: 63.00 }
        ],
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      }
    ]

    for (const invoice of invoices) {
      const docRef = await adminDb.collection('invoices').add(invoice)
      console.log(`  ✓ Added invoice: ${invoice.invoiceNumber} - $${invoice.amount} (${docRef.id})`)
    }
  }

  console.log('\n✅ Sample data seeding complete!')
  console.log('\n📝 Summary:')
  console.log(`   - Medications: ${existingMedsSnapshot.size} total`)
  console.log(`   - Lab results: ${existingLabsSnapshot.size} total`)
  console.log(`   - Invoices: ${existingInvoicesSnapshot.size} total`)
}

// Run the seed function
seedSampleData()
  .then(() => {
    console.log('\n🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error seeding data:', error)
    process.exit(1)
  })
