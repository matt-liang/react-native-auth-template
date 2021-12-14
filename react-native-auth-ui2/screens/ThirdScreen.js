import React from 'react';
import { StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-elements'

const ThirdScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text>Yet Another Screen</Text>
            <Button containerStyle={styles.buttonContainer} title="Go back to home" onPress={() => navigation.navigate("Home")} />
        </View>
    )
}

export default ThirdScreen

const styles = StyleSheet.create({
    buttonContainer: {
        marginTop: 20
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})