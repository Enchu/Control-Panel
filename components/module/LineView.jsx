import React from "react";
import { COLORS } from "../../constants";
import { View } from "react-native";

const LineView = ({containerStyle}) => {
  return (
    <View
      style={{
        borderBottomWidth: 1,
        marginVertical: 10,
        ...containerStyle
      }}
    />
  );
};

export default LineView;
