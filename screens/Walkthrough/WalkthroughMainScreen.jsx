import React, { useEffect, useState } from "react";
import { View, Text, Platform } from "react-native";
import { COLORS, FONTS, icons, SIZES } from "../../constants";
import { MotiView, useAnimationState } from "moti";
import { Shadow } from "react-native-shadow-2";
import { IconText, ModalText, TextButton, TextList } from "../../components/module";
import { RESP, RESPBODY } from "../../hooks/userApi";
import { useAuth } from "../../hooks/useAuth";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Chart from "../../components/chart/Chart";
import axios from "axios";
import RNFetchBlob from 'rn-fetch-blob';

const WalkthroughMainScreen = () => {
  const {ipSetup, user} = useAuth()

  const [panelInfo, setPanelInfo] = useState();
  const [metrics, setMetrics] = useState();

  const [mode, setMode] = useState("info");

  const [visible, setVisible] = useState(false)
  const [placeholderSource, setPlaceholderSource] = useState('');
  const [iconsSource, setIconsSource] = useState();

  //10.0.2.2:5001
  const renderPanel = async () => {
    const pp = await RESP(`http://${ipSetup}/api/metrics/state`, 'GET')

    if(pp != null){
      setPanelInfo(pp)
    }else{
      setIconsSource(icons.unsuccessful);
      setPlaceholderSource('Нет подключения');
    }
  }

  //base/command/
  const performAction = async (url, errorMessage) => {
    try {
      setVisible(false);
      const pp = await RESPBODY(user, url, 'GET', 5000);

      setIconsSource(icons.success);
      setPlaceholderSource(pp.result);
    } catch (error) {
      setIconsSource(icons.unsuccessful);
      setPlaceholderSource(errorMessage);
      console.log("performAction: " + error);
    }finally {
      setVisible(true);
      console.log("visible: " + visible)
    }
  };

  //restart-core
  const actionRestartPanel = async () => {
    setVisible(false);
    console.log("actionRest")
    try {
      const pp = await RESPBODY(user, `http://${ipSetup}/base/command/restart-core`, 'GET', 5000);

      if(pp.result === 'Устройство будет перезапущено.'){
        console.log("t")
        setIconsSource(icons.success);
        setPlaceholderSource(pp.result);
      }else{
        console.log("e")
        setIconsSource(icons.unsuccessful);
        setPlaceholderSource(pp.result);
      }
      console.log("f")
    } catch (error) {
      setIconsSource(icons.unsuccessful);
      setPlaceholderSource('Ошибка подключения');
      console.log("performAction: " + error);
    }finally {
      setVisible(true);
      console.log("visible: " + visible)
    }

    // await performAction(
    //   `http://${ipSetup}/base/command/restart-core`,
    //   'Error restarting'
    // );
  };

  //file-get
  const actionDownloadPanel = async () => {
    setVisible(false);
    console.log('try downloading')

    try{
      const response = await axios.get(`http://${ipSetup}/base/command/file-get`,{
        headers:{
          Authorization : `Bearer ${user}`
        },
        timeout: 5000,
      })

      const filePath = `${RNFetchBlob.fs.dirs.DownloadDir}/NameProject.zip`;

      console.log(filePath)
      console.log(response.data)

      await RNFetchBlob.fs.writeFile(filePath, response.data);

      setIconsSource(icons.success);
      setPlaceholderSource('Успешно скачено, в загрузки');
    }catch (e){
      setIconsSource(icons.unsuccessful);
      setPlaceholderSource('Ошибка подключения');
      console.error('Ошибка file-get:', e);
    }finally {
      setVisible(true);
      console.log("visible: " + visible)
    }

    /*RNFetchBlob
      .config({
        fileCache : true,
        path: `${downloadDir}/NameProject.zip`,
      })
      .fetch('GET', `http://${ipSetup}/base/command/file-get`, {
        Authorization : `Bearer ${user}`
      })
      .then((res) => {
        //const filePath = res.path();
        console.log('The file saved to', res.path())
        /!* AFTER DOWNLOAD *!/
        setIconsSource(icons.success);
        setPlaceholderSource('Успешно скачено');
      })
      .catch((errorMessage, statusCode) => {
        setIconsSource(icons.unsuccessful);
        setPlaceholderSource('Ошибка подключения');
        console.error('Ошибка file-get:', errorMessage);
      })
      .finally(() => {
        setVisible(true);
        console.log("visible: " + visible)
      })*/
  }

  //log-get
  const actionLogsPanel = async () => {
    setVisible(false);
    console.log('try logs')

    try{
      const response = await axios.get(`http://${ipSetup}/base/command/log-get`,{
        headers:{
          Authorization : `Bearer ${user}`
        },
        timeout: 5000,
      })

      const filePath = `${RNFetchBlob.fs.dirs.DownloadDir}/LogProject.zip`;

      console.log(filePath)
      console.log(response.data)

      await RNFetchBlob.fs.writeFile(filePath, response.data);

      setIconsSource(icons.success);
      setPlaceholderSource('Успешно скачено, в загрузки');
    }catch (e){
      setIconsSource(icons.unsuccessful);
      setPlaceholderSource('Ошибка подключения');
      console.error('Ошибка file-get:', e);
    }finally {
      setVisible(true);
      console.log("visible: " + visible)
    }
  };

  //file-set
  const actionFileSetPanel = async () => {
        await performAction(
          `http://${ipSetup}/base/command/file-set`,
          'Ошибка подключения'
        );
  };

  //file-set
  const actionUpdatePanel = async () => {
    await performAction(
      `http://${ipSetup}/base/command/file-set`,
      'Ошибка подключения'
    );
  };

  const animationState = useAnimationState({
    info:{
      height: SIZES.height * 0.55,
    },
    actions:{
      height: SIZES.height * 0.75,
    }
  });

  const cpuUsage = metrics && metrics.result ? (metrics.result.cpuUsagePercent / 100) : 0;
  const ramUsage = metrics && metrics.result ? (metrics.result.ramUsageMb) / 100 : 0;

  const metricsPanel = async () => {
    const pp = await RESP(`http://${ipSetup}/api/metrics/dynamic`, 'GET')
    if(pp!= null){
      setMetrics(pp);
    }
  }

  useEffect(() => {
    renderPanel()
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      metricsPanel()
    }, 2000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  useEffect(() => {
    animationState.transitionTo('info');
  }, []);

  const renderContainer = () => {
    if(mode === "info"){
      return renderInfoContainer()
    }else{
      return (
        <>
          {renderInfoContainer()}
          {renderActionsContainer()}
        </>
      );
    }
  }

  const renderInfoContainer = () => {
    return (
      <View>
        {/* List Data */}
        <TextList
          inputStyleL={{...FONTS.h2}}
          inputStyleR={{...FONTS.h2}}
          placeholderL='IP:'
          placeholderR={ipSetup}
        />
        {panelInfo && panelInfo.result && panelInfo.result.softwareVersion && (
          <TextList
            inputStyleL={{...FONTS.h2}}
            inputStyleR={{...FONTS.h2}}
            placeholderL='Версия ПО:'
            placeholderR={panelInfo.result.softwareVersion}
          />
        )}
        <TextList
          inputStyleL={{...FONTS.h2}}
          inputStyleR={{...FONTS.h2}}
          placeholderL='Проект:'
          placeholderR={panelInfo && panelInfo.result ? panelInfo.result.projectName || '123' : '123'}
        />
        <TextList
          inputStyleL={{...FONTS.h2}}
          inputStyleR={{...FONTS.h2}}
          placeholderL='В работе:'
          placeholderR={panelInfo && panelInfo.result ? panelInfo.result.inWork || '123' : '123'}
        />
        <TextList
          inputStyleL={{...FONTS.h2}}
          inputStyleR={{...FONTS.h2}}
          placeholderL='Атомов:'
          placeholderR={panelInfo && panelInfo.result ? panelInfo.result.atomsCount || '123' : '123'}
        />
        <TextList
          inputStyleL={{...FONTS.h2}}
          inputStyleR={{...FONTS.h2}}
          placeholderL='Блоков:'
          placeholderR={panelInfo && panelInfo.result ? panelInfo.result.blocksCount || '123' : '123'}
        />
        <TextList
          inputStyleL={{...FONTS.h2}}
          inputStyleR={{...FONTS.h2}}
          placeholderL='Клиентов:'
          placeholderR={panelInfo && panelInfo.result ? panelInfo.result.clientCount || '123' : '123'}
        />

        {/* LINE */}
        <View
          style={{
            borderBottomColor: COLORS.lightGrey,
            borderBottomWidth: 1,
            marginVertical: 10,
          }}
        />

        {/* CPU, RUM */}

        <TextList
          placeholderL='CPU:'
          placeholderR={metrics && metrics.result ? metrics.result.cpuUsagePercent + ' %' || '0%' : '0%'}
        />
        <TextList
          placeholderL='RAM:'
          placeholderR={metrics && metrics.result ? metrics.result.ramUsageMb + ' %' || '0%' : '0%'}
        />

          {/*<Chart
            cpuUsage={cpuUsage}
            ramUsage={ramUsage}
            containerStyle={{
              height: SIZES.height * 0.5,
              width: SIZES.width,
              justifyContent: 'center',
              alignItems: 'center',
            }}
          />*/}
      </View>
    )
  }

  const renderActionsContainer = () => {
    return (
      <View>
        <ModalText iconsSource={iconsSource} placeholderSource={placeholderSource} visibleSource={visible}/>

        {/* ICONS */}
        <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            {/* Reload */}
            <IconText
              containerStyle={{
                width: 120,
                height: 100,
                borderRadius: 10,
              }}
              icon={icons.restart}
              iconStyle={{ marginBottom: 10 }}
              label="Перезапустить"
              labelStyle={{ fontWeight: 'bold' }}
              onPress={() => {
                actionRestartPanel()
              }}
            />

            {/* Download */}
            <IconText
              containerStyle={{
                width: 120,
                height: 100,
                borderRadius: 10,
              }}
              icon={icons.download}
              iconStyle={{ marginBottom: 10 }}
              label="Скачать"
              labelStyle={{ fontWeight: 'bold' }}
              onPress={() => {
                actionDownloadPanel()
              }}
            />

            {/* Update */}
            <IconText
              containerStyle={{
                width: 120,
                height: 100,
                borderRadius: 10,
              }}
              icon={icons.edit}
              iconStyle={{ marginBottom: 10 }}
              label="Редактировать"
              labelStyle={{ fontWeight: 'bold' }}
              onPress={null}
            />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            {/* Get logs */}
            <IconText
              containerStyle={{
                width: 120,
                height: 100,
                borderRadius: 10,
              }}
              icon={icons.document}
              iconStyle={{ marginBottom: 10 }}
              label="Получить логи"
              labelStyle={{ fontWeight: 'bold' }}
              onPress={() => {
                actionLogsPanel()
              }}
            />

            {/* Upload */}
            <IconText
              containerStyle={{
                width: 120,
                height: 100,
                borderRadius: 10,
              }}
              icon={icons.pour}
              iconStyle={{ marginBottom: 10 }}
              label="Залить"
              labelStyle={{ fontWeight: 'bold' }}
              onPress={() => {
                actionFileSetPanel()
              }}
            />

            {/* Debug */}
            <IconText
              containerStyle={{
                width: 120,
                height: 100,
                borderRadius: 10,
              }}
              icon={icons.eyeblack}
              iconStyle={{ marginBottom: 10 }}
              label="Отладить"
              labelStyle={{ fontWeight: 'bold' }}
              onPress={null}
            />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            {/* Imitate */}
            <IconText
              containerStyle={{
                width: 120,
                height: 100,
                borderRadius: 10,
              }}
              icon={icons.play}
              iconStyle={{ marginBottom: 10 }}
              label="Имитировать"
              labelStyle={{ fontWeight: 'bold' }}
              onPress={null}
            />

            {/* Update */}
            <IconText
              containerStyle={{
                width: 120,
                height: 100,
                borderRadius: 10,
              }}
              icon={icons.update}
              iconStyle={{ marginBottom: 10 }}
              label="Обновить"
              labelStyle={{ fontWeight: 'bold' }}
              onPress={() => {
                actionUpdatePanel()
              }}
            />
            {/* Update */}
            <IconText
              containerStyle={{
                width: 120,
                height: 100,
                borderRadius: 10,
              }}
              iconStyle={{ marginBottom: 10 }}
              labelStyle={{ fontWeight: 'bold' }}
            />
          </View>

        </View>
      </View>
    )
  }

  const renderInfoContainerFooter = () => {
    return (
      <View
        style={{
          flexDirection: 'row',
          height: 80,
          alignItems: 'flex-end',
          justifyContent: 'center',
          marginTop:-30,
          marginHorizontal: SIZES.radius,
          paddingBottom: SIZES.radius,
          borderBottomLeftRadius: SIZES.radius,
          borderBottomRightRadius: SIZES.radius,
          zIndex: 0
        }}
      >
        <Text
          style={{
            color: COLORS.grey,
            ...FONTS.body5,
          }}
        >
          {mode === "info" ? "Показать" : "Скрыть"}
        </Text>

        <TextButton
          label={mode === "info" ? "Действия" : "Действия"}
          contentContainerStyle={{
            marginLeft: SIZES.base,
            backgroundColor: null,
          }}
          labelStyle={{
            color: COLORS.support3,
            ...FONTS.h5
          }}
          onPress={() => {
            if(animationState.current === 'info'){
              setVisible(false)
              animationState.transitionTo('actions')
              setMode("actions")
            }else {
              setVisible(false)
              animationState.transitionTo('info')
              setMode("info")
            }
          }}
        />
      </View>
    )
  }

  return (
    <View>

      <View
        style={{
          paddingTop: SIZES.padding,
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <Text style={{paddingTop: SIZES.radius,...FONTS.h1, color: COLORS.lightGrey}}>Панель управления</Text>
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
            <View style={{ width: SIZES.width - SIZES.base, padding: SIZES.base, borderRadius: SIZES.radius }}>

              <View>
                { renderContainer() }
              </View>

              {renderInfoContainerFooter()}


            </View>
          </Shadow>
          </KeyboardAwareScrollView>
        </MotiView>

    </View>
  );
};

export default WalkthroughMainScreen;
