import { Text, TouchableOpacity,TouchableOpacityProps } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';

import { styles } from './styles';

type Props  =  TouchableOpacityProps & {
  message: string;
}

export function Tip({ message,...rest }: Props) {
  return (
    <TouchableOpacity style={styles.container} {...rest}>
      <MaterialIcons
        name="volunteer-activism"
        color="#FFFFFF"
        size={24}
      />

      <Text style={styles.message}>
        {message}
      </Text>
    </TouchableOpacity>
  );
}