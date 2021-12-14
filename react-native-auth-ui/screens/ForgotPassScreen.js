import React from "react";
import { StyleSheet, Text, View } from 'react-native'
import { Button, Input } from "react-native-elements";

// This page does nothing
const ForgotPassScreen = ({ navigation }) => {

    const [number, setNumber] = React.useState("")

    return (
        <View style={styles.container}>
            <Text style={styles.titleText}>Forgot Password?</Text>
            <Input
                containerStyle={styles.inputContainer}
                inputStyle={styles.input}
                label="Enter your phone number"
                value={number}
                onChangeText={val => setNumber(val)}
            />
            <Button title="Confirm" onPress={() => navigation.navigate("SplashScreen")} containerStyle={styles.buttonContainer} />
        </View>
    )
}

export default ForgotPassScreen

const styles = StyleSheet.create({
    buttonContainer: {
        width: "60%"
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    input: {
        borderWidth: 1,
        marginTop: 20
    },
    inputContainer: {
        width: '60%',
        marginBottom: 30,
        borderBottomWidth: 0
    },
    titleText: {
        fontWeight: 'bold',
        marginBottom: 30,
        fontSize: 20
    }
})