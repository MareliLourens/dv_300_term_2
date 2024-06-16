import { db, firestore } from "../firebase";
import { getDocs, collection, doc, addDoc, query, orderBy, updateDoc, setDoc, increment } from "firebase/firestore";

export const createNewEntry = async (categoryId, entryData) => {
    try {
        const entriesRef = collection(db, 'Categories', categoryId, 'entries');
        const docRef = await addDoc(entriesRef, entryData);
        console.log('Document written with ID: ', docRef.id);

        await updateCategoryEntriesCount(categoryId); 

        return true;
    } catch (error) {
        console.error('Error adding document: ', error);
        return false;
    }
};

export const updateEntryVote = async (categoryId, entryId, newVoteCount) => {
    try {
        console.log("Updating vote count for categoryId:", categoryId, "entryId:", entryId);

        const entryDocRef = doc(db, "Categories", categoryId, "entries", entryId);
        await updateDoc(entryDocRef, { votes: newVoteCount });

        console.log("Vote count updated successfully.");
    } catch (error) {
        console.error("Error updating vote count in the database:", error);
        throw error; 
    }
};

export const updateEntryVoter = async (categoryId, entryId, userId) => {
    try {
        const userRef = doc(db, 'users', userId);
        const voterData = { categoryId, entryId, voted: true };
        await setDoc(userRef, voterData);

        console.log("Voter information updated successfully.");
    } catch (error) {
        console.error("Error updating voter information in the database:", error);
        throw error; 
    }
};

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
        const collectionRef = collection(firestore, "Categories", categoryId, "entries");
        const q = query(collectionRef, orderBy("votes", "desc"));
        const querySnapshot = await getDocs(q);
        const entriesData = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id }));

        return entriesData;
    } catch (error) {
        console.error("Error fetching entries:", error);
        return [];
    }
};

const updateCategoryEntriesCount = async (categoryId) => {
    const categoryRef = doc(db, 'Categories', categoryId);

    try {
        await updateDoc(categoryRef, {
            entries: increment(1)
        });

        console.log('Entries count updated successfully for category:', categoryId);
    } catch (error) {
        console.error('Error updating entries count:', error);
        throw error;
    }
};