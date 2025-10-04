
import {initializeApp} from 'firebase/app'
import {getAuth} from 'firebase/auth'
import {getFirestore, setDoc, addDoc, doc, connectFirestoreEmulator, collection, onSnapshot,
    deleteDoc, query, where, updateDoc} from 'firebase/firestore'
import {getFunctions, httpsCallable, connectFunctionsEmulator} from 'firebase/functions'
import {onUnmounted, ref} from 'vue'

import {contact_schema, fundraiser_schema, payment_schema, pledge_schema, statement_item_schema, statement_schema} from '@/shared/schemas'

import type {Contact, ContactWithId, Fundraiser, FundraiserWithId, Payment, PaymentWithId, Pledge, PledgeWithId, Statement, StatementItem, StatementItemWithId, StatementWithId} from '@/shared/schemas'
import {gen_stripe_url_schema, type GenStripeUrlInput} from '@/shared/requests'


// Init firebase
export const fire_app = initializeApp({
    projectId: 'colabor-ing',
    apiKey: 'AIzaSyCjYxh-QqVvjEScs6JHBsPwRgIILm8JCPI',
    authDomain: import.meta.env.DEV ? 'colabor-ing.firebaseapp.com' : 'colabor.ing',
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
const fire_send_statement = httpsCallable(fire_functions, 'send_statement')
const fire_create_pledge = httpsCallable(fire_functions, 'create_pledge')


// Get url for fundraiser data
export function data_url(fundraiser:string){
    const base = import.meta.env.DEV ? '/dev' : '/dev'
    return `${base}/${fundraiser}`
}


// Get a URL for a Stripe checkout session with given settings
export async function gen_stripe_url(fundraiser:string,
        {ref_code, currency, cents, recurring, email}:Pledge){
    const resp = await fire_gen_stripe_url(gen_stripe_url_schema.parse({
        ref_code,
        currency,
        recurring,
        email,
        fundraiser,
        cents,
    } as GenStripeUrlInput))
    return (resp.data as {stripe_url:string|null}).stripe_url
}


// Send receipt
export async function send_receipt(data:{fundraiser:string, payment:string}){
    await fire_send_receipt(data)
}


export async function send_statement(data:{fundraiser:string, statement:string, item:string}){
    await fire_send_statement(data)
}


export async function create_pledge(fundraiser:string, pledge:Pledge){
    await fire_create_pledge({fundraiser, pledge})
}


export async function create_fundraiser(id:string, title:string, steward_name:string){

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
        steward: {
            organiser_name: steward_name,
        },
    } as Fundraiser)
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


export async function create_statement(fundraiser:string, data:Statement){
    const statements_col = collection(fire_db, 'fundraisers', fundraiser, 'statements')
    const result = await addDoc(statements_col, statement_schema.parse(data))
    return result.id
}


export async function create_statement_item(fundraiser:string, statement:string, data:StatementItem){
    const items_col =
        collection(fire_db, 'fundraisers', fundraiser, 'statements', statement, 'items')
    const result = await addDoc(items_col, statement_item_schema.parse(data))
    return result.id
}


export async function delete_pledge(fundraiser:string, pledge:string){
    await deleteDoc(doc(fire_db, 'fundraisers', fundraiser, 'pledges', pledge))
}


export async function delete_payment(fundraiser:string, payment:string){
    await deleteDoc(doc(fire_db, 'fundraisers', fundraiser, 'payments', payment))
}

export async function delete_statement_item(fundraiser:string, statement:string, item:string){
    await deleteDoc(doc(fire_db, 'fundraisers', fundraiser, 'statements', statement, 'items', item))
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
            ...pledge_schema.parse(doc.data() as Pledge),
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


// Composable for listening to statements
export function use_statements(fundraiser:string){

    const statements = ref<StatementWithId[]>([])

    const colRef = collection(fire_db, 'fundraisers', fundraiser, 'statements')
    const unsub = onSnapshot(colRef, (snapshot) => {
        statements.value = snapshot.docs.map(doc => ({
            ...statement_schema.parse(doc.data() as Statement),
            id: doc.id,
        })).sort((a, b) => a.start.localeCompare(b.start))
    })

    onUnmounted(() => {
        unsub()
    })

    return statements
}


// Composable for listening to a statement
export function use_statement(fundraiser:string, statement:string){

    const statement_ref = ref<StatementWithId>()

    const fire_ref = doc(fire_db, 'fundraisers', fundraiser, 'statements', statement)
    const unsub = onSnapshot(fire_ref, snapshot => {
        statement_ref.value = {
            ...statement_schema.parse(snapshot.data() as Statement),
            id: statement,
        }
    })

    onUnmounted(() => {
        unsub()
    })

    return statement_ref
}


// Composable for listening to statement items
export function use_statement_items(fundraiser:string, statement:string){

    const items = ref<StatementItemWithId[]>([])

    const colRef = collection(fire_db, 'fundraisers', fundraiser, 'statements', statement, 'items')
    const unsub = onSnapshot(colRef, (snapshot) => {
        items.value = snapshot.docs.map(doc => ({
            ...statement_item_schema.parse(doc.data() as StatementItem),
            id: doc.id,
        }))
    })

    onUnmounted(() => {
        unsub()
    })

    return items
}



// UPDATE

export async function update_pledge(fundraiser:string, pledge:string, partial:Partial<Pledge>){
    const doc_ref = doc(fire_db, 'fundraisers', fundraiser, 'pledges', pledge)
    await updateDoc(doc_ref, pledge_schema.partial().parse(partial))
}


export async function update_payment(fundraiser:string, payment:string, partial:Partial<Payment>){
    const doc_ref = doc(fire_db, 'fundraisers', fundraiser, 'payments', payment)
    await updateDoc(doc_ref, payment_schema.partial().parse(partial))
}


export async function update_statement(fundraiser:string, statement:string,
        partial:Partial<Statement>){
    const doc_ref = doc(fire_db, 'fundraisers', fundraiser, 'statements', statement)
    await updateDoc(doc_ref, statement_schema.partial().parse(partial))
}


export async function update_statement_item(fundraiser:string, statement:string, item:string,
        partial:Partial<StatementItem>){
    const doc_ref = doc(fire_db, 'fundraisers', fundraiser, 'statements', statement, 'items', item)
    await updateDoc(doc_ref, statement_item_schema.partial().parse(partial))
}
