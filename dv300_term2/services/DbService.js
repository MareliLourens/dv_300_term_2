import { db, firestore } from "../firebase";
import { getDocs, collection, doc, addDoc, query, orderBy, updateDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth";

// Function to create a new entry in the specified category
export const createNewEntry = async (categoryId, entryData) => {
    try {
        const categoryRef = doc(db, "Categories", categoryId); // Reference to the category document
        const entriesRef = collection(categoryRef, "entries"); // Reference to the entries collection inside the category
        const docRef = await addDoc(entriesRef, entryData);
        console.log("Document written with ID: ", docRef.id);
        return true;
    } catch (error) {
        console.error("Error adding document: ", error);
        return false;
    }
};

// Function to update the vote count of an entry
export const updateEntryVote = async (categoryId, entryId, newVoteCount) => {
    try {
        console.log("Updating vote count for categoryId:", categoryId, "entryId:", entryId);

        const entryDocRef = doc(db, "Categories", categoryId, "entries", entryId);
        await updateDoc(entryDocRef, { votes: newVoteCount });

        console.log("Vote count updated successfully.");
    } catch (error) {
        console.error("Error updating vote count in the database:", error);
        throw error; // Throw the error to handle it in the calling function
    }
};

// Function to update the voter information for an entry
export const updateEntryVoter = async (categoryId, entryId, userId) => {
    try {
        const userRef = doc(db, 'users', userId);
        const voterData = { categoryId, entryId, voted: true };
        await setDoc(userRef, voterData);

        console.log("Voter information updated successfully.");
    } catch (error) {
        console.error("Error updating voter information in the database:", error);
        throw error; // Throw the error to handle it in the calling function
    }
};

// Function to get all categories
export const getCategories = async () => {
    try {
        const allCategories = [];
        const querySnapshot = await getDocs(collection(db, "Categories"));
        querySnapshot.forEach((doc) => {
            allCategories.push({ ...doc.data(), id: doc.id });
        });
        console.log(allCategories);
        return allCategories;
    } catch (error) {
        console.error("Error getting categories: ", error);
        return [];
    }
};

// Function to get all entries in a category sorted by votes in descending order
export const getEntries = async (categoryId) => {
    try {
        const collectionRef = collection(db, "Categories", categoryId, "entries");
        const q = query(collectionRef, orderBy("votes", "desc"));
        const querySnapshot = await getDocs(q);
        const entriesData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

        return entriesData;
    } catch (error) {
        console.error("Error fetching entries:", error);
        return [];
    }
};
