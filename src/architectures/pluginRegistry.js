import armlet from "@/architectures/armlet/plugin.js"
import anna from "@/architectures/anna/plugin.js"
import scott from "@/architectures/scott/plugin.js"

const plugins = [armlet, anna, scott];

export const pluginRegistry = plugins.reduce((registry, plugin) => {
    registry[plugin.name] = plugin;
    return registry;
}, {});