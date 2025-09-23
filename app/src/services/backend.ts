
import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'
import {getFirestore, setDoc, addDoc, doc, connectFirestoreEmulator, collection, onSnapshot, deleteDoc, query, where} from 'firebase/firestore'
import {getFunctions, httpsCallable, connectFunctionsEmulator} from 'firebase/functions'
import {onUnmounted, ref} from 'vue'

import {contact_schema, fundraiser_schema, payment_schema} from '@/schemas'

import type {Contact, ContactWithId, Fundraiser, FundraiserWithId, Payment, PaymentWithId, Pledge, PledgeWithId} from '@/schemas'


// Init firebase
export const fire_app = initializeApp({
    projectId: 'colabor-ing',
    apiKey: 'AIzaSyCjYxh-QqVvjEScs6JHBsPwRgIILm8JCPI',
    authDomain: 'colabor-ing.firebaseapp.com',
})
const fire_functions = getFunctions(fire_app, 'us-west1')
const fire_db = getFirestore(fire_app)
const fire_auth = getAuth(fire_app)
if (import.meta.env.DEV){
    connectFirestoreEmulator(fire_db, '127.0.0.1', 8080)
    connectFunctionsEmulator(fire_functions, '127.0.0.1', 5001)
}


// Access to cloud functions
const fire_gen_stripe_url = httpsCallable(fire_functions, 'gen_stripe_url')
const fire_send_receipt = httpsCallable(fire_functions, 'send_receipt')
const fire_create_pledge = httpsCallable(fire_functions, 'create_pledge')


// Get url for fundraiser data
export function data_url(fundraiser:string){
    const base = import.meta.env.DEV ? '/dev' : '/dev'
    return `${base}/${fundraiser}`
}


// Get a URL for a Stripe checkout session with given settings
export async function gen_stripe_url(fundraiser:string, {ref_code, currency, amount, recurring, email}:Pledge){
    const resp = await fire_gen_stripe_url(
        {ref_code, currency, amount, recurring, email, fundraiser})
    return (resp.data as {stripe_url:string|null}).stripe_url
}


// Send receipt
export async function send_receipt(data:{fundraiser:string, payment:string}){
    await fire_send_receipt(data)
}


export async function create_pledge(fundraiser:string, pledge:Pledge){
    await fire_create_pledge({fundraiser, pledge})
}


export async function create_fundraiser(id:string, title:string){

    if (!fire_auth.currentUser){
        throw new Error("Not signed in")
    }

    // TODO Was throwing error for non-existance which shouldn't do?
    const doc_ref = doc(fire_db, 'fundraisers', id)
    // if ((await getDoc(doc_ref)).exists()){
    //     throw new Error("Fundraiser already exists")
    // }

    const data:Fundraiser = fundraiser_schema.parse({
        title,
        owners: [fire_auth.currentUser.uid],
        contact: {
            email: fire_auth.currentUser.email,
        },
        receipt_thanks: "Thanks for your support!",
    })
    await setDoc(doc_ref, data)
}


export async function create_contact(fundraiser:string, data:Contact){
    const cleaned = contact_schema.parse(data)
    const result = await addDoc(collection(fire_db, 'fundraisers', fundraiser, 'contacts'), cleaned)
    return result.id
}


export async function create_payment(fundraiser:string, data:Payment){
    const cleaned = payment_schema.parse(data)
    await addDoc(collection(fire_db, 'fundraisers', fundraiser, 'payments'), cleaned)
}

export async function delete_payment(fundraiser:string, payment:string){
    await deleteDoc(doc(fire_db, 'fundraisers', fundraiser, 'payments', payment))
}


// Composable for listening to fundraisers
export function use_fundraisers(){

    const fundraisers = ref<FundraiserWithId[]>([])

    const owner = fire_auth.currentUser!.uid
    const fund_query = query(collection(fire_db, 'fundraisers'), where('owners', 'array-contains', owner))
    const unsub = onSnapshot(fund_query, (snapshot) => {
        fundraisers.value = snapshot.docs.map(doc => ({
            ...fundraiser_schema.parse(doc.data() as Fundraiser),
            id: doc.id,
        }))
    })

    onUnmounted(() => {
        unsub()
    })

    return fundraisers
}


// Composable for listening to pledges
export function use_pledges(fundraiser:string){

    const pledges = ref<PledgeWithId[]>([])

    const colRef = collection(fire_db, 'fundraisers', fundraiser, 'pledges')
    const unsub = onSnapshot(colRef, (snapshot) => {
        pledges.value = snapshot.docs.map(doc => ({
            ...doc.data() as Pledge,
            id: doc.id,
        })).sort((a, b) => a.timestamp - b.timestamp)
    })

    onUnmounted(() => {
        unsub()
    })

    return pledges
}


// Composable for listening to contacts
export function use_contacts(fundraiser:string){

    const contacts = ref<ContactWithId[]>([])

    const colRef = collection(fire_db, 'fundraisers', fundraiser, 'contacts')
    const unsub = onSnapshot(colRef, (snapshot) => {
        contacts.value = snapshot.docs.map(doc => ({
            ...contact_schema.parse(doc.data() as Contact),
            id: doc.id,
        }))
    })

    onUnmounted(() => {
        unsub()
    })

    return contacts
}


// Composable for listening to payments
export function use_payments(fundraiser:string){

    const payments = ref<PaymentWithId[]>([])

    const colRef = collection(fire_db, 'fundraisers', fundraiser, 'payments')
    const unsub = onSnapshot(colRef, (snapshot) => {
        payments.value = snapshot.docs.map(doc => ({
            ...payment_schema.parse(doc.data() as Payment),
            id: doc.id,
        })).sort((a, b) => a.date.localeCompare(b.date))
    })

    onUnmounted(() => {
        unsub()
    })

    return payments
}
