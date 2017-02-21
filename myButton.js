import React, { Component } from 'react';

import {
        Button,
        Alert
} from 'react-native';

class MyButton extends Component {

    render() {
        return(
            <Button
                onPress={this.props.onHomeButtonPress}
                title="Home"
                color="#519e8a"
                accessibilityLabel="Set your current location as Home"
                />
        );
    }
}
