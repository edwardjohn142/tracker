import 'react-native-gesture-handler';
import * as React from 'react';
import { View, Text,Button,ScrollView,TextInput,StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import PubNubReact from 'pubnub-react';



const Stack = createStackNavigator();

export default class Login extends React.Component {
    constructor(props) {
    super(props);
    // this.pubnub = new PubNubReact({
    //   publishKey: "pub-c-38bbe3c0-6929-4c22-b4a6-5d8704430219",
    //   subscribeKey: "sub-c-1164dd6c-6747-11ea-9174-5e95b827fd71"
    // });
    // this.pubnub.init(this);
  }

  render(){
    return (

    <View style={styles.container}>
        <ScrollView style={{padding: 20}}>
            <Text   style={{fontSize: 27}}>  Login  </Text>
            <TextInput placeholder='Username' />
            <TextInput placeholder='Password' />
            <View style={{margin:7}} />
            <Button   onPress={() => this.props.navigation.navigate("Home")} title="Submit" />
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
    flexDirection:'row',
    textAlign:'center'
  },
  logo: {
    flex: 1,
    width: "100%",
    resizeMode: "contain",
    alignSelf: "center"
  },
  form: {
    flex: 1,
    justifyContent: "center",
    width: "80%"
  }
});

