import React from 'react';
import { FlexWidget, TextWidget, IconWidget, WidgetComponentProps } from 'react-native-android-widget';

export function TimelineWidget({ widgetInfo }: WidgetComponentProps) {
    return (
        <FlexWidget
            style={{
                height: 'match_parent',
                width: 'match_parent',
                backgroundColor: '#ffffff',
                borderRadius: 16,
                padding: 16,
                flexDirection: 'column',
            }}
            clickAction="OPEN_TIMELINE"
        >
            <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <IconWidget icon="history" size={24} color="#005CBB" />
                <TextWidget
                    text="Recent Memories"
                    style={{
                        fontSize: 16,
                        fontFamily: 'sans-serif-medium',
                        color: '#1A1C1E',
                        marginLeft: 8,
                    }}
                />
            </FlexWidget>

            <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <FlexWidget style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#005CBB', marginRight: 12 }} />
                <TextWidget
                    text="Captured a thought about the new project"
                    style={{ fontSize: 14, color: '#44474E', flex: 1 }}
                    maxLines={1}
                />
            </FlexWidget>

            <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                <FlexWidget style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#005CBB', marginRight: 12 }} />
                <TextWidget
                    text="Meeting notes from design sync"
                    style={{ fontSize: 14, color: '#44474E', flex: 1 }}
                    maxLines={1}
                />
            </FlexWidget>

            <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }}>
                <FlexWidget style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: '#D7E3FF', marginRight: 12 }} />
                <TextWidget
                    text="Voice memo from morning walk"
                    style={{ fontSize: 14, color: '#74777F', flex: 1 }}
                    maxLines={1}
                />
            </FlexWidget>

            <FlexWidget style={{ marginTop: 'auto', flexDirection: 'row', justifyContent: 'flex_end' }}>
                <TextWidget
                    text="Syncing..."
                    style={{
                        fontSize: 12,
                        color: '#74777F',
                    }}
                />
            </FlexWidget>
        </FlexWidget>
    );
}
