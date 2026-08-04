import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemaTypes';
import { dataset, projectId } from './sanity/env';

const pid = projectId || 'placeholder';

export default defineConfig({
  name: 'capos',
  title: "Capo's Articles",
  projectId: pid,
  dataset,
  basePath: '/studio',
  plugins: [structureTool(), visionTool()],
  schema: { types: schemaTypes },
});
