import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as FileSystem from 'expo-file-system/legacy';
import * as MediaLibrary from 'expo-media-library';
import * as Sharing from 'expo-sharing';

export interface DownloadRecord {
    id: string;
    captureId: string;
    filename: string;
    type: 'image' | 'video' | 'audio' | 'document' | 'text' | 'location' | 'link' | 'note' | 'voice' | 'file';
    timestamp: number;
    size_bytes?: number;
    status: 'success' | 'failed';
    localUri?: string;
    error?: string;
}

interface DownloadsState {
    downloads: DownloadRecord[];
    addDownload: (record: DownloadRecord) => void;
    removeDownload: (id: string) => void;
    clearHistory: () => void;
    downloadCapture: (capture: any) => Promise<void>;
}

export const useDownloadStore = create<DownloadsState>()(
    persist(
        (set, get) => ({
            downloads: [],
            addDownload: (record) => set((state) => ({ downloads: [record, ...state.downloads] })),
            removeDownload: (id) => set((state) => ({ downloads: state.downloads.filter(d => d.id !== id) })),
            clearHistory: () => set({ downloads: [] }),
            downloadCapture: async (capture) => {
                const id = Math.random().toString(36).substring(7);
                const timestamp = Date.now();
                
                try {
                    let localUri = '';
                    let size_bytes = 0;
                    
                    if (capture.type === 'text' || capture.type === 'note' || capture.type === 'link' || capture.type === 'location') {
                        // Generate .txt file
                        const filename = `YRecall_Note_${capture.id.substring(0,6)}.txt`;
                        localUri = FileSystem.documentDirectory + filename;
                        const content = capture.content || '';
                        await FileSystem.writeAsStringAsync(localUri, content);
                        const info = await FileSystem.getInfoAsync(localUri);
                        if (info.exists && !info.isDirectory) size_bytes = info.size;
                        
                        // Share/Save to Files
                        const canShare = await Sharing.isAvailableAsync();
                        if (canShare) {
                            await Sharing.shareAsync(localUri);
                        }
                    } else if (capture.file_url) {
                        // Download media
                        const ext = capture.file_url.split('.').pop() || 'tmp';
                        const filename = `YRecall_Media_${capture.id.substring(0,6)}.${ext}`;
                        localUri = FileSystem.documentDirectory + filename;
                        
                        // Show toast that download started
                        require('react-native').ToastAndroid?.show('Downloading...', require('react-native').ToastAndroid.SHORT);

                        const downloadRes = await FileSystem.downloadAsync(capture.file_url, localUri);
                        localUri = downloadRes.uri;
                        
                        const info = await FileSystem.getInfoAsync(localUri);
                        if (info.exists && !info.isDirectory) size_bytes = info.size;
                        
                        if (capture.type === 'image' || capture.type === 'video') {
                            // Save to Gallery
                            const { status } = await MediaLibrary.requestPermissionsAsync();
                            if (status === 'granted') {
                                const asset = await MediaLibrary.createAssetAsync(localUri);
                                await MediaLibrary.createAlbumAsync('YRecall', asset, false);
                                require('react-native').ToastAndroid?.show('Saved to Gallery', require('react-native').ToastAndroid.SHORT);
                            } else {
                                // Fallback to sharing if permission denied
                                if (await Sharing.isAvailableAsync()) await Sharing.shareAsync(localUri);
                            }
                        } else {
                            // Share/Save to Files for Audio/Docs
                            if (await Sharing.isAvailableAsync()) {
                                await Sharing.shareAsync(localUri);
                            }
                        }
                    } else {
                        throw new Error("Nothing to download");
                    }
                    
                    get().addDownload({
                        id,
                        captureId: capture.id,
                        filename: localUri.split('/').pop() || 'Unknown',
                        type: capture.type,
                        timestamp,
                        size_bytes,
                        status: 'success',
                        localUri
                    });
                    
                } catch (error: any) {
                    console.error("Download Error: ", error);
                    get().addDownload({
                        id,
                        captureId: capture.id,
                        filename: 'Unknown',
                        type: capture.type,
                        timestamp,
                        status: 'failed',
                        error: error.message
                    });
                    require('react-native').ToastAndroid?.show('Download failed', require('react-native').ToastAndroid.LONG);
                }
            }
        }),
        {
            name: 'yrecall-downloads-storage',
            storage: createJSONStorage(() => AsyncStorage),
        }
    )
);
