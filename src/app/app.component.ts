import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { FiltersComponent } from './components/filters/filters.component';
import { FloodsDataService } from './services/floods/floods-data.service';
import { DatePipe } from '@angular/common';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, FiltersComponent],
  providers: [FloodsDataService, DatePipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
