// DbService.js

import { db, realtimeDB } from "../firebase";
import { getDocs, collection, doc, addDoc, query, orderBy, updateDoc} from "firebase/firestore";

// Function to create a new entry in the specified category
export const createNewEntry = async (categoryId, entryData) => {
    try {
        const categoryRef = doc(db, "Categories", categoryId);
        const entriesRef = collection(categoryRef, "entries");
        const docRef = await addDoc(entriesRef, entryData);
        console.log("Document written with ID: ", docRef.id);
        return true;
    } catch (error) {
        console.error("Error adding document: ", error);
        return false;
    }
};



export const updateEntryVote = async (categoryId, entryId, newVoteCount) => {
    try {
        console.log("Updating vote count for categoryId:", categoryId, "entryId:", entryId);

        const entryDocRef = doc(db, "Categories", categoryId, "entries", entryId);

        await updateDoc(entryDocRef, { votes: newVoteCount });
    } catch (error) {
        console.error("Error updating vote count in the database:", error);
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

export const getEntries = async (categoryId) => {
    try {
        const collectionRef = collection(db, "Categories", categoryId, "entries");
        const q = query(collectionRef, orderBy("votes", "desc"));
        const querySnapshot = await getDocs(q);
        const entriesData = [];
        querySnapshot.forEach((doc) => {
            const entry = { ...doc.data(), id: doc.id };
            entriesData.push(entry);
        });

        // Check if entries are not in descending order
        let isDescending = true;
        for (let i = 1; i < entriesData.length; i++) {
            if (entriesData[i].votes > entriesData[i - 1].votes) {
                isDescending = false;
                break;
            }
        }

        // If entries are not in descending order, reorder them
        if (!isDescending) {
            entriesData.sort((a, b) => b.votes - a.votes);
            console.warn("Entries were not in descending order. Reordered them.");
        }

        return entriesData;
    } catch (error) {
        console.error("Error fetching entries:", error);
        return [];
    }
};


