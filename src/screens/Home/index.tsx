import { useEffect, useState } from 'react';
import { Alert, Image, ScrollView, Text, View } from 'react-native';
import *as ImgePicker from 'expo-image-picker'
import *as ImageManipulator from 'expo-image-manipulator'
import { api } from '../../service/api';
import {foodContains} from '../../util/foodContains'
import { CustomModal } from "../../components/Modal"
import { translater } from "../../util/tranlate";

import { styles } from './styles';

import { Tip } from '../../components/Tip';
import { Item,ItemProps } from '../../components/Item';
import { Button } from '../../components/Button';
import { Loading } from '../../components/Loading';
import axios from 'axios';

export function Home() {

  const [selectedImageUri, setSelectedImageUri] = useState('');
  const [isLoading, setIsLoadin] = useState(false)
  const [items, setItem] = useState<ItemProps[]>([])
  const [message, setMessage] = useState('')

  const [modalVisible, setModalVisible] = useState(false);
  const [messageModal, setmessageModal] = useState('')

  const toggleModal = () => {
    setModalVisible(!modalVisible);
  };


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

  async function foodDetect(imageBase64:any | undefined) {

      const response = await api.post(`/v2/models/${process.env.EXPO_PUBLIC_API_MODEL_ID}/versions/${process.env.EXPO_PUBLIC_API_MODEL_VERSION_ID}/outputs`,{
        "user_app_id":{
          "user_id":process.env.EXPO_PUBLIC_API_USER_ID,
          "app_id":process.env.EXPO_PUBLIC_API_APP_ID
        },
        "inputs":[
          {
            "data":{
              "image":{
                "base64":imageBase64
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

      const traslayetr = await translater(concept)

      setItem(traslayetr)
      setIsLoadin(false)
      handleGenerateResponse(traslayetr)

  }


  async function handleGenerateResponse (objs:any)  {
     
    var al = ""

    for (const name in objs) {
      al+=objs[name].name+"\n"
    }
    const apiKey = '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'
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: 'gpt-3.5-turbo',
          messages: [{ role: 'system', content: 'You are a helpful assistant.' }, { role: 'user', content: `
            Olá, Quero que sejas um nutricionistas virtual para mim, aqui tem um objecto contento alimentos e outros tipos de informações: 
            ${al}
            quero que fazes uma filtragem apenas dos alimentos que contem na lista. 
            Em seguida me retorna a quantidade de nutrientes,proteína, carboidratos e demais propiedades que eles possuem. 
            Ao me retornar as resposta, responde como se fosse um nutricionista diante de paciente, começando dizendo, Olá! Seja bem-vindo ao seu acompanhamento nutricional virtual. Sou a IA-LD, sua nutricionista virtual e estou aqui para ajudar você a alcançar seus objetivos de saúde e bem-estar.
            Através desta plataforma, estaremos trabalhando juntos para criar um plano alimentar equilibrado e personalizado, levando em consideração suas preferências, necessidades nutricionais e metas. Você pode contar comigo para fornecer orientações sobre escolhas alimentares saudáveis, dicas para uma alimentação balanceada e informações sobre nutrientes essenciais.

            podes formatar o texto da resposta e adicionar emojis
            
            obs: Não te esqueças es um nutricionista e está lista contem os alimentos que eu pretendo comer neste momento
          ` }],
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${apiKey}`,
          },
        }
      );
      setmessageModal('')
      setmessageModal(response.data.choices[0]?.message?.content || '')
    } catch (error) {
      console.error('Error generating response:', error);
    }
  };
  

  return (
    <View style={styles.container}>

      <CustomModal visible={modalVisible} toggleModal={toggleModal} texto={messageModal}/>

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
            <Tip message='Consultar a sua nutricionista' onPress={toggleModal} />
            <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 24 }}>
              <View style={styles.items}>
                {
                  items.map((item)=>(
                    <Item key={item.key} data={item} />
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