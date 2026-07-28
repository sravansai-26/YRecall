import React from 'react';
import { FlexWidget, TextWidget, IconWidget, WidgetComponentProps } from 'react-native-android-widget';

export function QuickCaptureWidget({ widgetInfo }: WidgetComponentProps) {
    return (
        <FlexWidget
            style={{
                height: 'match_parent',
                width: 'match_parent',
                backgroundColor: '#ffffff',
                borderRadius: 16,
                padding: 16,
                flexDirection: 'column',
                justifyContent: 'space_between',
            }}
        >
            <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }}>
                <IconWidget icon="bolt" size={24} color="#005CBB" />
                <TextWidget
                    text="Quick Capture"
                    style={{
                        fontSize: 16,
                        fontFamily: 'sans-serif-medium',
                        color: '#1A1C1E',
                        marginLeft: 8,
                    }}
                />
            </FlexWidget>

            <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space_around', marginTop: 16 }}>
                <FlexWidget
                    clickAction="CAPTURE_TEXT"
                    style={{
                        backgroundColor: '#D7E3FF',
                        borderRadius: 12,
                        padding: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <IconWidget icon="edit" size={24} color="#001B3E" />
                </FlexWidget>

                <FlexWidget
                    clickAction="CAPTURE_VOICE"
                    style={{
                        backgroundColor: '#D7E3FF',
                        borderRadius: 12,
                        padding: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <IconWidget icon="mic" size={24} color="#001B3E" />
                </FlexWidget>

                <FlexWidget
                    clickAction="CAPTURE_PHOTO"
                    style={{
                        backgroundColor: '#D7E3FF',
                        borderRadius: 12,
                        padding: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                    }}
                >
                    <IconWidget icon="camera_alt" size={24} color="#001B3E" />
                </FlexWidget>
            </FlexWidget>
        </FlexWidget>
    );
}
