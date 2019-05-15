import {Component, Injectable, OnInit} from '@angular/core';
import {FormControl, FormBuilder, FormGroup, NgForm, Validators, ReactiveFormsModule} from '@angular/forms';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  addRestaurantForm: FormGroup;
  deleteRestaurantForm: FormGroup;
  modifyRestaurantDetailsForm: FormGroup;
  returnUrl: string;
  title = 'LuckyReservation';
  restaurants: any[] = [];

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private httpClient: HttpClient,
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

    this.deleteRestaurantForm = this.formBuilder.group({
      id: ['', Validators.required],
      password: ['', Validators.required]
    });

    this.modifyRestaurantDetailsForm = this.formBuilder.group({
      id: ['', Validators.required],
      numberOfTables: ['', Validators.required],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  get f() { return this.addRestaurantForm.controls; }

  get g() { return this.deleteRestaurantForm.controls; }

  get h() { return this.modifyRestaurantDetailsForm.controls; }

  onAdd() {
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('Content-Type', 'application/json');

    let body = new HttpParams({
      fromObject : {
        'id' : this.f.id.value,
        'name': this.f.name.value,
        'numberOfTables': this.f.numberOfTables.value,
        'password': this.f.password.value,
        'description': this.f.description.value,
        'address': this.f.address.value
      }
    });

    this.httpClient.post('http://127.0.0.1:3002/restaurant', body)
      .subscribe(data => {
        console.log(data);
        alert("Restaurant adaugat cu succes!");
      });
  }

  getRestaurants() {
    this.restaurants = [];
    return this.httpClient.get('http://localhost:3002/restaurants').subscribe((res:any) => {
      res.forEach((obj) => {
        this.restaurants.push(obj);
      });
    });
  }

  onDelete() {
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('Content-Type', 'application/json');

    let body = new HttpParams({
      fromObject : {
        'id' : this.g.id.value,
      }
    });

    this.httpClient.post('http://127.0.0.1:3002/restaurant-delete', body)
      .subscribe(data => {
        console.log(data);
        alert("Restaurantul a fost sters din aplicatie cu succes!");
      });
  }

  onModify() {
    const headers = new HttpHeaders()
      .set('Authorization', 'my-auth-token')
      .set('Content-Type', 'application/json');

    let body = new HttpParams({
      fromObject : {
        'id' : this.g.id.value,
        'numberOfTables': this.h.numberOfTables.value
      }
    });

    this.httpClient.post('http://127.0.0.1:3002/restaurant-modify', body)
      .subscribe(data => {
        console.log(data);
        alert("Restaurantul a fost modificat cu succes!");
      });
  }

}
