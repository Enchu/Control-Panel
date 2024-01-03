import React, { useEffect, useState } from "react";
import { View, Text, ScrollView } from "react-native";
import { COLORS, FONTS, icons, SIZES } from "../../constants";
import { MotiView, useAnimationState } from "moti";
import { Shadow } from "react-native-shadow-2";
import { IconText, ModalText, TextButton, TextList } from "../../components/module";
import { RESP, RESPBODY } from "../../hooks/userApi";
import { useAuth } from "../../hooks/useAuth";

const WalkthroughMainScreen = () => {
  const {ipSetup, user} = useAuth()

  const [panelInfo, setPanelInfo] = useState();
  const [metrics, setMetrics] = useState();

  const [mode, setMode] = useState("info");

  const [visible, setVisible] = useState(false)
  const [placeholderSource, setPlaceholderSource] = useState('');
  const [iconsSource, setIconsSource] = useState();

  const renderPanel = async () => {
    const pp = await RESP('http://10.0.2.2:5001/api/metrics/state', 'GET')

    console.log(pp)

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
      const pp = await RESPBODY(user, url, 'GET', 1000);

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
    await performAction(
      'http://10.0.2.2:5001/base/command/restart-core',
      'Error restarting'
    );
  };

  //file-get
  const actionDownloadPanel = async () => {
    await performAction(
      'http://10.0.2.2:5001/base/command/file-get',
      'Error file-get'
    );
  };

  //log-get
  const actionLogsPanel = async () => {
    await performAction(
      'http://10.0.2.2:5001/base/command/log-get',
      'Error log-get'
    );
  };

  //file-set
  const actionFileSetPanel = async () => {
    await performAction(
      'http://10.0.2.2:5001/base/command/file-set',
      'Error file-set'
    );
  };

  //file-set
  const actionUpdatePanel = async () => {
    await performAction(
      'http://10.0.2.2:5001/base/command/file-set',
      'Error file-set'
    );
  };

  const metricsPanel = async () => {
    const pp = await RESP('http://10.0.2.2:5001/api/metrics/dynamic', 'GET')
    if(pp!= null){
      setMetrics(pp)
    }
  }

  const animationState = useAnimationState({
    info:{
      height: SIZES.height * 0.55,
    },
    actions:{
      height: SIZES.height * 0.75,
    }
  });

  useEffect(() => {
    renderPanel()

    const interval = setInterval(() => {
      metricsPanel()
    }, 1000);

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
          placeholderL='IP:'
          placeholderR={ipSetup != null ? ipSetup : '10.0.2.2:5001'}
        />
        {panelInfo && panelInfo.result && panelInfo.result.softwareVersion && (
          <TextList
            placeholderL='Версия ПО:'
            placeholderR={panelInfo.result.softwareVersion}
          />
        )}
        <TextList
          placeholderL='Проект:'
          placeholderR={panelInfo && panelInfo.result ? panelInfo.result.projectName || '123' : '123'}
        />
        <TextList
          placeholderL='В работе:'
          placeholderR={panelInfo && panelInfo.result ? panelInfo.result.inWork || '123' : '123'}
        />
        <TextList
          placeholderL='Атомов:'
          placeholderR={panelInfo && panelInfo.result ? panelInfo.result.atomsCount || '123' : '123'}
        />
        <TextList
          placeholderL='Блоков:'
          placeholderR={panelInfo && panelInfo.result ? panelInfo.result.blocksCount || '123' : '123'}
        />
        <TextList
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

            {/* Dowload */}
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
            {/* Получить логи */}
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

            {/* Залить */}
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
              onPress={() => {actionFileSetPanel}}
            />

            {/* Отладить */}
            <IconText
              containerStyle={{
                width: 120,
                height: 100,
                borderRadius: 10,
              }}
              icon={icons.eye}
              iconStyle={{ marginBottom: 10 }}
              label="Отладить"
              labelStyle={{ fontWeight: 'bold' }}
              onPress={null}
            />
          </View>

          <View style={{ flexDirection: 'row', justifyContent: 'space-between', width: '100%' }}>
            {/* Имитировать */}
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

            {/* Обновить */}
            <IconText
              containerStyle={{
                width: 120,
                height: 100,
                borderRadius: 10,
                backgroundColor: 'lightblue',
              }}
              icon={icons.update}
              iconStyle={{ marginBottom: 10 }}
              label="Обновить"
              labelStyle={{ fontWeight: 'bold' }}
              onPress={() => {
                actionUpdatePanel()
              }}
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
          {mode === "info" ? "Show" : "Hide?"}
        </Text>

        <TextButton
          label={mode === "info" ? "Actions" : "Info"}
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
    <View style={{backgroundColor: COLORS.dark}}>

      <View
        style={{
          paddingTop: SIZES.padding,
          alignItems: 'center',
          justifyContent: 'flex-start',
        }}
      >
        <Text style={{...FONTS.h1, color: COLORS.lightGrey}}>Панель управления</Text>
      </View>

        <MotiView
          style={{
            marginTop: SIZES.padding,
            height: SIZES.height * 0.75,
            alignItems: 'center',
          }}
        >
          <ScrollView>
            <Shadow>
            <View style={{ width: SIZES.width - SIZES.base, padding: SIZES.base, borderRadius: SIZES.radius }}>

              <View>
                { renderContainer() }
              </View>

              {renderInfoContainerFooter()}


            </View>
          </Shadow>
          </ScrollView>
        </MotiView>

    </View>
  );
};

export default WalkthroughMainScreen;
