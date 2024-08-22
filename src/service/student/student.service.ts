import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { CreateStudentDto } from 'src/dto/create-student.dto';
import { Student } from 'src/interface/student.interface';
import { Model } from 'mongoose';
import { UpdateStudentDto } from 'src/dto/update-student.dto';

@Injectable()
export class StudentService {
  constructor(@InjectModel('Student') private studentModel: Model<Student>) {}

  async createStudent(createStudentDto: CreateStudentDto): Promise<Student> {
    const newStudent = await new this.studentModel(createStudentDto);
    return newStudent.save();
  }

  async updateStudent(
    id: string,
    updateStudentDto: UpdateStudentDto,
  ): Promise<Student> {
    const existingStudent = await this.studentModel.findByIdAndUpdate(
      id,
      updateStudentDto,
      { new: true },
    );
    if (!existingStudent) {
      throw new NotFoundException(`Student #${id} not found`);
    }
    return existingStudent;
  }

  async getAllStudents(): Promise<Student[]> {
    const studentData = await this.studentModel.find();
    if (!studentData || studentData.length == 0) {
      throw new NotFoundException('Students data not found!');
    }
    return studentData;
  }

  async getStudent(id: string): Promise<Student> {
    const existingStudent = await this.studentModel.findById(id).exec();
    if (!existingStudent) {
      throw new NotFoundException(`Student #${id} not found`);
    }
    return existingStudent;
  }

  async deleteStudent(id: string): Promise<Student> {
    const deletedStudent = await this.studentModel.findByIdAndDelete(id);
    if (!deletedStudent) {
      throw new NotFoundException(`Student #${id} not found`);
    }
    return deletedStudent;
  }
}
