import { Component, ChangeDetectionStrategy, NgZone } from '@angular/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
    size = 'md';
    theme = 'bordered';
    className;
    title = 'ng9-demo';
    e: HTMLElement;
    number = 0;
    home = '首页 <script>alert(111)</script>  <////--><details open ontoggle=confirm(/我是脚本/)> ';
    nodes = [];

    value = '恩<div>sss</div><script>alert(111);console.log(111)</script>';
    trustHtml: SafeHtml;
    constructor(http: HttpClient, ngZone: NgZone, domSanitizer: DomSanitizer) {
        for (let index = 1; index < 100; index++) {
            this.nodes.push({
                id: index,
                text: 'name ' + index,
            });
        }
        this.trustHtml = domSanitizer.bypassSecurityTrustHtml(this.value);
        const URL = `http://worktile.local:10010/api/typhon/devkit/status?status_code=401`;

        // http.get(URL).subscribe(
        //     (response) => {
        //         debugger;
        //     },
        //     (error) => {
        //         debugger;
        //     }
        // );

        // ngZone.runOutsideAngular(() => {
        //     let xhr = new XMLHttpRequest();
        //     xhr.onload = function () {
        //         debugger;
        //         alert(`Loaded: ${xhr.status} ${xhr.response}`);
        //     };

        //     xhr.onerror = function () {
        //         debugger;
        //         // only triggers if the request couldn't be made at all
        //         alert(`Network Error`);
        //     };

        //     xhr.onprogress = function (event) {
        //         debugger;
        //         // triggers periodically
        //         // event.loaded - how many bytes downloaded
        //         // event.lengthComputable = true if the server sent Content-Length header
        //         // event.total - total number of bytes (if lengthComputable)
        //         alert(`Received ${event.loaded} of ${event.total}`);
        //     };
        //     xhr.open('GET', URL);
        //     xhr.send();
        // });
    }

    click(editor: HTMLDivElement) {}

    trackByFn(index: number, node: any) {
        return node._id;
    }
}
