import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Platform, LayoutAnimation, UIManager } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Feather } from '@expo/vector-icons';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const FAQS = [
  { q: 'How do I clock in?', a: 'Use Attendance and tap Clock In when you arrive at work.' },
  { q: 'How do I request leave?', a: 'Open Submission → Leave and complete the leave request form.' },
  { q: 'How do I view my shift?', a: 'Open Shift to see your assigned work schedule.' },
  { q: 'How do I request an overtime schedule?', a: 'Open Overtime and use the available request feature.' },
  { q: 'How do I change my profile information?', a: 'Open Profile and select the relevant information section.' },
];

const FAQItem = ({ item }: { item: typeof FAQS[0] }) => {
  const [expanded, setExpanded] = useState(false);
  const toggle = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(!expanded);
  };
  return (
    <TouchableOpacity style={styles.faqCard} onPress={toggle} activeOpacity={0.7}>
      <View style={styles.faqHeader}>
        <Text style={styles.faqQuestion}>{item.q}</Text>
        <Feather name={expanded ? 'chevron-up' : 'chevron-down'} size={20} color="#6B7280" />
      </View>
      {expanded && <Text style={styles.faqAnswer}>{item.a}</Text>}
    </TouchableOpacity>
  );
};

export default function HelpCenterScreen() {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation<any>();

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
          <Feather name="arrow-left" size={24} color="#1F2937" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help Center</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.sectionTitle}>How can we help?</Text>
        <View style={styles.searchBar}>
          <Feather name="search" size={20} color="#9CA3AF" />
          <TextInput placeholder="Search help articles..." placeholderTextColor="#9CA3AF" style={styles.searchInput} />
        </View>

        <Text style={styles.sectionTitle}>Frequently Asked Questions</Text>
        {FAQS.map((faq, i) => <FAQItem key={i} item={faq} />)}

        <Text style={styles.sectionTitle}>Contact Support</Text>
        <TouchableOpacity style={styles.contactBtn} activeOpacity={0.7}><Text style={styles.contactText}>Chat with Support</Text></TouchableOpacity>
        <TouchableOpacity style={styles.contactBtn} activeOpacity={0.7}><Text style={styles.contactText}>Contact Administrator</Text></TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerTitle}>About MedStaff</Text>
          <Text style={styles.footerVersion}>Version 1.0.0</Text>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9F9F9' },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 20, paddingVertical: 16, backgroundColor: '#FFFFFF' },
  backButton: { padding: 4, marginLeft: -4 },
  headerTitle: { fontSize: 18, fontWeight: '700', color: '#1F2937' },
  scrollContent: { padding: 20, paddingBottom: 40 },
  sectionTitle: { fontSize: 16, fontWeight: '700', color: '#1F2937', marginBottom: 16, marginTop: 16 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFFFFF', borderRadius: 16, paddingHorizontal: 16, height: 50, gap: 10, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 10 }, android: { elevation: 2 } }) },
  searchInput: { flex: 1, fontSize: 15, color: '#1F2937' },
  faqCard: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 12, ...Platform.select({ ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 4 }, android: { elevation: 1 } }) },
  faqHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  faqQuestion: { fontSize: 15, fontWeight: '600', color: '#1F2937', flex: 1 },
  faqAnswer: { fontSize: 14, color: '#6B7280', marginTop: 12, lineHeight: 20 },
  contactBtn: { backgroundColor: '#FFFFFF', borderRadius: 16, padding: 16, marginBottom: 8, alignItems: 'center', borderWidth: 1, borderColor: '#F3F4F6' },
  contactText: { fontSize: 15, fontWeight: '600', color: '#0B8FAC' },
  footer: { alignItems: 'center', marginTop: 32, gap: 4 },
  footerTitle: { fontSize: 14, fontWeight: '600', color: '#374151' },
  footerVersion: { fontSize: 12, color: '#9CA3AF' }
});
