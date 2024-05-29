import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getDocs } from "firebase/firestore";

export const createNewEntry = async (Entry) => {


    try {
        const docRef = await addDoc(collection(db, "Entries"), Entry
        );
        console.log("Document written with ID: ", docRef.id);
        return true
    } catch (e) {
        console.error("Error adding document: ", e);
        return false
    }
}

var allCategories = []

export const getCategories = async () => {
    const allCategories = []; // Declare allCategories inside the function

    const querySnapshot = await getDocs(collection(db, "Categories"));
    querySnapshot.forEach((doc) => {
        // doc.data() is never undefined for query doc snapshots
        // console.log(doc.id, " => ", doc.data());
        allCategories.push({ ...doc.data(), id: doc.id });
    });
    console.log(allCategories);
    return allCategories;
}