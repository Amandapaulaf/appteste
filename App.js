
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Modal , Image} from 'react-native';
import { Camera } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import * as Permissions from 'expo-permissions';
import * as Location from 'expo-location';
import Cam from './src/components/Cam';




export default function App() {
  
  const [hasPermission, setHasPermission] = useState(null);
  const [permissionLibrary, setPermissionLibrary]= useState(null);
  const [permissionLoc, setPermissionLoc]= useState(null);
  const [localizacao, setLocalizacao] = useState(null);
  

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');

    })();

    (async () => {
      const { status } = await Permissions.askAsync(Permissions.MEDIA_LIBRARY);
      setPermissionLibrary(status === 'granted');

    })();

    (async () => {
      const { status } = await Permissions.askAsync(Permissions.LOCATION_FOREGROUND);
      setPermissionLoc(status === 'granted');
      if(status==='granted'){
        getLocation();
      }
    })();

  }, [])
  if (hasPermission == null || permissionLibrary==null || permissionLoc==null) {
    return <View></View>
  }
  if (hasPermission == false || permissionLibrary==false || permissionLoc==false) {
    return <Text>Acesso negado!</Text>
  }
  async function getLocation(){
    const response = await Location.getLastKnownPositionAsync({})
      if(response){
        setLocalizacao({
          locLatitude:response.coords.latitude,
          locLongitude:response.coords.longitude,
        })
      console.log(response.coords.latitude);
      console.log(response.coords.longitude);}
  }
  return (
    <SafeAreaView style={styles.container}>
      <Cam loc={localizacao}/>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
});
