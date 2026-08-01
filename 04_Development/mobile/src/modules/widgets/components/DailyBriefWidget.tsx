import React from 'react';
import { FlexWidget, TextWidget, SvgWidget, WidgetComponentProps } from 'react-native-android-widget';

const SPARKLE_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="#005CBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>`;
const LOGO_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="#005CBB" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;

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
                backgroundColor: '#ffffff',
                borderRadius: 24,
                padding: 16,
                flexDirection: 'column',
            }}
            clickAction="OPEN_URI"
            clickActionData={{ uri: 'yrecall://timeline-daily' }}
        >
            <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12, justifyContent: 'space_between' }}>
                <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <SvgWidget svg={SPARKLE_SVG} style={{ width: 22, height: 22, marginRight: 8 }} />
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
                <SvgWidget svg={LOGO_SVG} style={{ width: 16, height: 16 }} />
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
