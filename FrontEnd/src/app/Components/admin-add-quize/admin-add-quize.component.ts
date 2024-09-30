import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CoursesService } from '../../shared/services/courses.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-admin-add-quize',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-add-quize.component.html',
  styleUrls: ['./admin-add-quize.component.css']
})
export class AdminAddQuizeComponent implements OnInit {
    quizName: string = '';
    courseId!: number; // Will be fetched from course data
    questions = [
      { question: '', type: 'multiple_choice', choices: [{ choice: '' }, { choice: '' }], correctAnswer: 0, score: 1 }
    ];
    validationErrors: any = {}; // To capture validation errors
  
    constructor(private coursesService: CoursesService, private route: ActivatedRoute) {}
  
    ngOnInit(): void {
      const course = this.coursesService.getCourse();
      if (course) {
        this.courseId = course.id; // Assign the course ID from the service
      } else {
        console.error('Course data not found!');
      }
    }
  
    addQuestion() {
      this.questions.push({
        question: '',
        type: 'multiple_choice',
        choices: [{ choice: '' }, { choice: '' }],
        correctAnswer: 0,
        score: 1
      });
    }
  
    removeQuestion(index: number) {
      this.questions.splice(index, 1);
    }
  
    addChoice(questionIndex: number) {
      this.questions[questionIndex].choices.push({ choice: '' });
    }
  
    toggleChoices(questionIndex: number) {
      if (this.questions[questionIndex].type === 'true_false') {
        this.questions[questionIndex].choices = [{ choice: 'True' }, { choice: 'False' }];
      } else {
        this.questions[questionIndex].choices = [{ choice: '' }, { choice: '' }];
      }
    }
  
    submitQuiz() {
      const quizPayload = {
        name: this.quizName,
        course_id: this.courseId,
        questions: this.questions.map((question) => ({
          question: question.question,
          type: question.type,
          score_question: question.score,
        })),
      };
  
      this.coursesService.addQuiz(quizPayload).subscribe({
        next: (response) => {
            console.log(response)
          this.questions.forEach((question, index) => {
            const questionPayload = {
              question: question.question,
              type: question.type,
              score_question: question.score,
              quiz_id: response.data.id,
            };
  
            this.coursesService.addQuestion(questionPayload, response.data.id).subscribe((questionResponse) => {
              if (question.type === 'multiple_choice') {
                question.choices.forEach((choice, i) => {
                  const choicePayload = {
                    choice: choice.choice,
                    is_correct: i === question.correctAnswer ? 1 : 0,
                    question_id: questionResponse.data.id // Pass question_id explicitly
                  };
  
                  this.coursesService.addChoice(choicePayload, response.data.id, questionResponse.data.id).subscribe();
                });
              }
            });
          });
        },
        error: (errorResponse) => {
            console.log(errorResponse)
          if (errorResponse.error && errorResponse.error.errors) {
            this.validationErrors = errorResponse.error.errors;
          }
        }
      });
    }
  }
  