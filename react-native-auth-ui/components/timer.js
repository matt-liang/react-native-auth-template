import React from "react";
import { Text } from "react-native"
import { Card } from "react-native-elements";

const Timer = ({ expiry }) => {
    const [currentTime, updateCurrentTime] = React.useState(new Date().getTime())

    React.useEffect(() => {
        const interval = setInterval(() => {
            updateCurrentTime(new Date().getTime());
        }, 100);
        return () => clearInterval(interval);
    }, []);

    function timerTilExpiry() {
        if (expiry - currentTime >= 0) {
            const timeTilExpiry = (expiry - currentTime) / 1000
            return timeTilExpiry.toFixed(1)
        } else {
            return 0
        }
    }

    return (
        <Card>
            <Card.Title>Time until token expiry: {timerTilExpiry()}</Card.Title>
            <Card.Divider />
            <Text>Click on Refresh Token to get more time!</Text>
        </Card>
    )
}

export default Timer