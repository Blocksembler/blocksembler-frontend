import armlet from "@/architectures/armlet/plugin.js"
import anna from "@/architectures/anna/plugin.js"

const plugins = [armlet, anna];

export const pluginRegistry = plugins.reduce((registry, plugin) => {
    registry[plugin.name] = plugin;
    return registry;
}, {});