import React from 'react';
import { FlexWidget, TextWidget, ImageWidget, SvgWidget, WidgetComponentProps } from 'react-native-android-widget';

const MIC_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="#003D0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`;
const TEXT_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="#003D0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"></path><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path></svg>`;
const CAMERA_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="#003D0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"></path><circle cx="12" cy="13" r="4"></circle></svg>`;

export function QuickCaptureWidget({ widgetInfo }: WidgetComponentProps) {
    return (
        <FlexWidget
            style={{
                height: 'match_parent',
                width: 'match_parent',
                backgroundColor: '#FFF8F1',
                borderRadius: 24,
                padding: 16,
                flexDirection: 'column',
                justifyContent: 'space_between',
            }}
        >
            <FlexWidget style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space_between' }}>
                <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <ImageWidget image="https://raw.githubusercontent.com/sravansai-26/YRecall/main/04_Development/mobile/assets/logos/yr-logo.png" style={{ width: 16, height: 16, marginRight: 6 }} />
                    <TextWidget
                        text="Capture"
                        style={{
                            fontSize: 14,
                            fontWeight: 'bold',
                            color: '#1A1C1E',
                        }}
                    />
                </FlexWidget>
            </FlexWidget>

            <FlexWidget style={{ flexDirection: 'row', justifyContent: 'space_around', alignItems: 'center', flex: 1, marginTop: 12 }}>
                 <FlexWidget style={{ alignItems: 'center' }}>
                     <FlexWidget clickAction="OPEN_URI" clickActionData={{ uri: 'yrecall://capture/note' }} style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: '#E8E1DA', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                         <SvgWidget svg={TEXT_SVG} style={{ width: 22, height: 22 }} />
                     </FlexWidget>
                     <TextWidget text="Note" style={{ fontSize: 11, color: '#44474E', fontWeight: '500' }} />
                 </FlexWidget>

                 <FlexWidget style={{ alignItems: 'center' }}>
                     <FlexWidget clickAction="OPEN_URI" clickActionData={{ uri: 'yrecall://capture/voice' }} style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: '#E8E1DA', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                         <SvgWidget svg={MIC_SVG} style={{ width: 22, height: 22 }} />
                     </FlexWidget>
                     <TextWidget text="Voice" style={{ fontSize: 11, color: '#44474E', fontWeight: '500' }} />
                 </FlexWidget>

                 <FlexWidget style={{ alignItems: 'center' }}>
                     <FlexWidget clickAction="OPEN_URI" clickActionData={{ uri: 'yrecall://capture/camera' }} style={{ width: 52, height: 52, borderRadius: 26, backgroundColor: '#E8E1DA', alignItems: 'center', justifyContent: 'center', marginBottom: 6 }}>
                         <SvgWidget svg={CAMERA_SVG} style={{ width: 22, height: 22 }} />
                     </FlexWidget>
                     <TextWidget text="Camera" style={{ fontSize: 11, color: '#44474E', fontWeight: '500' }} />
                 </FlexWidget>
            </FlexWidget>
        </FlexWidget>
    );
}
