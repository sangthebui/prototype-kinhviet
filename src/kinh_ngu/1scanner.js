
export const TokenType = Object.freeze({
    TOKEN_ERROR: Symbol("TOKEN_ERROR"),
    TOKEN_LEFT_PAREN: Symbol('TOKEN_LEFT_PAREN'),
    TOKEN_RIGHT_PAREN: Symbol('TOKEN_RIGHT_PAREN'),
    TOKEN_LEFT_BRACE: Symbol('TOKEN_LEFT_BRACE'),
    TOKEN_RIGHT_BRACE: Symbol('TOKEN_RIGHT_BRACE'),
    TOKEN_COMMA: Symbol('TOKEN_COMMA'),
    TOKEN_DOT: Symbol('TOKEN_DOT'),
    TOKEN_MINUS: Symbol('TOKEN_MINUS'),
    TOKEN_PLUS: Symbol('TOKEN_PLUS'),
    TOKEN_SEMICOLON: Symbol('TOKEN_SEMICOLON'),
    TOKEN_SLASH: Symbol('TOKEN_SLASH'),
    TOKEN_STAR: Symbol('TOKEN_STAR'),
    // One or two characer tokens.
    TOKEN_BANG: Symbol('TOKEN_BANG'),
    TOKEN_BANG_EQUAL: Symbol( 'TOKEN_BANG_EQUAL'),
    TOKEN_EQUAL: Symbol('TOKEN_EQUAL'),
    TOKEN_EQUAL_EQUAL: Symbol('TOKEN_EQUAL_EQUAL'),
    TOKEN_GREATER: Symbol('TOKEN_GREATER'),
    TOKEN_GREATER_EQUAL: Symbol('TOKEN_GREATER_EQUAL'),
    TOKEN_LESS: Symbol( 'TOKEN_LESS'),
    TOKEN_LESS_EQUAL: Symbol('TOKEN_LESS_EQUAL'),
    // Literals
    TOKEN_IDENTIFIER: Symbol( 'TOKEN_IDENTIFIER'),
    TOKEN_STRING: Symbol('TOKEN_STRING'),
    TOKEN_NUMBER: Symbol( 'TOKEN_NUMBER'),
    // Keywords.
    TOKEN_AND: Symbol('TOKEN_AND'),
    TOKEN_CLASS: Symbol( 'TOKEN_CLASS'), TOKEN_ELSE: Symbol( 'TOKEN_ELSE'),
    TOKEN_FALSE: Symbol( 'TOKEN_FALSE'),
    TOKEN_FOR: Symbol( 'TOKEN_FOR'), TOKEN_FUN: Symbol( 'TOKEN_FUN'),
    TOKEN_IF: Symbol( 'TOKEN_IF'), TOKEN_NIL: Symbol('TOKEN_NIL'),
    TOKEN_OR: Symbol('TOKEN_OR'), TOKEN_PRINT : Symbol('TOKEN_PRINT'),
    TOKEN_RETURN: Symbol( 'TOKEN_RETURN'),
    TOKEN_SUPER: Symbol( 'TOKEN_SUPER'), TOKEN_THIS: Symbol( 'TOKEN_THIS'),
    TOKEN_TRUE: Symbol( 'TOKEN_TRUE'), TOKEN_VAR: Symbol( 'TOKEN_VAR'),
    TOKEN_WHILE: Symbol( 'TOKEN_WHILE'),
    TOKEN_EOF: Symbol( 'TOKEN_EOF'), TOKEN_EMPTY: Symbol( 'TOKEN_EMPTY'),
});


export default class Scanner {
    source = '';
    current = 0;
    start = 0;
    line = 1;

    constructor(source){
        this.source = source;
    }

    isAtEnd() {
        return this.current >= this.source.length;
    };

    makeToken(type, payload){
        let token = {
            length: this.current - this.start,
            line: this.line,
            type,
            payload

        };
        return token;
    };

    errorToken (message) {
        let token = {
            type: TokenType.TOKEN_ERROR,
            payload:  message,
            length:  message.length,
            line:  this.line,
        };

        return token;
    };

    advance () {
        return this.source.charAt(this.current++);
    };

    match (expected) {
        if (this.isAtEnd()) return false;
        if (this.source.charAt(this.current) !== expected) return false;
        this.current++;
        return true;
    };

    peek(){
        //look at the current character, but does not move the current forward
        return this.source.charAt(this.current);
    };

    peekNext (){
        if (this.isAtEnd()) return '\0';
        return this.source.charAt(this.current + 1);
    };

