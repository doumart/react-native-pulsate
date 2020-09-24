import React, { useEffect } from "react";
import {
  Animated, StyleSheet, View, ViewStyle,
} from "react-native";

export interface PulsateProps {
  color: string;
  diameter: number;
  duration?: number;
  speed?: number;
  numberOfPulses?: number;
  initialDiameter?: number;
  initialOpacity?: number;
  pulseStyle?: ViewStyle;
  style?: ViewStyle;
}

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    left: 0,
    right: 0,
    alignItems: "center",
  },
  pulse: {
    position: "absolute",
    flex: 1,
  },
});

interface Pulse {
  diameter: Animated.Value;
  opacity: Animated.Value;
  position: Animated.Value;
  borderRadius: Animated.Value;
}

const Pulsate: React.FunctionComponent<PulsateProps> = ({
  color,
  diameter,
  duration = 2000,
  initialDiameter = 0,
  initialOpacity = 0.8,
  numberOfPulses = 3,
  speed = 300,
  style,
  pulseStyle,
}) => {
  const pulses: Pulse[] = [];
  for (let i = 0; i < numberOfPulses; i++) {
    pulses.push({
      diameter: new Animated.Value(initialDiameter),
      opacity: new Animated.Value(initialOpacity),
      position: new Animated.Value((diameter - initialDiameter) / 2),
      borderRadius: new Animated.Value(initialDiameter / 2),
    });
  }

  const pulseAnimations: Animated.CompositeAnimation[] = pulses.map((pulse, i) =>
    createNewBlastAnimation(pulse, speed * i)
  );

  const blastAnimation = (pulse: Pulse) => Animated.parallel([
    Animated.timing(pulse.diameter, {
      toValue: diameter,
      duration,
      useNativeDriver: false
    }),
    Animated.timing(pulse.opacity, {
      toValue: 0,
      duration,
      useNativeDriver: false
    }),
    Animated.timing(pulse.position, {
      toValue: 0,
      duration,
      useNativeDriver: false
    }),
    Animated.timing(pulse.borderRadius, {
      toValue: diameter / 2,
      duration,
      useNativeDriver: false
    }),
  ]);

  const createNewBlastAnimation = (pulse: Pulse, delay: number) =>
    Animated.sequence([
      Animated.delay(delay),
      blastAnimation(pulse),
    ]);

  const startAnimationInLoop = () => {
    Animated.loop(
      Animated.parallel(pulseAnimations),
    ).start();
  };

  useEffect(() => {
    startAnimationInLoop();
  }, [
    diameter,
    duration,
    initialDiameter,
    initialOpacity,
    numberOfPulses,
    speed,
  ])

  return (
    <View style={[styles.container, style]}>
      <View style={{ width: diameter, height: diameter }}>
        {pulses.map((pulse, i) =>
          <Animated.View
            key={i.toString()}
            style={[
              styles.pulse,
              {
                width: pulse.diameter,
                borderRadius: pulse.borderRadius,
                height: pulse.diameter,
                opacity: pulse.opacity,
                backgroundColor: color,
                top: pulse.position,
                left: pulse.position,
              },
              pulseStyle,
            ]}
          />,
        )}
      </View>
    </View>
  );
}

export default Pulsate;
