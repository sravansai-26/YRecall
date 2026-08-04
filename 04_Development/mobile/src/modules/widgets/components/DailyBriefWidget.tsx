import React from 'react';
import { FlexWidget, TextWidget, ImageWidget, SvgWidget } from 'react-native-android-widget';

const SUN_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="#003D0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line></svg>`;

export interface DailyBriefData {
    message: string;
    updatedAt: string;
}

export function DailyBriefWidget({ widgetInfo, data }: { widgetInfo: any, data?: DailyBriefData }) {
    const message = data?.message || "Capture your first memory today to get AI insights and daily briefs.";
    const updated = data?.updatedAt || "Just now";
    return (
        <FlexWidget
            style={{
                height: 'match_parent',
                width: 'match_parent',
                backgroundColor: '#FFF8F1',
                borderRadius: 24,
                paddingLeft: 16,
                paddingBottom: 16,
                paddingTop: 10,
                paddingRight: 10,
                flexDirection: 'column',
            }}
            clickAction="OPEN_URI"
            clickActionData={{ uri: 'yrecall://timeline-daily' }}
        >
            <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 12, width: 'match_parent' }}>
                <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <SvgWidget svg={SUN_SVG} style={{ width: 20, height: 20, marginRight: 8 }} />
                    <TextWidget
                        text="Morning Brief"
                        style={{
                            fontSize: 15,
                            fontWeight: 'bold',
                            color: '#1A1C1E',
                        }}
                    />
                </FlexWidget>
                <ImageWidget image={require('../../../../assets/logos/yr-logo-widget.png')} imageWidth={22} imageHeight={22} style={{ width: 22, height: 22 }} />
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

            <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 }}>
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
