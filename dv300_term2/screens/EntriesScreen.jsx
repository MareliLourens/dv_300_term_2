import { StyleSheet, Text, View, SafeAreaView, TextInput, TouchableOpacity, Switch } from 'react-native'
import React, { useState } from 'react'
import { createNewEntry } from '../services/DbService'

const EntriesScreen = ({ navigation }) => {




    const [name, setName] = useState('')
    const [above18, setAbove18] = useState(false)
    const [surname, setSurname] = useState('')
    const [email, setEmail] = useState('')
    const [age, setAge] = useState('')
    const [password, setPassword] = useState('')

    const handleCreation = async () => {
        var Entries = {
            name, above18, surname, email, age, password, isEntered: false
        }
        var success = await createNewEntry(Entries)
        if (success){
            navigation.goBack()
        } else {
            console.error(e);
        }
    }

    return (
        <SafeAreaView >
            <View style={styles.container}>

                <TextInput
                    style={styles.inputField}
                    placeholder="name"
                    onChangeText={newText => setName(newText)}
                    defaultValue={name}
                />

                <TextInput
                    style={styles.inputField}
                    placeholder="surname"
                    onChangeText={newText => setSurname(newText)}
                    defaultValue={surname}
                />

                <TextInput
                    style={styles.inputField}
                    placeholder="email"
                    onChangeText={newText => setEmail(newText)}
                    defaultValue={email}
                />

                <TextInput
                    style={styles.inputField}
                    placeholder="age"
                    onChangeText={newText => setAge(newText)}
                    defaultValue={age}
                />

                <TextInput
                    style={styles.inputField}
                    secureTextEntry
                    placeholder="password"
                    onChangeText={newText => setPassword(newText)}
                    defaultValue={password}
                />

                <View style={styles.switch}>
                    <Switch
                        trackColor={{ false: 'black', true: 'green' }}
                        thumbColor={above18 ? 'yellow' : 'white'}
                        ios_backgroundColor="#3e3e3e"
                        onValueChange={(toggle) => setAbove18(toggle)}
                        value={above18}
                    />
                    <Text>Are you above 18?</Text>
                </View>

                <TouchableOpacity style={styles.button} onPress={handleCreation} >
                    <Text style={styles.buttonText}>Enter Competition</Text>
                </TouchableOpacity>

            </View>
        </SafeAreaView>
    )
}

export default EntriesScreen

const styles = StyleSheet.create({
    container: {
        padding: 20
    },
    inputField: {
        borderWidth: 2,
        borderColor: 'black',
        marginTop: 15,
        padding: 10
    },
    button: {
        backgroundColor: "green",
        textAlign: 'center',
        padding: 15,
        marginTop: 30
    },
    buttonText: {
        textAlign: 'center',
        color: 'white'
    },
    switch: {
        marginTop: 15,
        display: 'flex',
        flexDirection: 'row-reverse',
        alignItems: 'center',
        gap: 10,
    }
})