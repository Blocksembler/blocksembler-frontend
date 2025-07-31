import anna from "@/architectures/anna/plugin"
import armlet from "@/architectures/armlet/plugin"
import scott from "@/architectures/scott/plugin"
import simpleRISC from "@/architectures/simpleRISC/plugin"
import {ArchitecturePlugin} from "@/types/plugin";

let plugins: Array<ArchitecturePlugin> = [anna, armlet, scott, simpleRISC];
export const pluginRegistry: Record<string, ArchitecturePlugin> = {};

for (const plugin of plugins) {
    pluginRegistry[plugin.name] = plugin;
}