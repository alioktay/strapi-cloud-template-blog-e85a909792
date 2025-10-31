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
    url: Schema.Attribute.String;
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

export interface SharedSeo extends Struct.ComponentSchema {
  collectionName: 'components_shared_seos';
  info: {
    displayName: 'SEO';
  };
  attributes: {
    metaDescription: Schema.Attribute.Text;
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
      'shared.media': SharedMedia;
      'shared.quote': SharedQuote;
      'shared.rich-text': SharedRichText;
      'shared.seo': SharedSeo;
      'shared.slider': SharedSlider;
    }
  }
}
