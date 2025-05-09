import { View, Text, Image, TextInput, TouchableOpacity, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Icon from 'react-native-vector-icons/MaterialIcons'; 
import { useState } from 'react';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';



const app = () => {
  const [username, setUserName] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const router = useRouter();

const handleRegister = async () => {
  const userData = {
    username,
    password,
    role,
    email,
    name,
    phone,
  };

  try {
    const response = await fetch('http://localhost:5000/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (response.ok) {
      const data = await response.json();
      console.log('Register response:', data);

      const role = data.role || (data.user && data.user.role);
      if (role) {
        await AsyncStorage.setItem('userRole', role);
        if (data.token) {
          await AsyncStorage.setItem('userToken', data.token);
        }

        if (role === 'volunteer') {
          router.push('/volunteer/VolunteerDashboard');
        } else if (role === 'supervisor') {
          router.push('/supervisor/SupervisorDashboard');
        } else {
          alert(`Unknown role: ${role}`);
        }
      } else {
        alert('Registration successful, Login to continue.');
      }
    } else {
      const errorText = await response.text();
      alert(`Error: ${errorText}`);
    }
  } catch (error) {
    console.error('Registration error:', error);
    alert('An error occurred while registering. Please try again.');
  }
};

  return (
    <View style={styles.container}>
            <Image source={require("@/assets/images/vt.jpg")} style={styles.image} />

      <TouchableOpacity onPress={() => router.push('/')} style={styles.drawerItem}>
        <Icon name="home" size={35} color="#004158" />
      </TouchableOpacity>
      <Text style={styles.title}>Sign Up</Text>

      <TextInput 
        style={styles.input} 
        placeholder="Username" 
        value={username} 
        onChangeText={setUserName} 
      />
       <View style={styles.passwordContainer}>
        <TextInput 
          style={styles.passwordInput} 
          placeholder="Password" 
          secureTextEntry={!showPassword} 
          value={password} 
          onChangeText={setPassword} 
        />
        <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
          <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="gray" />
        </TouchableOpacity>
      </View>
      <TextInput 
        style={styles.input} 
        placeholder="Role (volunteer or supervisor)" 
        value={role} 
        onChangeText={setRole} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Email" 
        keyboardType="email-address" 
        value={email} 
        onChangeText={setEmail} 
      />
     
      <TextInput 
        style={styles.input} 
        placeholder="Name" 
        keyboardType="text" 
        value={name} 
        onChangeText={setName} 
      />
      <TextInput 
        style={styles.input} 
        placeholder="Phone" 
        keyboardType="number" 
        value={phone} 
        onChangeText={setPhone} 
      />
      

      <TouchableOpacity style={styles.button} onPress={handleRegister}>
        <Text style={styles.buttonText}>Register</Text>
      </TouchableOpacity>

      <Pressable style={styles.loginButton} onPress={() => router.push('/Login')}>
        <Text style={styles.loginLink}> Already have an Account?<Text style={styles.boldText}> LOGIN</Text></Text>
      </Pressable>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 20,
    backgroundColor: 'tan',
    // marginTop: 25,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#004158',
    textAlign: 'center',
    marginBottom: 20,
  },
  image: {
    width: 100, // Adjust width
    height: 100, // Adjust height
    // resizeMode: "contain",
    marginTop: 2,
    marginLeft: 130,
    marginBottom: -15,
    borderRadius: 70,
    },
  drawerItem: {
    top: -170,
  },
  input: {
    height: 50,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginBottom: 12,
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 15,
    backgroundColor: '#fff',
    marginBottom: 5,
  },
  passwordInput: {
    flex: 1,
    height: 50,
  },
  button: {
    backgroundColor: '#004158',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  loginButton: {
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 5,
  },
  loginLink: {
    color: '#004158',
    fontSize: 16,
    padding: 1,
  },
  boldText: {
    fontWeight: 'bold',
    fontSize: 18,
  },
});

export default app;
