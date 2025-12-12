import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateComponentDto } from '../models/create-component.dto';
import { UpdateComponentDto } from '../models/update-component.dto';
import {
  ComponentResponse,
  ComponentListResponse,
} from '../models/component-response.type';
import { PageComponent } from '../../../shared/types/component.types';
import {
  ComponentType,
  BaseComponent,
} from '../../../shared/types/component.types';

/**
 * Service for managing components
 * Uses mock data for initial implementation
 */
@Injectable()
export class ComponentsService {
  private components: PageComponent[] = [];
  private nextId = 1;

  constructor() {
    this.initializeMockData();
  }

  /**
   * Initialize mock data for development
   */
  private initializeMockData(): void {
    const mockComponent1: PageComponent = {
      id: 'comp-1',
      type: ComponentType.TEXT,
      content: 'Sample Text Component',
      style: {
        fontSize: '16px',
        color: '#333333',
        padding: '10px',
      },
    };

    const mockComponent2: PageComponent = {
      id: 'comp-2',
      type: ComponentType.IMAGE,
      src: '/images/sample.jpg',
      alt: 'Sample Image',
      style: {
        width: '100%',
        height: 'auto',
        borderRadius: '8px',
      },
    };

    const mockComponent3: PageComponent = {
      id: 'comp-3',
      type: ComponentType.ICON,
      iconName: 'heart',
      size: 24,
      color: '#ff0000',
      style: {
        padding: '10px',
      },
    };

    const mockComponent4: PageComponent = {
      id: 'comp-4',
      type: ComponentType.CONTAINER,
      children: [mockComponent1, mockComponent2],
      style: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
        padding: '20px',
        backgroundColor: '#f5f5f5',
      },
    };

    this.components = [
      mockComponent1,
      mockComponent2,
      mockComponent3,
      mockComponent4,
    ];
    this.nextId = 5;
  }

  /**
   * Create a new component
   */
  create(createComponentDto: CreateComponentDto): PageComponent {
    const newComponent: PageComponent = {
      id: `comp-${this.nextId++}`,
      type: createComponentDto.type,
      style: createComponentDto.style,
      ...(createComponentDto.type === ComponentType.TEXT && {
        content: createComponentDto.content || '',
      }),
      ...(createComponentDto.type === ComponentType.IMAGE && {
        src: createComponentDto.src || '',
        alt: createComponentDto.alt,
      }),
      ...(createComponentDto.type === ComponentType.ICON && {
        iconName: createComponentDto.iconName || '',
      }),
      ...((createComponentDto.type === ComponentType.CONTAINER ||
        createComponentDto.type === ComponentType.ROW ||
        createComponentDto.type === ComponentType.COLUMN) && {
        children: createComponentDto.children || [],
      }),
    } as PageComponent;

    this.components.push(newComponent);
    return newComponent;
  }

  /**
   * Get all components
   */
  findAll(): ComponentListResponse {
    return {
      components: this.components as any,
      total: this.components.length,
    };
  }

  /**
   * Get components by type
   */
  findByType(type: ComponentType): ComponentListResponse {
    const filtered = this.components.filter((c) => c.type === type);
    return {
      components: filtered as any,
      total: filtered.length,
    };
  }

  /**
   * Get a component by ID
   */
  findOne(id: string): PageComponent {
    const component = this.findComponentById(this.components, id);
    if (!component) {
      throw new NotFoundException(`Component with ID ${id} not found`);
    }
    return component;
  }

  /**
   * Recursively find a component by ID in the component tree
   */
  private findComponentById(
    components: (PageComponent | BaseComponent)[],
    id: string,
  ): PageComponent | null {
    for (const component of components) {
      if (component.id === id) {
        return component as PageComponent;
      }
      if (component.children) {
        const found = this.findComponentById(component.children, id);
        if (found) {
          return found;
        }
      }
    }
    return null;
  }

  /**
   * Update a component
   */
  update(id: string, updateComponentDto: UpdateComponentDto): PageComponent {
    const component = this.findOne(id);
    const updatedComponent: PageComponent = {
      ...component,
      ...updateComponentDto,
      style: {
        ...component.style,
        ...updateComponentDto.style,
      },
      ...(updateComponentDto.type === ComponentType.TEXT && {
        content: updateComponentDto.content ?? (component as any).content,
      }),
      ...(updateComponentDto.type === ComponentType.IMAGE && {
        src: updateComponentDto.src ?? (component as any).src,
        alt: updateComponentDto.alt ?? (component as any).alt,
      }),
      ...(updateComponentDto.type === ComponentType.ICON && {
        iconName:
          updateComponentDto.iconName ?? (component as any).iconName,
      }),
      ...((updateComponentDto.type === ComponentType.CONTAINER ||
        updateComponentDto.type === ComponentType.ROW ||
        updateComponentDto.type === ComponentType.COLUMN) && {
        children: updateComponentDto.children ?? (component as any).children,
      }),
    } as PageComponent;

    this.updateComponentInTree(this.components, id, updatedComponent);
    return updatedComponent;
  }

  /**
   * Recursively update a component in the component tree
   */
  private updateComponentInTree(
    components: (PageComponent | BaseComponent)[],
    id: string,
    updatedComponent: PageComponent,
  ): boolean {
    for (let i = 0; i < components.length; i++) {
      if (components[i].id === id) {
        components[i] = updatedComponent;
        return true;
      }
      if (components[i].children) {
        if (
          this.updateComponentInTree(
            components[i].children!,
            id,
            updatedComponent,
          )
        ) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Delete a component
   */
  remove(id: string): void {
    if (!this.removeComponentFromTree(this.components, id)) {
      throw new NotFoundException(`Component with ID ${id} not found`);
    }
  }

  /**
   * Recursively remove a component from the component tree
   */
  private removeComponentFromTree(
    components: (PageComponent | BaseComponent)[],
    id: string,
  ): boolean {
    for (let i = 0; i < components.length; i++) {
      if (components[i].id === id) {
        components.splice(i, 1);
        return true;
      }
      if (components[i].children) {
        if (this.removeComponentFromTree(components[i].children!, id)) {
          return true;
        }
      }
    }
    return false;
  }

  /**
   * Get available component types
   */
  getAvailableTypes(): ComponentType[] {
    return Object.values(ComponentType);
  }
}
