import React from 'react';
import { FlexWidget, TextWidget, ImageWidget, SvgWidget } from 'react-native-android-widget';

const CLOCK_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="#003D0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;

export interface WidgetData {
    title: string;
    subtitle?: string;
    time?: string;
}

export function TimelineWidget({ widgetInfo, data }: { widgetInfo: any, data?: WidgetData[] }) {
    const items = data || [
        { title: "No recent memories" }
    ];
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
            clickActionData={{ uri: 'yrecall://recall' }}
        >
            <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16, width: 'match_parent' }}>
                <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <SvgWidget svg={CLOCK_SVG} style={{ width: 22, height: 22, marginRight: 8 }} />
                    <TextWidget
                        text="Recent Memories"
                        style={{
                            fontSize: 15,
                            fontWeight: 'bold',
                            color: '#1A1C1E',
                        }}
                    />
                </FlexWidget>
                <ImageWidget image={require('../../../../assets/logos/yr-logo-widget.png')} imageWidth={22} imageHeight={22} style={{ width: 22, height: 22 }} />
            </FlexWidget>

            <FlexWidget style={{ flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
                {items.map((item: any, index: number) => (
                    <FlexWidget key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: index === 2 ? 0 : 10 }}>
                        <FlexWidget style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: index === 0 ? '#003D0B' : '#E8E1DA', marginRight: 12 }} />
                        <TextWidget
                            text={item.title || 'Memory'}
                            style={{ fontSize: 13, color: index === 0 ? '#44474E' : '#74777F' }}
                            maxLines={1}
                        />
                    </FlexWidget>
                ))}
            </FlexWidget>

            <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 }}>
                <FlexWidget style={{ height: 1 }} />
                <TextWidget
                    text="Syncing..."
                    style={{
                        fontSize: 11,
                        color: '#74777F',
                    }}
                />
            </FlexWidget>
        </FlexWidget>
    );
}
