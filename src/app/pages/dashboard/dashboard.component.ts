import { Component, OnInit } from '@angular/core';
import { LocalService } from 'src/app/services/local/local.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  message: any = null;
  constructor(
    private localService: LocalService
  ) { }

  ngOnInit() {


  }





}
