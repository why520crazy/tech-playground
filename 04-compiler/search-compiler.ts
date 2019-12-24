const DATE_FILTER_REGEX = /(after|before)\:(\d+)/gi;
const FROM_FILTER_REGEX = /from\:(\w+)/gi;
const APPLICATIONS_FILTER_REGEX = /[agile|pipe|testhub|trace]\:(\w+)/gi;
const IN_FILTER_REGEX = /in\:(\w+)/gi;

namespace TemplateCompilerNS {
    interface LexerOptions {}

    enum TokenTypes {
        from = 'from',
        after = 'after',
        before = 'before',
        in = 'in',
        text = 'text',
        application = 'application'
    }

    class Token<T = any> {
        invalid = false;
        addition: T;
        constructor(public type: TokenTypes, public value: string) {}
    }

    class Lexer {
        constructor(options: LexerOptions) {}

        lex(src: string): Token[] {
            const sections = src.split(' ');
            const tokens: Token[] = [];
            sections.forEach(section => {
                section = section.trim();
                let cap: RegExpExecArray;
                if ((cap = DATE_FILTER_REGEX.exec(section))) {
                    const direction = cap[1].toLowerCase();
                    const date = cap[2].toLowerCase();
                    tokens.push(new Token(TokenTypes[direction], date));
                } else if ((cap = FROM_FILTER_REGEX.exec(section))) {
                    tokens.push(new Token(TokenTypes.from, cap[1]));
                } else if ((cap = IN_FILTER_REGEX.exec(section))) {
                    tokens.push(new Token(TokenTypes.in, cap[1].toLowerCase()));
                } else {
                    tokens.push(new Token(TokenTypes.text, section));
                }
            });
            return tokens;
        }

        static lex(src: string, options: LexerOptions = {}) {
            options = Object.assign({}, options);
            const lexer = new Lexer(options);
            return lexer.lex(src);
        }
    }

    interface ParserOptions {}

    class Parser {
        constructor(options: ParserOptions) {}

        parse(tokens: Token[]) {
            return tokens.map(token => {
                if (token.type === TokenTypes.from) {
                    token.addition = {
                        uid: token.value
                    };
                } else if ([TokenTypes.before, TokenTypes.after].includes(token.type)) {
                    const timestamp = Date.parse(token.value);
                    token.addition = !isNaN(timestamp) ? timestamp : null;
                    token.invalid = !isNaN(timestamp);
                } else {
                }
                return token;
            });
        }

        static parse(tokens: Token[], options: ParserOptions = {}) {
            const parser = new Parser(options);
            return parser.parse(tokens);
        }
    }

    const input = `from:xuhaifeng in:agile befor:2019`;
    const tokens = Lexer.lex(input);

    const result = Parser.parse(tokens);

    console.log(JSON.stringify(tokens, null, 2));
    console.log(JSON.stringify(result, null, 2));
}
