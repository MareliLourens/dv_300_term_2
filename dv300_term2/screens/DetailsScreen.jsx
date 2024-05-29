import { Button, StyleSheet, Text, View } from 'react-native';
import React, { useEffect, useState } from 'react';

const DetailsScreen = ({ route, navigation }) => {
    const { item } = route.params;
    

    return (
        <View style={styles.container}>
            <Text style={{ fontSize: 24 }}>{item.name}</Text>
            <Text>Location: {item.location}</Text>
            <Text>Entries: {item.entries}</Text>
            
        </View>
    );
}

export default DetailsScreen

const styles = StyleSheet.create({
    container: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: 15,
        marginTop: 20,
    }
});
