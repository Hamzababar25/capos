import { defineConfig } from 'sanity';
import { structureTool } from 'sanity/structure';
import { schemaTypes } from './sanity/schemaTypes';
import { structure } from './sanity/structure';
import { dataset, projectId } from './sanity/env';

const pid = projectId || 'placeholder';

/**
 * Capos Admin (Sanity Studio)
 * Vision / developer tools hidden — simpler for the client.
 */
export default defineConfig({
  name: 'capos',
  title: 'Capos Admin',
  projectId: pid,
  dataset,
  basePath: '/studio',
  plugins: [
    structureTool({
      structure,
      title: 'Admin',
    }),
  ],
  schema: { types: schemaTypes },
});
