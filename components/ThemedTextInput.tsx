import { TextInput, type TextInputProps, StyleSheet } from 'react-native';
import { useThemeColor } from '@/hooks/useThemeColor';

export type ThemedInputTextProps = TextInputProps & {
  lightColor?: string;
  darkColor?: string;
  type?: 'default' | 'title' | 'defaultSemiBold' | 'subtitle' | 'link';
};

export function ThemedInputText({
  style,
  lightColor,
  darkColor,
  type = 'default',
  ...rest
}: ThemedInputTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');

  return (
    <TextInput
      style={[
        { color },
        styles.input, // Adiciona o estilo básico do input
        type === 'default' ? styles.default : undefined,        
        style,
      ]}
      placeholderTextColor={color}
      {...rest}
    />
  );
}

const styles = StyleSheet.create({
  input: {
    borderBottomWidth: 1, // Adiciona a borda inferior
    borderColor: 'gray', // Cor da borda inferior
  },
  default: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 15,
  },  
});
