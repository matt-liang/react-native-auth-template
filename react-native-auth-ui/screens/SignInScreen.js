import React, { useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import { Button, Input } from 'react-native-elements'

import { AuthContext } from '../components/context'

const SignInScreen = ({ navigation }) => {
    const [data, updateData] = useState({
        username: '',
        password: ''
    })

    const [invalidUserMsg, setInvalidUserMsg] = useState("")

    const Context = React.useContext(AuthContext)
    const actions = Context.actions

    const handleUserName = (val) => {
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

    const loginHandle = () => {
        const requestOptions = {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: data.username, password: data.password }),
        };
        fetch("http://10.0.2.2:8080/login", requestOptions)
            .then(response => response.status === 200 && response.json())
            .then(data => actions.signIn(data.expiresat))
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    return (
        <View style={styles.container}>
            <Input
                containerStyle={styles.inputContainer}
                label="Username"
                placeholder="Username"
                value={data.username}
                onChangeText={(val) => handleUserName(val)}
                leftIcon={{ type: 'font-awesome', name: 'user', style: { marginRight: 10 } }}
            />
            <Input
                containerStyle={styles.inputContainer}
                label="Password"
                placeholder="Password"
                value={data.password}
                onChangeText={(val) => handlePassword(val)}
                leftIcon={{ type: 'font-awesome', name: 'lock', style: { marginRight: 10 } }}
                secureTextEntry
                errorMessage={invalidUserMsg}
            />
            <Button containerStyle={styles.buttonContainer} title="Sign in" onPress={loginHandle} />
            <TouchableOpacity onPress={() => navigation.navigate("ForgotPassScreen")} style={styles.touchableContainer}>
                <Text style={styles.touchableText}>Forgot Password?</Text>
            </TouchableOpacity>
        </View>
    );
}

export default SignInScreen

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
    touchableContainer: {
        marginTop: 20
    },
    touchableText: {
        color: '#2196F3',
        fontWeight: 'bold'
    },
})