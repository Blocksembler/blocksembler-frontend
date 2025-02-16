import armlet from "@/architectures/armlet/armlet.js"
import anna from "@/architectures/anna/anna.js"

const plugins = [armlet, anna];

export const pluginRegistry = plugins.reduce((registry, plugin) => {
    registry[plugin.name] = plugin;
    return registry;
}, {});