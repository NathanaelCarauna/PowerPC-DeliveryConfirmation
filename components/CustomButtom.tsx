import React from 'react';
import { Text, TouchableOpacity, StyleSheet, GestureResponderEvent, ViewStyle } from 'react-native';

interface CustomButtonProps {
    title: string;
    onPress: (event: GestureResponderEvent) => void;
    style?: ViewStyle;
    disabled?: boolean;
}

export function CustomButton({ title, onPress, style, disabled }: CustomButtonProps) {
  return (
    <TouchableOpacity 
      style={[
        styles.button, 
        style, 
        disabled && styles.disabledButton
      ]} 
      onPress={onPress}
      disabled={disabled}
    >
      <Text style={[styles.buttonText, disabled && styles.disabledText]}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0f3a6d',
    padding: 10,
    borderRadius: 25, 
    alignItems: 'center', 
    justifyContent: 'center', 
    width: '100%', 
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF', 
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledButton: {
    backgroundColor: '#a0a0a0', // Cor mais clara para indicar que está desabilitado
    opacity: 0.7,
  },
  disabledText: {
    color: '#e0e0e0', // Cor mais clara para o texto quando desabilitado
  },
});
