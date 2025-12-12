import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiParam,
  ApiQuery,
  ApiBody,
} from '@nestjs/swagger';
import { ComponentsService } from '../services/components.service';
import { CreateComponentDto } from '../models/create-component.dto';
import { UpdateComponentDto } from '../models/update-component.dto';
import {
  ComponentResponse,
  ComponentListResponse,
} from '../models/component-response.type';
import { ComponentType } from '../../../shared/types/component.types';

/**
 * Controller for component management endpoints
 */
@ApiTags('components')
@Controller('components')
export class ComponentsController {
  constructor(private readonly componentsService: ComponentsService) {}

  /**
   * Create a new component
   * POST /api/components
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new component' })
  @ApiResponse({
    status: 201,
    description: 'Component created successfully',
    type: ComponentResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createComponentDto: CreateComponentDto): ComponentResponse {
    return this.componentsService.create(createComponentDto) as any;
  }

  /**
   * Get all components
   * GET /api/components
   */
  @Get()
  @ApiOperation({ summary: 'Get all components' })
  @ApiQuery({
    name: 'type',
    required: false,
    enum: ComponentType,
    description: 'Filter by component type',
  })
  @ApiResponse({
    status: 200,
    description: 'List of components retrieved successfully',
    type: ComponentListResponse,
  })
  findAll(@Query('type') type?: string): ComponentListResponse {
    if (type) {
      return this.componentsService.findByType(type as ComponentType);
    }
    return this.componentsService.findAll();
  }

  /**
   * Get available component types
   * GET /api/components/types
   */
  @Get('types')
  @ApiOperation({ summary: 'Get available component types' })
  @ApiResponse({
    status: 200,
    description: 'Component types retrieved successfully',
    schema: {
      type: 'array',
      items: {
        type: 'string',
        enum: Object.values(ComponentType),
      },
    },
  })
  getTypes(): ComponentType[] {
    return this.componentsService.getAvailableTypes();
  }

  /**
   * Get a component by ID
   * GET /api/components/:id
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a component by ID' })
  @ApiParam({ name: 'id', description: 'Component ID', example: 'comp-1' })
  @ApiResponse({
    status: 200,
    description: 'Component retrieved successfully',
    type: ComponentResponse,
  })
  @ApiResponse({ status: 404, description: 'Component not found' })
  findOne(@Param('id') id: string): ComponentResponse {
    return this.componentsService.findOne(id) as any;
  }

  /**
   * Update a component
   * PATCH /api/components/:id
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update a component' })
  @ApiParam({ name: 'id', description: 'Component ID', example: 'comp-1' })
  @ApiBody({ type: UpdateComponentDto })
  @ApiResponse({
    status: 200,
    description: 'Component updated successfully',
    type: ComponentResponse,
  })
  @ApiResponse({ status: 404, description: 'Component not found' })
  update(
    @Param('id') id: string,
    @Body() updateComponentDto: UpdateComponentDto,
  ): ComponentResponse {
    return this.componentsService.update(id, updateComponentDto) as any;
  }

  /**
   * Delete a component
   * DELETE /api/components/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a component' })
  @ApiParam({ name: 'id', description: 'Component ID', example: 'comp-1' })
  @ApiResponse({ status: 204, description: 'Component deleted successfully' })
  @ApiResponse({ status: 404, description: 'Component not found' })
  remove(@Param('id') id: string): void {
    this.componentsService.remove(id);
  }
}
