import React, { useCallback, useEffect } from "react";
import { View, Dimensions, StyleSheet, Text } from "react-native";
import Animated, { useAnimatedProps, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { ReText } from "react-native-redash";
import { COLORS, SIZES } from "../../constants";

const CIRCLE_LENGTH = 1000
const R = CIRCLE_LENGTH / (2 * Math.PI)
const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const Chart = ({cpuUsage, ramUsage, containerStyle}) => {
  const BACKGROUND_STROKE_COLOR = '#303858'
  const progressCPU = useSharedValue(0)
  const progressRAM = useSharedValue(0)

  useEffect(() =>{
    progressCPU.value = withTiming(Math.min(cpuUsage, 1), {duration: 1500})
    progressRAM.value = withTiming(Math.min(ramUsage, 1), {duration: 1500})
  }, [cpuUsage, ramUsage])

  const animatedPropsCPU = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH * ( 1 - progressCPU.value),
  }))

  const animatedPropsRAM = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH * ( 1 - progressRAM.value),
  }))

  //const {width, height} = Dimensions.get('window')

  /*const onPress = useCallback(() => {
    progressCPU.value = withTiming(progressCPU.value > 0 ? 0 : 1, {duration: 2000})
  }, [])*/


  return (
    <View style={{ ...containerStyle}}>
      <ReText
        style={{
          fontSize: 30,
          color: COLORS.lightGrey,
          width: 200,
          textAlign: 'center'
        }}
        text={useDerivedValue(() => `CPU: ${Math.floor(progressCPU.value * 100)}%`)}
      />
      <ReText
        style={{
          fontSize: 30,
          color: COLORS.lightGrey,
          width: 200,
          textAlign: 'center',
        }}
        text={useDerivedValue(() => `RAM: ${Math.floor(progressRAM.value * 100)}%`)}
      />
      <Svg style={{position: 'absolute'}}>
        <Circle
          cx={180}
          cy={175}
          r={R}
          stroke={BACKGROUND_STROKE_COLOR}
          strokeWidth={30}
          fill="transparent"
        />
        <AnimatedCircle
          cx={180}
          cy={175}
          r={R}
          stroke={'#A6E1FA'}
          strokeWidth={15}
          strokeDasharray={CIRCLE_LENGTH}
          animatedProps={animatedPropsCPU}
          strokeLinecap={'round'}
          fill="transparent"
        />

        <Circle
          cx={180}
          cy={175}
          r={R - 50}
          stroke={BACKGROUND_STROKE_COLOR}
          strokeWidth={30}
          fill="transparent"
        />
        <AnimatedCircle
          cx={180}
          cy={175}
          r={R - 50}
          stroke={'#e7288e'}
          strokeWidth={15}
          strokeDasharray={CIRCLE_LENGTH}
          animatedProps={animatedPropsRAM}
          strokeLinecap={'round'}
          fill="transparent"
        />
      </Svg>
    </View>
  );
};

export default Chart;
