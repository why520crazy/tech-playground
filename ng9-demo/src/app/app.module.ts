import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
// import { NgxTethysModule } from 'ngx-tethys';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { ItemComponent } from './item/item.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { UsersComponent } from './users/users.component';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatSortModule } from '@angular/material/sort';
import { BreadcrumbComponent, SafeHtml } from './breadcrumb/breadcrumb.component';
import { BreadcrumbItemComponent } from './breadcrumb/item/breadcrumb-item.component';
import { FormsModule } from '@angular/forms';

@NgModule({
    declarations: [AppComponent, ItemComponent, UsersComponent, BreadcrumbComponent, BreadcrumbItemComponent, SafeHtml],
    imports: [
        BrowserModule,
        CommonModule,
        FormsModule,
        AppRoutingModule,
        // NgxTethysModule,
        BrowserAnimationsModule,
        MatTableModule,
        MatPaginatorModule,
        MatSortModule,
        HttpClientModule
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule {}
