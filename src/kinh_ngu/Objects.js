
export let headOfObjects = null;

export const markObject = (obj) => {
    if (obj === null) return;
    obj.isMarked = true;
}

export const ValueType = Object.freeze({
    PRIMITIVE: Symbol('PRIMITIVE'),
    BOOLEAN: Symbol('BOOLEAN'), //memory collected
    NIL: Symbol('NIL'),
    NUMBER: Symbol('NUMBER'),
    STRING: Symbol('STRING'),
    BLOCK: Symbol('BLOCK'),
    CLOSURE: Symbol('CLOSURE'),
    NATIVE_FUNCTION: Symbol('NATIVE_FUNCTION'),
    CLASS: Symbol('CLASS'),
    OBJECT: Symbol('OBJECT'),
    METHOD: Symbol('METHOD'),
    BOUND_METHOD: Symbol('BOUND_METHOD'),
    INITIALIZER: Symbol('INITIALIZER'),
    LOCAL: Symbol('LOCAL'),
    UPVALUE: Symbol('UPVALUE'),
    FRAMEUPVALUE: Symbol('FRAMEUPVALUE'),
    OPENUPVALUE: Symbol('OPENUPVALUE'),
    COMPILERCLASS: Symbol('COMPILERCLASS'),
});

export const newClosure = (closure) => {
    const newClosure = {
        ...closure,
        frameUpvalues: {},
    }
    return newClosure;
}

export const newKlass = (klass) => {
    const newKlass = {
        ...klass,
    }
    return newKlass;
}

export const newObject = (object) => {
    const newObject = {
        ...object,
    }

    return newObject;
}

export const newMethod = (method) => {
    if (!method){
        return undefined;
    }
    const newMethod = {
        ...method,
    }

    return newMethod;
}

export const newInstance = (klass) => {
    const newInst = {
        type: ValueType.OBJECT,
        klass,
        fields: {},
    };

    return newInst;
};

export const newFrame = (closure, ip, stackSlot) => {
    let frame = {
        closure: closure,
        ip: ip,
        stackSlot: stackSlot,
        frameUpvalues: {}
    }
    return frame;
}

export class ObjectLox {
    constructor(value, type, isMarked=false) {
        this.value = value;
        this.type = type;
        this.isMarked = false;
        // this.next = headOfObjects;
        // headOfObjects = this.next;
    }

    static isValue(value){
        switch(value.type){
            case ValueType.PRIMITIVE:
            case ValueType.BOOLEAN:
            case ValueType.NIL:
            case ValueType.NUMBER:
            case ValueType.STRING:
            case ValueType.BLOCK:
            case ValueType.CLOSURE:
            case ValueType.CLASS:
            case ValueType.OBJECT:
            case ValueType.METHOD:
            case ValueType.BOUND_METHOD:
            case ValueType.INITIALIZER:
            case ValueType.LOCAL:
            case ValueType.UPVALUE:
            case ValueType.FRAMEUPVALUE:
            case ValueType.OPENUPVALUE:
            case ValueType.COMPILERCLASS:
                return true;
            default:
                return false;
        }
    }

    static isString({value, type}){
        return typeof value === 'string' && type === ValueType.STRING;
    }

    static isNumber({value, type}){
        return Number.isFinite(value) && type === ValueType.NUMBER;
    }

    static isBoolean({value, type}){
        return typeof value === 'boolean' && type === ValueType.BOOLEAN;
    }

    static isNil({value, type}){
        return value === null && type === ValueType.NIL;
    }
}

