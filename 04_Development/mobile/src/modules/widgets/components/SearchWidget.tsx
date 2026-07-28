import React from 'react';
import { FlexWidget, TextWidget, IconWidget, WidgetComponentProps } from 'react-native-android-widget';

export function SearchWidget({ widgetInfo }: WidgetComponentProps) {
    return (
        <FlexWidget
            style={{
                height: 'match_parent',
                width: 'match_parent',
                backgroundColor: '#ffffff',
                borderRadius: 30,
                paddingHorizontal: 20,
                flexDirection: 'row',
                alignItems: 'center',
            }}
            clickAction="OPEN_SEARCH"
        >
            <IconWidget icon="search" size={24} color="#44474E" />
            <TextWidget
                text="Search your memory graph..."
                style={{
                    fontSize: 16,
                    color: '#74777F',
                    marginLeft: 12,
                    flex: 1,
                }}
            />
            <FlexWidget clickAction="OPEN_VOICE_SEARCH">
                <IconWidget icon="mic" size={24} color="#005CBB" />
            </FlexWidget>
        </FlexWidget>
    );
}
