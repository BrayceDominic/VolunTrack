import React, { useState } from 'react';
import { ScrollView, View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Dimensions } from 'react-native';

const { height } = Dimensions.get('window');

const app = () => {
  const [email, setEmail] = useState('');

  const handlePasswordReset = () => {
    if (!email.trim()) {
      Alert.alert('Input Required', 'Please enter your email.');
      return;
    }

    // Replace this with actual API call
    Alert.alert(
      'Reset Link Sent',
      `A password reset link has been sent to ${email}. Please check your inbox.`
    );
    setEmail('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Privacy & Security</Text>

      {/* 📜 Terms of Service */}
      <Text style={styles.sectionTitle}>Terms of Service (Tanzania)</Text>
      <Text style={styles.text}>
        By using this app, you agree to the following:
        {"\n\n"}• You will use this app lawfully and avoid any form of cyberbullying, fraud, or impersonation.
        {"\n"}• You shall not misuse this service in violation of the Tanzanian **Cybercrimes Act (2015)**.
        {"\n"}• You agree that VolunTrack reserves the right to suspend your access if malicious or unauthorized activity is detected.
        {"\n"}• You acknowledge that activities on the platform may be logged for auditing and compliance purposes.
      </Text>

      {/* 🔏 Privacy Policy */}
      <Text style={styles.sectionTitle}>Privacy Policy</Text>
      <Text style={styles.text}>
        Your privacy is our priority:
        {"\n\n"}• We collect only the necessary personal information such as name, email, and login details.
        {"\n"}• All data is stored securely and is accessible only by authorized personnel.
        {"\n"}• We do not share your data with third parties without your consent unless required by law.
        {"\n"}• You have the right to request deletion or correction of your data.
        {"\n"}• This app complies with Tanzania’s **Data Protection Guidelines** and **Electronic Transactions Act**.
      </Text>

      {/* 🔐 Reset Password */}
      <Text style={styles.sectionTitle}>Reset Your Password</Text>
      <Text style={styles.text}>Forgot your password? Enter your email below and we’ll send you a reset link.</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
      </TouchableOpacity>

      {/* 🛡️ Security Tips */}
      <Text style={styles.sectionTitle}>Security Tips</Text>
      <Text style={styles.text}>• Use strong, unique passwords for each account.</Text>
      <Text style={styles.text}>• Enable 2-Factor Authentication where available.</Text>
      <Text style={styles.text}>• Never share your login credentials with anyone.</Text>
      <Text style={styles.text}>• Avoid accessing the app from public or untrusted devices.</Text>
      <Text style={styles.text}>• Regularly update the app to receive security patches.</Text>

      {/* 📞 Contact */}
      <Text style={styles.sectionTitle}>Need Help?</Text>
      <Text style={styles.text}>📧 Email: support@voluntrack.com</Text>
      <Text style={styles.text}>📞 Phone: +255 717 933 892</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: 'tan',
    minHeight: height,
  },
  header: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#004158',
    textAlign: 'center',
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004158',
    marginTop: 20,
    marginBottom: 10,
  },
  text: {
    fontSize: 15,
    color: '#333',
    lineHeight: 22,
    marginBottom: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginTop: 10,
    marginBottom: 10,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#004158',
    paddingVertical: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});

export default app;
