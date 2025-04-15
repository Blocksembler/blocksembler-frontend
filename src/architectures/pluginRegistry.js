import anna from "@/architectures/anna/plugin.js"
import armlet from "@/architectures/armlet/plugin.js"
import simpleRISC from "@/architectures/simpleRISC/plugin.js"

const plugins = [anna, armlet, simpleRISC];

export const pluginRegistry = plugins.reduce((registry, plugin) => {
    registry[plugin.name] = plugin;
    return registry;
}, {});