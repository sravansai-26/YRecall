import React from 'react';
import type { WidgetTaskHandlerProps } from 'react-native-android-widget';
import { WidgetPreview } from 'react-native-android-widget';
import { requestWidgetUpdate } from 'react-native-android-widget';

// We'll define the widget components here for the task handler
import { QuickCaptureWidget } from './src/modules/widgets/components/QuickCaptureWidget';
import { SearchWidget } from './src/modules/widgets/components/SearchWidget';
import { DailyBriefWidget } from './src/modules/widgets/components/DailyBriefWidget';
import { TimelineWidget } from './src/modules/widgets/components/TimelineWidget';

export async function widgetTaskHandler(props: WidgetTaskHandlerProps) {
    const widgetInfo = props.widgetInfo;
    const widgetAction = props.widgetAction;

    // Based on the widget name registered in app.json, render the correct React component
    // Note: react-native-android-widget translates these React components to RemoteViews
    
    // We can handle CLICK actions here (deep linking)
    if (widgetAction === 'WIDGET_CLICK') {
        const actionData = props.clickActionData;
        if (actionData) {
            // For now, we just pass deep links to the app using Intent mechanism
            // If the user clicks a button with a deep link, it will launch the app
        }
    }

    if (widgetAction === 'WIDGET_ADDED' || widgetAction === 'WIDGET_UPDATE' || widgetAction === 'WIDGET_RESIZED') {
        // Render the widget UI
        switch (widgetInfo.widgetName) {
            case 'QuickCaptureWidget':
                props.renderWidget(<QuickCaptureWidget widgetInfo={widgetInfo} />);
                break;
            case 'SearchWidget':
                props.renderWidget(<SearchWidget widgetInfo={widgetInfo} />);
                break;
            case 'DailyBriefWidget':
                props.renderWidget(<DailyBriefWidget widgetInfo={widgetInfo} />);
                break;
            case 'TimelineWidget':
                props.renderWidget(<TimelineWidget widgetInfo={widgetInfo} />);
                break;
            default:
                // Unknown widget
                break;
        }
    }
}
