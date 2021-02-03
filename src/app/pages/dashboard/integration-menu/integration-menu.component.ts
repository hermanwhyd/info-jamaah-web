import { Component, OnInit } from '@angular/core';
import { PopoverRef } from 'src/@vex/components/popover/popover-ref';
import { environment } from './../../../../environments/environment';

@Component({
  selector: 'vex-integration-menu',
  templateUrl: './integration-menu.component.html',
  styleUrls: ['./integration-menu.component.scss']
})
export class IntegrationMenuComponent implements OnInit {
  swaggerUrl: string;

  constructor(private popoverRef: PopoverRef<IntegrationMenuComponent>) { }

  ngOnInit(): void {
    this.swaggerUrl = environment.swaggerUrl;
  }

  close() {
    this.popoverRef.close();
  }
}
