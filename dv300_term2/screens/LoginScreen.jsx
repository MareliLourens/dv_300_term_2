import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container_big}>
      <Image style={styles.image} source={require('../assets/Login.png')} />
      <View style={styles.styledView_big} />
      <View style={styles.container}>
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Log in to continue</Text>

        <TextInput style={styles.input} placeholder="Email" placeholderTextColor="#A9A9A9" />
        <TextInput style={styles.input} placeholder="Password" placeholderTextColor="#A9A9A9" secureTextEntry />

        <TouchableOpacity style={styles.forgotPasswordContainer}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>


        <TouchableOpacity
          style={styles.button}
          onPress={() => navigation.navigate('Photos')}
        >
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.signupbutton}
          onPress={() => navigation.navigate('Register')}>
          <Text style={styles.signupbuttonText}>Not a member?</Text>
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
    height: 430,
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
  forgotPasswordContainer: {
    width: '100%', 
    alignItems: 'flex-end', 
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: '#A9A9A9',
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

export default LoginScreen;
