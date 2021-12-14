import React from 'react';
import { StyleSheet, Text, View } from 'react-native'
import { Button } from 'react-native-elements'

const AnotherScreen = ({ navigation }) => {
    return (
        <View style={styles.container}>
            <Text>Another Screen</Text>
            <Button containerStyle={styles.buttonContainer} title="Go back to home" onPress={() => navigation.navigate("Home")} />
        </View>
    )
}

export default AnotherScreen

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