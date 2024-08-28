import React from 'react';
import { Text, TouchableOpacity, StyleSheet, GestureResponderEvent } from 'react-native';

interface CustomButtonProps {
    title: string;
    onPress: (event: GestureResponderEvent) => void;
    style?: React.CSSProperties | object;    
  }

export function CustomButton({ title, onPress, style }: CustomButtonProps) {
  return (
    <TouchableOpacity style={[style, styles.button, ,  ]} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
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
});
