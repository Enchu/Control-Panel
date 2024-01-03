import React, { useEffect, useRef, useState } from "react";
import { Image, Text, View } from "react-native";
import { COLORS, constants, FONTS, SIZES } from "../../constants";
import icons from "../../constants/icons";
import FormInfo from "../../components/module/FormInfo";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { MotiView } from "moti";
import { Shadow } from "react-native-shadow-2";
import { RESP } from "../../hooks/userApi";

const WalkthroughMainScreen = () => {
  const [network, setNetwork] = useState();

  const renderPanel = async () => {
    const pp = await RESP('http://10.0.2.2:5001/api/metrics/interfaces', 'GET')
    if(pp != null){
      setNetwork(pp)
    }
  }

  useEffect(() => {
    renderPanel()
  }, []);

  return (
    <View style={{backgroundColor: COLORS.dark}}>

      <View
        style={{
          paddingTop: SIZES.padding,
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <Text style={{...FONTS.h1, color: COLORS.lightGrey}}>Сетевые интерфейсы</Text>
      </View>


      <MotiView
        style={{
          marginTop: SIZES.padding,
          height: SIZES.height * 0.50,
          alignItems: 'center',
        }}
      >
        <Shadow>
          <View style={{
            width: SIZES.width - SIZES.base,
            padding: SIZES.base,
            borderRadius: SIZES.radius,
            backgroundColor: COLORS.dark08,
          }}>

            {/* 1 */}
            {
              network && network.result && network.result.networkInterfaceSettings && network.result.networkInterfaceSettings.map((item, index) => (
                <FormInfo
                  key={index}
                  containerStyle={{
                    backgroundColor: COLORS.error,
                  }}
                  placeholder={`eth${index + 1}`}
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
                  ipPlaceholder={item.ipAddress || '12. 12. 12. 19'}
                  maskPlaceholder={item.mask || '255. 255. 255. 0'}
                  gatewayPlaceholder={item.gateway || '172. 16. 31. 222'}
                />
              ))
            }

            {/* TEST */}
            {/*<FormInfo
              containerStyle={{
                backgroundColor: COLORS.error,
              }}
              placeholder="eth1"

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

              ipPlaceholder={
                network && network.result && network.result.networkInterfaceSettings && network.result.networkInterfaceSettings.length > 0
                  ? network.result.networkInterfaceSettings[0].ipAddress
                  : '12. 12. 12. 19'
              }
              maskPlaceholder={
                network && network.result && network.result.networkInterfaceSettings && network.result.networkInterfaceSettings.length > 0
                  ? network.result.networkInterfaceSettings[0].mask
                  : '255. 255. 255. 0'
              }
              gatewayPlaceholder={
                network && network.result && network.result.networkInterfaceSettings && network.result.networkInterfaceSettings.length > 0
                  ? network.result.networkInterfaceSettings[0].gateway
                  : '172. 16. 31. 222'
              }
            />*/}


          </View>
        </Shadow>
      </MotiView>

    </View>
  );
};

export default WalkthroughMainScreen;
