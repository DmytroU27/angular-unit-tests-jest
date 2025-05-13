
import {ComponentFixture, TestBed} from "@angular/core/testing";
import {TodosService} from "../../services/todos.service";
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MainComponent} from "./main.component";

describe('Header component', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;
  let todosService: TodosService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [MainComponent, HttpClientTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    todosService = TestBed.inject(TodosService);
    fixture.detectChanges();
  });

  it('creates a component', () => {
    expect(component).toBeTruthy();
  });
})
