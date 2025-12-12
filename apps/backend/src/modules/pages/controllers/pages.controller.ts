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
import { PagesService } from '../services/pages.service';
import { CreatePageDto } from '../models/create-page.dto';
import { UpdatePageDto } from '../models/update-page.dto';
import { PageResponse, PageListResponse } from '../models/page-response.type';

/**
 * Controller for page management endpoints
 */
@ApiTags('pages')
@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  /**
   * Create a new page
   * POST /api/pages
   */
  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new page' })
  @ApiResponse({
    status: 201,
    description: 'Page created successfully',
    type: PageResponse,
  })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createPageDto: CreatePageDto): PageResponse {
    return this.pagesService.create(createPageDto);
  }

  /**
   * Get all pages with pagination
   * GET /api/pages?page=1&limit=10
   */
  @Get()
  @ApiOperation({ summary: 'Get all pages with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number, example: 1 })
  @ApiQuery({ name: 'limit', required: false, type: Number, example: 10 })
  @ApiResponse({
    status: 200,
    description: 'List of pages retrieved successfully',
    type: PageListResponse,
  })
  findAll(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ): PageListResponse {
    const pageNum = page ? parseInt(page, 10) : 1;
    const limitNum = limit ? parseInt(limit, 10) : 10;
    return this.pagesService.findAll(pageNum, limitNum);
  }

  /**
   * Get a page by ID
   * GET /api/pages/:id
   */
  @Get(':id')
  @ApiOperation({ summary: 'Get a page by ID' })
  @ApiParam({ name: 'id', description: 'Page ID', example: '1' })
  @ApiResponse({
    status: 200,
    description: 'Page retrieved successfully',
    type: PageResponse,
  })
  @ApiResponse({ status: 404, description: 'Page not found' })
  findOne(@Param('id') id: string): PageResponse {
    return this.pagesService.findOne(id);
  }

  /**
   * Get a page by slug
   * GET /api/pages/slug/:slug
   */
  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a page by slug' })
  @ApiParam({ name: 'slug', description: 'Page slug', example: 'my-page' })
  @ApiResponse({
    status: 200,
    description: 'Page retrieved successfully',
    type: PageResponse,
  })
  @ApiResponse({ status: 404, description: 'Page not found' })
  findBySlug(@Param('slug') slug: string): PageResponse {
    return this.pagesService.findBySlug(slug);
  }

  /**
   * Update a page
   * PATCH /api/pages/:id
   */
  @Patch(':id')
  @ApiOperation({ summary: 'Update a page' })
  @ApiParam({ name: 'id', description: 'Page ID', example: '1' })
  @ApiBody({ type: UpdatePageDto })
  @ApiResponse({
    status: 200,
    description: 'Page updated successfully',
    type: PageResponse,
  })
  @ApiResponse({ status: 404, description: 'Page not found' })
  update(
    @Param('id') id: string,
    @Body() updatePageDto: UpdatePageDto,
  ): PageResponse {
    return this.pagesService.update(id, updatePageDto);
  }

  /**
   * Delete a page
   * DELETE /api/pages/:id
   */
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete a page' })
  @ApiParam({ name: 'id', description: 'Page ID', example: '1' })
  @ApiResponse({ status: 204, description: 'Page deleted successfully' })
  @ApiResponse({ status: 404, description: 'Page not found' })
  remove(@Param('id') id: string): void {
    this.pagesService.remove(id);
  }

  /**
   * Publish a page
   * POST /api/pages/:id/publish
   */
  @Post(':id/publish')
  @ApiOperation({ summary: 'Publish a page' })
  @ApiParam({ name: 'id', description: 'Page ID', example: '1' })
  @ApiResponse({
    status: 200,
    description: 'Page published successfully',
    type: PageResponse,
  })
  @ApiResponse({ status: 404, description: 'Page not found' })
  publish(@Param('id') id: string): PageResponse {
    return this.pagesService.publish(id);
  }

  /**
   * Unpublish a page
   * POST /api/pages/:id/unpublish
   */
  @Post(':id/unpublish')
  @ApiOperation({ summary: 'Unpublish a page' })
  @ApiParam({ name: 'id', description: 'Page ID', example: '1' })
  @ApiResponse({
    status: 200,
    description: 'Page unpublished successfully',
    type: PageResponse,
  })
  @ApiResponse({ status: 404, description: 'Page not found' })
  unpublish(@Param('id') id: string): PageResponse {
    return this.pagesService.unpublish(id);
  }
}
