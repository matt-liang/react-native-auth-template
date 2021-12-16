import React, { useState } from "react";
import { StyleSheet, View } from 'react-native'
import { Button, Input } from "react-native-elements";

const SignUpScreen = ({ navigation }) => {
    const [data, updateData] = useState({
        username: '',
        password: '',
        reEnterPassword: '',
        phonenumber: '',
    })

    const [errMessage, setErrMessage] = useState("")

    const handleUsername = (val) => {
        updateData({
            ...data,
            username: val
        })
    }

    const handlePassword = (val) => {
        updateData({
            ...data,
            password: val
        })
    }

    const handleReEnterPassword = (val) => {
        updateData({
            ...data,
            reEnterPassword: val
        })
    }

    const handlePhoneNumber = (val) => {
        updateData({
            ...data,
            phonenumber: val
        })
    }

    function validate() {
        if (data.phonenumber.length != 10) {
            setErrMessage("This is not a valid phone number")
            return false
        }
    }

    const handleSignUp = () => {
        if (data.password !== data.reEnterPassword) {
            return
        }
        let valid = validate()
        if (!valid) return
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: data.username, password: data.password, phonenumber: data.phonenumber }),
        };
        fetch("http://10.0.2.2:8080/signup", requestOptions)
            .then(response => {
                if (response.status == 400) {
                    setErrMessage("This username already exists, please try another")
                } else {
                    navigation.navigate("SplashScreen")
                }
            })
            .catch(error => {
                alert('Error contacting server', error);
            });
    }

    return (
        <View style={styles.container}>
            <Input
                label="Username"
                containerStyle={styles.inputContainer}
                onChangeText={(val) => handleUsername(val)}
                leftIcon={{ type: 'font-awesome', name: 'user', style: { marginRight: 10 } }}
            />
            <Input
                label="Password"
                containerStyle={styles.inputContainer}
                onChangeText={(val) => handlePassword(val)}
                leftIcon={{ type: 'font-awesome', name: 'lock', style: { marginRight: 10 } }}
                secureTextEntry
            />
            <Input
                label="Repeat Password"
                containerStyle={styles.inputContainer}
                onChangeText={(val) => handleReEnterPassword(val)}
                leftIcon={{ type: 'font-awesome', name: 'lock', style: { marginRight: 10 } }}
                secureTextEntry
            />
            <Input
                label="Phone Number"
                containerStyle={styles.inputContainer}
                onChangeText={(val) => handlePhoneNumber(val)}
                leftIcon={{ type: 'font-awesome', name: 'mobile', style: { marginRight: 10 } }}
                errorMessage={errMessage}
            />
            <Button containerStyle={styles.buttonContainer} title="Sign Up" onPress={() => handleSignUp()} />
        </View>
    )
}

export default SignUpScreen

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
    inputContainer: {
        width: '60%'
    },
})