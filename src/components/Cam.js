import React from "react";
import { useRef, useState , useEffect} from "react";
import { Camera } from "expo-camera";
import { StyleSheet, TouchableOpacity, View , Text} from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import Janela from "./Janela";

export default function Cam({loc}) {
    const camRef = useRef(null);
    const [type, setType] = useState(Camera.Constants.Type.back);
    const [capturedPhoto, setCapturedPhoto] = useState(null);
    const [open, setOpen] = useState(false);
    const [imagem, setImagem] = useState(null);

    useEffect(() => {
        // useEffect é chamado sempre que 'imagem' é atualizado
        if (imagem) {
          setOpen(true);
        }
      }, [imagem]);
  
    async function takePicture() {
        if (camRef) {
            const data = await camRef.current.takePictureAsync();
            setCapturedPhoto({
                uri: data.uri,
                latitude: loc.locLatitude,
                longitude: loc.locLongitude,
            });
            const fileName = uri.split('/').pop();
            const file = {
              uri: data.uri,
              name: fileName,
              type: 'image/jpg',
            };
            setImagem(file);
            console.log(data);
           
        }
    }
    return <>
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
        {capturedPhoto && <Janela open={open} foto={capturedPhoto} file={imagem}/>}
    </>
}
const styles = StyleSheet.create({
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
})