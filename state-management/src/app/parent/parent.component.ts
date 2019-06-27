import { Component, OnInit, ViewChild } from '@angular/core';

@Component({
    selector: 'app-parent',
    templateUrl: './parent.component.html',
    styleUrls: ['./parent.component.scss']
})
export class ParentComponent implements OnInit {
    name = 'Hello';

    text = 'World';

    logMessage = ``;

    constructor() {}

    ngOnInit() {}

    onChildTextClick(event: Event) {
        this.logMessage = `on child text click, event: ${event}`;
    }

    changeName() {

    }
}
