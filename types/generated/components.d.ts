import type { Schema, Struct } from '@strapi/strapi';

export interface CommonTag extends Struct.ComponentSchema {
  collectionName: 'components_common_tags';
  info: {
    displayName: 'Tag';
  };
  attributes: {
    label: Schema.Attribute.String;
  };
}

export interface NavigationMenuItem extends Struct.ComponentSchema {
  collectionName: 'components_navigation_menu_items';
  info: {
    description: 'Menu item that can link to either an external URL or an internal page';
    displayName: 'Menu Item';
    icon: 'list';
  };
  attributes: {
    children: Schema.Attribute.Component<'navigation.menu-item-child', true>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    page: Schema.Attribute.Relation<'oneToOne', 'api::page.page'>;
    type: Schema.Attribute.Enumeration<['external', 'internal']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'internal'>;
    url: Schema.Attribute.String & Schema.Attribute.DefaultTo<'#'>;
  };
}

export interface NavigationMenuItemChild extends Struct.ComponentSchema {
  collectionName: 'components_navigation_menu_item_children';
  info: {
    description: 'Child menu item that can link to either an external URL or an internal page (without further nesting)';
    displayName: 'Menu Item Child';
    icon: 'list';
  };
  attributes: {
    label: Schema.Attribute.String & Schema.Attribute.Required;
    openInNewTab: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    page: Schema.Attribute.Relation<'oneToOne', 'api::page.page'>;
    type: Schema.Attribute.Enumeration<['external', 'internal']> &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'internal'>;
    url: Schema.Attribute.String;
  };
}

