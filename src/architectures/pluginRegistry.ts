import anna from "@/architectures/anna/plugin"
import armlet from "@/architectures/armlet/plugin"
import {ArchitecturePlugin} from "@/types/plugin";

let plugins: Array<ArchitecturePlugin> = [anna, armlet];
export const pluginRegistry: Record<string, ArchitecturePlugin> = {};

for (const plugin of plugins) {
    pluginRegistry[plugin.name] = plugin;
}