import type { Meta, StoryObj } from '@storybook/react';
import { Locator } from './locator';

const meta: Meta<typeof Locator> = {
  title: 'Components/Locator',
  component: Locator,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {},
};