export interface SharedCallToAction extends Struct.ComponentSchema {
  collectionName: 'components_shared_call_to_actions';
  info: {
    description: 'A call-to-action component with button, link, and text for encouraging user engagement';
    displayName: 'Call to Action';
    icon: 'cursor';
  };
  attributes: {
    alignment: Schema.Attribute.Enumeration<['left', 'center', 'right']> &
      Schema.Attribute.DefaultTo<'center'>;
    buttonLink: Schema.Attribute.String;
    buttonStyle: Schema.Attribute.Enumeration<['primary', 'secondary', 'outline', 'ghost']> &
      Schema.Attribute.DefaultTo<'primary'>;
    buttonText: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Learn More'>;
    text: Schema.Attribute.Text;
    title: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

export interface SharedEventCalendar extends Struct.ComponentSchema {
  collectionName: 'components_shared_event_calendars';
  info: {
    description: 'A calendar component for displaying upcoming events of all types';
    displayName: 'Event Calendar';
    icon: 'calendar';
  };
  attributes: {
    categoryFilter: Schema.Attribute.Enumeration<
      ['competitive', 'social', 'training', 'administrative']
    >;
    dateRangeEnd: Schema.Attribute.Date;
    dateRangeStart: Schema.Attribute.Date;
    displayFormat: Schema.Attribute.Enumeration<['grid', 'list', 'compact']> &
      Schema.Attribute.DefaultTo<'list'>;
    eventTypes: Schema.Attribute.Enumeration<
      ['tournament', 'training', 'meeting', 'social', 'workshop', 'administrative']
    >;
    maxEvents: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          max: 100;
          min: 1;
        },
        number
      > &
      Schema.Attribute.DefaultTo<10>;
    showPastEvents: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    title: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Upcoming Events'>;
  };
}

export interface SharedEventRegistration extends Struct.ComponentSchema {
  collectionName: 'components_shared_event_registrations';
  info: {
    description: 'Registration component for events requiring sign-up (tournaments, training sessions, meetings, etc.)';
    displayName: 'Event Registration';
    icon: 'user-plus';
  };
  attributes: {
    currentParticipants: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      > &
      Schema.Attribute.DefaultTo<0>;
    customFields: Schema.Attribute.JSON;
    description: Schema.Attribute.Text;
    maxParticipants: Schema.Attribute.Integer &
      Schema.Attribute.SetMinMax<
        {
          min: 1;
        },
        number
      >;
    registrationDeadline: Schema.Attribute.DateTime;
    registrationEmail: Schema.Attribute.Email;
    registrationFee: Schema.Attribute.Decimal &
      Schema.Attribute.SetMinMax<
        {
          min: 0;
        },
        number
      >;
    registrationUrl: Schema.Attribute.String;
    requirePayment: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    showWaitlist: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    status: Schema.Attribute.Enumeration<['open', 'closed', 'waitlist', 'cancelled']> &
      Schema.Attribute.DefaultTo<'open'>;
    title: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Register for this Event'>;
  };
}

export interface SharedEventSchedule extends Struct.ComponentSchema {
  collectionName: 'components_shared_event_schedules';
  info: {
    description: 'A schedule component for displaying event dates and times (works for tournaments, training sessions, meetings, etc.)';
    displayName: 'Event Schedule';
    icon: 'calendar-alt';
  };
  attributes: {
    displayFormat: Schema.Attribute.Enumeration<['list', 'timeline', 'calendar']> &
      Schema.Attribute.DefaultTo<'list'>;
    scheduleItems: Schema.Attribute.Component<'shared.schedule-item', true>;
    showLocations: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    showTimes: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<true>;
    title: Schema.Attribute.String & Schema.Attribute.DefaultTo<'Schedule'>;
  };
}

export interface SharedMedia extends Struct.ComponentSchema {
  collectionName: 'components_shared_media';
  info: {
    displayName: 'Media';
    icon: 'file-video';
  };
  attributes: {
    file: Schema.Attribute.Media<'images' | 'files' | 'videos'>;
  };
}

export interface SharedQuote extends Struct.ComponentSchema {
  collectionName: 'components_shared_quotes';
  info: {
    displayName: 'Quote';
    icon: 'indent';
  };
  attributes: {
    body: Schema.Attribute.Text;
    title: Schema.Attribute.String;
  };
}

export interface SharedRichText extends Struct.ComponentSchema {
  collectionName: 'components_shared_rich_texts';
  info: {
    description: '';
    displayName: 'Rich text';
    icon: 'align-justify';
  };
  attributes: {
    body: Schema.Attribute.RichText;
  };
}

export interface SharedScheduleItem extends Struct.ComponentSchema {
  collectionName: 'components_shared_schedule_items';
  info: {
    description: 'A single item in an event schedule';
    displayName: 'Schedule Item';
    icon: 'clock';
  };
  attributes: {
    description: Schema.Attribute.Text;
    endDate: Schema.Attribute.DateTime;
    isAllDay: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    label: Schema.Attribute.String & Schema.Attribute.Required;
    location: Schema.Attribute.String;
    startDate: Schema.Attribute.DateTime & Schema.Attribute.Required;
  };
}

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'SEO';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text;
    metaKeywords: Schema.Attribute.String;
    metaTitle: Schema.Attribute.String;
    noIndex: Schema.Attribute.Boolean;
    shareImage: Schema.Attribute.Media;
  };
}

export interface SharedSlider extends Struct.ComponentSchema {
  collectionName: 'components_shared_sliders';
  info: {
    description: '';
    displayName: 'Slider';
    icon: 'address-book';
  };
  attributes: {
    files: Schema.Attribute.Media<'images', true>;
  };
}

declare module '@strapi/strapi' {
  export module Public {
    export interface ComponentSchemas {
      'common.tag': CommonTag;
      'navigation.menu-item': NavigationMenuItem;
      'navigation.menu-item-child': NavigationMenuItemChild;
      'shared.call-to-action': SharedCallToAction;
      'shared.event-calendar': SharedEventCalendar;
      'shared.event-registration': SharedEventRegistration;
      'shared.event-schedule': SharedEventSchedule;
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.schedule-item': SharedScheduleItem;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
    }
  }
}
