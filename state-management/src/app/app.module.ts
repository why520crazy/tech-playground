import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ParentComponent } from './parent/parent.component';
import { ChildComponent } from './parent/child/child.component';
import { ProjectComponent } from './project/project.component';
import { ThyStoreModule } from 'ngx-tethys';
import { AppStateStore } from './app-state.store';

@NgModule({
    declarations: [AppComponent, ParentComponent, ChildComponent, ProjectComponent],
    imports: [
        BrowserModule,
        AppRoutingModule,
        ThyStoreModule.forRoot([AppStateStore])
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
