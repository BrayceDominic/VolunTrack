import React, { useEffect, useState } from 'react';
import {
  View, Text, ActivityIndicator, StyleSheet,
  Dimensions, ScrollView, TouchableOpacity, Modal
} from 'react-native';
import { BarChart } from 'react-native-chart-kit';
import { useLocalSearchParams } from 'expo-router';

const screenWidth = Dimensions.get('window').width;

const App = () => {
  const { id: supervisorId } = useLocalSearchParams();
  const [labels, setLabels] = useState([]);
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedIndex, setSelectedIndex] = useState(null);

  useEffect(() => {
    fetch(`http://192.168.101.180:5000/api/grades/supervisor/${supervisorId}`)
      .then(res => res.json())
      .then(json => {
        const names = json.map(item => item.volunteer_name);
        const values = json.map(item => item.score);
        setLabels(names);
        setScores(values);
        setLoading(false);
      })
      .catch(error => {
        console.error('Fetch error:', error);
        setLoading(false);
      });
  }, [supervisorId]);

  const handleBarPress = index => {
    setSelectedIndex(index === selectedIndex ? null : index);
  };

  if (loading) {
    return <ActivityIndicator size="large" color="#004158" style={{ flex: 1 }} />;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Volunteer Performance Chart</Text>
      <BarChart
        data={{
          labels,
          datasets: [{ data: scores }]
        }}
        width={screenWidth - 30}
        height={790}
        fromZero
        showValuesOnTopOfBars
        withInnerLines
        withHorizontalLabels
        chartConfig={{
          backgroundColor: '#e1f5fe',
          backgroundGradientFrom: '#ffffff',
          backgroundGradientTo: '#c2e9fb',
          decimalPlaces: 0,
          barPercentage: 0.2,
          color: (opacity = 1) => `rgba(0, 65, 88, ${opacity})`,
          labelColor: (opacity = 1) => `rgba(0, 65, 88, ${opacity})`,
          propsForBackgroundLines: {
            stroke: 'rgba(0,0,0,0.1)',
            strokeDasharray: '0',
          },
        }}
        verticalLabelRotation={-55}
        yAxisSuffix="%"
        segments={10}
        maxValue={100}
        style={{ borderRadius: 16 }}
        withCustomBarColorFromData={false}
        flatColor={true}
        decorator={() =>
          selectedIndex !== null && (
            <View
              style={{
                position: 'absolute',
                top: 60,
                left: (screenWidth - 30) * (selectedIndex / labels.length),
                backgroundColor: 'rgba(0,65,88,0.9)',
                padding: 8,
                borderRadius: 8,
                zIndex: 999,
              }}
            >
              <Text style={{ color: '#fff', fontSize: 12, fontWeight: 'bold' }}>
                {labels[selectedIndex]}
              </Text>
              <Text style={{ color: '#fff', fontSize: 12 }}>
                Score: {scores[selectedIndex]}%
              </Text>
            </View>
          )
        }
        onDataPointClick={({ index }) => handleBarPress(index)}
      />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#f0f8ff',
  },
  header: {
    fontSize: 22,
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#004158',
    marginBottom: 20,
  },
});

export default App;
