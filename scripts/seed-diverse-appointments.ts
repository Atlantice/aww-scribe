import { adminDb } from '../lib/firebase-admin'
import { Timestamp } from 'firebase-admin/firestore'

// Sample data for realistic appointments
const visitTypes = [
  'Wellness Exam',
  'Sick Visit',
  'Follow-up',
  'Vaccination',
  'Dental Cleaning',
] as const

const wellnessScenarios = [
  {
    type: 'Wellness Exam' as const,
    chiefComplaint: 'Annual wellness examination',
    subjective: 'Owner reports that Luna is doing well overall. Eating normally, active, no vomiting or diarrhea. Owner notes she has been more playful lately and enjoys her daily walks.',
    objective: 'BAR (Bright, Alert, Responsive). BCS 5/9. Coat in good condition. Teeth show mild tartar buildup on upper premolars. Heart and lungs auscult normally. Abdomen soft, non-painful. No palpable masses. Eyes, ears, nose clear.',
    assessment: 'Healthy adult Golden Retriever. Mild dental tartar noted. All vaccines up to date.',
    plan: 'Continue current diet and exercise routine. Recommend dental cleaning within next 6 months. Schedule next wellness exam in 1 year. Owner educated on heartworm prevention.',
    vitals: { temperature: '101.2°F', heartRate: '88 bpm', respiratoryRate: '22 rpm', weight: '65 lbs' },
    diagnoses: [{ condition: 'Routine wellness exam', icdCode: 'Z00.00', severity: undefined, isPrimary: true }],
    medications: [],
  },
  {
    type: 'Vaccination' as const,
    chiefComplaint: 'Vaccination appointment - DHPP and Rabies boosters',
    subjective: 'Owner here for scheduled vaccinations. Luna has been healthy with no recent illnesses or concerns. Tolerates vaccines well historically.',
    objective: 'BAR. TPR within normal limits. No contraindications to vaccination. Physical exam unremarkable.',
    assessment: 'Healthy patient presenting for routine vaccinations.',
    plan: 'Administered DHPP and Rabies vaccines. Monitor for any adverse reactions. Next vaccines due in 1 year.',
    vitals: { temperature: '101.4°F', heartRate: '92 bpm', respiratoryRate: '24 rpm', weight: '64 lbs' },
    diagnoses: [{ condition: 'Vaccination administration', icdCode: 'Z23', severity: undefined, isPrimary: true }],
    medications: [],
  },
]

