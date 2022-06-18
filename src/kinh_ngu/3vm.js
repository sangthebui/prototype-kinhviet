import Compiler, { OpCode } from './2compile.js';

import {
    ObjectLox, ValueType,
    newKlass, newMethod, newInstance,
    newFrame, newClosure
} from "./Objects.js";

export let standard_output = [];

const print = (text) => {
    standard_output.push(text);
}

export const InterpretResult  = Object.freeze({
    INTERPRET_OK: Symbol('INTERPRET_OK'),
    INTERPRET_COMPILE_ERROR: Symbol('INTERPRET_COMPILE_ERROR'),
    INTERPRET_RUNTIME_ERROR: Symbol('INTERPRET_RUNTIME_ERROR'),
});

const FRAMES_MAX = 256;

//TODO remove ObjectLox for primitive values

const printValue = (value) => {
    switch(value.type){
        case ValueType.NIL:
            print("nil");
            break;
        case ValueType.PRIMITIVE:
            print(value.value);
            break;
        case ValueType.CLOSURE:
            print(value.name);
            break;
        case ValueType.CLASS:
            print(value.name);
            break;
        case ValueType.OBJECT:
            print(`instance of ${value.klass.name}`);
            break;
        case ValueType.NATIVE_FUNCTION:
            print("<native fn>");
            break;
        case ValueType.METHOD:
        case ValueType.BOUND_METHOD:
            print("<fn method>");
            break;
        default:
            print(value.value);
            break;

    }
};

//Memory management: stacks, globals, frame.closure (same as compiler.closure), frame.closure.frameUpvalues,
//compiler.closure

export default class VM {
    //TODO GC
    stack = []; // the array stack of Values
    //TODO GC
    globals = {}; // list of globals variables during runtime
    frames = []; // list of call frames
    frameCount = 0;
    currentFunctionStackLocation = 0;
    //TODO GC
    openUpvalues = null;

    constructor() {
        this.defineNative('clock', this.clockNative);
    }

    runtimeError(message){
        print(`Runtime error: ${message}`);
    }

    push(value){
        return this.stack.push(value) - 1;
    }
    popN(n){
        for(let i = 0; i < n; i++){
            this.stack.pop();
        }
    }
    pop() {
        return this.stack.pop();
    };
    peek(distance) {
        //look at the top of the stack
        const dist = this.stack.length - 1 - distance;
        return this.stack[dist];
    }

    defineNative(name, closure){
        this.globals[name] = {
            type: ValueType.NATIVE_FUNCTION,
            closure
        };
    }

    clockNative(argCount, value){
        //wrap the clock value inside an ObjectLox
        return new ObjectLox(new Date() / 1000, ValueType.NUMBER);
    }

    isFalsey(value){
        const isNil = ObjectLox.isNil(value) ;
        const isBool = ObjectLox.isBoolean(value);
        const isFalse =  isNil  || (isBool && !value.value);

      return isFalse;
    }

    valuesEqual(aValue, bValue){
        if (aValue.type !== bValue.type) return false;
        switch(aValue.type){
            case ValueType.NIL: return true;
            case ValueType.BOOLEAN:
            case ValueType.NUMBER:
            case ValueType.STRING:
                return aValue.value === bValue.value;
            default:
                return false;
        }
    }

    captureUpvalue(local){
        let prevUpvalue = null;
        let upvalue = this.openUpvalues;

        while(upvalue !== null && upvalue.location > local){
            prevUpvalue = upvalue;
            upvalue = upvalue.next;
        }

        if (upvalue !== null && upvalue.location === local){
            return upvalue;
        }
        //TODO GC openUpvalue
        let createdUpvalue =  {
            location: local,
            next: upvalue, // createdUpvalue.next = upvalue;
            isCaptured: false,
        };
        // createdUpvalue.next = ;

        if (prevUpvalue === null){
            this.openUpvalues = createdUpvalue;
        } else {
            prevUpvalue.next = createdUpvalue;
        }

        return createdUpvalue;
    }

    closeUpvalues(last){
        while (this.openUpvalues !== null && this.openUpvalues.location >= last) {
            let upvalue = this.openUpvalues;
            //capture the item on the stack
            let localFromStack = this.stack[upvalue.location];
            upvalue.location = localFromStack;
            this.openUpvalues = upvalue.next;
        }
    }

