import { useState } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import *as ImgePicker from 'expo-image-picker'
import *as ImageManipulator from 'expo-image-manipulator'
import { api } from '../../service/api';
import {foodContains} from '../../util/foodContains'


import { styles } from './styles';

import { Tip } from '../../components/Tip';
import { Item,ItemProps } from '../../components/Item';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';

export function Home() {

  const [selectedImageUri, setSelectedImageUri] = useState('');
  const [isLoading, setIsLoadin] = useState(false)
  const [items, setItem] = useState<ItemProps[]>([])
  const [message, setMessage] = useState('')


  async function handleSelectImage() {

    try {
      
      const {status} = await ImgePicker.requestMediaLibraryPermissionsAsync();

      if(status !== ImgePicker.PermissionStatus.GRANTED){
        return Alert.alert("É necessario conceder permissão para acessar sua galeria!")
      }
      setIsLoadin(true)

      const response = await ImgePicker.launchImageLibraryAsync({
        mediaTypes: ImgePicker.MediaTypeOptions.Images,
        allowsEditing:true,
        aspect:[4,4],
        quality:1
      })
      if(response.canceled){
        return setIsLoadin(false)
      }
        
       
      if(!response.canceled){
        
        const imgManipuled = await ImageManipulator.manipulateAsync(
          response.assets[0].uri,
          [{resize:{width:900}}],
          {
            compress:1,
            format:ImageManipulator.SaveFormat.JPEG,
            base64:true
          }
        )
        setSelectedImageUri(imgManipuled.uri)
        foodDetect(imgManipuled.base64)
        
      }
       
    } catch (error) {
      
      console.log(error)
    }
    
  }

  async function foodDetect(imageBase64:string | undefined) {

      const response = await api.post(`/v2/models/${process.env.EXPO_PUBLIC_API_MODEL_ID}/versions/${process.env.EXPO_PUBLIC_API_MODEL_VERSION_ID}/outputs`,{
        "user_app_id":{
          "user_id":process.env.EXPO_PUBLIC_API_USER_ID,
          "app_id":process.env.EXPO_PUBLIC_API_APP_ID
        },
        "inputs":[
          {
            "data":{
              "image":{
                "url":"https://github.com/andersonigfrancisco.png"
              }
            }
          }
        ]
      })

      const concept = response.data.outputs[0].data.concepts.map((concept:any)=>{
        return {
          name: concept.name,
          percentage: `${concept.value * 100} %`
        }
      })

      const isVegetable = foodContains(concept,'vegetable');
      setMessage( isVegetable ? '' : 'Adiciona vegetal no seu prato!')

      setItem(concept)
      setIsLoadin(false)
  }

  return (
    <View style={styles.container}>
      <Button onPress={handleSelectImage} disabled={isLoading} />

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
     
        {
          isLoading ? <Loading/> : 
          <>
            {
              message && <Tip message={message}/>
            }
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 24 }}>
              <View style={styles.items}>
                {
                  items.map((item)=>(
                    <Item key={item.name} data={item} />
                  ))
                }
              </View>
            </ScrollView>
          </>
        }
      </View>
    </View>
  );
}