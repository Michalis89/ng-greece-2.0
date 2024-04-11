import { Component } from '@angular/core';
import { HeaderComponent } from './components/header/header.component';
import { FiltersComponent } from './components/filters/filters.component';
import { FloodsDataService } from './services/floods/floods-data.service';
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [HeaderComponent, FiltersComponent],
  providers: [FloodsDataService],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
