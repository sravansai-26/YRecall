import React from 'react';
import { FlexWidget, TextWidget, SvgWidget, WidgetComponentProps } from 'react-native-android-widget';

const SEARCH_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="#44474E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;
const MIC_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="#005CBB" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`;
const LOGO_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="#005CBB" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon></svg>`;

export function SearchWidget({ widgetInfo }: WidgetComponentProps) {
    return (
        <FlexWidget
            style={{
                height: 64,
                width: 'match_parent',
                backgroundColor: '#ffffff',
                borderRadius: 32,
                paddingHorizontal: 16,
                flexDirection: 'row',
                alignItems: 'center',
            }}
            clickAction="OPEN_URI"
            clickActionData={{ uri: 'yrecall://search' }}
        >
            <SvgWidget svg={LOGO_SVG} style={{ width: 22, height: 22, marginLeft: 4 }} />
            
            <TextWidget
                text="Search your memory..."
                style={{
                    fontSize: 16,
                    color: '#74777F',
                    marginLeft: 14,
                    flex: 1,
                }}
            />
            
            <FlexWidget 
                clickAction="OPEN_URI" 
                clickActionData={{ uri: 'yrecall://capture?type=voice' }} 
                style={{ padding: 10 }}
            >
                <SvgWidget svg={MIC_SVG} style={{ width: 24, height: 24 }} />
            </FlexWidget>
        </FlexWidget>
    );
}
