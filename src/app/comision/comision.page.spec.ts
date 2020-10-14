import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { ComisionPage } from './comision.page';

describe('ComisionPage', () => {
  let component: ComisionPage;
  let fixture: ComponentFixture<ComisionPage>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ComisionPage ],
      imports: [IonicModule.forRoot()]
    }).compileComponents();

    fixture = TestBed.createComponent(ComisionPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
