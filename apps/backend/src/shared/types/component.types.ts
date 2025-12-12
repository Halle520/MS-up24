/**
 * Component types and interfaces for the page builder
 */

export enum ComponentType {
  TEXT = 'text',
  IMAGE = 'image',
  ICON = 'icon',
  CONTAINER = 'container',
  ROW = 'row',
  COLUMN = 'column',
}

export interface ComponentStyle {
  width?: string;
  height?: string;
  padding?: string;
  margin?: string;
  backgroundColor?: string;
  color?: string;
  fontSize?: string;
  fontWeight?: string;
  textAlign?: 'left' | 'center' | 'right' | 'justify';
  border?: string;
  borderRadius?: string;
  display?: string;
  flexDirection?: 'row' | 'column';
  justifyContent?: string;
  alignItems?: string;
  gap?: string;
}

export interface ComponentPosition {
  x?: number;
  y?: number;
  zIndex?: number;
}

export interface BaseComponent {
  id: string;
  type: ComponentType;
  style?: ComponentStyle;
  position?: ComponentPosition;
  children?: BaseComponent[];
}

export interface TextComponent extends BaseComponent {
  type: ComponentType.TEXT;
  content: string;
  style?: ComponentStyle & {
    fontSize?: string;
    fontWeight?: string;
    color?: string;
    textAlign?: 'left' | 'center' | 'right' | 'justify';
  };
}

export interface ImageComponent extends BaseComponent {
  type: ComponentType.IMAGE;
  src: string;
  alt?: string;
  style?: ComponentStyle & {
    width?: string;
    height?: string;
    objectFit?: 'contain' | 'cover' | 'fill' | 'none' | 'scale-down';
  };
}

export interface IconComponent extends BaseComponent {
  type: ComponentType.ICON;
  iconName: string;
  size?: number;
  color?: string;
  style?: ComponentStyle;
}

export interface ContainerComponent extends BaseComponent {
  type: ComponentType.CONTAINER | ComponentType.ROW | ComponentType.COLUMN;
  children: BaseComponent[];
  style?: ComponentStyle & {
    display?: 'flex' | 'grid' | 'block';
    flexDirection?: 'row' | 'column';
    gap?: string;
  };
}

export type PageComponent =
  | TextComponent
  | ImageComponent
  | IconComponent
  | ContainerComponent;
