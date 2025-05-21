import React from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { Link } from 'expo-router';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Alert, Linking } from 'react-native';


const faqData = [
  // { id: '1', question: 'How do I reset my password?', answer: 'Go to Settings > Change Password and follow the instructions.' },
  { id: '1', question: 'How do I add a project?', answer: 'Navigate to the Projects tab. Fill out the required information and click "Add Project"' },
  { id: '2', question: 'How do I add a task?', answer: 'Navigate to the Tasks tab. Fill out the required information and click "Add Task"' },
  { id: '3', question: 'How do I view my volunteers?', answer: 'After you have succesfully logged in your dashboard will display your assigned volunteers on a special volunteer card.' },
  // { id: '4', question: 'Can I delete a project?', answer: 'NO, Only Supervisors have the mandate to delete a project on their dashboard.' },
  // { id: '5', question: 'How do I contact another user?', answer: 'Use the in-app messaging feature located in your dashboard.' },
];

const howToGuides = [
  // { id: '1', title: 'How to Add a Volunteer', guide: 'Navigate to the Volunteer tab > Tap "Add Volunteer" > Fill the form and submit.' },
  { id: '2', title: 'How to Update Your Profile', guide: 'Go to Profile > Tap "Edit" > Make your changes > Tap Save.' },
  { id: '3', title: 'How to Track Attendance', guide: 'Supervisors can go to the Attendance tab  > View attendance records.' },
  { id: '4', title: 'How to See Volunteers Feedback', guide: 'Volunteers can use the Feedback form on their feedback screen to send feedback to supervisors, who can see them in their feedback screen.' },
  // { id: '5', title: 'How to Create a Task', guide: 'Supervisors navigate to Tasks > Tap "Create Task" > Fill in details and assign to volunteers.' },
];

const App = () => {
  const phoneNumber = '+255717933892';

const openLink = async (url) => {
  try {
    const supported = await Linking.canOpenURL(url);
    if (supported) {
      await Linking.openURL(url);
    } else {
      Alert.alert('App Not Installed', 'Please install the required app to continue.');
    }
  } catch (err) {
    console.error('Error opening URL:', err);
    Alert.alert('Error', 'Unable to open the app.');
  }
};

const openWhatsApp = () => {
  const whatsappUrl = `whatsapp://send?phone=${phoneNumber}`;
  openLink(whatsappUrl);
};

const openTelegram = () => {
  const telegramUrl = `https://t.me/${phoneNumber.replace('+', '')}`; // Telegram usernames can't use '+' or spaces
  openLink(telegramUrl);
};

const openLiveChat = () => {
  Alert.alert('Coming Soon', 'Live chat feature coming soon!');
};

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Link href="/supervisor/SupervisorDashboard" style={styles.backButton}>
        <Icon name="arrow-left" size={24} color="#004158" />
      </Link>

      <Text style={styles.header}>Help and Support</Text>

      {/* FAQ Section */}
      <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
      {faqData.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.faqQuestion}>{item.question}</Text>
          <Text style={styles.faqAnswer}>{item.answer}</Text>
        </View>
      ))}

      {/* How-To Guides */}
      <Text style={styles.sectionTitle}>How-To Guides</Text>
      {howToGuides.map((item) => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.faqQuestion}>{item.title}</Text>
          <Text style={styles.faqAnswer}>{item.guide}</Text>
        </View>
      ))}

      {/* Contact Support */}
      <Text style={styles.sectionTitle}>Contact Support</Text>
      <Text style={styles.contact}>📧 support@voluntrack.com</Text>
      <Text style={styles.contact}>📞 +255-717-933-892</Text>

      <View style={styles.socialLinks}>
        <Icon name="whatsapp" size={30} color="#004158" onPress={() => openLink('https://whatsapp.com')} style={styles.icon} />
        <Icon name="telegram" size={30} color="#004158" onPress={() => openLink('https://telegram.com')} style={styles.icon} />
      </View>

      {/* <View style={styles.iconRow}>
        <Pressable onPress={openWhatsApp} style={styles.iconBox}>
          <Icon name="whatsapp" size={50} color="#25D366" />
          <Text style={styles.iconLabel}>WhatsApp</Text>
        </Pressable>

        <Pressable onPress={openTelegram} style={styles.iconBox}>
          <Icon name="send" size={50} color="#0088cc" />
          <Text style={styles.iconLabel}>Telegram</Text>
        </Pressable>
      </View> */}

      {/* <Button title="Live Chat" onPress={openLiveChat} /> */}

      {/* Report an Issue */}
      {/* <Text style={styles.sectionTitle}>Report an Issue</Text>
      <Button title="Report an Issue" onPress={navigateToReportPage} color="#aa0000" /> */}

      {/* Map Section 
      <Text style={styles.sectionTitle}>Find Us on Map</Text>
      <View style={{ height: 200, borderRadius: 10, overflow: 'hidden', marginBottom: 20 }}>
        <WebView
          // source={{ uri: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d127999.10108944728!2d34.94621816894472!3d-7.770634038722723!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x18598d8e9a0f71c7%3A0x4cf59d10864757ce!2sIringa!5e0!3m2!1sen!2stz!4v1712795042366!5m2!1sen!2stz' }}
          source={{ uri: 'https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3953.129298688769!2d35.6942367741204!3d-7.776111877143997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1854162aaa7c8acd%3A0xd0f090f2a6bcb901!2sRuaha%20Catholic%20University%20(RUCU)!5e0!3m2!1sen!2stz!4v1744369701437!5m2!1sen!2stz' }} 
        />
      </View> */}

      {/* Follow Us */}
      <Text style={styles.sectionTitle}>Follow Us</Text>
      <View style={styles.socialLinks}>
        <Icon name="twitter" size={30} color="#004158" onPress={() => openLink('https://twitter.com/yourapp')} style={styles.icon} />
        <Icon name="instagram" size={30} color="#004158" onPress={() => openLink('https://instagram.com/yourapp')} style={styles.icon} />
        <Icon name="google" size={30} color="#004158" onPress={() => openLink('https://google.com')} style={styles.icon} />
      </View>

      {/* Legal Links */}
      {/* <Text style={styles.sectionTitle}>Legal</Text>
      <Link href="/terms" style={styles.link}>Terms of Service</Link>
      <Link href="/privacy" style={styles.link}>Privacy Policy</Link> */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: 'tan',
    padding: 16,
    paddingBottom: 30,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#004158',
    textAlign: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#004158',
    marginTop: 20,
    marginBottom: 10,
  },
  card: {
    backgroundColor: '#f2f2f2',
    padding: 12,
    borderRadius: 10,
    marginBottom: 12,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: '#004158',
  },
  faqAnswer: {
    fontSize: 14,
    color: '#555',
    marginTop: 5,
  },
  link: {
    color: '#004158',
    fontSize: 16,
    marginBottom: 10,
    textDecorationLine: 'underline',
  },
  contact: {
    fontSize: 16,
    color: '#333',
    marginBottom: 6,
  },
  socialLinks: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    marginVertical: 15,
  },
  icon: {
    padding: 10,
  },
  backButton: {
    marginBottom: 10,
  },
  iconRow: {
    flexDirection: 'row',
    gap: 40,
  },
  iconBox: {
    alignItems: 'center',
  },
  iconLabel: {
    marginTop: 8,
    fontSize: 16,
    color: '#004158',
    fontWeight: '600',
  },
});

export default App;
