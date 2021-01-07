import React, { Component } from 'react';
import { StyleSheet, Text, View, Button, TouchableOpacity } from 'react-native';
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from 'moment'
import * as Permissions from 'expo-permissions';
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
    }),
  });

export default class Alarm extends Component {
    constructor() {
        super()
        this.state = {
          isVisible: false,
          chosenTime: ''
        }
    }

    registerForPushNotificationsAsync = async () =>  {
        let token;
          const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
          let finalStatus = existingStatus;
          if (existingStatus !== 'granted') {
            const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
            finalStatus = status;
          }
          if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
          }
          token = (await Notifications.getExpoPushTokenAsync()).data;
          console.log(token);
        }

        async componentDidMount() {
            //this.currentUser = await firebase.auth().currentUser;
            await this.registerForPushNotificationsAsync();
          }

    handlePicker = (datetime) => {
        this.setState({
            isVisible: false,
            chosenTime: moment(datetime).format('DD MMMM, YYYY HH:mm')
        })
        
    }

    showPicker = () => {
        this.setState({
            isVisible: true
        })
    }

    hidePicker = () => {
        this.setState({
            isVisible: false
        })
        
    }

    handleConfirm = () => {
        const trigger = new Date(this.state.chosenTime)
        Notifications.scheduleNotificationAsync({
            content: {
              title: 'Wake up!',
              body: "I'm so proud of myself!",t
            },
            trigger,
            })
    }

    render() {
        return(
            <View style={styles.container}>
                <Text style={{color: 'red', fontSize: 20}}>
                    {this.state.chosenTime}
                </Text>
                <TouchableOpacity style = {styles.button} onPress={this.showPicker}>
                    <Text style={styles.text}>Choose a Time</Text>
                </TouchableOpacity>
                <TouchableOpacity style = {styles.button} onPress={this.handleConfirm}>
                    <Text style={styles.text}>Set Alarm</Text>
                </TouchableOpacity>
                <DateTimePickerModal
                    isVisible={this.state.isVisible}
                    onConfirm={this.handlePicker}
                    onCancel={this.hidePicker}
                    mode={'datetime'}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: '#fff',
      alignItems: 'center',
      justifyContent: 'center',
    },
  
    button: {
      width: 250,
      height: 50,
      backgroundColor: 'rgb(0, 0, 0)',
      borderRadius: 30,
      justifyContent: 'center',
      marginTop: 15
    },
  
    text: {
      fontSize: 18,
      color: 'white',
      textAlign: 'center'
    }
});