import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import { createNewEntry, getCategories } from '../services/DbService';
import { Button } from 'react-native';
import { saveImageUrlToFirestore } from '../services/BucketService'; // Import saveImageUrlToFirestore function from BucketService.js
import * as ImagePicker from 'expo-image-picker';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db } from '../firebase'; // Import db from firebase.js

const EntriesScreen = ({ navigation }) => {
    const [name, setName] = useState('');
    const [surname, setSurname] = useState('');
    const [email, setEmail] = useState('');
    const [age, setAge] = useState('');
    const [password, setPassword] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('');
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [image, setImage] = useState(null);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const categoriesData = await getCategories();
            setCategories(categoriesData);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching categories:', error);
            setError('Error fetching categories. Please try again later.');
            setLoading(false);
        }
    };

    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.All,
            allowsEditing: true,
            aspect: [4, 3],
            quality: 1,
        });

        if (!result.cancelled) {
            setImage(result.uri);
        }
    };

    const handleCreation = async () => {
        try {
            let imageUrl = null;
            if (image) {
                imageUrl = await uploadImage(image); // Upload image and get URL
            }

            // Create entry data object
            const entryData = {
                name,
                surname,
                email,
                age,
                password,
                category: selectedCategory,
                isEntered: false,
                imageUrl: imageUrl || null,
            };

            // Save entry data including imageUrl to Firestore
            const success = await createNewEntry(selectedCategory, entryData);
            if (success) {
                navigation.goBack();
            } else {
                console.error('Failed to create entry');
            }
        } catch (error) {
            console.error('Error creating entry:', error);
            // Handle error here (e.g., show error message to user)
        }
    };

    const uploadImage = async (imageUri) => {
        const filename = imageUri.substring(imageUri.lastIndexOf('/') + 1);
        const uploadUri = Platform.OS === 'ios' ? imageUri.replace('file://', '') : imageUri;

        const storageRef = ref(storage, 'images/' + filename);
        const uploadTask = uploadBytesResumable(storageRef, uploadUri, { contentType: 'image/jpeg' });

        try {
            const snapshot = await uploadTask;

            // Get download URL for the uploaded image
            const downloadUrl = await getDownloadURL(snapshot.ref);

            // Save the download URL to Firestore using saveImageUrlToFirestore function
            await saveImageUrlToFirestore(downloadUrl, 'entries', {
                name,
                surname,
                email,
                age,
                password,
                category: selectedCategory,
                isEntered: false,
            });

            return downloadUrl;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    };

    if (loading) {
        return (
            <View style={styles.container}>
                <Text>Loading categories...</Text>
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.container}>
                <Text>{error}</Text>
            </View>
        );
    }

    return (
        <SafeAreaView>
            <ScrollView style={styles.container}>
                <Text style={styles.text}>Enter the competition</Text>
                <Text style={styles.input_caption}>Name:</Text>
                <TextInput
                    style={styles.inputField}
                    placeholder="name"
                    onChangeText={(newText) => setName(newText)}
                    value={name}
                />
                <Text style={styles.input_caption}>Surname:</Text>
                <TextInput
                    style={styles.inputField}
                    placeholder="surname"
                    onChangeText={(newText) => setSurname(newText)}
                    value={surname}
                />
                <Text style={styles.input_caption}>Age:</Text>
                <TextInput
                    style={styles.inputField}
                    placeholder="age"
                    onChangeText={(newText) => setAge(newText)}
                    value={age}
                    keyboardType="numeric"
                />
                <Text style={styles.input_caption}>Email:</Text>
                <TextInput
                    style={styles.inputField}
                    placeholder="email"
                    onChangeText={(newText) => setEmail(newText)}
                    value={email}
                    keyboardType="email-address"
                />
                <Text style={styles.input_caption}>Password:</Text>
                <TextInput
                    style={styles.inputField}
                    secureTextEntry
                    placeholder="password"
                    onChangeText={(newText) => setPassword(newText)}
                    value={password}
                />
                <Text style={styles.input_caption}>Category:</Text>
                <View style={styles.radioButtonContainer}>
                    {categories.map((category) => (
                        <TouchableOpacity
                            key={category.id}
                            style={[
                                styles.radioButton,
                                selectedCategory === category.id && styles.radioButtonSelected,
                            ]}
                            onPress={() => setSelectedCategory(category.id)}
                        >
                            <Text>{category.name}</Text>
                        </TouchableOpacity>
                    ))}
                </View>

                <Button title="Pick an image from camera roll" onPress={pickImage} />
                {image && <Image source={{ uri: image }} style={styles.image} />}

                <TouchableOpacity style={styles.button} onPress={handleCreation}>
                    <Text style={styles.buttonText}>Enter Competition</Text>
                </TouchableOpacity>

            </ScrollView>
        </SafeAreaView>
    );
};

export default EntriesScreen;

const styles = StyleSheet.create({
    container: {
        padding: 20,
        backgroundColor: 'white',
    },
    inputField: {
        width: '100%',
        height: 40,
        borderBottomWidth: 1,
        borderBottomColor: '#A9A9A9',
        marginBottom: 20,
        fontSize: 16,
        paddingLeft: 10,
    },
    button: {
        width: '100%',
        height: 50,
        backgroundColor: '#FFBF5E',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 25,
        marginTop: 20,
    },
    buttonText: {
        color: '#fff',
        fontSize: 18,
        fontWeight: 'bold',
    },
    text: {
        color: 'black',
        fontSize: 24,
        fontWeight: 'bold',
        marginTop: 20,
    },
    input_caption: {
        fontSize: 16,
        fontWeight: 'bold',
        marginTop: 10,
    },
    radioButtonContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
    },
    radioButton: {
        flexDirection: 'row',
        alignItems: 'center',
        borderWidth: 1,
        borderColor: '#A9A9A9',
        borderRadius: 12,
        paddingVertical: 6,
        paddingHorizontal: 12,
        marginRight: 10,
    },
    radioButtonSelected: {
        backgroundColor: '#FFBF5E',
    },
    image: {
        width: 200,
        height: 200,
        marginTop: 20,
    },
});
