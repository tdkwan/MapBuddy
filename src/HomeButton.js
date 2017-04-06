import React, { Component } from 'react';

import {
        Button,
        TouchableHighlight,
        Alert,
        View,
        StyleSheet,
        Text
} from 'react-native';

export default class HomeButton extends Component {
    render() {
        return(
            <TouchableHighlight onPress={this.props.onPress}>
                <View style={this.props.buttonStyle}>
                    <Text style={this.props.textStyle}>HOME</Text>
                </View>
            </TouchableHighlight>
        );
    }
}
