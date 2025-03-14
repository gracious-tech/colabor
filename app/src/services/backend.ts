
import {initializeApp} from 'firebase/app'
import {getFirestore, setDoc, doc, connectFirestoreEmulator} from 'firebase/firestore'
import {getFunctions, httpsCallable, connectFunctionsEmulator} from 'firebase/functions'


export interface Pledge {
    id:string
    fundraiser:string
    currency:string
    amount:number
    recurring:'single'|'month'
    means:string
    name:string
    email:string
    appreciate:string|null
}


// Init firebase
const fire_app = initializeApp({projectId: 'colabor-ing'})
const fire_functions = getFunctions(fire_app)
const fire_db = getFirestore(fire_app)
if (import.meta.env.DEV){
    connectFirestoreEmulator(fire_db, '127.0.0.1', 8080)
    connectFunctionsEmulator(fire_functions, '127.0.0.1', 5001)
}


// Access to cloud functions
const fire_get_stripe_url = httpsCallable(fire_functions, 'get_stripe_url')


// Get url for fundraiser data
export function data_url(fundraiser:string){
    const base = import.meta.env.DEV ? '/dev' : '/dev'
    return `${base}/${fundraiser}`
}


// Get a URL for a Stripe checkout session with given settings
export async function get_stripe_url({currency, amount, recurring, email, fundraiser}:Pledge){
    const resp = await fire_get_stripe_url({currency, amount, recurring, email, fundraiser})
    return (resp.data as {stripe_url:string|null}).stripe_url
}


// Save pledge data to db
export async function save_pledge({id, ...other_props}:Pledge){
    // WARN This won't throw when network issues, will submit when come online
    await setDoc(doc(fire_db, 'pledges', id), other_props)
}
