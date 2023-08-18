import React from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { View, Text, TouchableOpacity, Modal, StyleSheet, ScrollView } from 'react-native';

export const CustomModal = ({ visible, toggleModal,texto }:any) => {
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={visible}
      onRequestClose={toggleModal}
    >
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>

        <MaterialIcons
        name="free-breakfast"
        color="#14684E"
        size={45}
      />

        <ScrollView  showsVerticalScrollIndicator={false} contentContainerStyle={{ paddingVertical: 24 }}>
          <Text>{texto}</Text>
        </ScrollView>
          
          <TouchableOpacity onPress={toggleModal}>
            <Text style={styles.textOpen}>Finalizar sessão</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
    height:480,
    width:300
  },
  textOpen: {
    marginTop:10,
   color: "#14684E",
   textAlign:'center'
  },
  
});
