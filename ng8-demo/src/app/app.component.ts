import { Component, HostBinding } from '@angular/core';
import { UserInfo, DEFAULT_USER, css } from '@worktile/lib8/entities';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.scss']
})
export class AppComponent {

    // @HostBinding(`class.${css.layout}`) hasClass = true;
    user = DEFAULT_USER;
    title = 'ng8-demo';
}
