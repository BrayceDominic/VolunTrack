import React from 'react';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Icon library
import { Link } from "expo-router";
import { View, Text, ScrollView, TouchableOpacity, Image, Linking, StyleSheet } from 'react-native';
const App = () => {
  const videoResources = [
    {
      title: 'How to Be a Professional at Work',
      videoId: 'MimobT484_4',
    },
    {
      title: 'Microsoft Office Specialist Program Overview',
      videoId: 'EqeZfgfipXg',
    },
    {
      title: 'Internship Journal',
      videoId: 'trIbgBPbPt0',
    },
    {
      title: 'Google Workspace for Productivity',
      videoId: 'QbwnMmO41DA',
    },
    {
      title: 'How to use LinkedIn to land a job',
      videoId: 'AJocoZEV7ew',
    },
  ];

  // const articleResources = [
  //   {
  //     title: 'Top 10 Tips for Professionalism at Work – Google Article',
  //     link: 'https://www.google.com/search?q=top+10+professionalism+tips+at+work',
  //   },
  //   {
  //     title: 'How Volunteering Builds Professional Skills – Google Article',
  //     link: 'https://www.google.com/search?q=how+volunteering+builds+professional+skills',
  //   },
  // ];

  return (
    <ScrollView style={styles.container}>
      <Link href="/volunteer/VolunteerDashboard" style={styles.backButton}>
      <Icon name="arrow-back" size={24} color="#004158" />
      </Link>
      <Text style={styles.header}> Professional Growth Resources</Text>

      {/* <Text style={styles.section}>🎥 YouTube Videos</Text> */}
      {videoResources.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => Linking.openURL(`https://www.youtube.com/watch?v=${item.videoId}`)}
        >
          <Image
            source={{ uri: `https://img.youtube.com/vi/${item.videoId}/hqdefault.jpg` }}
            style={styles.thumbnail}
          />
          <Text style={styles.title}>{item.title}</Text>
        </TouchableOpacity>
      ))}

      {/* <Text style={styles.section}>📄 Google Articles</Text>
      {articleResources.map((item, index) => (
        <TouchableOpacity
          key={index}
          style={styles.card}
          onPress={() => Linking.openURL(item.link)}
        >
          <Text style={styles.title}>{item.title}</Text>
        </TouchableOpacity> */}
      {/* ))} */}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'tan',
    padding: 16,
  },
  backButton: {
        marginRight: 16,
  },
  header: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#004158',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 5,
  },
  section: {
    fontSize: 18,
    fontWeight: '600',
    color: '#004158',
    marginBottom: 10,
    marginTop: 10,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 8,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  thumbnail: {
    width: '100%',
    height: 200,
    borderRadius: 12,
    marginBottom: 10,
  },
  title: {
    fontSize: 16,
    color: '#004158',
    fontWeight: '500',
  },
});

export default App;
