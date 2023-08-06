import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View, SafeAreaView, TouchableOpacity, Modal , Image} from 'react-native';
import { Camera } from 'expo-camera';
import { useState, useEffect, useRef } from 'react';
import { FontAwesome } from '@expo/vector-icons';
import * as Permissions from 'expo-permissions';
import * as MediaLibrary from 'expo-media-library';
import * as Location from 'expo-location';

export default function App() {
  const camRef = useRef(null);
  const [type, setType] = useState(Camera.Constants.Type.back);
  const [hasPermission, setHasPermission] = useState(null);
  const [capturedPhoto, setCapturedPhoto] = useState(null);
  const [open, setOpen] = useState(false);
  const [permissionLibrary, setPermissionLibrary]= useState(null);
  const [permissionLoc, setPermissionLoc]= useState(null);
  const [locLatitude, setLocLatitude] = useState(null);
  const [locLongitude, setLocLongitude]= useState(null);

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

  async function takePicture() {
    if (camRef) {
      const data = await camRef.current.takePictureAsync();
      setCapturedPhoto({
        uri: data.uri,
        latitude: locLatitude,
        longitude: locLongitude,
      });
      console.log(data);
      console.log(capturedPhoto);
      setOpen(true);
    }
  }

  async function savePicture(){
    if(capturedPhoto){
    const asset= await MediaLibrary.createAssetAsync(capturedPhoto.uri)
    .then(() => {
      alert('foto salva com sucesso');

    })
    .catch(error => {console.log('err', error);})
  }}

  async function getLocation(){
    const response = await Location.getLastKnownPositionAsync({})
      if(response){
      setLocLatitude(response.coords.latitude);
      setLocLongitude(response.coords.longitude);
      console.log(response.coords.latitude);
      console.log(response.coords.longitude);}
  }
  return (
    <SafeAreaView style={styles.container}>

      <Camera style={styles.camera} type={type} ref={camRef}>
        <View style={styles.view}>
          <TouchableOpacity style={styles.botao}
            onPress={() => {
              setType(type === Camera.Constants.Type.back ? Camera.Constants.Type.front : Camera.Constants.Type.back)
            }}>
            <Text style={styles.botaotext}>trocar</Text>
          </TouchableOpacity>

        </View>
      </Camera>
      <TouchableOpacity style={styles.buttoncamera}
        onPress={takePicture}
      >
        <FontAwesome name='camera' size={23} color='#FFF' />
      </TouchableOpacity>

      {capturedPhoto &&
        <Modal
          animationType='slide'
          transparent={false}
          visible={open}
        >
          <View style={styles.modal}>
            <View style={{margin:10, flexDirection:'row'}}>
              <TouchableOpacity style={{margin:40}}
                onPress={
                  () => setOpen(false)
                }>
                <FontAwesome name="window-close" size={50} color="red" />
              </TouchableOpacity>
              <TouchableOpacity style={{margin:40}} onPress={savePicture}>
                <FontAwesome name="upload" size={50} color="blue" />
              </TouchableOpacity>
            </View>
            <Image style={{width:'100%',margin:20, borderRadius:20, height: 500}} source= {{uri: capturedPhoto.uri}}/>
          </View>

        </Modal>
      }

    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
  },
  camera: {
    flex: 1,
  },
  view: {
    flex: 1,
    backgroundColor: 'transparent',
    flexDirection: 'row',

  },
  botao: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    backgroundColor: 'black',
    borderRadius: 20,
    height: 60,
    justifyContent: 'center',
    width: 80,
    alignItems: 'center',

  },
  botaotext: {
    fontSize: 20,
    marginBottom: 13,
    color: '#FFF',
    textAlign: 'center',
  },
  buttoncamera: {
    justifyContent: "center",
    alignItems: 'center',
    backgroundColor: 'black',
    margin: 20,
    height: 90,
    borderRadius: 20,

  },
  modal: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    margin: 20,
  },
});
