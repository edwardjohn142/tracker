import React from 'react';
import { StyleSheet, View, Platform, Dimensions, SafeAreaView,Text,PermissionsAndroid  } from 'react-native';
import MapView, { Marker, AnimatedRegion } from 'react-native-maps';
import PubNubReact from 'pubnub-react';
import PubNub from 'pubnub';
import Geolocation from '@react-native-community/geolocation';

navigator.geolocation = require('@react-native-community/geolocation');
const { width, height } = Dimensions.get('window');

const ASPECT_RATIO = width / height;
const LATITUDE = 14.5756169;
const LONGITUDE = 121.0220756;
const LATITUDE_DELTA = 0.0922;
const LONGITUDE_DELTA = LATITUDE_DELTA * ASPECT_RATIO;

export async function requestLocationPermission() 
{
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION
    )
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {

    } else {
      console.log("location permission denied")
      alert("Location permission denied");
    }
  } catch (err) {
    console.warn(err)
  }
}
const pubnub = new PubNub({
    publishKey: "pub-c-38bbe3c0-6929-4c22-b4a6-5d8704430219",
    subscribeKey: "sub-c-1164dd6c-6747-11ea-9174-5e95b827fd71"
  });
export default class Trackee extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      latitude: LATITUDE,
      longitude: LONGITUDE,
      coordinate: new AnimatedRegion({
        latitude: LATITUDE,
        longitude: LONGITUDE,
        latitudeDelta: 0,
        longitudeDelta: 0,
      }),
    };



  }

   componentDidMount() {
     requestLocationPermission()
     
     // this is for trackee

     
     this.watchLocation();
     
     
     // this is for the tracker
    //  this.subscribeToPubNub();
      
      
  }
//   subscribeToPubNub = () => {
//     pubnub.subscribe({
//       channels: ['location'],
//       withPresence: true,
//     });
    
//     pubnub.getMessage('location', msg => {
//       const { coordinate } = this.state;
//       console.log(msg)
//       const { latitude, longitude } = msg.message;
//       const newCoordinate = { latitude, longitude };
      
//       if (Platform.OS === 'android') {
//         if (this.marker) {
//           this.marker._component.animateMarkerToCoordinate(newCoordinate, 500);
//         }
//       } else {
//         coordinate.timing(newCoordinate).start();
//       }
  
//       this.setState({
//         latitude,
//         longitude,
//       });
//     });
//   };
  


  componentDidUpdate(prevProps, prevState) {
   

    
    if (this.props.latitude !== prevState.latitude) {
      console.log(2);
    //   setTimeout(() =>{ this.subscribeToPubNub();},5000)
      pubnub.publish({
        message: {
          latitude: this.state.latitude,
          longitude: this.state.longitude,
        },
        channel: 'location',
      });
    }
  
  }

  componentWillUnmount() {
   
    navigator.geolocation.clearWatch(this.watchID);
    
  }



   watchLocation = () =>{
       const { coordinate } = this.state;
       console.log(2);
       this.watchID = navigator.geolocation.watchPosition(
           position => {
        this.setState({coordinate:position.coords})
        const { latitude, longitude } = position.coords;

        const newCoordinate = {
          latitude,
          longitude,
        };
        
        if (Platform.OS === 'android') {
          if (this.marker) {
            this.marker._component.animateMarkerToCoordinate(newCoordinate, 500); // 500 is the duration to animate the marker
          }
        } else {
          coordinate.timing(newCoordinate).start();
        }        
        this.setState({
          latitude,
          longitude,
        });
      },
      error => console.log(error),
      {
        enableHighAccuracy: true,
        timeout: 5000,
        maximumAge: 1000,
        distanceFilter: 30,
      }
    );
  };

  getMapRegion = () => ({
    latitude: this.state.latitude,
    longitude: this.state.longitude,
    latitudeDelta: LATITUDE_DELTA,
    longitudeDelta: LONGITUDE_DELTA,
  });

  render() {
    return (
      <SafeAreaView style={{ flex: 1 }}>
        
        <View style={styles.container}>
       
          <MapView style={styles.map} showUserLocation followUserLocation loadingEnabled region={this.getMapRegion()}>
         
            <Marker.Animated
              key='sadfsaf'
              ref={marker => {
                this.marker = marker;
              }}
              coordinate={this.state.coordinate}
            />
            <View><Text>{"lat :"+this.state.latitude}</Text></View>
            <View><Text>{"lng :"+this.state.longitude}</Text></View>
          </MapView>
        </View>
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  map: {
    ...StyleSheet.absoluteFillObject,
  },
});
