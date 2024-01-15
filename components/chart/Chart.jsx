import React, { useCallback, useEffect } from "react";
import { View, Dimensions, StyleSheet, Text } from "react-native";
import Animated, { useAnimatedProps, useDerivedValue, useSharedValue, withTiming } from "react-native-reanimated";
import Svg, { Circle } from "react-native-svg";
import { ReText } from "react-native-redash";
import { COLORS, SIZES } from "../../constants";

const CIRCLE_LENGTH = 1000
const R = (CIRCLE_LENGTH / (2.5 * Math.PI)).toFixed(2)

const AnimatedCircle = Animated.createAnimatedComponent(Circle)

const Chart = ({cpuUsage, ramUsage, containerStyle}) => {
  const BACKGROUND_STROKE_COLOR = '#303858'
  const progressCPU = useSharedValue(0)
  const progressRAM = useSharedValue(0)

  useEffect(() =>{
    progressCPU.value = withTiming((cpuUsage).toFixed(2), {duration: 1500});
    progressRAM.value = withTiming((ramUsage).toFixed(2), {duration: 1500});
    }, [cpuUsage, ramUsage])

  const animatedPropsCPU = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH * ( 1 - (progressCPU.value - 0.2)),
  }))

  const animatedPropsRAM = useAnimatedProps(() => ({
    strokeDashoffset: CIRCLE_LENGTH * ( 1 - (progressRAM.value > 0.5 ? progressRAM.value - 0.3 : progressRAM.value)),
  }))

  return (
    <View style={{ ...containerStyle}}>
      {/*<ReText
        style={{
          fontSize: 25,
          color: COLORS.lightGrey,
          width: 150,
          textAlign: 'center',
          justifyContent: 'flex-start',
        }}
        text={useDerivedValue(() => `CPU: ${Math.floor(progressCPU.value * 100)}%`)}
      />
      <ReText
        style={{
          fontSize: 25,
          color: COLORS.lightGrey,
          width: 150,
          textAlign: 'center',
        }}
        text={useDerivedValue(() => `RAM: ${Math.floor(progressRAM.value * 100)}%`)}
      />*/}
      <Svg>
        <Circle
          cx={SIZES.width / 2}
          cy={150}
          r={R}
          stroke={BACKGROUND_STROKE_COLOR}
          strokeWidth={30}
          fill="transparent"
        />
        <AnimatedCircle
          cx={SIZES.width / 2}
          cy={150}
          r={R}
          stroke={'#A6E1FA'}
          strokeWidth={15}
          strokeDasharray={CIRCLE_LENGTH}
          animatedProps={animatedPropsCPU}
          strokeLinecap={'round'}
          fill="transparent"
        />

        <Circle
          cx={SIZES.width / 2}
          cy={150}
          r={R - 40}
          stroke={BACKGROUND_STROKE_COLOR}
          strokeWidth={30}
          fill="transparent"
        />
        <AnimatedCircle
          cx={SIZES.width / 2}
          cy={150}
          r={R - 40}
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
