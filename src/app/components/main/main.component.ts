import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-main',
  templateUrl: './main.component.html',
  styleUrls: ['./main.component.scss'],
})
export class MainComponent implements OnInit {
  form: FormGroup = this.fb.group({
    bookRef: ['', [Validators.required]],
  });

  constructor(private fb: FormBuilder, private router: Router) {}

  ngOnInit(): void {}

  search() {
    const ref: null | string = this.form.get('bookRef')?.value;
    if (ref) this.router.navigate(['reservation', `${ref}`]);
  }

  makeReservation() {
    this.router.navigate(['reservation/new']);
  }

  goToManager() {
    this.router.navigate(['manager/login']);
  }
}
