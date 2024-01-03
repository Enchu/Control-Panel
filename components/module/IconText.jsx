import React from 'react';
import { TouchableOpacity, Text, View, Image } from "react-native";
import { FONTS, COLORS } from "../../constants";

const IconText = ({
                      containerStyle,
                      icon,
                      iconStyle,
                      label,
                      labelStyle,
                      onPress
                    }) => {
  return (
    <TouchableOpacity
      style={{
        alignItems: 'center',
        justifyContent: 'center',
        ...containerStyle
      }}
      onPress={onPress}
    >
      <View style={{ alignItems: 'center' }}>
        <Image
          source={icon}
          resize="contain"
          style={{
            width: 30,
            height: 30,
            marginBottom: 5,
            ...iconStyle
          }}
        />
        <Text style={{ ...FONTS.h3, color: COLORS.lightGrey, ...labelStyle }}>
          {label}
        </Text>
      </View>
    </TouchableOpacity>
  );
};


export default IconText;
