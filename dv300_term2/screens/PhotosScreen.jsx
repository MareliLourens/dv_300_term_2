import { StyleSheet, Text, View, Button, SafeAreaView } from 'react-native'
import React from 'react'
import { auth } from '../firebase'; // Ensure this path is correct

const ProfileScreen = ({ navigation }) => {

    const handleLogout = () => {
        // Sign out from Firebase
        auth.signOut().then(() => {
            // Navigate back to login screen
            navigation.replace('Login');
        }).catch((error) => {
            // Handle errors here
            console.error("Sign out error:", error);
        });
    }

    return (
        <SafeAreaView>
            <View style={{ padding: 20 }}>
                <Text>Photos</Text>

                {/* Display user info */}
                <Text>Email: {auth.currentUser?.email}</Text>
                <Text>Username: {auth.currentUser?.displayName}</Text>

                <Button
                    title="Sign Out"
                    color="green"
                    onPress={handleLogout} />
            </View>
        </SafeAreaView>
    )
}

export default ProfileScreen
