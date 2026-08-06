import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { visionTool } from '@sanity/vision';
import { schemaTypes } from './sanity/schemaTypes';
import { structure } from './sanity/structure';
import { dataset, projectId } from './sanity/env';

const pid = projectId || 'placeholder';

export default defineConfig({
  name: 'capos',
  title: "Capo's Studio",
  projectId: pid,
  dataset,
  basePath: '/studio',
  plugins: [
    structureTool({ structure }),
    visionTool(),
  ],
  schema: { types: schemaTypes },
});

