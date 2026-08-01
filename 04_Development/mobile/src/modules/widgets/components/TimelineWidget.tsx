import React from 'react';
import { FlexWidget, TextWidget, SvgWidget, WidgetComponentProps } from 'react-native-android-widget';

const CLOCK_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="#005CBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>`;
const LOGO_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="#005CBB" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;

export interface WidgetData {
    title: string;
    subtitle?: string;
    time?: string;
}

export function TimelineWidget({ widgetInfo, data }: WidgetComponentProps & { data?: WidgetData[] }) {
    const items = data || [
        { title: "No recent memories" }
    ];
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
            clickActionData={{ uri: 'yrecall://recall' }}
        >
            <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16, justifyContent: 'space_between' }}>
                <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <SvgWidget svg={CLOCK_SVG} style={{ width: 22, height: 22, marginRight: 8 }} />
                    <TextWidget
                        text="Recent Memories"
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

            <FlexWidget style={{ flexDirection: 'column', flex: 1, justifyContent: 'center' }}>
                {items.slice(0, 3).map((item, index) => (
                    <FlexWidget key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: index === 2 ? 0 : 10 }}>
                        <FlexWidget style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: index === 0 ? '#005CBB' : '#D7E3FF', marginRight: 12 }} />
                        <TextWidget
                            text={item.title || 'Memory'}
                            style={{ fontSize: 13, color: index === 0 ? '#44474E' : '#74777F', flex: 1 }}
                            maxLines={1}
                        />
                    </FlexWidget>
                ))}
            </FlexWidget>

            <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space_between', alignItems: 'center', marginTop: 8 }}>
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
