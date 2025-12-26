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
import type { Patient, Appointment, Medication } from '@/types/firestore'

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
