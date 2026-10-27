import React, { useState } from 'react'; // Added useState
import { View, Text, Image, TouchableOpacity, StyleSheet,ActivityIndicator,Alert } from 'react-native';
import { normalize } from '../../utils/responsive';
import CustomInput from '../../components/common/CustomInput';
import { EmailIcon, LockIcon, EyeIcon } from '../../assets/icons/index';
import { useDispatch } from 'react-redux';
import { useLoginMutation } from '../../store/apiSlice';
import { setCredentials } from '../../store/authSlice';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);

  const dispatch = useDispatch();
  const [login, { isLoading }] = useLoginMutation();

  const handleLogin = async () => {
    if (!email || !password) {
      Alert.alert("Error", "Please enter both email and password.");
      return;
    }
console.log("SENDING TO BACKEND ->", { email: email, password: password });
    try {
      const result = await login({ email, password }).unwrap();
      console.log("RESULT FROM BACKEND ->", result);
      
      dispatch(setCredentials({ user: result.user, token: result.token }));
      
      navigation.replace('Home'); 
      
    } catch (err) {
      Alert.alert("Login Failed", err?.data?.detail || "Invalid email or password.");
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Image source={require('../../assets/images/eagle_logo.png')} style={styles.logo} />
        <Text style={styles.title}>Welcome Back</Text>
        <Text style={styles.subtitle}>Secure your world with smart monitoring</Text>

        <View style={styles.form}>
          <CustomInput 
            placeholder="Enter your email" 
            Icon={EmailIcon} 
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
          />
          
          <CustomInput 
            placeholder="Enter your password" 
            secureTextEntry={isPasswordSecure} 
            Icon={LockIcon} 
            RightIcon={EyeIcon} 
            onRightIconPress={() => setIsPasswordSecure(!isPasswordSecure)} 
            value={password}
            onChangeText={setPassword}
          />
          
          <TouchableOpacity 
            style={[styles.button, isLoading && styles.buttonDisabled]} 
            onPress={handleLogin}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="#FFF" />
            ) : (
              <Text style={styles.buttonText}>Login</Text>
            )}
          </TouchableOpacity>

          <View style={styles.footer}>
            <Text style={styles.footerText}>Don't have an account? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('SignUp')}>
              <Text style={styles.link}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  content: { flex: 1, alignItems: 'center', paddingHorizontal: normalize(25), paddingTop: normalize(50) },
  logo: { width: normalize(110), height: normalize(110), borderRadius: normalize(55) },
  title: { fontSize: normalize(26), fontWeight: 'bold', marginTop: normalize(20), color: '#1A1A1A' },
  subtitle: { fontSize: normalize(14), color: '#666', marginTop: normalize(5) },
  form: { width: '100%', marginTop: normalize(40) },
  button: { backgroundColor: '#C8AD84', height: normalize(55), borderRadius: normalize(15), justifyContent: 'center', alignItems: 'center', marginTop: normalize(10) },
  buttonDisabled: { opacity: 0.7 },
  buttonText: { color: '#FFF', fontSize: normalize(17), fontWeight: '600' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: normalize(20) },
  footerText: { color: '#666' },
  link: { color: '#C8AD84', fontWeight: 'bold' },
});

export default LoginScreen;