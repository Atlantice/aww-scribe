'use client'

import { useEffect, useState } from 'react'
import {
  collection,
  query,
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
} from 'firebase/firestore'
import { clientDb } from '@/lib/firebase-client'
import type { Patient, Appointment, Medication, LabResult, Invoice } from '@/types/firestore'

function convertTimestamps(data: any): any {
  const converted = { ...data }

  Object.keys(converted).forEach(key => {
    const value = converted[key]

    // Convert Timestamp objects to Date
    if (value instanceof Timestamp) {
      converted[key] = value.toDate()
    }
    // Recursively handle nested objects (but not arrays of primitives)
    else if (value && typeof value === 'object' && !Array.isArray(value)) {
      converted[key] = convertTimestamps(value)
    }
  })

  return converted
}

export function usePatients() {
  const [patients, setPatients] = useState<Patient[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    console.log('🔴 usePatients: Setting up Firestore listener')

    // Remove orderBy to avoid index requirement - we'll sort client-side
    const q = collection(clientDb, 'patients')

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log('🔴 usePatients: Received snapshot with', snapshot.size, 'patients')
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...convertTimestamps(doc.data())
        })) as Patient[]

        // Sort by name client-side
        data.sort((a, b) => (a.name || '').localeCompare(b.name || ''))

        console.log('🔴 usePatients: Converted patients:', data.map(p => ({ id: p.id, name: p.name })))
        setPatients(data)
        setLoading(false)
      },
      (err) => {
        console.error('🔴 usePatients: Error fetching patients:', err)
        console.error('🔴 usePatients: Error code:', err.code)
        console.error('🔴 usePatients: Error message:', err.message)
        setError(err as Error)
        setLoading(false)
      }
    )

    return () => {
      console.log('🔴 usePatients: Cleaning up listener')
      unsubscribe()
    }
  }, [])

  return { patients, loading, error }
}

export function usePatientAppointments(patientId: string | null, limitCount = 10) {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('🟡 usePatientAppointments effect running with patientId:', patientId)

    if (!patientId) {
      console.log('🟡 No patientId, clearing appointments')
      setAppointments([])
      setLoading(false)
      return
    }

    const q = query(
      collection(clientDb, 'appointments'),
      where('patientId', '==', patientId),
      orderBy('date', 'desc'),
      limit(limitCount)
    )

    console.log('🟡 Setting up Firestore listener for patientId:', patientId)

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        console.log('🟡 Firestore snapshot received:', {
          size: snapshot.size,
          docs: snapshot.docs.map(doc => ({ id: doc.id, patientId: doc.data().patientId }))
        })
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...convertTimestamps(doc.data())
        })) as Appointment[]
        setAppointments(data)
        setLoading(false)
      },
      (error) => {
        console.error('🟡 Firestore listener error:', error)
        setLoading(false)
      }
    )

    return () => {
      console.log('🟡 Cleaning up Firestore listener for patientId:', patientId)
      unsubscribe()
    }
  }, [patientId, limitCount])

  return { appointments, loading }
}

export function usePatientMedications(patientId: string | null) {
  const [medications, setMedications] = useState<Medication[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!patientId) {
      setMedications([])
      setLoading(false)
      return
    }

    const q = query(
      collection(clientDb, 'medications'),
      where('patientId', '==', patientId),
      where('status', '==', 'Active'),
      orderBy('startDate', 'desc')
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      })) as Medication[]
      setMedications(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [patientId])

  return { medications, loading }
}

export function usePatient(patientId: string | null) {
  const [patient, setPatient] = useState<Patient | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!patientId) {
      setPatient(null)
      setLoading(false)
      return
    }

    const q = query(
      collection(clientDb, 'patients'),
      where('id', '==', patientId),
      limit(1)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      if (snapshot.empty) {
        setPatient(null)
      } else {
        const doc = snapshot.docs[0]
        const data = {
          id: doc.id,
          ...convertTimestamps(doc.data())
        } as Patient
        setPatient(data)
      }
      setLoading(false)
    })

    return () => unsubscribe()
  }, [patientId])

  return { patient, loading }
}

export function usePatientLabResults(patientId: string | null) {
  const [labResults, setLabResults] = useState<LabResult[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!patientId) {
      setLabResults([])
      setLoading(false)
      return
    }

    const q = query(
      collection(clientDb, 'labResults'),
      where('patientId', '==', patientId),
      orderBy('orderDate', 'desc'),
      limit(20)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      })) as LabResult[]
      setLabResults(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [patientId])

  return { labResults, loading }
}

export function usePatientInvoices(patientId: string | null) {
  const [invoices, setInvoices] = useState<Invoice[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!patientId) {
      setInvoices([])
      setLoading(false)
      return
    }

    const q = query(
      collection(clientDb, 'invoices'),
      where('patientId', '==', patientId),
      orderBy('date', 'desc'),
      limit(20)
    )

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...convertTimestamps(doc.data())
      })) as Invoice[]
      setInvoices(data)
      setLoading(false)
    })

    return () => unsubscribe()
  }, [patientId])

  return { invoices, loading }
}
