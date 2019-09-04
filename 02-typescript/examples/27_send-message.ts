// enum SendTypes {
//     connect = 1,
//     join = 2,
//     leave = 3,
//     message = 4
// }

// interface MessageInfo {
//     from: string;
//     to: string;
//     content: string;
// }

// function send(type: SendTypes, data?: string | number | never | MessageInfo) {}

// // 第一种方案
// interface SendConnectInfo {
//     type: SendTypes.connect;
// }
// interface SendJoinInfo {
//     type: SendTypes.join;
//     data: string;
// }
// interface SendLeaveInfo {
//     type: SendTypes.leave;
//     data: number;
// }
// interface SendMessageInfo {
//     type: SendTypes.message;
//     data: MessageInfo;
// }
// function send1(data: SendConnectInfo | SendJoinInfo | SendLeaveInfo | SendMessageInfo): void {}

// send1({
//     type: SendTypes.connect
// });
// send1({
//     type: SendTypes.join,
//     data: 'ss'
// });
// send1({
//     type: SendTypes.leave,
//     data: 1
// });
// send1({
//     type: SendTypes.leave,
//     data: ''
// });

// send1({
//     type: SendTypes.message,
//     data: { from: '1', to: '1', content: 'hello' }
// });

// //  第二种方案：重载
// function send2(type: SendTypes.connect): void;
// function send2(type: SendTypes.join, data: string): void;
// function send2(type: SendTypes.leave, data: number): void;
// function send2(type: SendTypes.message, data: MessageInfo): void;
// function send2(type: SendTypes, data?: any): void {}

// send2(SendTypes.connect);
// send2(SendTypes.join, 'xx');
// send2(SendTypes.leave, 1);
// send2(SendTypes.leave, 'xxx');
// send2(SendTypes.message, { from: '1', to: '1', content: 'hello' });

// //  第三种方案
// interface SendData {
//     [SendTypes.connect]: never;
//     [SendTypes.join]: string;
//     [SendTypes.leave]: number;
//     [SendTypes.message]: MessageInfo;
// }

// function sendNext<TType extends SendTypes>(type: TType, data?: SendData[TType]) {}

// sendNext(SendTypes.connect);
// sendNext(SendTypes.join, 'xx');
// sendNext(SendTypes.join, 1);
// sendNext(SendTypes.leave, 1);
// sendNext(SendTypes.message, { from: '1', to: '1', content: 'hello' });