    callValue(callee, argCount){

        switch(callee.type){
            case ValueType.BOUND_METHOD: {
                //binding this to each method
                let location = this.stack.length - argCount - 1;
                this.stack[location] = callee.receiver;

                return this.call(callee.method, argCount);
            }
            case ValueType.CLASS: {
                const instance =  newInstance(callee);
                //push onto the stack before all the arguments
                const position = this.stack.length - 1 - argCount;
                this.stack[position] = instance;//put the object where the class before the arguments

                let initializer = newMethod(callee.methods['init']);

                if (initializer !== undefined && initializer !== null){
                    //binding this to each method
                    return this.call(initializer, argCount);

                } else if (argCount !== 0){
                    this.runtimeError(`Expected 0 arguments but got ${argCount}`);
                    return false;
                }

                return true;
            }
            case ValueType.CLOSURE: {
                //we are calling function
                return this.call(callee, argCount);
            }
            case ValueType.NATIVE_FUNCTION: {
                const result = callee.closure(argCount, this.stack.length - 1 - argCount);
                this.stack = this.stack.slice(0, argCount + 1); // remove the argCount and the function
                this.push(result);
                return true;
            }
            default: break;
        }
        this.runtimeError('Can only call functions and classes');
        return false;
    }

    call(closure, argCount){
        if (argCount !== closure.arity){
            this.runtimeError(`Expected ${closure.arity} arguments but got ${argCount}.`);
            return false;
        }

        //probably need to handle the max frame size ourselves
        if (this.frames.length === FRAMES_MAX){
            this.runtimeError('Stack Overflow.');
            return false;
        }

        // if (closure.type === ValueType.CLOSURE ||
        //     closure.type === ValueType.METHOD ||
        //     closure.type === ValueType.INITIALIZER){
        //     closure.ip = 0; //reset the frame IP when it gets call multiple times.
        // }

        //convert the call frames stack to a push and pop action
        let stackSlot = this.stack.length - 1 - argCount;
        let frame = newFrame(closure, 0, stackSlot);
        this.frames.push(frame);
        this.frameCount++;

        return true;
    }

    bindMethod(klass, name){
        if (!klass.methods[name]){
            this.runtimeError(`Undefined property in ${klass.name}`);
            return false;
        }

        const receiver = this.peek(0);
        //TODO GC BoundMethod
        const boundMethod = {
            type: ValueType.BOUND_METHOD,
            receiver,
            method: klass.methods[name],
        };

        this.pop(); //pop the instance off the stack and push the method
        this.push(boundMethod);

        return true;
    }

    invokeFromClass(klass, methodName, argCount){
        let method = klass.methods[methodName];
        if (method === undefined || method === null){
            this.runtimeError(`Undefined property ${methodName}`);
            return false;
        }
        return this.call(method, argCount);
    }

    invoke(methodName, argCount){
        const instance = this.peek(argCount);

        //check the fields before the method
        let field = instance.fields[methodName];
        if (field !== undefined && field !== null &&
            field.toString().indexOf('[native code]') === -1){ //JS hack to check against prototype code
            // this.stack = field
            return this.callValue(field, argCount);
        }

        if (instance.type !== ValueType.OBJECT){
            this.runtimeError("Only instances have methods.");
            return false;
        }

        let method = newMethod(instance.klass.methods[methodName]);
        if (method === undefined || method === null ||
            method.toString().indexOf('[native code]') !== -1){ //JS hack to check against prototype code
            this.runtimeError(`Undefined property ${methodName}`);
            return false;
        }
        return this.call(method, argCount);
    }