const sickVisitScenarios = [
  {
    type: 'Sick Visit' as const,
    chiefComplaint: 'Limping on right front leg for 3 days after playing at dog park',
    subjective: 'Owner reports Luna has been limping on her right front leg for the past three days. Started after vigorous play session at the dog park. Limping is worse in the morning and after rest. No yelping or visible swelling noted by owner.',
    objective: 'Mild lameness grade 2/5 on right forelimb. Palpation reveals mild pain and heat in right carpal region. No crepitus. Full range of motion maintained. No visible wounds or abrasions.',
    assessment: 'Soft tissue injury (sprain/strain) of right front leg, likely carpal region. Rule out fracture.',
    plan: 'Strict rest for 7-10 days. Cold compress 10-15 min 3x daily for first 48 hours. Carprofen 75mg PO BID with food for pain/inflammation. Recheck in 10 days if not improving. Advised to monitor for worsening or non-weight bearing.',
    vitals: { temperature: '102.1°F', heartRate: '96 bpm', respiratoryRate: '26 rpm', weight: '65 lbs' },
    diagnoses: [{ condition: 'Soft tissue injury - right forelimb', icdCode: 'M79.9', severity: 'mild', isPrimary: true }],
    medications: [
      { name: 'Carprofen', dosage: '75mg', frequency: 'BID', duration: '7 days', route: 'PO', instructions: 'Give with food' },
    ],
  },
  {
    type: 'Sick Visit' as const,
    chiefComplaint: 'Vomiting and decreased appetite for 2 days',
    subjective: 'Owner reports Luna vomited 4 times yesterday and twice this morning. Mostly clear fluid with some yellow bile. Decreased appetite - eating about 25% of normal amount. Still drinking water. No diarrhea. Owner suspects she may have eaten something at the park.',
    objective: 'Mildly dehydrated (estimated 5%). Abdomen mildly tense but no discrete masses palpated. No pain on abdominal palpation. Bowel sounds present. TPR otherwise normal.',
    assessment: 'Acute gastroenteritis, likely dietary indiscretion. Mild dehydration.',
    plan: 'SQ fluids 200ml LRS administered. Cerenia 16mg PO for nausea. Bland diet (boiled chicken and rice) for 3-5 days. Metronidazole 500mg PO BID for 5 days. Recheck if vomiting continues or worsens. Owner to monitor hydration and appetite.',
    vitals: { temperature: '101.8°F', heartRate: '102 bpm', respiratoryRate: '28 rpm', weight: '63 lbs' },
    diagnoses: [
      { condition: 'Acute gastroenteritis', icdCode: 'K52.9', severity: 'moderate', isPrimary: true },
      { condition: 'Mild dehydration', icdCode: 'E86.0', severity: 'mild', isPrimary: false },
    ],
    medications: [
      { name: 'Cerenia', dosage: '16mg', frequency: 'SID', duration: '3 days', route: 'PO', instructions: 'Give 1 hour before meals' },
      { name: 'Metronidazole', dosage: '500mg', frequency: 'BID', duration: '5 days', route: 'PO', instructions: 'Give with small amount of food' },
    ],
  },
  {
    type: 'Sick Visit' as const,
    chiefComplaint: 'Ear infection - shaking head and scratching at left ear',
    subjective: 'Owner reports Luna has been shaking her head frequently and scratching at her left ear for the past week. Some odor noticed from the ear. No visible discharge on the outside but owner suspects infection.',
    objective: 'Left ear canal erythematous with moderate amount of dark brown exudate. Mild yeast odor. No foreign bodies visualized. Tympanic membrane intact. Right ear clear.',
    assessment: 'Left ear otitis externa, likely yeast (Malassezia).',
    plan: 'Ear cleaned with appropriate solution. Prescribed Posatex otic ointment, apply 4 drops to affected ear BID for 7 days. Recheck in 1 week. Advised owner on proper ear cleaning technique.',
    vitals: { temperature: '101.6°F', heartRate: '94 bpm', respiratoryRate: '24 rpm', weight: '65 lbs' },
    diagnoses: [{ condition: 'Otitis externa, left ear', icdCode: 'H60.9', severity: 'moderate', isPrimary: true }],
    medications: [
      { name: 'Posatex', dosage: '4 drops', frequency: 'BID', duration: '7 days', route: 'Otic', instructions: 'Apply to left ear only, massage base of ear after application' },
    ],
  },
]

const followUpScenarios = [
  {
    type: 'Follow-up' as const,
    chiefComplaint: 'Recheck for limping - right front leg',
    subjective: 'Owner reports significant improvement in limping. Luna is much more comfortable and active. Finished Carprofen course. Only minimal limping noted in the morning which resolves quickly.',
    objective: 'Lameness resolved. No pain on palpation of right carpal region. Heat and swelling resolved. Full range of motion. Gait normal.',
    assessment: 'Resolved soft tissue injury of right forelimb.',
    plan: 'Gradual return to normal activity over next week. Start with short leashed walks, gradually increase duration. Monitor for any return of limping. No further medication needed. Follow up PRN.',
    vitals: { temperature: '101.3°F', heartRate: '90 bpm', respiratoryRate: '22 rpm', weight: '65 lbs' },
    diagnoses: [{ condition: 'Resolved soft tissue injury', icdCode: 'Z09', severity: undefined, isPrimary: true }],
    medications: [],
  },
]

