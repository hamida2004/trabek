import { View, Text, TouchableOpacity, ImageBackground, StyleSheet, Image } from 'react-native';
import { Link } from 'expo-router';
import Ionicons from '@expo/vector-icons/Ionicons';
import colors from '../../assets/colors';
import logo from '../../assets/images/logo.png';
import plant from '../../assets/images/plant.png';
import { TextInput } from 'react-native-web';
import { useState } from 'react';
export default function IntroScreen() {
  const [id,setId] = useState('');
  const [isValid, setIsValid] = useState(false);
  return (
    <View
      style={styles.container}
    >
      <Image source={logo}
      style={{
        position: 'absolute',
        top: 40,
        right: 40,
        height:80,
        width:120,
        
      }}
      resizeMode='contain'
      />
      <Text style={styles.subtitle}>أمنك الغذائي يبدأ من أرضك</Text>
      <Text style={styles.tagline}>
        زراعة أكثر ذكاءً مع تزايدك: خبيرك الزراعي في جيبك لفلاحة مستدامة ومرحة
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          width: '100%',
          marginBottom: 20,
        }}
      >
        <Ionicons name="grid" size={24} color={colors.olive}
        style={{
          position: 'absolute',
          left: 16,
          top: 7,
        }}
        />

        <TextInput
          placeholder='هوية الجهاز'
          style={{
            width: '100%',
            height: 40,
            borderWidth: 1,
            borderColor: colors.olive,
            borderRadius: 10,
            paddingHorizontal: 10,
            marginBottom: 20,
            textAlign: 'right',
          }}
        >

        </TextInput>
      </View>
      <Image source={plant}
        style={{
          width: '100%',
          height: 300,
          resizeMode: 'contain',
          marginTop: 20,
        }}
      />
      <Link href="./Page01" asChild>
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>إبدأ رحلتك</Text>
        </TouchableOpacity>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },

  title: {
    fontSize: 40,
    fontWeight: 'bold',
    color: colors.white,
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 24,
    color: colors.olive,
    marginBottom: 20,
    textAlign: 'center',
  },
  tagline: {
    fontSize: 16,
    color: colors.white,
    textAlign: 'center',
    marginBottom: 40,
  },
  button: {
    backgroundColor: colors.green,
    padding: 15,
    borderRadius: 10,
    width: '80%',
    alignItems: 'center',
  },
  buttonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: 'bold',
  },
});