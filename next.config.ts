import path from "node:path";

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // The LeadStrikes folder, not this project.
    //
    // Two constraints meet here. A stray lockfile in the user's home directory
    // makes Next infer the wrong workspace root, so it has to be pinned. But
    // @leadstrikes/motion-engine is installed via `file:` and symlinks out to a
    // sibling directory — pinning the root any tighter than the shared parent
    // puts the engine outside it and Turbopack cannot resolve the import.
    root: path.resolve(__dirname, "../.."),
  },
};

export default nextConfig;
