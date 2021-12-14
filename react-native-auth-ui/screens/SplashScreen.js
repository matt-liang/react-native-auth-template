import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Button } from 'react-native-elements'

const SplashScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>AUTH LABS</Text>
            <Image style={styles.image} source={require('./biometrics.jpg')} />
            <Button containerStyle={styles.buttonContainer} title="Sign In" onPress={() => navigation.navigate("SignInScreen")} />
            <TouchableOpacity style={styles.touchableContainer} onPress={() => navigation.navigate("SignUpScreen")}>
                <Text style={styles.touchableText}>Dont have an account? Sign Up!</Text>
            </TouchableOpacity>
        </View>
    )
}

export default SplashScreen

const styles = StyleSheet.create({
    buttonContainer: {
        width: '60%',
        marginTop: 30,
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        flex: 1,
    },
    image: {
        width: 200,
        height: 200,
        marginBottom: 20
    },
    touchableContainer: {
        marginTop: 20,
    },
    touchableText: {
        color: '#2196F3',
        fontWeight: 'bold'
    },
    titleText: {
        fontWeight: 'bold',
        fontSize: 30,
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10,
        marginBottom: 10
    }
})