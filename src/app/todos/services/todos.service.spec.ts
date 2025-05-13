import {TestBed} from "@angular/core/testing";
import {TodosService} from "./todos.service";
import {HttpClientTestingModule, HttpTestingController} from "@angular/common/http/testing";
import {FilterEnum} from "../types/filter.enum";
import {TodoInterface} from "../types/todo.interface";

describe('TodosService', () => {
  let todosService: TodosService
  let httpTestingController: HttpTestingController
  const baseUrl = 'http://localhost:3004/todos'

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [TodosService]
    })
    todosService = TestBed.inject(TodosService)
    httpTestingController = TestBed.inject(HttpTestingController)
  })

  afterEach(() => {
    httpTestingController.verify()
  })

  it('creates service', () => {
    expect(todosService).toBeTruthy()
  })

  it('sets initial data', () => {
    expect(todosService.apiBaseUrl).toEqual(baseUrl)
    expect(todosService.todosSig()).toEqual([])
    expect(todosService.filterSig()).toEqual(FilterEnum.all)
  })

  describe('changeFilter', () => {
    it('changes the filter', () => {
      todosService.changeFilter(FilterEnum.active)
      expect(todosService.filterSig()).toEqual(FilterEnum.active)
    });
  });

  describe('getTodos', () => {
    it('get correct data', () => {
      todosService.getTodos()
      const req = httpTestingController.expectOne(baseUrl)
      const resp: TodoInterface[] = [{id: '1', text: 'Something', isCompleted: false}]
      req.flush(resp)
      expect(todosService.todosSig()).toEqual(resp)
    })
  })

  describe('addTodo', () => {
    it('add correct data', () => {
      const text = 'Kick some ass'
      todosService.addTodo(text)
      const req = httpTestingController.expectOne(baseUrl)
      const resp: TodoInterface = {id: '1', text, isCompleted: false}
      req.flush(resp)
      expect(todosService.todosSig()).toEqual([resp])
    })
  })

  describe('changeTodo', () => {
    it('correct change data', () => {
      todosService.todosSig.set([{id: '1', text: 'Kick some ass', isCompleted: false}])
      const text = 'Make some noise'
      todosService.changeTodo('1', text)
      const req = httpTestingController.expectOne(`${baseUrl}/1`)
      const resp: TodoInterface = {id: '1', text, isCompleted: false}
      req.flush(resp)
      expect(todosService.todosSig()).toEqual([resp])
    })
  })

  describe('removeTodo', () => {
    it('correct remove data', () => {
      todosService.todosSig.set([{id: '1', text: 'Kick some ass', isCompleted: false}])
      todosService.removeTodo('1')
      const req2 = httpTestingController.expectOne(`${baseUrl}/1`)
      req2.flush({})
      expect(todosService.todosSig()).toEqual([])
    })
  })

  describe('toggleTodo', () => {
    it('toggles a todo', () => {
      todosService.todosSig.set([{id: '1', text: 'Kick some ass', isCompleted: false}])
      todosService.toggleTodo('1')
      const req = httpTestingController.expectOne(`${baseUrl}/1`)
      const resp: TodoInterface = {id: '1', text: 'Kick some ass', isCompleted: true}
      req.flush(resp)
      expect(todosService.todosSig()).toEqual([resp])
    })

    it('error with toggle if no todos', () => {
      expect(() => todosService.toggleTodo('1')).toThrowError("Didn't find todo to update")
    })
  })

  describe('toggleAll', () => {
    it('toggles all todos', () => {
      todosService.todosSig.set([
        {id: '1', text: 'Kick some ass', isCompleted: false},
        {id: '2', text: 'Make some noise', isCompleted: false}
      ])
      todosService.toggleAll(true)
      const reqs = httpTestingController.match(req => req.url.includes(baseUrl))
      reqs[0].flush({id: '1', text: 'Kick some ass', isCompleted: true})
      reqs[1].flush({id: '2', text: 'Make some noise', isCompleted: true})
      expect(todosService.todosSig()).toEqual([
        {id: '1', text: 'Kick some ass', isCompleted: true},
        {id: '2', text: 'Make some noise', isCompleted: true}
      ])
    })
  })
})