    run(){
        let frame = this.frames[this.frameCount - 1];

        function read_constant(){
            const constantIndex = read_byte();
            return frame.closure.constants[constantIndex];
        }
        function read_string(){
            const constant = read_constant();
            return constant.value;
        }
        function read_byte(){
            return frame.closure.code[frame.ip++];
        }

        while(true){
            const instruction = read_byte();

            switch (instruction) {
                case OpCode.OP_CONSTANT: {
                    const constant = read_constant();
                    this.push(constant);
                    break;
                }
                case OpCode.OP_NIL: {
                    //TODO GC Value
                    // this.push(new Value(null, ValueType.NIL));
                    this.push(new ObjectLox(null, ValueType.NIL));
                    break;
                }
                case OpCode.OP_TRUE: {
                    //TODO GC Value
                    // this.push(new Value(true, ValueType.BOOLEAN));
                    this.push(new ObjectLox(true, ValueType.BOOLEAN));
                    break;
                }
                case OpCode.OP_FALSE: {
                    //TODO GC Value
                    // this.push(new Value(false, ValueType.BOOLEAN));
                    this.push(new ObjectLox(false, ValueType.BOOLEAN));
                    break;
                }
                case OpCode.OP_POP: this.pop(); break;
                case OpCode.OP_GET_LOCAL: {
                    //stack effect = - 1
                    const key = read_byte();
                    const value = this.stack[key + frame.stackSlot];
                    this.push(value);
                    break;
                }
                case OpCode.OP_SET_LOCAL: {
                    //stack effect = 0
                    let key = read_byte();
                    const value = this.peek(0);
                    this.stack[key + frame.stackSlot] = value;
                    break;
                }
                case OpCode.OP_DEFINE_GLOBAL: {
                    const key = read_string();
                    let value = this.pop();
                    //check if it is a callable and create a new one
                    this.globals[key] = value;
                    break;
                }
                case OpCode.OP_SET_GLOBAL: {
                    const key = read_string();
                    //value should already exist in global
                    if (this.globals[key] === undefined){
                        this.runtimeError(`Undefined variable '${key}'`);
                        return InterpretResult.INTERPRET_RUNTIME_ERROR;
                    }
                    const value = this.peek(0);
                    this.globals[key] = value;
                    break;
                }
                case OpCode.OP_GET_GLOBAL: {
                    const key = read_string();
                    const value = this.globals[key];
                    if (!value){
                        this.runtimeError(`Undefined variable ${key}`);
                        return InterpretResult.INTERPRET_RUNTIME_ERROR;
                    }
                    this.push(value);
                    break;
                }
                case OpCode.OP_GET_UPVALUE: {
                    const slot = read_byte();
                    const upValue = frame.closure.frameUpvalues[slot];
                    //TODO GC Value
                    // let value = new Value(0);
                    let value = new ObjectLox(0);
                    if (Number.isInteger(upValue.location)){
                        value = this.stack[upValue.location];
                    } else if (ObjectLox.isValue(upValue.location)){
                        value = upValue.location;
                    }
                    //
                    this.push(value);

                    break;
                }
                case OpCode.OP_SET_UPVALUE: {
                    const slot = read_byte();
                    const value = this.peek(0);
                    frame.closure.frameUpvalues[slot].location = value;
                    break;
                }
                case OpCode.OP_SET_PROPERTY: {
                    let instance = this.peek(1);
                    if (instance.type !== ValueType.OBJECT){
                        this.runtimeError("Only instances have properties.");
                        return InterpretResult.INTERPRET_RUNTIME_ERROR;
                    }
                    let field = read_string();
                    instance.fields[field] = this.peek(0);
                    let value = this.pop();
                    this.pop();
                    this.push(value);
                    break;
                }
                case OpCode.OP_GET_PROPERTY: {
                    let instance = this.peek(0);
                    if (instance.type !== ValueType.OBJECT){
                        this.runtimeError("Only instances have properties.");
                        return InterpretResult.INTERPRET_RUNTIME_ERROR;
                    }
                    let name = read_string();

                    //check if the field exists
                    if (instance.fields[name]) {
                        let value = instance.fields[name];

                        this.pop();// instance
                        this.push(value);
                        break;//we handle the fields
                    }

                    if (!this.bindMethod(instance.klass, name)){
                        return this.runtimeError(`Cannot bind ${name} to ${instance.name}`);
                    }
                    break;
                }
                case OpCode.OP_EQUAL: {
                    const b = this.pop();
                    const a = this.pop();
                    //TODO GC Value
                    // const c = new Value(this.valuesEqual(a, b), ValueType.BOOLEAN);
                    const c = new ObjectLox(this.valuesEqual(a, b), ValueType.BOOLEAN);
                    this.push(c);
                    break;
                }
                case OpCode.OP_GET_SUPER: {
                    const name = read_string();
                    const superClass = this.pop();

                    if (!this.bindMethod(superClass, name)){
                        return InterpretResult.INTERPRET_RUNTIME_ERROR;
                    }
                    break;
                }
                case OpCode.OP_GREATER: {
                    if (ObjectLox.isNumber(this.peek(0)) &&
                        ObjectLox.isNumber(this.peek(1))){
                        const a = this.pop();
                        const b = this.pop();
                        //TODO GC Value
                        this.push(new ObjectLox(b.value > a.value, ValueType.BOOLEAN));                    } else {
                        // this.push(new Value(b.value > a.value, ValueType.NUMBER));                    } else {
                        this.runtimeError("Operands must be numbers.");
                        return InterpretResult.INTERPRET_RUNTIME_ERROR;
                    }
                    break;
                }
                case OpCode.OP_LESS: {
                    if (ObjectLox.isNumber(this.peek(0)) &&
                        ObjectLox.isNumber(this.peek(1))){
                        const a = this.pop();
                        const b = this.pop();
                        //TODO GC Value
                        // this.push(new Value(b.value < a.value, ValueType.NUMBER));
                        const bool = b.value < a.value;
                        this.push(new ObjectLox(bool, ValueType.BOOLEAN));

                    } else {
                        this.runtimeError("Operands must be numbers.");
                        return InterpretResult.INTERPRET_RUNTIME_ERROR;
                    }
                    break;
                }
                case OpCode.OP_ADD: {
                    if (ObjectLox.isString(this.peek(0)) &&
                        ObjectLox.isString(this.peek(1)) ){
                        const a = this.pop();
                        const b = this.pop();
                        //TODO GC Value
                        // this.push(new Value(b.value + a.value), ValueType.STRING);
                        this.push(new ObjectLox(b.value + a.value, ValueType.STRING));
                    } else if (ObjectLox.isNumber(this.peek(0)) &&
                        ObjectLox.isNumber(this.peek(1))){
                        //TODO GC Value
                        // this.push(new Value(this.pop().value + this.pop().value, ValueType.NUMBER));
                        this.push(new ObjectLox(this.pop().value + this.pop().value, ValueType.NUMBER));
                    } else {
                        this.runtimeError("Operands must be two numbers or two strings.");
                        return InterpretResult.INTERPRET_RUNTIME_ERROR;
                    }
                    break;
                }
                case OpCode.OP_SUBTRACT: {
                    if (ObjectLox.isNumber(this.peek(0)) &&
                        ObjectLox.isNumber(this.peek(1))){
                        const a = this.pop();
                        const b = this.pop();
                        //TODO GC Value
                        // this.push(new Value(b.value - a.value, ValueType.NUMBER));                    } else {
                        this.push(new ObjectLox(b.value - a.value, ValueType.NUMBER));                    } else {
                        this.runtimeError("Operands must be numbers.");
                        return InterpretResult.INTERPRET_RUNTIME_ERROR;
                    }
                    break;
                }
                case OpCode.OP_MULTIPLY: {
                    if (ObjectLox.isNumber(this.peek(0)) &&
                        ObjectLox.isNumber(this.peek(1))){
                        //TODO GC Value
                        // this.push(new Value(this.pop().value * this.pop().value, ValueType.NUMBER));
                        this.push(new ObjectLox(this.pop().value * this.pop().value, ValueType.NUMBER));
                    } else {
                        this.runtimeError("Operands must be numbers.");
                        return InterpretResult.INTERPRET_RUNTIME_ERROR;
                    }
                    break;
                }
                case OpCode.OP_DIVIDE: {
                    if (ObjectLox.isNumber(this.peek(0)) &&
                        ObjectLox.isNumber(this.peek(1))){
                        const a = this.pop();
                        const b = this.pop();
                        //TODO GC Value
                        // this.push(new Value(b.value / a.value, ValueType.NUMBER));
                        this.push(new ObjectLox(b.value / a.value, ValueType.NUMBER));
                    } else {
                        this.runtimeError("Operands must be numbers.");
                        return InterpretResult.INTERPRET_RUNTIME_ERROR;
                    }
                    break;
                }
                case OpCode.OP_NOT: {
                    let temp = this.pop();
                    //TODO GC Value
                    // this.push(new Value(this.isFalsey(temp), ValueType.BOOLEAN));
                    this.push(new ObjectLox(this.isFalsey(temp), ValueType.BOOLEAN));
                    break;
                }
                case OpCode.OP_NEGATE: {
                    let value = this.peek(0);
                    if (!ObjectLox.isNumber(value)){
                        this.runtimeError("Operand must be a number.");
                        return InterpretResult.INTERPRET_RUNTIME_ERROR;
                    }
                    value = this.pop();
                    //TODO GC Value
                    // this.push(new Value(-value.value, ValueType.NUMBER));
                    this.push(new ObjectLox(-value.value, ValueType.NUMBER));
                    break;
                }
                case OpCode.OP_PRINT: {
                    const value = this.pop();
                    printValue(value);
                    break;
                }
                case OpCode.OP_JUMP: {
                    const offset = read_byte();
                    frame.ip += offset;
                    break;
                }
                case OpCode.OP_JUMP_IF_FALSE: {
                    const offset = read_byte();
                    const value = this.peek(0);
                    const isFalse = this.isFalsey(value);
                    if(isFalse) {
                        frame.ip += offset;
                    }
                    break;
                }
                case OpCode.OP_LOOP: {
                    const offset = read_byte();
                    frame.ip -= offset;
                    break;
                }
                case OpCode.OP_CALL: {
                    const argCount = read_byte();
                    const callee = this.peek(argCount);
                    // const callee = value.value;
                    if (!this.callValue(callee, argCount)){
                        return InterpretResult.INTERPRET_RUNTIME_ERROR;
                    }

                    frame = this.frames[this.frameCount - 1];
                    break;
                }
                case OpCode.OP_INVOKE: {
                    const methodName = read_string();
                    const argCount = read_byte(); //read
                    if (!this.invoke(methodName, argCount)){
                        return InterpretResult.INTERPRET_RUNTIME_ERROR;
                    }
                    frame = this.frames[this.frameCount -1];//go back to the previous frame.
                    break;
                }
                case OpCode.OP_SUPER_INVOKE: {
                    const method = read_string();
                    const argCount = read_byte();
                    const superClass = this.pop();
                    if (!this.invokeFromClass(superClass, method, argCount)){
                        return InterpretResult.INTERPRET_RUNTIME_ERROR;
                    }

                    frame = this.frames[this.frameCount -1];//go back to the previous frame.
                    break;
                }
                case OpCode.OP_CLOSURE: {
                    //TODO GC Closure
                    let closure = newClosure(read_byte()); //create a new closure
                    //capture the upvalues
                    //isLocal means that the upvalues is a local value
                    //otherwise, it is in an upvalue already

                    //index refers to which index the upvalues is
                    for ( let i = 0; i < closure.upvalueCount; i++) {
                        let isLocal = read_byte();
                        let index = read_byte();
                        if ( isLocal ) {
                            let local = frame.stackSlot + index;
                            // const value = this.stack[local];

                            closure.frameUpvalues[i] = this.captureUpvalue(local);
                        } else {
                            closure.frameUpvalues[i] = frame.closure.frameUpvalues[index];
                        }
                    }
                    this.push(closure);
                    break;
                }
                case OpCode.OP_CLOSE_UPVALUE: {
                    //TODO need to test out the block and break;
                    //I know that it is all of the variables on top of the stack except the first function
                    const locationOfLocals = this.stack.length - 1;
                    this.closeUpvalues(locationOfLocals);
                    this.pop();
                    break;
                }
                case OpCode.OP_RETURN:{
                    const value = this.pop();
                    //capture any necessary upvalues before the locals are discarded off the stack
                    //I know that it is all of the variables on top of the stack except the first function
                    const locationOfLocals = 1;
                    this.closeUpvalues(locationOfLocals);
                    this.frameCount--;
                    this.frames.pop();
                    //checking to see if we are at the end of the "script function"
                    if (this.frameCount === 0){
                        this.pop();//pop the script (global) function
                        return InterpretResult.INTERPRET_OK;
                        //this works.
                    }

                    //remove the previous frame locals here
                    //argCount + locals;
                    const lastFunctionStack = this.stack.length - frame.stackSlot;
                    this.popN(lastFunctionStack);
                    this.push(value);

                    frame = this.frames[this.frameCount -1];//go back to the previous frame.
                    break;
                }
                case OpCode.OP_CLASS: {
                    //read byte gets from constant table, we need to create a new object
                    const klass = newKlass(read_byte());
                    this.push(klass);
                    break;
                }
                case OpCode.OP_INHERIT: {
                    let superClass = this.peek(1);
                    const subClass = this.peek(0);
                    if (superClass.type !== ValueType.CLASS) {
                        this.runtimeError("Superclass must be a class.");
                        return InterpretResult.INTERPRET_RUNTIME_ERROR;
                    }
                    //add all the superclass methods to subclass
                    //TODO GC methods object
                    subClass.methods = {...subClass.methods, ...superClass.methods};
                    this.pop();
                    break;
                }
                case OpCode.OP_METHOD: {
                    const methodName = read_string();
                    const method = newMethod(this.peek(0)); //we want a cop of the new method.
                    const klass = this.peek(1); //we want the same klass on the stack, not a new copy
                    klass.methods[methodName] = method;
                    this.pop();

                    break;
                }
                default:
                    print('Unknown instruction: ' + instruction);
                    return InterpretResult.INTERPRET_RUNTIME_ERROR;
            } //end switch
        } //end while

        return InterpretResult.INTERPRET_OK;
    }

    interpret(source) {
        const compiler = new Compiler(source);
        let closure = compiler.compile();

        standard_output = [];

        if (closure === null || closure === undefined){
            return InterpretResult.INTERPRET_COMPILE_ERROR;
        }

        //calling the top level script function.
        this.push(closure);
        this.call(closure, 0);
        //
        const status =  this.run(); //calls the first CallFrame and begins to execute its code.
        
        return status;
    };
}
