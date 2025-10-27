import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useNavigation } from '@react-navigation/native';

const KEYS = {
  accounts: 'ERS_ACCOUNTS',
  session: 'ERS_SESSION',
  reports: 'ERS_REPORTS',
};

export default function DebugStorageScreen() {
  const [storageData, setStorageData] = useState<{[key: string]: any}>({});
  const navigation = useNavigation();

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = async () => {
    try {
      const keys = await AsyncStorage.getAllKeys();
      const data: {[key: string]: any} = {};
      
      for (const key of keys) {
        const value = await AsyncStorage.getItem(key);
        try {
          data[key] = value ? JSON.parse(value) : value;
        } catch (e) {
          data[key] = value; // In case it's not a JSON string
        }
      }
      
      setStorageData(data);
    } catch (error) {
      console.error('Error reading storage:', error);
    }
  };

  const clearStorage = async () => {
    try {
      await AsyncStorage.clear();
      await loadStorageData();
      alert('Storage cleared! The app will now restart.');
      // You might want to add a way to restart the app here
    } catch (error) {
      console.error('Error clearing storage:', error);
    }
  };

  const createDefaultAdmin = async () => {
    try {
      const defaultAdmin = {
        id: 'admin-1',
        name: 'System Admin',
        email: 'admin@ers.local',
        phone: '0000000000',
        role: 'admin',
        password: 'admin123',
      };

      const accounts = [defaultAdmin];
      await AsyncStorage.setItem(KEYS.accounts, JSON.stringify(accounts));
      await loadStorageData();
      alert('Default admin account created!\nEmail: admin@ers.local\nPassword: admin123');
    } catch (error) {
      console.error('Error creating admin:', error);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Debug Storage</Text>
      </View>
      
      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Storage Contents:</Text>
          <Text style={styles.jsonText}>
            {JSON.stringify(storageData, null, 2)}
          </Text>
        </View>
      </ScrollView>

      <View style={styles.buttonsContainer}>
        <TouchableOpacity onPress={createDefaultAdmin} style={[styles.button, styles.createButton]}>
          <Text style={styles.buttonText}>Create Default Admin</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={clearStorage} style={[styles.button, styles.clearButton]}>
          <Text style={styles.buttonText}>Clear All Data</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={loadStorageData} style={[styles.button, styles.refreshButton]}>
          <Text style={styles.buttonText}>Refresh Data</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  backButton: {
    marginRight: 16,
  },
  backButtonText: {
    fontSize: 16,
    color: '#007AFF',
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 20,
    backgroundColor: '#fff',
    borderRadius: 8,
    padding: 16,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
  },
  jsonText: {
    fontFamily: 'monospace',
    fontSize: 12,
    color: '#333',
  },
  buttonsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#ddd',
  },
  button: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginHorizontal: 4,
  },
  createButton: {
    backgroundColor: '#4CAF50',
  },
  clearButton: {
    backgroundColor: '#F44336',
  },
  refreshButton: {
    backgroundColor: '#2196F3',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});
