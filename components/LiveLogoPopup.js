import React, { useEffect } from 'react';
import { Modal, View, StyleSheet } from 'react-native';
import { Video } from 'expo-av';

const LiveLogoPopup = ({ visible, onDismiss }) => {
  useEffect(() => {
    if (visible) {
      // Auto-dismiss after animation duration (e.g., 5 seconds)
      const timer = setTimeout(() => onDismiss(), 5000);
      return () => clearTimeout(timer);
    }
  }, [visible]);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View style={styles.container}>
        <Video
          source={require('../assets/simba_global_ai_animation.mp4')}
          style={styles.video}
          resizeMode="contain"
          shouldPlay
          isLooping
          useNativeControls={false}
        />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.7)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: 250,
    height: 250,
  },
});

export default LiveLogoPopup;