import "reflect-metadata";
import { Constructor } from "./Types";
export declare class Container {
    private readonly _typeMappings;
    private readonly _singletonCache;
    constructor();
    whenRequestingType<T>(requestingType: Constructor<T>): {
        useType: (t: Constructor<T>) => {
            asSingleInstance: () => void;
            asInstancePerRequest: () => string;
        };
        useRequestedType: () => {
            asSingleInstance: () => void;
            asInstancePerRequest: () => string;
        };
        useFactory: (f: () => T) => {
            asSingleInstance: () => void;
            asInstancePerRequest: () => string;
        };
    };
    private createNewTypeMapping;
    private findTypeMappingForConstructor;
    resolveType<T extends Constructor>(typeToResolve: T): T;
    resolve<T>(typeToResolve: Constructor<T>): T;
    private getPathDescription;
    private getSingletonCacheEntry;
    private createInstance;
}
