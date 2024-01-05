import React, { useRef, useState } from "react";
import { Animated, View, Text } from "react-native";
import { COLORS, FONTS, SIZES, constants } from "../../constants";
import { TextButton } from "../../components/module";
import WalkthroughMainScreen from "./WalkthroughMainScreen";
import ControlPanel from "./ControlPanel";
import Metrics from "./Metrics";

const Walkthrough = ({navigation}) => {

  const [wallAnimationTwo, setWallAnimationTwo] = useState(false)
  const onViewChangeRef = useRef(({viewableItems, changed}) => {
    if(viewableItems[0].index === 0){
      setWallAnimationTwo(true);
    }
  })

  const scrollX = useRef(new Animated.Value(0)).current;

  const Dots = () => {
    const dotPosition = Animated.divide(scrollX, SIZES.width)

    return (
      <View
        style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center'
          }}
      >
        {
          constants.walkthrough.map((item, index) => {
            const dotColor = dotPosition.interpolate({
              inputRange: [index -1, index, index +1],
              outputRange: [COLORS.lightGrey, COLORS.support3, COLORS.lightGrey],
              extrapolate: "clamp",
            })

            return (
              <Animated.View
                key={`dot-${index}`}
                style={{
                  borderRadius: 5,
                  marginHorizontal: 6,
                  width: 10,
                  height: 10,
                  backgroundColor: dotColor
                }}
              />
            )
          })
        }
      </View>
    )
  }

  const renderFooter = () => {
    return (
      <View
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: SIZES.height * 0.1,
          alignItems: "center",
          justifyContent: "space-between",
          paddingHorizontal: SIZES.padding,
          paddingVertical: SIZES.height > 700 ? SIZES.padding : 20,
        }}
      >
        <Dots/>
      </View>
    )
  }

  return (
    <View
      style={{
        flex: 1,
        backgroundColor: COLORS.dark,
      }}
    >
      <Animated.FlatList
        data={constants.walkthrough}
        keyExtractor={(item) => item.id}
        horizontal
        snapToInterval={SIZES.width}
        decelerationRate="fast"
        showsHorizontalScrollIndicator={false}
        scrollEventThrottle={16}
        onViewableItemsChanged={onViewChangeRef.current}
        onScroll={Animated.event(
          [{ nativeEvent: { contentOffset: { x: scrollX, } } }],
          { useNativeDriver: false, }
        )}
        renderItem={({item, index}) => {
          return (
            <View
              style={{
                width: SIZES.width,
                justifyContent: 'center',
                backgroundColor: COLORS.dark
              }}
            >
              {/* Walkthrough Images */}
              <View
                style={{
                  flex: 1,
                  justifyContent: 'Top',
                }}
              >
                {index === 0 && <WalkthroughMainScreen/>}
                {index === 1 && <ControlPanel/>}
                {index === 2 && <Metrics/>}
              </View>

            </View>
          )
        }}
      />

      {renderFooter()}
    </View>
  );
};

export default Walkthrough;
