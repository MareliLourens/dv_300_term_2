import { collection, addDoc } from "firebase/firestore";
import { firestore } from "../firebase";

export const saveImageUrlToFirestore = async (downloadURL, collectionName, docData) => {
    try {
        const docRef = await addDoc(collection(firestore, collectionName), {
            ...docData,
            imageUrl: downloadURL,
            createdAt: new Date()
        });
        console.log("Document written with ID: ", docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};
