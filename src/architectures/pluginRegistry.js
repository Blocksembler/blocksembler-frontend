import armlet from "@/architectures/armlet/plugin.js"

const plugins = [armlet];

export const pluginRegistry = plugins.reduce((registry, plugin) => {
    registry[plugin.name] = plugin;
    return registry;
}, {});