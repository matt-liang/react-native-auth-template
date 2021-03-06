import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { Button, Card } from 'react-native-elements'

import Timer from '../components/timer';
import { AuthContext } from '../components/context';

const HomeScreen = () => {

    const Context = React.useContext(AuthContext);
    const actions = Context.actions
    const [expiry, setExpiry] = React.useState(Context.expiry)
    const [apiMessage, setApiMessage] = React.useState("Your API Message")

    const refreshToken = () => {
        const requestOptions = {
            method: 'POST'
        };
        fetch("http://10.0.2.2:8080/refreshtoken", requestOptions)
            .then(response => response.status === 200 && response.json())
            .then(data => setExpiry(data.expiresat))
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    const authorizedMsg = () => {
        fetch("http://10.0.2.2:8080/authorizedhandler")
            .then(response => response.text())
            .then(text => setApiMessage(text))
            .catch((error) => {
                console.error('Error:', error);
            });
    }

    return (
        <View style={styles.container}>
            <Text style={styles.homeText}>Successfully authenticated! Welcome to your App.</Text>
            <Timer expiry={expiry} />
            <Button containerStyle={styles.buttonContainer} title="Refresh Token" onPress={refreshToken} />
            <Card>
                <Card.Title>{apiMessage}</Card.Title>
                <Card.Divider />
                <Text>Click on API to see your secure API message</Text>
            </Card>
            <Button containerStyle={styles.buttonContainer} title="API" onPress={authorizedMsg} />
            <Button containerStyle={styles.buttonContainer} title="Sign out" onPress={actions.signOut} />
        </View>
    );
}

export default HomeScreen

const styles = StyleSheet.create({
    buttonContainer: {
        marginTop: 20,
        width: '60%'
    },
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    homeText: {
        marginBottom: 30,
    }
})