import React from 'react';
import { FlexWidget, TextWidget, IconWidget, WidgetComponentProps } from 'react-native-android-widget';

export function DailyBriefWidget({ widgetInfo }: WidgetComponentProps) {
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
            clickAction="OPEN_DAILY_BRIEF"
        >
            <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                <IconWidget icon="auto_awesome" size={24} color="#005CBB" />
                <TextWidget
                    text="Morning Brief"
                    style={{
                        fontSize: 16,
                        fontFamily: 'sans-serif-medium',
                        color: '#1A1C1E',
                        marginLeft: 8,
                    }}
                />
            </FlexWidget>

            <TextWidget
                text="You have 3 tasks today and 2 upcoming reminders. Your AI companion has prepared a personalized reflection for you."
                style={{
                    fontSize: 14,
                    color: '#44474E',
                    lineHeight: 20,
                }}
            />

            <FlexWidget style={{ marginTop: 'auto', flexDirection: 'row', justifyContent: 'flex_end' }}>
                <TextWidget
                    text="Updated 10m ago"
                    style={{
                        fontSize: 12,
                        color: '#74777F',
                    }}
                />
            </FlexWidget>
        </FlexWidget>
    );
}
