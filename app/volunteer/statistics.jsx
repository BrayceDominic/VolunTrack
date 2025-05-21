import React, { useEffect, useState } from 'react';
import {
  View, Text, ActivityIndicator, StyleSheet,
  Dimensions, ScrollView, Modal, TouchableOpacity
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useLocalSearchParams } from 'expo-router';
import { Link } from 'expo-router';
import Icon from 'react-native-vector-icons/MaterialIcons';

const screenWidth = Dimensions.get('window').width;

const App = () => {
  const { id: volunteerId } = useLocalSearchParams();
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    fetch(`http://192.168.100.47:5000/api/grades/volunteer/${volunteerId}`)
      .then(res => res.json())
      .then(data => {
        setGrades(data);
        setLoading(false);
      })
      .catch(error => {
        console.error('Error fetching grades:', error);
        setLoading(false);
      });
  }, [volunteerId]);

  const labels = grades.map(g => g.task_title.length > 10 ? g.task_title.slice(0, 10) + '…' : g.task_title);
  const scores = grades.map(g => g.score);

  const openModal = (index) => {
    setSelectedIndex(index);
    setModalVisible(true);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#004158" style={{ flex: 1, justifyContent: 'center' }} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Link href="/volunteer/VolunteerDashboard" style={styles.backButton}>
          <Icon name="arrow-back" size={24} color="#004158" />
        </Link>
      <Text style={styles.title}>📊 Your Task Performance</Text>

      {/* Chart Section */}
      <BarChart
        data={{
          labels,
          datasets: [{ data: scores }]
        }}
        width={screenWidth - 30}
        height={420}
        fromZero
        showValuesOnTopOfBars
        chartConfig={{
          backgroundColor: '#ffffff',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#d6f0ff',
          decimalPlaces: 0,
          barPercentage: 0.5,
          color: (opacity = 1) => `rgba(0, 65, 88, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 65, 88, ${opacity})`,
          propsForBackgroundLines: {
            stroke: '#ccc',
            strokeDasharray: '4',
          },
          propsForLabels: {
            fontSize: 12,
          },
        }}
        style={styles.chart}
        verticalLabelRotation={-30}
        onDataPointClick={({ index }) => openModal(index)}
      />

      {/* Custom Task Details Below Chart */}
      <View style={styles.taskList}>
        {grades.map((grade, index) => (
          <View key={index} style={styles.taskItem}>
            <Text style={styles.taskScore}>{grade.score}%</Text>
            <Text style={styles.taskTitle}>{grade.task_title}</Text>
            <Text style={styles.taskComment}>{grade.comments}</Text>
          </View>
        ))}
      </View>

      {/* MODAL */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        {selectedIndex !== null && (
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{grades[selectedIndex].task_title}</Text>
              <Text style={styles.modalScore}>⭐ Score: {grades[selectedIndex].score}%</Text>
              <Text style={styles.modalCommentLabel}>📝 Comment:</Text>
              <Text style={styles.modalComment}>{grades[selectedIndex].comments}</Text>

              <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      </Modal>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: 'tan',
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    textAlign: 'center',
    color: '#004158',
    marginVertical: 20,
  },
  chart: {
    borderRadius: 16,
    marginBottom: 30,
  },
  taskList: {
    marginTop: 10,
  },
  taskItem: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#004158',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  taskScore: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#007a99',
    textAlign: 'center',
    marginBottom: 5,
  },
  taskTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#004158',
    textAlign: 'center',
    marginBottom: 5,
  },
  taskComment: {
    fontSize: 14,
    color: '#333',
    textAlign: 'center',
    lineHeight: 20,
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContent: {
    width: '100%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 25,
    alignItems: 'center',
    shadowColor: '#004158',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 10,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#004158',
    marginBottom: 10,
    textAlign: 'center',
  },
  modalScore: {
    fontSize: 18,
    color: '#007a99',
    marginBottom: 10,
    fontWeight: '600',
  },
  modalCommentLabel: {
    fontSize: 16,
    color: '#555',
    marginBottom: 5,
  },
  modalComment: {
    fontSize: 16,
    color: '#222',
    marginBottom: 20,
    textAlign: 'center',
    lineHeight: 22,
  },
  closeButton: {
    backgroundColor: '#004158',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 10,
  },
  closeButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default App;
