import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";

export const createNewEntry = async (Entry) => {


    try {
        const docRef = await addDoc(collection(db, "Entries"), Entry
        // {
        //     first: "Ada",
        //     last: "Lovelace",
        //     born: 1815
        // }
    );
        console.log("Document written with ID: ", docRef.id);
        return true
    } catch (e) {
        console.error("Error adding document: ", e);
        return false
    }
}