import React, { Component } from 'react';

import {
        Button,
        TouchableHighlight,
        Alert,
        View,
        StyleSheet,
        Text
} from 'react-native';

export default class MyButton extends Component {
    render() {
        return(
            <TouchableHighlight onPress={this.props.onHomeButtonPress}>
                <View style={this.props.styles.homeButton}>
                    <Text style={this.props.styles.buttonText}>HOME</Text>
                </View>
            </TouchableHighlight>
        );
    }
}
