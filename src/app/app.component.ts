import {
  Component,
  DoCheck,
  IterableChangeRecord,
  IterableChanges,
  IterableDiffer,
  IterableDiffers,
  VERSION,
} from '@angular/core';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements DoCheck {
  a = [1, 2, 3];

  employee1: Employee = { id: 1, name: 'Eliran' };
  employee2: Employee = { id: 2, name: 'Martina' };

  employees: Employee[] = [this.employee1, this.employee2];

  employee3: Employee = { id: 1, name: 'Eliran' };

  differ: IterableDiffer<Employee> = null;

  constructor(private differs: IterableDiffers) {
    this.differ = this.differs.find(this.employees).create(this.trackBy);
  }
  ngDoCheck(): void {
    console.clear();

    const changes: IterableChanges<Employee> = this.differ.diff(this.employees);

    if (changes) {
      changes.forEachAddedItem((record: IterableChangeRecord<Employee>) =>
        console.log('added', record)
      );

      changes.forEachMovedItem((record: IterableChangeRecord<Employee>) =>
        console.log('moved', record)
      );

      changes.forEachRemovedItem((record: IterableChangeRecord<Employee>) =>
        console.log('removed', record)
      );
    }
  }

  click() {
    this.a = [1, 3, 4];

    this.employees = [this.employee3, this.employee2];
  }

  trackBy(employee) {
    return employee.id;
  }
}

interface Employee {
  id: number;
  name: string;
}
