import React from 'react';
import {COLORS, FONTS, SIZES} from "../../constants";
import {TextInput, View} from "react-native";

const FormInput = ({
                     containerStyle,
                     inputContainerStyle,
                     placeholder,
                     inputStyle,
                     value = "",
                     prependComponent,
                     appendComponent,
                     onChange,
                     onPress,
                     editable,
                     secureTextEntry,
                     keyboardType = "default",
                     autoCompleteType = "off",
                     autoCapitalize = "none",
                     maxLength,
                     placeholderTextColor = COLORS.grey60,
                   }) => {
  return (
    <View style={{...containerStyle}}>
      <View style={{
        flexDirection: "row",
        height: 55,
        paddingHorizontal: SIZES.radius,
        borderRadius: SIZES.radius,
        alignItems: "center",
        backgroundColor: COLORS.lightGrey,
        ...inputContainerStyle
      }}>
        {prependComponent}

        <TextInput style={{
          flex: 1,
          paddingVertical: 0,
          ...FONTS.body3,
          ...inputStyle,
        }}
                   value={value}
                   placeholder={placeholder}
                   placeholderTextColor={placeholderTextColor}
                   secureTextEntry={secureTextEntry}
                   keyboardType={keyboardType}
                   autoCompleteType={autoCompleteType}
                   autoCapitalize={autoCapitalize}
                   maxLength={maxLength}
                   onChangeText={onChange}
                   onPress={onPress}
                   editable={editable}
        />

        {appendComponent}

      </View>
    </View>
  )

};

export default FormInput;
