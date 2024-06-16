import { collection, addDoc } from "firebase/firestore";
import { firestore } from "../firebase";

export const saveImageUrlToFirestore = async (downloadURL, collectionName, docData) => {
    try {
        const docRef = await addDoc(collection(firestore, collectionName), {
            ...docData,
            imageUrl: downloadURL,
            createdAt: new Date()
        });
        console.log('Document written with ID: ', docRef.id);
    } catch (e) {
        console.error("Error adding document: ", e);
    }
};

import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import { storage } from "../firebase";

export const handleUploadOfImage = async (uri, fileName) => {
    try {
        const blob = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function () {
                resolve(xhr.response);
            };
            xhr.onerror = function (e) {
                console.log(e);
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", uri, true);
            xhr.send(null);
        });

        const imageRef = ref(storage, fileName);

        const uploadResult = await uploadBytes(imageRef, blob);

        blob.close();

        const downloadURL = await getDownloadURL(imageRef);

        return downloadURL;
    } catch (error) {
        console.error("Error uploading image: ", error);
        throw error;
    }
};

const uploadAndSaveImage = async (uri, fileName, collectionName, docData) => {
    try {
        const downloadURL = await handleUploadOfImage(uri, fileName);
        await saveImageUrlToFirestore(downloadURL, collectionName, docData);
    } catch (error) {
        console.error("Error during the upload and save process: ", error);
    }
};
