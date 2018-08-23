"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
var PendingResolveJob_1 = require("./PendingResolveJob");
var Utilities_1 = require("./Utilities");
var Container = /** @class */ (function () {
    function Container() {
        this._typeMappings = [];
    }
    Container.prototype.whenRequestingType = function (requestingType) {
        var _this = this;
        return {
            useType: function (useType) { return _this._typeMappings.push({
                requestingType: requestingType,
                useType: useType
            }); }
        };
    };
    Container.prototype.resolve = function (typeToResolve) {
        var _a;
        var resolveJobs = new Array();
        resolveJobs.push(new PendingResolveJob_1.PendingResolveJob(typeToResolve, null, null));
        while (resolveJobs.length > 0) {
            var job = resolveJobs[resolveJobs.length - 1];
            try {
                var parentJob = job.parent;
                var constructor = job.constructor;
                for (var _i = 0, _b = this._typeMappings; _i < _b.length; _i++) {
                    var mapping = _b[_i];
                    if (mapping.requestingType !== constructor)
                        continue;
                    constructor = mapping.useType;
                    break;
                }
                var className = this.extractClassName(constructor);
                if (constructor === String || constructor === Number)
                    throw new Error('Simple types (in this case ' + className + ') can\'t be injected.');
                var argumentInjectionInstanceDictionary = job.argumentInjectionDictionary;
                var parentArgumentInjectionInstanceDictionary = parentJob && parentJob.argumentInjectionDictionary;
                if (argumentInjectionInstanceDictionary.getParameterIndexes().length === job.argumentCount) {
                    var instance = new ((_a = constructor).bind.apply(_a, [void 0].concat(argumentInjectionInstanceDictionary.toParameterArray())))();
                    if (parentJob === null)
                        return instance;
                    parentArgumentInjectionInstanceDictionary.updateParameterAtIndex(job.argumentIndex, instance);
                    resolveJobs.splice(resolveJobs.length - 1, 1);
                    continue;
                }
                var argumentInjectionTypeDictionary = Utilities_1.getMetadata(constructor, 'arguments');
                var argumentCount = Utilities_1.getMetadata(constructor, 'argumentCount');
                if (!argumentInjectionTypeDictionary)
                    throw new Error('The class ' + className + ' must be decorated with the @Injectable decorator for it to be resolved.');
                job.argumentCount = argumentCount;
                if (argumentInjectionTypeDictionary.getParameterIndexes().length !== argumentCount)
                    throw new Error('All arguments in the class ' + className + ' must have the @Inject decorator set for it to be resolved.');
                var argumentIndexes = argumentInjectionTypeDictionary.getParameterIndexes();
                if (argumentCount > 0) {
                    for (var _c = 0, argumentIndexes_1 = argumentIndexes; _c < argumentIndexes_1.length; _c++) {
                        var argumentIndex = argumentIndexes_1[_c];
                        var argumentType = argumentInjectionTypeDictionary.getParameter(argumentIndex);
                        resolveJobs.push(new PendingResolveJob_1.PendingResolveJob(argumentType, job, argumentIndex));
                    }
                }
                else {
                    var instance = new constructor();
                    if (parentJob === null)
                        return instance;
                    parentArgumentInjectionInstanceDictionary.updateParameterAtIndex(job.argumentIndex, instance);
                    resolveJobs.splice(resolveJobs.length - 1, 1);
                    continue;
                }
            }
            catch (ex) {
                if (!(ex instanceof Error))
                    throw ex;
                var err = ex;
                var path = this.extractClassName(job.constructor);
                var indentCount = 0;
                while (true) {
                    job = job.parent;
                    if (!job)
                        break;
                    var indent = '';
                    for (var i = 0; i < indentCount; i++) {
                        indent += ' ';
                    }
                    path = this.extractClassName(job.constructor) + '\n' + indent + '-> ' + path;
                    indentCount++;
                }
                throw new Error(err.message + '\nWhile resolving:\n-> ' + path);
            }
        }
    };
    Container.prototype.extractClassName = function (constructor) {
        return constructor.name || constructor;
    };
    return Container;
}());
exports.Container = Container;
//# sourceMappingURL=Container.js.map