import React, { useEffect, useState} from 'react';
import {StyleSheet, View, Text, Image, Modal, FlatList, TouchableOpacity, TouchableWithoutFeedback} from "react-native";
import {COLORS, FONTS, SIZES} from "../../constants";
import {MotiView, useAnimationState} from 'moti';
import {Shadow} from "react-native-shadow-2";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import icons from "../../constants/icons";
import { CheckBox, CountryDropDown, FormInput, IconButton, ModalText, TextButton } from "../../components/module";
import axios from "axios";
import {useAuth} from "../../hooks/useAuth";

const styles = StyleSheet.create({
  authContainer: {
    flex: 1,
    width: SIZES.width - (SIZES.padding * 2),
    padding: SIZES.padding,
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.light,
  },
  socialButtonContainer: {
    width: 55,
    height: 55,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: SIZES.radius,
    backgroundColor: COLORS.grey20
  }
})

const Auth = ({navigation}) => {
  const [mode, setMode] = useState("signIn");
  const [isVisible, setIsVisible] = useState(false);

  const [countries, setCountries] = useState([]);
  const [showCountryModal, setShowCountryModal] = useState(false);

  const {login, register} = useAuth()

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [ip, setIp] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [selectedCountry, setSelectedCountry] = useState(null);
  const [termsChecked, setTermsChecked] = useState(false);

  const [showErrorModal, setShowErrorModal] = useState(false);

  const authHandler = async (email, password, ip) => {
    const jwt = await login(email, password, ip)
    console.log(jwt + "123");

    if(jwt != null) {
      console.log("Login successful")
      navigation.navigate("Walkthrough")
    }else{
      setShowErrorModal(true);
      console.log("Login unsuccessful");
    }
  }

  const registerHandler = async (email, password) => {
    register(email, password)
  }

  const animationState = useAnimationState({
    signIn:{
      height: SIZES.height * 0.55,
    },
    signUp:{
      height: SIZES.height * 0.7,
    }
  });

  const renderAuthContainer = () => {
    if(mode === "signIn"){
      return renderSignIn()
    }else{
      return renderSignUp()
    }
  }

  useEffect(() => {
    animationState.transitionTo('signIn');

    /*axios.get('https://restcountries.com/v3.1/all')
      .then(response => {
        const data = response.data;
        let countryData = data.slice(0, 150).map(item => ({
          code: item.cca2,
          name: item.name.common,
          callingCode: `+${item.cca2}`,
          flag: item.flags.png || item.flags.svg,
        }));

        setCountries(countryData);
      })
      .catch(error => {
        console.log('Ошибка при запросе данных:', error);
        if (error.response) {
          console.log('Response data:', error.response.data);
          console.log('Response status:', error.response.status);
          console.log('Response headers:', error.response.headers);
        } else if (error.request) {
          console.log('Request made but no response received:', error.request);
        } else {
          console.log('Error setting up the request:', error.message);
        }
      });*/
  }, []);

  useEffect(() => {
    if (showErrorModal) {
      console.log('123');
      <ModalText iconsSource={icons.unsuccessful} placeholderSource='Ошибка подключения' visibleSource={showErrorModal}/>
    }
  }, [showErrorModal]);

  const renderSignIn = () => {
    return (
      <MotiView
        state={animationState}
        style={{marginTop: SIZES.padding, height: SIZES.height * 0.55}}
      >
        <Shadow>
          <View style={styles.authContainer}>

            <Text style={{width: '60%', lineHeight: 50, color: COLORS.dark, ...FONTS.h1}}>
              Sign in to continue
            </Text>

            <KeyboardAwareScrollView
              enableOnAndroid={true}
              keyboardDismissMode={"on-drag"}
              keyboardShouldPersistTaps={"handled"}
              extraScrollHeight={-300}
              contextContainerStyle={{
                flexGrow: 1,
                justifyContent: 'center',
              }}
            >
              {/* IP */}
              <FormInput
                containerStyle={{
                  marginTop: SIZES.padding,
                  borderRadius: SIZES.radius,
                  backgroundColor: COLORS.error
                }}
                placeholder="IP"
                value={ip}
                onChange={(text) => setIp(text)}
                prependComponent={
                  <Image
                    source={icons.flash}
                    style={{
                      width: 25,
                      height: 25,
                      marginRight: SIZES.base
                    }}
                  />
                }
              />

              {/* EMAIl */}
              <FormInput
                containerStyle={{
                  marginTop: SIZES.padding,
                  borderRadius: SIZES.radius,
                  backgroundColor: COLORS.error
                }}
                placeholder="Email"
                value={email}
                onChange={(text) => setEmail(text)}
                prependComponent={
                  <Image
                    source={icons.email}
                    style={{
                      width: 25,
                      height: 25,
                      marginRight: SIZES.base
                    }}
                  />
                }
              />

              {/* PASSWORD */}
              <FormInput
                containerStyle={{
                  marginTop: SIZES.radius,
                  borderRadius: SIZES.radius,
                  backgroundColor: COLORS.error
                }}
                placeholder="Password"
                value={password}
                secureTextEntry={!isVisible}
                onChange={(text) => setPassword(text)}
                prependComponent={
                  <Image
                    source={icons.lock}
                    style={{
                      width: 25,
                      height: 25,
                      marginRight: SIZES.base
                    }}
                  />
                }
                appendComponent={
                  <IconButton
                    icon={isVisible ? icons.eye_off : icons.eye}
                    iconStyle={{
                      tintColor: COLORS.grey
                    }}
                    onPress={() => setIsVisible(!isVisible)}
                  />
                }
              />

              {/* FORGOT */}
              <View style={{alignItems: 'flex-end'}}>
                <TextButton
                  label="Forgot Password"
                  contentContainerStyle={{marginTop: SIZES.radius, backgroundColor: null}}
                  labelStyle={{color: COLORS.support3, ...FONTS.h4}}
                />
              </View>

            </KeyboardAwareScrollView>

            {/* LOG IN */}
            <TextButton
              label="Log In"
              contentContainerStyle={{
                height: 55,
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.primary
              }}
              labelStyle={{...FONTS.h3}}
              onPress={() => authHandler(email, password, ip)}
            />

          </View>
        </Shadow>
      </MotiView>
    )
  }

  const renderSignUp = () => {
    return (
      <MotiView
        state={animationState}
        style={{marginTop: SIZES.padding, height: SIZES.height * 0.7}}
      >
        <Shadow>
          <View style={styles.authContainer}>
            <Text style={{width: '60%', lineHeight: 50, ...FONTS.h1}}>
              Create new account
            </Text>

            <KeyboardAwareScrollView
              enableOnAndroid={true}
              keyboardDismissMode={"on-drag"}
              keyboardShouldPersistTaps={"handled"}
              extraScrollHeight={-300}
              contextContainerStyle={{
                flexGrow: 1,
                marginTop: SIZES.padding,
                paddingBottom: SIZES.padding * 2,
              }}
            >

              {/* NAME */}
              <FormInput
                containerStyle={{
                  borderRadius: SIZES.radius,
                  backgroundColor: COLORS.error
                }}
                placeholder="Name"
                value={name}
                onChange={(text) => setName(text)}
                prependComponent={
                  <Image
                    source={icons.person}
                    style={{
                      width: 25,
                      height: 25,
                      marginRight: SIZES.base
                    }}
                  />
                }
              />

              {/* Email */}
              <FormInput
                containerStyle={{
                  marginTop: SIZES.radius,
                  borderRadius: SIZES.radius,
                  backgroundColor: COLORS.error
                }}
                placeholder="Email"
                value={email}
                onChange={(text) => setEmail(text)}
                prependComponent={
                  <Image
                    source={icons.person}
                    style={{
                      width: 25,
                      height: 25,
                      marginRight: SIZES.base
                    }}
                  />
                }
              />

              {/* Phone */}
              <FormInput
                containerStyle={{
                  marginTop: SIZES.radius,
                  borderRadius: SIZES.radius,
                  backgroundColor: COLORS.error
                }}
                placeholder="Phone"
                value={phone}
                onChange={(text) => setPhone(text)}
                prependComponent={
                  <Image
                    source={icons.phone}
                    style={{
                      width: 25,
                      height: 25,
                      marginRight: SIZES.base
                    }}
                  />
                }
              />

              {/* COUNTRY */}
              <CountryDropDown
                containerStyle={{
                  marginTop: SIZES.radius
                }}
                selectedCountry={selectedCountry}
                onPress={() => setShowCountryModal(!showCountryModal)}
              />

              {/* PASSWORD */}
              <FormInput
                containerStyle={{
                  marginTop: SIZES.radius,
                  borderRadius: SIZES.radius,
                  backgroundColor: COLORS.error
                }}
                placeholder="Password"
                value={password}
                secureTextEntry={!isVisible}
                onChange={(text) => setPassword(text)}
                prependComponent={
                  <Image
                    source={icons.lock}
                    style={{
                      width: 25,
                      height: 25,
                      marginRight: SIZES.base
                    }}
                  />
                }
                appendComponent={
                  <IconButton
                    icon={isVisible ? icons.eye_off : icons.eye}
                    iconStyle={{
                      tintColor: COLORS.grey
                    }}
                    onPress={() => setIsVisible(!isVisible)}
                  />
                }
              />

              {/*Terms and Conditions*/}
              <CheckBox
                containerStyle={{
                  marginTop: SIZES.radius
                }}
                isSelected={termsChecked}
                onPress={() => setTermsChecked(!termsChecked)}
              />
            </KeyboardAwareScrollView>

            <TextButton
              label='Create Account'
              contentContainerStyle={{
                height: 55,
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.primary
              }}
              labelStyle={{...FONTS.h3}}
              onPress={() => registerHandler(email, password)}
            />

          </View>
        </Shadow>
      </MotiView>
    )
  }

  const renderCountryModal = () => {
    return (
      <Modal
        animationType="slide"
        transparent={true}
        visible={showCountryModal}
      >
        <TouchableWithoutFeedback onPress={() => setShowCountryModal(false)}>
          <View
            style={{
              flex:1,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: COLORS.dark80
            }}
          >
            <View
              style={{
                height: 400,
                width: SIZES.width * 0.8,
                backgroundColor: COLORS.light,
                borderRadius: SIZES.radius
              }}
            >
              <FlatList
                data={countries}
                KeyExtractor={(item) => item.code}
                contentContainerStyle={{
                  paddingHorizontal: SIZES.padding,
                  paddingBottom: SIZES.padding
                }}
                renderItem={({ item }) => {
                  return (
                    <TouchableOpacity
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        marginTop: SIZES.radius
                      }}
                      onPress={() => {
                        setSelectedCountry(item)
                        setShowCountryModal(false)
                      }}
                    >
                      <Image
                        source={{uri: item.flag}}
                        resizeMode="contain"
                        style={{
                          width:40,
                          height:30
                        }}
                      />
                      <Text
                        style={{
                          flex: 1,
                          marginLeft: 10,
                          fontSize: 16,
                          fontWeight: 'bold',
                          color: 'black'
                        }}
                      >
                        {item.name}
                      </Text>
                    </TouchableOpacity>
                  )
                }}
              />
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    )
  }

  const renderAuthContainerFooter = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          height: 80,
          alignItems: 'flex-end',
          justifyContent: 'center',
          marginTop:-30,
          marginHorizontal: SIZES.radius,
          paddingBottom: SIZES.radius,
          borderBottomLeftRadius: SIZES.radius,
          borderBottomRightRadius: SIZES.radius,
          backgroundColor: COLORS.light60,
          zIndex: 0
        }}
      >
        <Text
          style={{
            color: COLORS.grey,
            ...FONTS.body5,
          }}
        >
          {mode === "signIn" ? "Dont have an account" : "I already have an account?"}
        </Text>

        <TextButton
          label={mode === "signIn"? "Create a new account" : "Sign in"}
          contentContainerStyle={{
            marginLeft: SIZES.base,
            backgroundColor: null,
          }}
          labelStyle={{
            color: COLORS.support3,
            ...FONTS.h5
          }}
          onPress={() => {
            if(animationState.current === 'signIn'){
              animationState.transitionTo('signUp')
              setMode("signUp")
            }else {
              animationState.transitionTo('signIn')
              setMode("signIn")
            }
          }}
        />
      </View>
    )
  }

  const renderSocialLogins = () => {
    return (
      <View
        style={{
          flex: 1,
          alignItems: 'center',
          justifyContent: 'center',
          marginTop: -30,
          zIndex: -1
        }}
      >
        <Text
          style={{
            color: COLORS.dark,
            ...FONTS.body3,
          }}
        >
          Or login Witch
        </Text>

        <View
          style={{
            flexDirection: 'row',
            marginTop: SIZES.radius
          }}
        >
          {/* Twitter */}
          <IconButton
            icon={icons.twitter}
            iconStyle={{
              tintColor: COLORS.primary
            }}
            containerStyle={styles.socialButtonContainer}
          />

          {/* Google */}
          <IconButton
            icon={icons.google}
            iconStyle={{
              tintColor: COLORS.primary
            }}
            containerStyle={{...styles.socialButtonContainer, marginLeft: SIZES.radius}}
          />

          {/* Google */}
          <IconButton
            icon={icons.linkedin}
            iconStyle={{
              tintColor: COLORS.primary
            }}
            containerStyle={{...styles.socialButtonContainer, marginLeft: SIZES.radius}}
          />

        </View>
      </View>
    )
  }

  return (
    <View style={{ flex: 1, paddingHorizontal: SIZES.padding, backgroundColor: COLORS.lightGrey}}>
      <View style={{zIndex: 1}}>
        {renderAuthContainer()}
      </View>

      {renderAuthContainerFooter()}

      {mode === "signIn" && renderSocialLogins()}

      {/* Country Modal */}
      {renderCountryModal()}
    </View>
  );
};

export default Auth;