    skipWhiteSpace () {
        //keep skipping empty string, carriage return, tab,
        //newlines, and comments.
        for(;;){
            const character = this.peek();
            switch(character){
                case ' ':
                case '\r':
                case '\t':
                    this.advance();
                    break;
                case '\n': {
                    this.line++;
                    this.advance();
                    break;
                }
                //need to escape slash
                case '/': {
                    if (this.peekNext() === '/') {
                        //A comment goes until the end of the line
                        while(this.peek() !== '\n' && !this.isAtEnd()) {
                            this.advance();
                        }
                    } else {
                        return;
                    }
                    break;
                }
                default:
                    return;
            }
        }
    };

    checkKeyword (keyword, type){
        //take the word from scanner
        const word = this.source.substring(this.current - keyword.length, this.current);
        const keyWordLength = keyword.length;
        const wordLength = this.current - this.start;
        //compare they have the same length and content
        if ( (wordLength === keyWordLength) && (word === keyword)){
            return  type;
        }

        return TokenType.TOKEN_IDENTIFIER;
    };

    vietIdentifierType(){
        const currentCharacter = this.source.charAt(this.start);
        switch(currentCharacter){
            case 'b': return this.checkKeyword('bien', TokenType.TOKEN_VAR);
            case 'c': return this.checkKeyword('cho', TokenType.TOKEN_FOR);
            case 'd': return this.checkKeyword('dung', TokenType.TOKEN_TRUE);
            case 'h': {
                if (this.current - this.start > 1){
                    const innerCharacter = this.source.charAt(this.start + 1);
                    switch (innerCharacter){
                        case 'a': return this.checkKeyword('ham', TokenType.TOKEN_FUN);
                        case 'o': return this.checkKeyword('hoac', TokenType.TOKEN_OR);
                    }
                }
                break;
            }
            case 'k': {
                if (this.current - this.start > 1){
                    const innerCharacter = this.source.charAt(this.start + 2);
                    switch (innerCharacter){
                        case 'ha': return this.checkKeyword('khac', TokenType.TOKEN_ELSE);
                        case 'hi': return this.checkKeyword('khi', TokenType.TOKEN_WHILE);
                    }
                }
            }
                break;
            case 'l': {
                if (this.current - this.start > 1){
                    const innerCharacter = this.source.charAt(this.start + 1);
                    switch (innerCharacter){
                        case 'o': return this.checkKeyword('lop', TokenType.TOKEN_CLASS);
                        case 'u': return this.checkKeyword('luc', TokenType.TOKEN_WHILE);
                    }
                }
                break;
            }
            case 'n': {
                if (this.current - this.start > 1){
                    const innerCharacter = this.source.charAt(this.start + 1);
                    switch (innerCharacter){
                        case 'a': return this.checkKeyword('nay', TokenType.TOKEN_THIS);
                        case 'e': return this.checkKeyword('neu', TokenType.TOKEN_IF);
                        case 'i': return this.checkKeyword('nil', TokenType.TOKEN_NIL);
                    }
                }
                break;
            }
            case 's': {
                if (this.current - this.start > 1){
                    const innerCharacter = this.source.charAt(this.start + 1);
                    switch (innerCharacter){
                        case 'a': return this.checkKeyword('sai', TokenType.TOKEN_FALSE);
                        case 'i': return this.checkKeyword('sieu', TokenType.TOKEN_SUPER);
                    }
                }
                break;
            }
            case 't': return this.checkKeyword('tra', TokenType.TOKEN_RETURN);
            case 'v': {
                if (this.current - this.start > 1){
                    const innerCharacter = this.source.charAt(this.start + 1);
                    switch (innerCharacter){
                        case 'a': return this.checkKeyword('va', TokenType.TOKEN_AND);
                        case 'i': return this.checkKeyword('viet', TokenType.TOKEN_PRINT);
                    }
                }
                break;
            }
        }
        return TokenType.TOKEN_IDENTIFIER;
    }

    identifierType(){
        const currentCharacter = this.source.charAt(this.start);
        switch(currentCharacter){
            case 'a': return this.checkKeyword('and', TokenType.TOKEN_AND);
            case 'c': return this.checkKeyword('class', TokenType.TOKEN_CLASS);
            case 'e': return this.checkKeyword('else', TokenType.TOKEN_ELSE);
            case 'f': {
                if (this.current - this.start > 1){
                    const innerCharacter = this.source.charAt(this.start + 1);
                    switch (innerCharacter){
                        case 'a': return this.checkKeyword('false', TokenType.TOKEN_FALSE);
                        case 'o': return this.checkKeyword('for', TokenType.TOKEN_FOR);
                        case 'u': return this.checkKeyword('fun', TokenType.TOKEN_FUN);
                    }
                }
                break;
            }
            case 'i': return this.checkKeyword('if', TokenType.TOKEN_IF);
            case 'n': return this.checkKeyword('nil', TokenType.TOKEN_NIL);
            case 'o': return this.checkKeyword('or', TokenType.TOKEN_OR);
            case 'p': return this.checkKeyword('print', TokenType.TOKEN_PRINT);
            case 'r': return this.checkKeyword('return', TokenType.TOKEN_RETURN);
            case 's': return this.checkKeyword('super', TokenType.TOKEN_SUPER);
            case 't': {
                if (this.current - this.start > 1){
                    const innerCharacter = this.source.charAt(this.start + 1);
                    switch (innerCharacter){
                        case 'h': return this.checkKeyword('this', TokenType.TOKEN_THIS);
                        case 'r': return this.checkKeyword('true', TokenType.TOKEN_TRUE);
                    }
                }
                break;
            }
            case 'v': return this.checkKeyword('var', TokenType.TOKEN_VAR);
            case 'w': return this.checkKeyword('while', TokenType.TOKEN_WHILE);
        }
        return TokenType.TOKEN_IDENTIFIER;
    };

