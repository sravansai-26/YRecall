import React from 'react';
import { FlexWidget, TextWidget, ImageWidget, SvgWidget, WidgetComponentProps } from 'react-native-android-widget';

export interface DailyBriefData {
    message: string;
    updatedAt: string;
}

export function DailyBriefWidget({ widgetInfo, data }: WidgetComponentProps & { data?: DailyBriefData }) {
    const message = data?.message || "Capture your first memory today to get AI insights and daily briefs.";
    const updated = data?.updatedAt || "Just now";
    return (
        <FlexWidget
            style={{
                height: 'match_parent',
                width: 'match_parent',
                backgroundColor: '#FFF8F1',
                borderRadius: 24,
                padding: 16,
                flexDirection: 'column',
            }}
            clickAction="OPEN_URI"
            clickActionData={{ uri: 'yrecall://timeline-daily' }}
        >
            <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, justifyContent: 'space_between' }}>
                <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <TextWidget
                        text="Morning Brief"
                        style={{
                            fontSize: 16,
                            fontFamily: 'sans-serif-medium',
                            color: '#1A1C1E',
                            fontWeight: 'bold',
                        }}
                    />
                </FlexWidget>
                <ImageWidget image="https://raw.githubusercontent.com/sravansai-26/YRecall/main/04_Development/mobile/assets/logos/yr-logo.png" style={{ width: 22, height: 22 }} />
            </FlexWidget>

            <FlexWidget style={{ flex: 1, justifyContent: 'center' }}>
                <TextWidget
                    text={message}
                    style={{
                        fontSize: 14,
                        color: '#44474E',
                    }}
                    maxLines={4}
                />
            </FlexWidget>

            <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space_between', alignItems: 'center', marginTop: 8 }}>
                <FlexWidget style={{ height: 1 }} />
                <TextWidget
                    text={`Updated ${updated}`}
                    style={{
                        fontSize: 11,
                        color: '#74777F',
                    }}
                />
            </FlexWidget>
        </FlexWidget>
    );
}
