import React, { useState } from 'react';
import {
  Text,
  View,
  Alert,
  SafeAreaView,
  Button,
  StyleSheet,
} from 'react-native';
import { scanOCR } from 'vision-camera-ocr';
import { runOnJS } from 'react-native-reanimated';

import {
  Camera,
  useCameraDevices,
  useFrameProcessor,
  CameraPosition,
} from 'react-native-vision-camera';

export default function Home() {
  const [text, setText] = useState('');
  const [cameraPosition, setCameraPosition] =
    useState < CameraPosition > 'front';
  const [isFlashOn, setIsFlashOn] = useState(false);

  const devices = useCameraDevices();
  const device = cameraPosition == 'front' ? devices.front : devices.back;

  const frameProcessor = useFrameProcessor((frame) => {
    'worklet';
    const data = scanOCR(frame);
    runOnJS(setText)(data.result.text);
  }, []);

  //   function handleToogleCameraPosition() {
  //     setCameraPosition((prevState) => (prevState == 'front' ? 'back' : 'front'));
  //   }

  //   function handleToogleFlash() {
  //     if (cameraPosition === 'front') {
  //       return Alert.alert('Flash', 'Utilize a câmera traseira para utilizar o flash');
  //     }
  //     setIsFlashOn((prevState) => !prevState);
  //   }
  if (!device) {
    return <Text>Carregando...</Text>;
  }
  return (
    <>
      <SafeAreaView style={styles.container}>
        {/* <View><Button onPress={handleToggleFlash} /></View> */}
        <Camera
          style={{ flex: 1 }}
          isActive={true}
          device={device}
          frameProcessor={frameProcessor}
        />
        <View>
          <Text>{text}</Text>
        </View>
      </SafeAreaView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#050505',
  },
  header: {
    backgroundColor: '#94dd00',
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 15,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  maintext: {
    fontSize: 16,
    margin: 20,
  },
  barcodebox: {
    alignItems: 'center',
    justifyContent: 'center',
    height: 300,
    width: '100%',
    overflow: 'hidden',
  },
});
