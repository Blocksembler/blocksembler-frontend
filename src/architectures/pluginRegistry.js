import anna from "@/architectures/anna/plugin.js"
import armlet from "@/architectures/armlet/plugin.js"
import simpleMips from "@/architectures/simpleMips/plugin.js"

const plugins = [anna, armlet, simpleMips];

export const pluginRegistry = plugins.reduce((registry, plugin) => {
    registry[plugin.name] = plugin;
    return registry;
}, {});