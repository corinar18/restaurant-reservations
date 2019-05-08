import {Component, OnInit} from '@angular/core';
import {FormControl, FormBuilder, FormGroup, NgForm, Validators, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import { HttpClient, HttpParams } from '@angular/common/http';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  addRestaurantForm: FormGroup;
  returnUrl: string;
  title = 'LuckyReservation';

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient
  ) {}

  ngOnInit() {
    this.addRestaurantForm = this.formBuilder.group({
      id: ['', Validators.required],
      name: ['', Validators.required],
      numberOfTables: ['', Validators.required],
      password: ['', Validators.required],
      description: ['', Validators.required],
      address: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.addRestaurantForm.controls; }

  onSubmit() {
    let params = new HttpParams();
    params = params.append('id', this.f.id.value);
    params = params.append('name', this.f.name.value);
    params = params.append('numberOfTables', this.f.numberOfTables.value);
    params = params.append('password', this.f.password.value);
    params = params.append('description', this.f.description.value);
    params = params.append('address', this.f.address.value);

    return this.httpClient.post('http://localhost:3002/restaurant', {params});
  }
}
