import { Component, ChangeDetectionStrategy } from '@angular/core';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AppComponent {
    title = 'ng9-demo';
    e: HTMLElement;
    value: string;

    home = '首页 <script>alert(111)</script>  <////--><details open ontoggle=confirm(/我是脚本/)> ';
    nodes = [];

    constructor() {
        for (let index = 1; index < 100; index++) {
            this.nodes.push({
                id: index,
                text: 'name ' + index
            });
        }
    }

    click(editor: HTMLDivElement) {}

    trackByFn(index: number, node: any) {
        return node._id;
    }
}
