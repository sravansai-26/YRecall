import React from 'react';
import { FlexWidget, TextWidget, ImageWidget, SvgWidget } from 'react-native-android-widget';

const SEARCH_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="#44474E" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>`;
const MIC_SVG = `<svg viewBox="0 0 24 24" fill="none" stroke="#003D0B" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z"></path><path d="M19 10v2a7 7 0 0 1-14 0v-2"></path><line x1="12" y1="19" x2="12" y2="23"></line><line x1="8" y1="23" x2="16" y2="23"></line></svg>`;

export function SearchWidget({ widgetInfo }: { widgetInfo: any }) {
    return (
        <FlexWidget
            style={{ height: "match_parent", width: "match_parent", backgroundColor: '#FFF8F1', borderRadius: 24, padding: 12, justifyContent: 'space-between', flexDirection: 'row', alignItems: 'center' }}
            clickAction="OPEN_URI"
            clickActionData={{ uri: 'yrecall://search' }}
        >
            <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }}>
                <SvgWidget svg={SEARCH_SVG} style={{ width: 18, height: 18, marginRight: 8, marginLeft: 4 }} />
                <TextWidget text="Search your memory..." style={{ fontSize: 14, color: '#44474E', marginLeft: 4 }} />
            </FlexWidget>

            <FlexWidget style={{ flexDirection: 'row', alignItems: 'center' }} clickAction="OPEN_URI" clickActionData={{ uri: 'yrecall://capture?type=voice' }} >
                <SvgWidget svg={MIC_SVG} style={{ width: 20, height: 20, marginRight: 12 }} />
                <ImageWidget image={require('../../../../assets/logos/yr-logo-widget.png')} imageWidth={22} imageHeight={22} style={{ width: 22, height: 22, marginRight: 4 }} />
            </FlexWidget>
        </FlexWidget>
    );
}
