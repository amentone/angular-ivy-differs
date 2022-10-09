import {
  Directive,
  DoCheck,
  ElementRef,
  Input,
  KeyValueChangeRecord,
  KeyValueChanges,
  KeyValueDiffer,
  KeyValueDiffers,
  Renderer2,
} from '@angular/core';

@Directive({
  selector: '[myNgStyle]',
})
export class MyNgStyleDirective implements DoCheck {
  private _myNgStyle: { [key: string]: string };
  private _differ: KeyValueDiffer<string, string>;

  constructor(
    private _differs: KeyValueDiffers,
    private _elementRef: ElementRef,
    private _renderer: Renderer2
  ) {}

  @Input() set myNgStyle(value: { [key: string]: string }) {
    this._myNgStyle = value;
    if (!this._differ && value) {
      this._differ = this._differs.find(this._myNgStyle).create();
    }
  }

  ngDoCheck(): void {
    if (this._differ) {
      const changes: KeyValueChanges<string, any> = this._differ.diff(
        this._myNgStyle
      );

      if (changes) {
        // apply changes

        changes.forEachAddedItem((record: KeyValueChangeRecord<string, any>) =>
          this._setStyle(record.key, record.currentValue)
        );

        changes.forEachChangedItem(
          (record: KeyValueChangeRecord<string, any>) =>
            this._setStyle(record.key, record.currentValue)
        );

        changes.forEachRemovedItem(
          (record: KeyValueChangeRecord<string, any>) =>
            this._setStyle(record.key, null)
        );
      }
    }
  }

  private _setStyle(nameAndUnit: string, value: string) {
    const [name, unit] = nameAndUnit.split('.');
    value = value && unit ? `${value}${unit}` : value;

    this._renderer.setStyle(this._elementRef.nativeElement, name, value);
  }
}
