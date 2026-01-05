import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HeaderContentLayout } from './components/layouts/header-content-layout/header-content-layout';
import { ToolbarContainer } from './containers/toolbar-container/toolbar-container';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HeaderContentLayout, ToolbarContainer],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('front');
}
