import { Pressable, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import { Entypo } from '@expo/vector-icons';
import { getCategories } from '../services/DbService';

const CompetitionsScreen = ({ navigation }) => {


    const [CategoryItems, setCategoryItems] = useState([])

    useEffect(() => {
        handleGettingOfData()

    }, [])

    const handleGettingOfData = async () => {
        var allData = await getCategories()
        console.log("All data" + allData)
        setCategoryItems(allData)
    }
    return (
        <SafeAreaView>
            <View style={styles.container}>

                {CategoryItems.map((item, index) => (
                    <TouchableOpacity key={index} style={styles.card} onPress={() => navigation.navigate("Details", { item })}>
                        <Text>{item.name}</Text>
                        <AntDesign name="star" size={24} color="orange" />
                    </TouchableOpacity>
                ))}

            </View>

            
        </SafeAreaView>


    )
}

export default CompetitionsScreen

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    card: {
        width: '100%',
        backgroundColor: 'white',
        padding: 15,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 20
    },
    addButton: {
        backgroundColor: 'white',
        borderColor: 'green',
        borderWidth: 2,
        padding: 10,
        marginBottom: 20,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 5
    },
    addButtonText: {
        textAlign: 'center',
        color: 'green',
        fontWeight: 'bold'
    },
    
})