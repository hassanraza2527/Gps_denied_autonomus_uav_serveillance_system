import React, { useState } from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  SafeAreaView, 
  ScrollView,
  ActivityIndicator,
  Alert
} from 'react-native';
import { useDispatch } from 'react-redux';
import { normalize } from '../../utils/responsive';
import CustomInput from '../../components/common/CustomInput';

import { EmailIcon, LockIcon, EyeIcon, ChevronLeftIcon, UserIcon } from '../../assets/icons/index';

import { useSignupMutation } from '../../store/apiSlice';
import { setCredentials } from '../../store/authSlice';

const SignUpScreen = ({ navigation }) => {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isPasswordSecure, setIsPasswordSecure] = useState(true);
  const [isConfirmPasswordSecure, setIsConfirmPasswordSecure] = useState(true);

  const dispatch = useDispatch();
  const [signup, { isLoading }] = useSignupMutation();

  const handleSignup = async () => {
    if (!fullName || !email || !password || !confirmPassword) {
      Alert.alert("Error", "Please fill in all fields.");
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert("Error", "Passwords do not match.");
      return;
    }

    try {
      const result = await signup({
        full_name: fullName,
        email: email.trim(),
        password: password,
        confirm_password: confirmPassword
      }).unwrap();

      dispatch(setCredentials({ user: result.user, token: result.token }));
      
      navigation.replace('EmptyState'); 
      
    } catch (err) {
      Alert.alert("Signup Failed", err?.data?.detail || "An error occurred during signup.");
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <TouchableOpacity 
            onPress={() => navigation.goBack()} 
            style={styles.backButton}
          >
            <ChevronLeftIcon width={28} height={28} color="#1A1A1A" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <Image 
            source={require('../../assets/images/eagle_logo.png')} 
            style={styles.logo} 
          />
          
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Sign up to start monitoring</Text>

          <View style={styles.form}>
            <CustomInput 
              placeholder="Enter your full name" 
              Icon={UserIcon} 
              value={fullName}
              onChangeText={setFullName}
            />
            
            <CustomInput 
              placeholder="Enter your email" 
              Icon={EmailIcon} 
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
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

            <CustomInput 
              placeholder="Confirm your password" 
              secureTextEntry={isConfirmPasswordSecure} 
              Icon={LockIcon} 
              RightIcon={EyeIcon} 
              onRightIconPress={() => setIsConfirmPasswordSecure(!isConfirmPasswordSecure)}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />

            <TouchableOpacity 
              style={[styles.button, isLoading && styles.buttonDisabled]}
              onPress={handleSignup}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#FFF" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>

            <View style={styles.footer}>
              <Text style={styles.footerText}>Already have an account? </Text>
              <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                <Text style={styles.link}>Login</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#FFF' 
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: normalize(30),
  },
  header: {
    paddingHorizontal: normalize(20),
    paddingTop: normalize(15),
  },
  backButton: {
    padding: normalize(5),
    alignSelf: 'flex-start',
  },
  content: { 
    flex: 1, 
    alignItems: 'center', 
    paddingHorizontal: normalize(25), 
    paddingTop: normalize(10) 
  },
  logo: { 
    width: normalize(100), 
    height: normalize(100), 
    borderRadius: normalize(50),
    marginBottom: normalize(15),
  },
  title: { 
    fontSize: normalize(28), 
    fontWeight: 'bold', 
    color: '#1A1A1A' 
  },
  subtitle: { 
    fontSize: normalize(15), 
    color: '#666', 
    marginTop: normalize(8) 
  },
  form: { 
    width: '100%', 
    marginTop: normalize(35) 
  },
  button: { 
    backgroundColor: '#C8AD84', 
    height: normalize(55), 
    borderRadius: normalize(15), 
    justifyContent: 'center', 
    alignItems: 'center',
    marginTop: normalize(5),
  },
  buttonDisabled: {
    opacity: 0.7
  },
  buttonText: { 
    color: '#FFF', 
    fontSize: normalize(17), 
    fontWeight: '600' 
  },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'center', 
    marginTop: normalize(25) 
  },
  footerText: { 
    color: '#666',
    fontSize: normalize(14),
  },
  link: { 
    color: '#C8AD84', 
    fontWeight: 'bold',
    fontSize: normalize(14),
  },
});

export default SignUpScreen;