    string() {
        while (this.peek() !== '"' && !this.isAtEnd()){
            if (this.peek() === '\n'){
                this.line++;
            }
            this.advance();
        }

        if (this.isAtEnd()){
            return this.errorToken("Unterminated string.");
        }



        //at this point, the scanner already consume the first quote
        //therefore, we need to account for the two quotes.
        const firstQuote = 1;
        const tokenString = {
            type: TokenType.TOKEN_STRING,
            length: this.current - this.start - firstQuote,
            line: this.line,
            payload: this.source.substring(this.start + firstQuote, this.current)
        }

        // The closing quote
        this.advance();

        return tokenString;
    };

    isDigit (character) {
        const reg = new RegExp(/^\d/);
        return reg.test(character);
    };

    number(){
        while (this.isDigit(this.peek())){
            this.advance();
        }

        if (this.peek() === '.' && this.isDigit(this.peekNext())){
            //consume the ".".
            this.advance();
            while(this.isDigit(this.peek())){
                this.advance();
            }
        }
        // the actual number is returned as a number
        const tokenNumber = {
            type: TokenType.TOKEN_NUMBER,
            // start: Number(scanner.source.substring(scanner.start, scanner.current)),
            length: this.current - this.start,
            line: this.line,
            payload: this.source.substring(this.start, this.current),
        };
        return tokenNumber;
    };

    isAlpha (character) {
        const reg = new RegExp(/^[_a-zA-Z]/);
        return reg.test(character);
    };


    identifier () {
        while(this.isAlpha(this.peek()) || this.isDigit(this.peek())){
            this.advance();//keep going until the identifier ends
        }
        const payload = this.source.substring(this.start, this.current);
        // return this.makeToken(this.identifierType(), payload);
        return this.makeToken(this.vietIdentifierType(), payload);
    };


    scanToken() {
        this.skipWhiteSpace();
        this.start = this.current;

        if (this.isAtEnd()) return this.makeToken(TokenType.TOKEN_EOF);

        const character = this.advance();
        if (this.isAlpha(character)) return this.identifier();
        if (this.isDigit(character)) {
            return this.number();
        }
        switch(character){
            case '(': return this.makeToken(TokenType.TOKEN_LEFT_PAREN, '(');
            case ')': return this.makeToken(TokenType.TOKEN_RIGHT_PAREN, ')');
            case '{': return this.makeToken(TokenType.TOKEN_LEFT_BRACE, '{');
            case '}': return this.makeToken(TokenType.TOKEN_RIGHT_BRACE, '}');
            case ';': return this.makeToken(TokenType.TOKEN_SEMICOLON, ';');
            case ',': return this.makeToken(TokenType.TOKEN_COMMA, ',');
            case '.': return this.makeToken(TokenType.TOKEN_DOT, '.');
            case '-': return this.makeToken(TokenType.TOKEN_MINUS, '-');
            case '+': return this.makeToken(TokenType.TOKEN_PLUS, '+');
            case '/': return this.makeToken(TokenType.TOKEN_SLASH, '/');
            case '*': return this.makeToken(TokenType.TOKEN_STAR, '*');
            /* one or two characters together*/
            case '!': return this.makeToken(this.match('=')? TokenType.TOKEN_BANG_EQUAL: TokenType.TOKEN_BANG, '!');
            case '=': return this.makeToken(this.match('=')? TokenType.TOKEN_EQUAL_EQUAL: TokenType.TOKEN_EQUAL, '=');
            case '<': return this.makeToken(this.match('=')? TokenType.TOKEN_LESS_EQUAL: TokenType.TOKEN_LESS, '<');
            case '>': return this.makeToken(this.match('=')? TokenType.TOKEN_GREATER_EQUAL: TokenType.TOKEN_GREATER, '>');
            case '"': {
                return this.string();
            }
            default:
                return this.errorToken("Unexpected character.");
        }
    };

}