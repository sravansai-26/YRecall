import React, { useState, useRef, useEffect } from 'react';
import { 
    View, 
    TextInput, 
    Pressable, 
    KeyboardAvoidingView, 
    Platform, 
    Modal, 
    Text
} from 'react-native';
import { Stack as ExpoStack, useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { capturesApi } from '../../../src/modules/captures/services/api';
import { colors } from '../../../src/shared/theme/colors';
import { RichEditor, RichToolbar, actions } from 'react-native-pell-rich-editor';

export default function NoteCaptureScreen() {
    const router = useRouter();
    const insets = useSafeAreaInsets();
    
    const [title, setTitle] = useState('');
    const [contentHtml, setContentHtml] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isPinned, setIsPinned] = useState(false);
    const [isFavorite, setIsFavorite] = useState(false);
    
    const richText = useRef<RichEditor>(null);
    const [isEditorReady, setIsEditorReady] = useState(false);
    
    // Link Modal State
    const [isLinkModalVisible, setLinkModalVisible] = useState(false);
    const [linkUrl, setLinkUrl] = useState('');
    const [linkText, setLinkText] = useState('');

    const convertHtmlToMarkdown = (html: string) => {
        if (!html) return '';
        let md = html;
        
        // Links: <a href="url">text</a> -> [text](url)
        md = md.replace(/<a\s+(?:[^>]*?\s+)?href=["']([^"']*)["'][^>]*>(.*?)<\/a>/gi, '[$2]($1)');
        
        // Bold: <b>text</b> or <strong>text</strong> -> **text**
        md = md.replace(/<(b|strong)[^>]*>(.*?)<\/\1>/gi, '**$2**');
        
        // Italic: <i>text</i> or <em>text</em> -> *text*
        md = md.replace(/<(i|em)[^>]*>(.*?)<\/\1>/gi, '*$2*');
        
        // Headers: <h1>text</h1> -> # text
        md = md.replace(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gi, '\n# $1\n');
        
        // Lists: <li>text</li> -> - text
        md = md.replace(/<li[^>]*>(.*?)<\/li>/gi, '\n- $1');
        
        // Paragraphs and Divs -> Newlines
        md = md.replace(/<(p|div)[^>]*>/gi, '\n');
        
        // Line breaks -> Newlines
        md = md.replace(/<br\s*\/?>/gi, '\n');
        
        // Strip remaining HTML tags safely to prevent nested tag bypass
        let prevMd;
        do {
            prevMd = md;
            md = md.replace(/<[^>]+>/gm, '');
        } while (md !== prevMd);
        
        // Unescape common HTML entities
        md = md.replace(/&nbsp;/g, ' ').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');
        
        // Auto-link raw URLs (http, https, www) if they aren't already part of a markdown link
        // We do this by checking if the URL is preceded by "](" or "[".
        // A safer way is to split by markdown links, linkify the text parts, and reassemble.
        const markdownLinkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
        let parts = [];
        let lastIndex = 0;
        let match;
        while ((match = markdownLinkRegex.exec(md)) !== null) {
            let textBefore = md.substring(lastIndex, match.index);
            // Linkify raw URLs in the text before
            textBefore = textBefore.replace(/(https?:\/\/[^\s]+|www\.[^\s]+)/gi, (urlMatch) => {
                const url = urlMatch.startsWith('www.') ? `https://${urlMatch}` : urlMatch;
                return `[${urlMatch}](${url})`;
            });
            parts.push(textBefore);
            parts.push(match[0]);
            lastIndex = markdownLinkRegex.lastIndex;
        }
        let textAfter = md.substring(lastIndex);
        textAfter = textAfter.replace(/(https?:\/\/[^\s]+|www\.[^\s]+)/gi, (urlMatch) => {
            const url = urlMatch.startsWith('www.') ? `https://${urlMatch}` : urlMatch;
            return `[${urlMatch}](${url})`;
        });
        parts.push(textAfter);
        
        md = parts.join('');
        
        return md.replace(/\n{3,}/g, '\n\n').trim();
    };

    const [keyboardHeight, setKeyboardHeight] = useState(0);

    useEffect(() => {
        const showSubscription = require('react-native').Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow',
            (e: any) => setKeyboardHeight(e.endCoordinates.height)
        );
        const hideSubscription = require('react-native').Keyboard.addListener(
            Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide',
            () => setKeyboardHeight(0)
        );
        return () => {
            showSubscription.remove();
            hideSubscription.remove();
        };
    }, []);

    const handleSave = async () => {
        const plainText = convertHtmlToMarkdown(contentHtml);
        if (!plainText) return;
        
        setIsSaving(true);
        try {
            await capturesApi.createNote({
                title: title.trim() || null,
                content_text: plainText,
                rich_text: { html: contentHtml },
                format: 'html'
            });
            require('react-native').ToastAndroid?.show('Note saved successfully', require('react-native').ToastAndroid.SHORT);
            router.back();
        } catch (error) {
            console.error('Failed to save note to API, adding to offline queue:', error);
            require('../../../src/modules/captures/store/useCaptureQueue').useCaptureQueue.getState().addToQueue({
                id: Math.random().toString(36).substring(7),
                type: 'note',
                payload: {
                    title: title.trim() || null,
                    content_text: plainText,
                    rich_text: { html: contentHtml },
                    format: 'html'
                },
                timestamp: Date.now(),
                status: 'failed'
            });
            require('react-native').ToastAndroid?.show('Saved offline. Will sync when online.', require('react-native').ToastAndroid.LONG);
            router.back();
        } finally {
            setIsSaving(false);
        }
    };

    const handleInsertLink = () => {
        if (linkUrl) {
            // If the user didn't enter text, fallback to the URL itself
            richText.current?.insertLink(linkText || linkUrl, linkUrl);
        }
        setLinkModalVisible(false);
        setLinkUrl('');
        setLinkText('');
    };

    const handleCancelLink = () => {
        setLinkModalVisible(false);
        setLinkUrl('');
        setLinkText('');
    };

    return (
        <KeyboardAvoidingView 
            style={{ flex: 1, backgroundColor: colors['surface-container-lowest'] }}
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        >
            <ExpoStack.Screen 
                options={{
                    headerShown: true,
                    headerTitle: '',
                    headerStyle: { backgroundColor: colors['surface-container-lowest'] },
                    headerShadowVisible: false,
                    headerLeft: () => (
                        <Pressable onPress={() => router.back()} className="mr-4">
                            <Ionicons name="arrow-back" size={24} color={colors['on-surface']} />
                        </Pressable>
                    ),
                    headerRight: () => (
                        <View className="flex-row items-center space-x-6 mr-2">
                            <Pressable onPress={() => setIsPinned(!isPinned)} className="p-2">
                                <MaterialIcons name={isPinned ? "push-pin" : "push-pin"} size={24} color={isPinned ? colors.primary : colors['on-surface-variant']} />
                            </Pressable>
                            <Pressable 
                                onPress={handleSave} 
                                disabled={isSaving || !convertHtmlToMarkdown(contentHtml)}
                                className="bg-primary/10 px-4 py-2 rounded-full"
                            >
                                <Text className={`font-public-sans-bold text-base ${convertHtmlToMarkdown(contentHtml) && !isSaving ? 'text-primary' : 'text-on-surface-variant'}`}>
                                    {isSaving ? 'Saving...' : 'Save'}
                                </Text>
                            </Pressable>
                        </View>
                    )
                }}
            />
            
            <View className="px-4 pt-2 pb-4">
                <TextInput
                    className="text-3xl font-public-sans-bold"
                    style={{ color: colors['on-surface'] }}
                    placeholder="Title"
                    placeholderTextColor={colors['on-surface-variant']}
                    value={title}
                    onChangeText={setTitle}
                    multiline
                    maxLength={100}
                />
            </View>

            {/* Rich Text Editor */}
            <View style={{ flex: 1, paddingHorizontal: 16, paddingBottom: 60 }}>
                <RichEditor
                    ref={richText}
                    onChange={setContentHtml}
                    placeholder="Start writing..."
                    initialHeight={300}
                    editorStyle={{
                        backgroundColor: colors['surface-container-lowest'],
                        color: colors['on-surface'],
                        placeholderColor: colors['on-surface-variant'],
                        cssText: `
                            body { font-family: sans-serif; font-size: 18px; line-height: 1.5; margin: 0; padding-bottom: 20px; }
                            a { color: ${colors.primary}; text-decoration: none; font-weight: 500; }
                            h1 { font-size: 24px; font-weight: bold; margin-bottom: 12px; }
                        `
                    }}
                    useContainer={false}
                    editorInitializedCallback={() => setIsEditorReady(true)}
                />
            </View>

            {/* Formatting Toolbar */}
            <View 
                className="bg-surface-container border-t border-outline-variant/20 absolute bottom-0 left-0 right-0"
                style={{ paddingBottom: Math.max(insets.bottom, 12) + (Platform.OS === 'android' ? keyboardHeight : 0) }}
            >
                <RichToolbar
                    editor={richText}
                    disabled={!isEditorReady}
                    iconTint={colors['on-surface-variant']}
                    selectedIconTint={colors.primary}
                    disabledIconTint={colors['outline-variant']}
                    iconSize={24}
                    style={{ backgroundColor: 'transparent' }}
                    actions={[
                        actions.setBold,
                        actions.setItalic,
                        actions.setUnderline,
                        actions.heading1,
                        actions.insertBulletsList,
                        actions.insertOrderedList,
                        'customLink'
                    ]}
                    iconMap={{
                        customLink: ({tintColor}: any) => <MaterialIcons name="link" size={24} color={tintColor} />
                    }}
                    customLink={() => setLinkModalVisible(true)}
                />
            </View>

            {/* Link Insertion Modal */}
            <Modal 
                visible={isLinkModalVisible} 
                transparent 
                animationType="fade"
                onRequestClose={handleCancelLink}
            >
                <View className="flex-1 bg-black/50 items-center justify-center px-6">
                    <View className="bg-surface-container-lowest w-full rounded-3xl p-6 shadow-lg">
                        <Text className="text-xl font-public-sans-bold text-on-surface mb-6">
                            Insert Hyperlink
                        </Text>
                        
                        <View className="bg-surface-container-low rounded-2xl px-4 h-14 justify-center mb-4">
                            <TextInput
                                className="font-public-sans text-base flex-1"
                                style={{ color: colors['on-surface'] }}
                                placeholder="https://example.com"
                                placeholderTextColor={colors['on-surface-variant']}
                                value={linkUrl}
                                onChangeText={setLinkUrl}
                                autoCapitalize="none"
                                autoCorrect={false}
                                keyboardType="url"
                            />
                        </View>

                        <View className="bg-surface-container-low rounded-2xl px-4 h-14 justify-center mb-6">
                            <TextInput
                                className="font-public-sans text-base flex-1"
                                style={{ color: colors['on-surface'] }}
                                placeholder="Display Text (Optional)"
                                placeholderTextColor={colors['on-surface-variant']}
                                value={linkText}
                                onChangeText={setLinkText}
                            />
                        </View>

                        <View className="flex-row justify-end space-x-4">
                            <Pressable 
                                onPress={handleCancelLink} 
                                className="px-6 py-3 rounded-full"
                            >
                                <Text className="font-public-sans-bold text-primary">Cancel</Text>
                            </Pressable>
                            <Pressable 
                                onPress={handleInsertLink} 
                                className="bg-primary px-6 py-3 rounded-full"
                                style={{ opacity: linkUrl ? 1 : 0.5 }}
                                disabled={!linkUrl}
                            >
                                <Text className="font-public-sans-bold text-on-primary">Insert</Text>
                            </Pressable>
                        </View>
                    </View>
                </View>
            </Modal>
        </KeyboardAvoidingView>
    );
}