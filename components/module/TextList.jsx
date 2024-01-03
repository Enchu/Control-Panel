import React from "react";
import { Text, View } from "react-native";
import { COLORS, FONTS, SIZES } from "../../constants";

const TextList = ({ containerStyle,
                    inputContainerStyle,
                    placeholderL,
                    placeholderR,
                    inputStyleL,
                    inputStyleR,
                    prependComponent,
                    appendComponent
}) => {
  return (
    <View style={{ ...containerStyle}}>
      <View
        style={{
          marginBottom: SIZES.base,
          ...inputContainerStyle,
        }}
      >
        <View
          style={{
            flexDirection: "row",
          }}
        >
          {prependComponent}

          <Text
            style={{
              width: "41%",
              marginRight: SIZES.padding,
              marginLeft: SIZES.base,
              color: COLORS.lightGrey,
              ...FONTS.h2,
              ...inputStyleL,
            }}
          >
            {placeholderL}
          </Text>

          <Text
            style={{
              color: COLORS.lightGrey,
              ...FONTS.h2,
              ...inputStyleR
            }}
          >
            {placeholderR}
          </Text>

          {appendComponent}
        </View>
      </View>
    </View>
  );
};

export default TextList;
