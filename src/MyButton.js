import React, { Component } from 'react';

import {
        Button,
        Alert,
        View,
        StyleSheet
} from 'react-native';

export default class MyButton extends Component {

    render() {
        return(
            <View style={this.props.styles.homeButton}>
                <Button
                    onPress={this.props.onHomeButtonPress}
                    title="Home"
                    color="#519e8a"
                    accessibilityLabel="Set your current location as Home">
                </Button>
            </View>
        );
    }
}
