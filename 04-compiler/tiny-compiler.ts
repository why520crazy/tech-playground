namespace TinyCompilerNS {
    enum NodeTypes {
        number = 'number',
        operation = 'operation'
    }

    interface ASTNode<T = string | number> {
        type: NodeTypes;
        value: T;
        expressions?: ASTNode[];
    }

    class TinyCompiler {
        str: string;

        constructor(str: string) {
            this.str = str;
        }

        lex(): string[] {
            return this.str.split(' ').map(item => {
                return item.trim();
            });
        }

        parse(tokens: string[]): ASTNode {
            let index = 0;
            const peek = () => {
                return tokens[index];
            };
            const consume = () => {
                return tokens[index++];
            };

            const parseExpr = (): ASTNode => {
                const token = peek();
                if (/\d/.test(token)) {
                    return {
                        type: NodeTypes.number,
                        value: parseInt(consume())
                    };
                } else {
                    const node = {
                        type: NodeTypes.operation,
                        value: consume(),
                        expressions: []
                    };
                    while (peek()) {
                        node.expressions.push(parseExpr());
                    }
                    return node;
                }
            };

            return parseExpr();
        }

        evaluate(ast: ASTNode) {
            const opAcMap = {
                sum: (args: number[]) => args.reduce((a, b) => a + b, 0),
                sub: (args: number[]) => args.reduce((a, b) => a - b),
                div: (args: number[]) => args.reduce((a, b) => a / b),
                mul: (args: number[]) => args.reduce((a, b) => a * b, 1)
            };

            if (ast.type === NodeTypes.number) {
                return ast.value;
            } else {
                return opAcMap[ast.value](
                    ast.expressions.map(node => {
                        return this.evaluate(node);
                    })
                );
            }
        }

        compile(ast: ASTNode) {
            const opMap = { sum: '+', mul: '*', sub: '-', div: '/' };
            const compileNum = (ast: ASTNode) => {
                return ast.value;
            };
            const compileOp = (ast: ASTNode) => {
                return `(${ast.expressions.map(compile).join(' ' + opMap[ast.value] + ' ')})`;
            };

            const compile = (ast: ASTNode) => {
                return ast.type === NodeTypes.number ? compileNum(ast) : compileOp(ast);
            };
            return compile(ast);
        }
    }

    const program = 'mul 3 sub 2 sum 1 3 4';
    const tinyCompiler = new TinyCompiler(program);

    const ast = tinyCompiler.parse(tinyCompiler.lex());
    console.log(`ast: ${JSON.stringify(ast, undefined, 2)}`);

    const result = tinyCompiler.evaluate(ast);
    console.log(`evaluate result: ${result}`);

    const compileResult = tinyCompiler.compile(ast);
    console.log(`compile result: ${compileResult}`);

}
