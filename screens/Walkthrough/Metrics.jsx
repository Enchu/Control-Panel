import React, { useEffect, useState } from "react";
import { ScrollView, Text, View } from "react-native";
import { COLORS, FONTS, SIZES } from "../../constants";
import { LineView, TextList } from "../../components/module";
import { MotiView } from "moti";
import { Shadow } from "react-native-shadow-2";
import { RESP } from "../../hooks/userApi";
import { useAuth } from "../../hooks/useAuth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const Metrics = () => {
  const {ipSetup} = useAuth()

  //Date
  const currentDate = new Date();
  const options = {
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    timeZone: 'Europe/Moscow',
    timeZoneName: 'short',
  };
  const formattedDate = currentDate.toLocaleString('ru-RU', options);

  const [metrics, setMetrics] = useState();
  const [responseTime, setResponseTime] = useState();

  const renderPanel = async () => {
    const startTime = performance.now();

    const pp = await RESP(`http://${ipSetup}/api/metrics/dynamic`, 'GET')

    if(pp != null){
      const elapsedTime = performance.now() - startTime;
      const elapsedTimeInSeconds = Math.round(elapsedTime);

      setResponseTime(elapsedTimeInSeconds);

      setMetrics(pp)
    }
  }

  useEffect(() => {
    const interval = setInterval(() => {
      renderPanel()
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <View>

      <View
        style={{
          paddingTop: SIZES.padding,
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <Text style={{paddingTop: SIZES.radius,...FONTS.h1, color: COLORS.lightGrey}}>Метрики</Text>
      </View>

      <MotiView
        style={{
          marginTop: SIZES.padding,
          height: SIZES.height * 0.75,
          alignItems: 'center',
        }}
      >
        <KeyboardAwareScrollView>
          <Shadow>
            <View style={{
              width: SIZES.width - SIZES.base,
              padding: SIZES.base,
              borderRadius: SIZES.radius,
            }}>

              {/* List Data */}
              <TextList
                inputStyleL={{...FONTS.h3}}
                inputStyleR={{...FONTS.h3}}
                placeholderL='Инициализация:'
                placeholderR={metrics && metrics.result ? metrics.result.creationTime || '3.0 сек' : '3.0 сек'}
              />
              <TextList
                inputStyleL={{...FONTS.h3}}
                inputStyleR={{...FONTS.h3}}
                placeholderL='Конфигурирование:'
                placeholderR={metrics && metrics.result ? metrics.result.configurationTime || '3.0 сек' : '3.0 сек'}
              />
              <TextList
                inputStyleL={{...FONTS.h3}}
                inputStyleR={{...FONTS.h3}}
                placeholderL='Запуск:'
                placeholderR={metrics && metrics.result ? metrics.result.startCallTime || '3.0 сек' : '3.0 сек'}
              />

              {/* LINE */}
              <LineView
                containerStyle={{
                  borderBottomColor: COLORS.lightGrey
                }}
              />

              <TextList
                inputStyleL={{...FONTS.h3}}
                inputStyleR={{...FONTS.h3}}
                placeholderL='Версии ОС:'
                placeholderR='Linux'
              />
              <TextList
                inputStyleL={{...FONTS.h3}}
                inputStyleR={{...FONTS.h3}}
                placeholderL='Версии ALiSe:'
                placeholderR=''
              />
              <TextList
                inputStyleL={{...FONTS.h3}}
                inputStyleR={{...FONTS.h3}}
                placeholderL='Версии Booter:'
                placeholderR='Linux'
              />

              {/* LINE */}
              <LineView
                containerStyle={{
                  borderBottomColor: COLORS.lightGrey
                }}
              />

              <TextList
                inputStyleL={{...FONTS.h3}}
                inputStyleR={{...FONTS.h3}}
                placeholderL='Время:'
                placeholderR={metrics && metrics.result ? metrics.result.curentDeviceTimeString || formattedDate : formattedDate}
              />
              <TextList
                inputStyleL={{...FONTS.h3}}
                inputStyleR={{...FONTS.h3}}
                placeholderL='CPU:'
                placeholderR={metrics && metrics.result ? metrics.result.cpuUsagePercent + ' %' || '0%' : '0%'}
              />
              <TextList
                inputStyleL={{...FONTS.h3}}
                inputStyleR={{...FONTS.h3}}
                placeholderL='RAM:'
                placeholderR={metrics && metrics.result ? metrics.result.ramUsageMb + ' %' || '0%' : '0%'}
              />
              <TextList
                inputStyleL={{...FONTS.h3}}
                inputStyleR={{...FONTS.h3}}
                placeholderL='Температура CPU:'
                placeholderR={metrics && metrics.result ? metrics.result.cpuTemperature + ' %' || '0%' : '0%'}
              />
              <TextList
                inputStyleL={{...FONTS.h3}}
                inputStyleR={{...FONTS.h3}}
                placeholderL='Загрузка диспетчера:'
                placeholderR={metrics && metrics.result ? metrics.result.dispatcherLoad + ' %' || '0%' : '0%'}
              />
              <TextList
                inputStyleL={{...FONTS.h3}}
                inputStyleR={{...FONTS.h3}}
                placeholderL='Очередь:'
                placeholderR={metrics && metrics.result ? metrics.result.queueLength || '' : ''}
              />
              <TextList
                inputStyleL={{...FONTS.h3}}
                inputStyleR={{...FONTS.h3}}
                placeholderL='Операций в секунду:'
                placeholderR={metrics && metrics.result ? metrics.result.opInSec || '' : ''}
              />
              <TextList
                inputStyleL={{...FONTS.h3}}
                inputStyleR={{...FONTS.h3}}
                placeholderL='Операция максимум:'
                placeholderR={metrics && metrics.result ? metrics.result.opMax || '' : ''}
              />
              <TextList
                inputStyleL={{...FONTS.h3}}
                inputStyleR={{...FONTS.h3}}
                placeholderL='Операция среднее:'
                placeholderR={metrics && metrics.result ? metrics.result.opAvg || '' : ''}
              />
              <TextList
                inputStyleL={{...FONTS.h3}}
                inputStyleR={{...FONTS.h3}}
                placeholderL='Ошибок:'
                placeholderR={metrics && metrics.result ? metrics.result.opFailed || '' : ''}
              />
              <TextList
                inputStyleL={{...FONTS.h3}}
                inputStyleR={{...FONTS.h3}}
                placeholderL='Время ответа:'
                placeholderR={responseTime !== undefined ? responseTime + ' мсек' : '0 мсек'}
              />


            </View>
          </Shadow>
        </KeyboardAwareScrollView>
      </MotiView>

    </View>
  );
};

export default Metrics;
