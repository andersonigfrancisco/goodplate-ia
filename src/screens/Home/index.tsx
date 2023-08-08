import { useState } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import *as ImgePicker from 'expo-image-picker'
import *as ImageManipulator from 'expo-image-manipulator'


import { styles } from './styles';

import { Tip } from '../../components/Tip';
import { Item } from '../../components/Item';
import { Button } from '../../components/Button';

export function Home() {
  const [selectedImageUri, setSelectedImageUri] = useState('');

  async function handleSelectImage() {

    try {
      
      const {status} = await ImgePicker.requestMediaLibraryPermissionsAsync();

      if(status !== ImgePicker.PermissionStatus.GRANTED){
        return Alert.alert("É necessario conceder permissão para acessar sua galeria!")
      }
      const response = await ImgePicker.launchImageLibraryAsync({
        mediaTypes: ImgePicker.MediaTypeOptions.Images,
        allowsEditing:true,
        aspect:[4,4],
        quality:1
      })
      if(response.canceled)
        return;
      else
        setSelectedImageUri(response.assets[0].uri)
    } catch (error) {
      
      console.log(error)
    }
    
   }

  return (
    <View style={styles.container}>
      <Button onPress={handleSelectImage} />

      {
        selectedImageUri ?
          <Image
            source={{ uri: selectedImageUri }}
            style={styles.image}
            resizeMode="cover"
          />
          :
          <Text style={styles.description}>
            Selecione a foto do seu prato para analizar.
          </Text>
      }

      <View style={styles.bottom}>
        <Tip message="Aqui vai uma dica" />

        <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 24 }}>
          <View style={styles.items}>
            <Item data={{ name: 'Vegetal', percentage: '95%' }} />
          </View>
        </ScrollView>
      </View>
    </View>
  );
}