import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  turbopack: {
    // Pinned explicitly rather than left to auto-detection: a stray lockfile
    // above this project (in a parent or home directory, depending on
    // machine) makes Next infer the wrong workspace root otherwise.
    //
    // Previously pinned two levels up, because @leadstrikes/motion-engine was
    // a `file:` dependency symlinked to a sibling directory outside this
    // project — which made the whole app unbuildable anywhere but this one
    // machine (a fresh clone, or a CI/deploy runner, has no such sibling
    // folder). The engine is now vendored into ./vendor/motion-engine, inside
    // the project, so the root only needs to cover this directory.
    root: __dirname,
  },
};

export default nextConfig;
