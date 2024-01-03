import React, { useEffect, useRef, useState } from "react";
import { Button, Modal, View, Text, TouchableOpacity, Animated, StyleSheet, Image } from "react-native";
import { FONTS, icons } from "../../constants";

export const ModalPoup = ({visible, children}) => {
  const [showModal, setShowModal] = useState(visible);
  const scaleValue = useRef(new Animated.Value(0)).current

  useEffect(() => {
    toggleModal()
  }, [visible]);

  const toggleModal = () => {
    if(visible){
      setShowModal(true)
      Animated.spring(scaleValue, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true
      }).start();
    }else{
      setTimeout(() => setShowModal(false), 200);
      Animated.timing(scaleValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true
      }).start();
    }
  }

  return (
    <Modal transparent visible={showModal}>
      <View style={styles.modalBackGround}>
        <Animated.View style={[styles.modalContainer, {transform: [{scale: scaleValue}]}]}>
          {children}
        </Animated.View>
      </View>
    </Modal>
  )
}

const ModalText = ({
                  iconsSource,
                  placeholderSource,
                  visibleSource
                   }) => {
  const [visible, setVisible] = useState(visibleSource)
  const [currentPlaceholder, setCurrentPlaceholder] = useState(placeholderSource)

  useEffect(() => {
    setVisible(visibleSource);
    setCurrentPlaceholder(placeholderSource);
  }, [visibleSource, placeholderSource]);

  return (
    <View
      style={{
        flex:1,
        justifyContent: 'center',
        alignItems: 'center'
     }}
    >
      <ModalPoup visible={visible}>
        <View style={{alignItems: 'center'}}>
          {/* CLOSE HEADER */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => setVisible(false)}>
              <Image
                source={icons.x}
                style={{
                  height: 30,
                  width: 30
                }}
              />
            </TouchableOpacity>
          </View>
        </View>

        {/* SUCCESS */}
        <View
          style={{
            alignItems: 'center'
          }}
        >
          <Image
            source={iconsSource}
            style={{
              height: 150,
              width: 150,
              marginVertical: 10,
            }}
          />
        </View>

        <Text
          style={{
            marginVertical: 30,
            textAlign: 'center',
            ...FONTS.h3
          }}
        >
          {currentPlaceholder}
        </Text>
      </ModalPoup>
      {/*<Button title='open modal' onPress={() => setVisible(true)}/>*/}
    </View>
  );
};

const styles = StyleSheet.create({
  modalBackGround: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    width: '80%',
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderRadius: 20,
    elevation: 20,
  },
  header: {
    width: '100%',
    height: 40,
    alignItems: 'flex-end',
    justifyContent: 'center',
  }
})

export default ModalText;
