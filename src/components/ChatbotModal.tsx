import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TextInput,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { BrandColors } from '@/constants/Colors';
import { useTheme } from '@/src/context/ThemeContext';
import { useLanguage } from '@/src/context/LanguageContext';
import { getFontFamily } from '@/constants/Typography';
import { AppIcon } from './AppIcon';
import { CHATBOT_FAQ_DATABASE, searchFaq, FaqItem } from '../data/chatbotFaq';

interface Message {
  id: string;
  sender: 'user' | 'bot';
  text: string;
  relatedRoute?: string;
  suggestedActionLabel?: string;
  timestamp: string;
}

interface ChatbotModalProps {
  visible: boolean;
  onClose: () => void;
}

export function ChatbotModal({ visible, onClose }: ChatbotModalProps) {
  const router = useRouter();
  const { theme, isDark } = useTheme();
  const { t, language } = useLanguage();
  const isHindi = language === 'hi';

  const [inputQuery, setInputQuery] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [conversation, setConversation] = useState<Message[]>([]);
  const scrollViewRef = useRef<any>(null);
  const messageCounter = useRef(1);

  const greetingText = isHindi
    ? 'नमस्ते! मैं आपका अपनीलैब स्कूली विज्ञान सहायक हूँ। आप नीचे दिए गए किसी भी प्रश्न पर टैप कर सकते हैं या अपना प्रश्न लिख सकते हैं:'
    : 'Hello! I am your ApniLab school science guide. Feel free to tap any common question below or type your inquiry:';

  const allMessages: Message[] = [
    {
      id: 'welcome',
      sender: 'bot',
      text: greetingText,
      timestamp: 'Just now',
    },
    ...conversation,
  ];

  const handleSendQuery = (queryText: string) => {
    const trimmed = queryText.trim();
    if (!trimmed) return;

    messageCounter.current += 1;
    const userMessage: Message = {
      id: `u-${messageCounter.current}`,
      sender: 'user',
      text: trimmed,
      timestamp: 'Now',
    };

    setConversation((prev) => [...prev, userMessage]);
    setInputQuery('');
    setIsTyping(true);

    // Simulate slight natural response time (180ms)
    setTimeout(() => {
      const match: FaqItem | null = searchFaq(trimmed, language);
      messageCounter.current += 1;

      let botResponse: Message;

      if (match) {
        botResponse = {
          id: `b-${messageCounter.current}`,
          sender: 'bot',
          text: match.answer[language] || match.answer.en,
          relatedRoute: match.relatedRoute,
          suggestedActionLabel: match.relatedRoute
            ? isHindi
              ? 'संबंधित प्रयोग पर जाएं →'
              : 'Open Related Experiment →'
            : undefined,
          timestamp: 'Now',
        };
      } else {
        botResponse = {
          id: `b-${messageCounter.current}`,
          sender: 'bot',
          text: isHindi
            ? 'मेरे पास अभी इसके लिए सटीक उत्तर नहीं है। आप नीचे दिए गए अक्सर पूछे जाने वाले विज्ञान प्रश्नों में से चुन सकते हैं:'
            : "I don't have a specific answer for that topic yet. You can tap any of these school science topics below:",
          timestamp: 'Now',
        };
      }

      setConversation((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 180);
  };

  const handleSuggestedQuestionPress = (faq: FaqItem) => {
    const qText = faq.defaultQuestion[language] || faq.defaultQuestion.en;
    handleSendQuery(qText);
  };

  const handleNavigateToRoute = (route: string) => {
    onClose();
    router.push(route as any);
  };

  const handleClearChat = () => {
    setConversation([]);
  };

  return (
    <Modal visible={visible} animationType="slide" transparent={false} onRequestClose={onClose}>
      <SafeAreaView style={[styles.safeArea, { backgroundColor: theme.background }]}>
        <KeyboardAvoidingView
          style={styles.keyboardContainer}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          {/* Header */}
          <View style={[styles.header, { backgroundColor: theme.card, borderBottomColor: theme.border }]}>
            <View style={styles.headerLeft}>
              <View style={[styles.botAvatarBox, { backgroundColor: isDark ? BrandColors.indigo950 : BrandColors.indigo50 }]}>
                <AppIcon name="bot" size={28} isDark={isDark} />
              </View>
              <View style={styles.headerTitleCol}>
                <Text style={[styles.headerTitle, { color: theme.text, fontFamily: getFontFamily('bold', isHindi) }]}>
                  {t('assistant_title')}
                </Text>
                <View style={styles.onlineBadgeRow}>
                  <View style={styles.onlineDot} />
                  <Text style={[styles.headerSubtitle, { color: theme.textMuted, fontFamily: getFontFamily('regular', isHindi) }]}>
                    {t('assistant_subtitle')}
                  </Text>
                </View>
              </View>
            </View>

            <View style={styles.headerActions}>
              <TouchableOpacity
                style={[styles.headerIconBtn, { backgroundColor: isDark ? theme.border : BrandColors.slate100 }]}
                onPress={handleClearChat}
                activeOpacity={0.7}
                accessibilityLabel="Clear chat">
                <Ionicons name="trash-outline" size={18} color={theme.textSecondary} />
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.headerIconBtn, { backgroundColor: isDark ? theme.border : BrandColors.slate100 }]}
                onPress={onClose}
                activeOpacity={0.7}
                accessibilityLabel="Close assistant">
                <Ionicons name="close" size={20} color={theme.text} />
              </TouchableOpacity>
            </View>
          </View>

          {/* Quick FAQ Chips Bar */}
          <View style={[styles.faqQuickBar, { backgroundColor: theme.cardAlt, borderBottomColor: theme.border }]}>
            <Text style={[styles.quickBarTitle, { color: theme.textMuted, fontFamily: getFontFamily('semiBold', isHindi) }]}>
              {t('suggested_questions_title')}
            </Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipsScroll}>
              {CHATBOT_FAQ_DATABASE.map((faq) => {
                const label = faq.defaultQuestion[language] || faq.defaultQuestion.en;
                return (
                  <TouchableOpacity
                    key={faq.id}
                    style={[styles.faqChip, { backgroundColor: theme.card, borderColor: theme.border }]}
                    onPress={() => handleSuggestedQuestionPress(faq)}
                    activeOpacity={0.8}>
                    <Text
                      style={[styles.faqChipText, { color: theme.text, fontFamily: getFontFamily('medium', isHindi) }]}
                      numberOfLines={1}>
                      {label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>

          {/* Messages List */}
          <ScrollView
            ref={scrollViewRef}
            contentContainerStyle={styles.messagesContainer}
            onContentSizeChange={() => scrollViewRef.current?.scrollToEnd({ animated: true })}
            showsVerticalScrollIndicator={false}>
            {allMessages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <View
                  key={msg.id}
                  style={[
                    styles.messageRow,
                    isUser ? styles.messageRowUser : styles.messageRowBot,
                  ]}>
                  {!isUser && (
                    <View style={[styles.miniBotIcon, { backgroundColor: isDark ? BrandColors.indigo950 : BrandColors.indigo50 }]}>
                      <AppIcon name="bot" size={18} isDark={isDark} />
                    </View>
                  )}
                  <View
                    style={[
                      styles.bubble,
                      isUser
                        ? [styles.bubbleUser, { backgroundColor: theme.primary }]
                        : [styles.bubbleBot, { backgroundColor: theme.card, borderColor: theme.border }],
                    ]}>
                    <Text
                      style={[
                        styles.messageText,
                        {
                          color: isUser ? BrandColors.white : theme.text,
                          fontFamily: getFontFamily('regular', isHindi),
                        },
                      ]}>
                      {msg.text}
                    </Text>

                    {/* Action button if answer has related lab */}
                    {msg.relatedRoute && (
                      <TouchableOpacity
                        style={[styles.routeActionBtn, { backgroundColor: theme.primaryLight, borderColor: theme.primaryBorder }]}
                        onPress={() => handleNavigateToRoute(msg.relatedRoute!)}
                        activeOpacity={0.8}>
                        <Ionicons name="flask" size={14} color={theme.tint} />
                        <Text style={[styles.routeActionText, { color: theme.tint, fontFamily: getFontFamily('bold', isHindi) }]}>
                          {msg.suggestedActionLabel || (isHindi ? 'प्रयोग देखें →' : 'View Lab →')}
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              );
            })}

            {isTyping && (
              <View style={[styles.messageRow, styles.messageRowBot]}>
                <View style={[styles.miniBotIcon, { backgroundColor: isDark ? BrandColors.indigo950 : BrandColors.indigo50 }]}>
                  <AppIcon name="bot" size={18} isDark={isDark} />
                </View>
                <View style={[styles.bubble, styles.bubbleBot, { backgroundColor: theme.card, borderColor: theme.border }]}>
                  <View style={styles.typingRow}>
                    <ActivityIndicator size="small" color={theme.tint} />
                    <Text style={[styles.typingText, { color: theme.textMuted, fontFamily: getFontFamily('regular', isHindi) }]}>
                      {t('assistant_typing')}
                    </Text>
                  </View>
                </View>
              </View>
            )}
          </ScrollView>

          {/* Input Bar */}
          <View style={[styles.inputBar, { backgroundColor: theme.card, borderTopColor: theme.border }]}>
            <TextInput
              style={[
                styles.textInput,
                {
                  backgroundColor: theme.cardAlt,
                  color: theme.text,
                  borderColor: theme.border,
                  fontFamily: getFontFamily('regular', isHindi),
                },
              ]}
              placeholder={t('ask_assistant_placeholder')}
              placeholderTextColor={theme.textMuted}
              value={inputQuery}
              onChangeText={setInputQuery}
              onSubmitEditing={() => handleSendQuery(inputQuery)}
              returnKeyType="send"
            />
            <TouchableOpacity
              style={[
                styles.sendBtn,
                { backgroundColor: inputQuery.trim() ? theme.primary : theme.border },
              ]}
              onPress={() => handleSendQuery(inputQuery)}
              disabled={!inputQuery.trim()}
              activeOpacity={0.8}>
              <Ionicons
                name="send"
                size={18}
                color={inputQuery.trim() ? BrandColors.white : theme.textMuted}
              />
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    flex: 1,
  },
  botAvatarBox: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitleCol: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 16,
  },
  onlineBadgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    marginTop: 2,
  },
  onlineDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981',
  },
  headerSubtitle: {
    fontSize: 12,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerIconBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    alignItems: 'center',
    justifyContent: 'center',
  },
  faqQuickBar: {
    paddingVertical: 8,
    paddingLeft: 16,
    borderBottomWidth: 1,
  },
  quickBarTitle: {
    fontSize: 11,
    marginBottom: 6,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  chipsScroll: {
    paddingRight: 16,
    gap: 8,
  },
  faqChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
  },
  faqChipText: {
    fontSize: 12,
  },
  messagesContainer: {
    padding: 16,
    gap: 14,
    paddingBottom: 24,
  },
  messageRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: 8,
  },
  messageRowBot: {
    justifyContent: 'flex-start',
  },
  messageRowUser: {
    justifyContent: 'flex-end',
  },
  miniBotIcon: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 2,
  },
  bubble: {
    maxWidth: '82%',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 16,
  },
  bubbleBot: {
    borderBottomLeftRadius: 4,
    borderWidth: 1,
  },
  bubbleUser: {
    borderBottomRightRadius: 4,
  },
  messageText: {
    fontSize: 14,
    lineHeight: 20,
  },
  routeActionBtn: {
    marginTop: 10,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    gap: 6,
    alignSelf: 'flex-start',
  },
  routeActionText: {
    fontSize: 12,
  },
  typingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  typingText: {
    fontSize: 13,
  },
  inputBar: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderTopWidth: 1,
    gap: 10,
  },
  textInput: {
    flex: 1,
    height: 44,
    borderRadius: 22,
    paddingHorizontal: 16,
    borderWidth: 1,
    fontSize: 14,
  },
  sendBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
