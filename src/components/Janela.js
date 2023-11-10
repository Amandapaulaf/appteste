import React from "react";
import * as MediaLibrary from 'expo-media-library';
import { Image, Modal, View, TouchableOpacity, StyleSheet, Text } from "react-native";
import { FontAwesome } from '@expo/vector-icons';
import { useState, useEffect } from "react";
import {  ref, put, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import { storage } from "../config";


export default function Janela({ open, foto ,file}) {
    const [modalVisible, setModalVisible] = useState(open);
    const [id,setId] = useState(null);

    function generateUniqueID() {
        const timestamp = new Date().getTime();
        const randomNum = Math.floor(Math.random() * 10000);
        return `${timestamp}-${randomNum}`;
      }

    async function upload(){
        if(foto){
           
            const newId = generateUniqueID();
            const storageRef = ref(storage, `imagens/${newId}`);

            try {
              const response = await fetch(foto.uri);
              const blob = await response.blob();
          
              // Utilize a função put para enviar o blob para o Firebase Storage
              await put(storageRef, blob);
          
              // Obtenha a URL de download (opcional)
              const downloadURL = await getDownloadURL(storageRef);
              console.log('Imagem enviada com sucesso. URL:', downloadURL);
            } catch (error) {
              console.error('Erro ao enviar imagem para o Firebase:', error);
            }
        }
    }

    useEffect(() => {
        setModalVisible(true);
    }, [open]);
    


    async function savePicture() {
        if (foto) {
            const asset = await MediaLibrary.createAssetAsync(foto.uri)
                .then(() => {
                    alert('foto salva com sucesso');

                })
                .catch(error => { console.log('err', error); })
        }
        upload();
    }
    const closeModal = () => {
        setModalVisible(false);
    };

    return <>
        <Modal
            animationType='slide'
            transparent={false}
            visible={modalVisible}
        >
            <View style={styles.modal}>
                <View style={{ margin: 10, flexDirection: 'row' }}>
                    <TouchableOpacity style={{ margin: 40 }}
                        onPress={closeModal}>
                        <FontAwesome name="window-close" size={50} color="red" />
                    </TouchableOpacity>
                    <TouchableOpacity style={{ margin: 40 }} onPress={savePicture}>
                        <FontAwesome name="upload" size={50} color="blue" />
                    </TouchableOpacity>
                </View>
                <Image style={{ width: '100%', margin: 20, borderRadius: 20, height: 500 }} source={{ uri: foto.uri }} />
            </View>

        </Modal>
    </>
}
const styles = StyleSheet.create({
    modal: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        margin: 20,
    },
});