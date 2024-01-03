import React from 'react';
import {COLORS, FONTS, SIZES} from "../../constants";
import {Text, View} from "react-native";

const FormInput = ({
                     containerStyle,
                     inputContainerStyle,
                     placeholder,
                     inputStyle,
                     prependComponent,
                     appendComponent,
                     ipPlaceholder,
                     maskPlaceholder,
                     gatewayPlaceholder,
                   }) => {
  return (
    <View style={{ ...containerStyle, backgroundColor: COLORS.dark, }}>
      <View
        style={{
          flexDirection: "row",
          height: 55,
          paddingHorizontal: SIZES.radius,
          borderRadius: SIZES.radius,
          alignItems: "center",
          ...inputContainerStyle,
        }}
      >
        {prependComponent}

        <Text
          style={{
            color: COLORS.lightGrey,
            flex: 1,
            paddingVertical: 0,
            ...FONTS.body2,
            ...inputStyle,
            marginLeft: SIZES.base,
          }}
        >
          {placeholder}
        </Text>

        {appendComponent}
      </View>

      <View style={{marginBottom: SIZES.base}}>

        {/* Text */}
        <View
          style={{
            flexDirection: "row",
            marginRight: SIZES.padding,
            marginLeft: SIZES.base
          }}
        >
          <Text
            style={{
              width: "35%",
              marginRight: SIZES.padding,
              marginLeft: SIZES.base,
              color: COLORS.lightGrey,
              ...FONTS.h2
            }}
          >
            IP:
          </Text>
          <Text
            style={{
              color: COLORS.lightGrey,
              ...FONTS.h2
            }}
          >
            {ipPlaceholder}
          </Text>

        </View>

        {/* Text 2 */}
        <View
          style={{
            flexDirection: "row",
            marginRight: SIZES.padding,
            marginLeft: SIZES.base,
          }}
        >
          <Text
            style={{
              width: "35%",
              marginRight: SIZES.padding,
              marginLeft: SIZES.base,
              color: COLORS.lightGrey,
              ...FONTS.h2,
            }}
          >
            Mask:
          </Text>

          <Text
            style={{
              color: COLORS.lightGrey,
              ...FONTS.h2
            }}
          >
            {maskPlaceholder}
          </Text>

        </View>

        {/* Text 3 */}
        <View
          style={{
            flexDirection: "row",
            marginRight: SIZES.padding,
            marginLeft: SIZES.base
          }}
        >
          <Text
            style={{
              width: "35%",
              marginRight: SIZES.padding,
              marginLeft: SIZES.base,
              color: COLORS.lightGrey,
              ...FONTS.h2,
            }}
          >
            Gateway:
          </Text>

          <Text
            style={{
              color: COLORS.lightGrey,
              ...FONTS.h2
            }}
          >
            {gatewayPlaceholder}
          </Text>

        </View>
      </View>

    </View>
  );
};

export default FormInput;
