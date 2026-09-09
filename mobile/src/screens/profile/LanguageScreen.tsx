import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Platform
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

const LANGUAGES = [
  { id: 'en', name: 'English' },
  { id: 'id', name: 'Bahasa Indonesia' }
];

export default function LanguageScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [selectedLang, setSelectedLang] = useState('en');

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Language</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionHeader}>App Language</Text>
        <Text style={styles.sectionSubtitle}>Choose the language used throughout MedStaff.</Text>

        <View style={styles.card}>
          {LANGUAGES.map((lang, index) => {
            const isSelected = selectedLang === lang.id;
            const isLast = index === LANGUAGES.length - 1;

            return (
              <React.Fragment key={lang.id}>
                <TouchableOpacity
                  style={styles.optionRow}
                  activeOpacity={0.7}
                  onPress={() => setSelectedLang(lang.id)}
                >
                  <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                    {lang.name}
                  </Text>
                  {isSelected && (
                    <Feather name="check" size={20} color="#0B8FAC" />
                  )}
                </TouchableOpacity>
                {!isLast && <View style={styles.divider} />}
              </React.Fragment>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFFFF'
  },
  backButton: { padding: 4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  scrollContent: { padding: 20 },
  sectionHeader: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 6 },
  sectionSubtitle: { fontSize: 13, color: '#6B7280', marginBottom: 20, lineHeight: 18 },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    overflow: 'hidden',
    ...Platform.select({
      ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 },
      android: { elevation: 2 }
    })
  },
  optionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 18
  },
  optionText: { fontSize: 15, fontWeight: '500', color: '#4B5563' },
  optionTextSelected: { fontWeight: '700', color: '#0B8FAC' },
  divider: { height: 1, backgroundColor: '#F3F4F6' }
});
