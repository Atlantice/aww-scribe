import { adminDb } from '../lib/firebase-admin'
import * as fs from 'fs'
import * as path from 'path'

async function backupAppointments() {
  console.log('💾 Starting backup of all appointments...')

  // Create backups directory if it doesn't exist
  const backupsDir = path.join(process.cwd(), 'backups')
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir)
    console.log('  ✓ Created backups directory')
  }

  // Get all appointments
  const appointmentsSnapshot = await adminDb.collection('appointments').get()

  console.log(`  Found ${appointmentsSnapshot.size} appointments to backup`)

  // Convert to JSON-serializable format
  const appointments = appointmentsSnapshot.docs.map(doc => {
    const data = doc.data()
    return {
      id: doc.id,
      ...data,
      // Convert Firestore Timestamps to ISO strings
      date: data.date?.toDate?.()?.toISOString() || null,
      createdAt: data.createdAt?.toDate?.()?.toISOString() || null,
      updatedAt: data.updatedAt?.toDate?.()?.toISOString() || null,
    }
  })

  // Create filename with timestamp
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0]
  const filename = `appointments-backup-${timestamp}.json`
  const filepath = path.join(backupsDir, filename)

  // Write to file
  fs.writeFileSync(filepath, JSON.stringify(appointments, null, 2))

  console.log(`\n✅ Backup complete!`)
  console.log(`  📁 File: ${filepath}`)
  console.log(`  📊 Records: ${appointments.length}`)

  return filepath
}

// Run the backup function
backupAppointments()
  .then((filepath) => {
    console.log('\n🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error during backup:', error)
    process.exit(1)
  })
