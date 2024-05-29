import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { useNavigation } from '@react-navigation/native';

const RegisterScreen = () => {
  const navigation = useNavigation();
  const [selectedAge, setSelectedAge] = useState();

  return (
    <View style={styles.container_big}>
      <Image style={styles.image} source={require('../assets/Login.png')} />
      <View style={styles.styledView_big} />
      <View style={styles.container}>
        <Text style={styles.title}>Welcome</Text>
        <Text style={styles.subtitle}>Sign up to continue</Text>

        <Text style={styles.Infotext}>Personal Information:</Text>
        <TextInput style={styles.input} placeholder="Name" placeholderTextColor="#A9A9A9" />
        <TextInput style={styles.input} placeholder="Surname" placeholderTextColor="#A9A9A9" />
        
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={selectedAge}
            style={styles.picker} // Apply picker styles
            onValueChange={(itemValue) => setSelectedAge(itemValue)}
          >
            <Picker.Item label="Select Age" value={null} />
            {Array.from({ length: 63 }, (_, i) => i + 18).map((age) => (
              <Picker.Item key={age} label={age.toString()} value={age} />
            ))}
          </Picker>
        </View>
        
        <Text style={styles.Infotext}>Log In Information:</Text>
        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#A9A9A9" />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#A9A9A9" secureTextEntry />

        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Photos')}
        >
          <Text style={styles.buttonText}>Sign Up</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signupbutton}
          onPress={() => navigation.navigate('Login')}
        >
          <Text style={styles.signupbuttonText}>Already a member?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container_big: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: '#003680',
  },
  image: {
    height: 550,
    width: 550,
    alignItems: 'center',
    position: 'absolute',
    top: -90,
    left: -105,
  },
  styledView_big: {
    backgroundColor: 'white',
    height: 630,
    borderTopRightRadius: 35,
    borderTopLeftRadius: 35,
    alignItems: 'center',
    position: 'absolute',
    bottom: 0,
    width: '100%',
  },
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#A9A9A9',
    marginBottom: 40,
  },
  input: {
    width: '100%',
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#A9A9A9',
    marginBottom: 20,
    fontSize: 16,
    paddingLeft: 10,
  },
  pickerContainer: {
    width: '100%',
    height: 40,
    borderBottomWidth: 1,
    borderBottomColor: '#A9A9A9',
    marginBottom: 20,
    justifyContent: 'center',
  },
  picker: {
    width: '100%',
    height: '100%',
    color: '#A9A9A9', 
  },
  Infotext: {
    fontSize: 18,
    fontWeight: 'bold',
    width: '100%',
    alignItems: 'flex-end',
    marginBottom: 10,
    marginLeft: 10,
  },
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFBF5E',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  signupbutton: {
    width: '100%',
    height: 50,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 25,
    borderWidth: 3,
    borderColor: '#FFBF5E',
    marginTop: 15,
  },
  signupbuttonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default RegisterScreen;
