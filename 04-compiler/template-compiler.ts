namespace TemplateCompilerNS {
    interface LexerOptions {
        startTag?: string;
        endTag?: string;
    }

    enum TokenTypes {
        StartTag,
        EndTag,
        String
    }

    class Token<T> {
        type: TokenTypes;
        value: T;

        constructor(type: TokenTypes, value: T) {
            this.type = type;
            this.value = value;
        }
    }

    class Lexer {
        constructor(options: LexerOptions) {}

        lex(src: string): Token<string | number>[] {
            const allTokens = src.split(' ');
            return allTokens.map(tokenStr => {
                return new Token(TokenTypes.String, tokenStr);
            });
        }

        static lex(src: string, options: LexerOptions = {}) {
            options = Object.assign({}, { startTag: '{{', endTag: '}}' }, options);
            const lexer = new Lexer(options);
            return lexer.lex(src);
        }
    }

    interface ParserOptions {}

    // class Parser {
    //     constructor(options: ParserOptions) {}

    //     parse(src: string) {
    //         const allTokens = src.split(' ');
    //         return allTokens;
    //     }

    //     static parse(tokens: string, options: ParserOptions = {}) {
    //         const parser = new Parser(options);
    //         return parser.parse(src);
    //     }
    // }

    const input = `hello {{name}}, <div class="{{book}}"></div>`;
    const tokens = Lexer.lex(input);

    console.log(tokens);
}
