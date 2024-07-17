import React from 'react';
import { Text, TouchableOpacity, StyleSheet, GestureResponderEvent } from 'react-native';

interface CustomButtonProps {
    title: string;
    onPress: (event: GestureResponderEvent) => void;
  }

export function CustomButton({ title, onPress }: CustomButtonProps) {
  return (
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.buttonText}>{title}</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  button: {
    backgroundColor: '#0f3a6d', // Altere a cor do botão aqui
    padding: 10,
    borderRadius: 25, // Adiciona border radius
    alignItems: 'center', // Centraliza o texto no eixo horizontal
    justifyContent: 'center', // Centraliza o texto no eixo vertical
    width: '100%', // Define a largura do botão
    marginTop: 10,
  },
  buttonText: {
    color: '#FFFFFF', // Cor do texto do botão
    fontSize: 16,
    fontWeight: 'bold',
  },
});
