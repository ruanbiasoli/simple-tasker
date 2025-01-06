import { Test, TestingModule } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Task } from './entities/task.entity';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';

const mockTaskRepository = {
  find: jest.fn(),
  findOneBy: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  delete: jest.fn(),
};

describe('TasksService', () => {
  let service: TasksService;
  let repository: Repository<Task>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TasksService,
        {
          provide: getRepositoryToken(Task),
          useValue: mockTaskRepository,
        },
      ],
    }).compile();

    service = module.get<TasksService>(TasksService);
    repository = module.get<Repository<Task>>(getRepositoryToken(Task));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('getAllTasks', () => {
    it('deve retornar uma lista de tarefas', async () => {
      const taskArray = [
        { id: 1, title: 'Teste 1', completed: false },
        { id: 2, title: 'Teste 2', completed: true },
      ];
      repository.find = jest.fn().mockResolvedValue(taskArray);

      const result = await service.getAllTasks();
      expect(result).toEqual(taskArray);
      expect(repository.find).toHaveBeenCalled();
    });
  });

  describe('createTask', () => {
    it('deve criar e retornar a nova tarefa', async () => {
      const newTask = { title: 'Nova Tarefa' };
      const savedTask = { id: 1, title: 'Nova Tarefa', completed: false };

      repository.create = jest.fn().mockReturnValue(savedTask);
      repository.save = jest.fn().mockResolvedValue(savedTask);

      const result = await service.createTask(newTask);
      expect(result).toEqual(savedTask);
      expect(repository.create).toHaveBeenCalledWith({ ...newTask, completed: false });
      expect(repository.save).toHaveBeenCalledWith(savedTask);
    });
  });

  describe('updateTask', () => {
    it('deve atualizar e retornar a tarefa', async () => {
      const existingTask = { id: 1, title: 'Tarefa', completed: false };
      const updateDto = { completed: true };
      const updatedTask = { ...existingTask, ...updateDto };

      repository.findOneBy = jest.fn().mockResolvedValue(existingTask);
      repository.save = jest.fn().mockResolvedValue(updatedTask);

      const result = await service.updateTask(1, updateDto);
      expect(result).toEqual(updatedTask);
      expect(repository.findOneBy).toHaveBeenCalledWith({ id: 1 });
      expect(repository.save).toHaveBeenCalledWith(updatedTask);
    });

    it('deve lançar NotFoundException se a tarefa não existir', async () => {
      repository.findOneBy = jest.fn().mockResolvedValue(null);

      await expect(service.updateTask(999, { completed: true })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('deleteTask', () => {
    it('deve remover a tarefa', async () => {
      repository.delete = jest.fn().mockResolvedValue({ affected: 1 });

      await service.deleteTask(1);
      expect(repository.delete).toHaveBeenCalledWith(1);
    });

    it('deve lançar NotFoundException se a tarefa não existir', async () => {
      repository.delete = jest.fn().mockResolvedValue({ affected: 0 });

      await expect(service.deleteTask(999)).rejects.toThrow(NotFoundException);
    });
  });
});