async function seedDiverseAppointments() {
  console.log('🌱 Starting to seed diverse appointment data...')

  // Get Luna's patient ID
  const patientsSnapshot = await adminDb.collection('patients').where('name', '==', 'Luna').get()

  if (patientsSnapshot.empty) {
    console.error('❌ Luna patient not found!')
    return
  }

  const lunaId = patientsSnapshot.docs[0].id
  console.log(`  Found Luna (${lunaId})`)

  // Clear existing appointments for Luna
  const existingAppointments = await adminDb.collection('appointments').where('patientId', '==', lunaId).get()
  console.log(`  Deleting ${existingAppointments.size} existing appointments...`)

  for (const doc of existingAppointments.docs) {
    await doc.ref.delete()
  }

  // Generate appointments over the past 6 months
  const now = new Date()
  const appointments: any[] = []

  // Create appointment dates (spread over last 6 months)
  const appointmentDates = [
    new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000), // 6 months ago - Wellness
    new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000), // 4 months ago - Vaccination
    new Date(now.getTime() - 45 * 24 * 60 * 60 * 1000),  // 45 days ago - Sick Visit (GI)
    new Date(now.getTime() - 21 * 24 * 60 * 60 * 1000),  // 21 days ago - Sick Visit (Ear)
    new Date(now.getTime() - 5 * 24 * 60 * 60 * 1000),   // 5 days ago - Sick Visit (Limping)
    new Date(now.getTime() - 2 * 24 * 60 * 60 * 1000),   // 2 days ago - Follow-up (Limping)
  ]

  const scenarios = [
    wellnessScenarios[0],
    wellnessScenarios[1],
    sickVisitScenarios[1],
    sickVisitScenarios[2],
    sickVisitScenarios[0],
    followUpScenarios[0],
  ]

  for (let i = 0; i < appointmentDates.length; i++) {
    const scenario = scenarios[i]
    const appointmentDate = appointmentDates[i]

    const appointmentData = {
      patientId: lunaId,
      date: Timestamp.fromDate(appointmentDate),
      type: scenario.type,
      chiefComplaint: scenario.chiefComplaint,
      status: 'Completed',
      veterinarianName: 'Dr. Sarah Chen',
      soap: {
        subjective: scenario.subjective,
        objective: scenario.objective,
        assessment: scenario.assessment,
        plan: scenario.plan,
        vitals: scenario.vitals,
        diagnoses: scenario.diagnoses,
        medications: scenario.medications,
        procedures: scenario.type === 'Dental Cleaning' ? [
          { name: 'Professional dental cleaning', code: 'DEN001' }
        ] : scenario.type === 'Vaccination' ? [
          { name: 'DHPP vaccine administration', code: 'VAC001' },
          { name: 'Rabies vaccine administration', code: 'VAC002' },
        ] : [],
        followUp: scenario.type === 'Sick Visit' ? {
          required: true,
          timeframe: '7-10 days',
          reason: 'Reassess condition and treatment response',
        } : undefined,
        timestamps: {
          examStarted: appointmentDate,
          examCompleted: new Date(appointmentDate.getTime() + 30 * 60 * 1000), // 30 mins later
          documented: new Date(appointmentDate.getTime() + 35 * 60 * 1000),
          attested: new Date(appointmentDate.getTime() + 36 * 60 * 1000),
        },
        attestation: {
          provider: 'Dr. Sarah Chen',
          timestamp: new Date(appointmentDate.getTime() + 36 * 60 * 1000),
          signature: 'SC',
        },
      },
      createdAt: Timestamp.fromDate(appointmentDate),
      updatedAt: Timestamp.fromDate(appointmentDate),
      aiProcessed: true,
    }

    const docRef = await adminDb.collection('appointments').add(appointmentData)
    console.log(`  ✓ Created ${scenario.type}: ${scenario.chiefComplaint.substring(0, 50)}... (${docRef.id})`)
    appointments.push(appointmentData)
  }

  console.log(`\n✅ Successfully created ${appointments.length} diverse appointments!`)
  console.log('\nAppointment summary:')
  console.log(`  - Wellness Exams: ${appointments.filter(a => a.type === 'Wellness Exam').length}`)
  console.log(`  - Vaccinations: ${appointments.filter(a => a.type === 'Vaccination').length}`)
  console.log(`  - Sick Visits: ${appointments.filter(a => a.type === 'Sick Visit').length}`)
  console.log(`  - Follow-ups: ${appointments.filter(a => a.type === 'Follow-up').length}`)
}

// Run the seed function
seedDiverseAppointments()
  .then(() => {
    console.log('\n🎉 Done!')
    process.exit(0)
  })
  .catch((error) => {
    console.error('\n❌ Error during seeding:', error)
    process.exit(1)
  })
