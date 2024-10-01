import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CoursesService } from '../../shared/services/courses.service';
import { ActivatedRoute } from '@angular/router';

interface Choice {
  choice: string;
  is_correct ?: boolean; 
}

interface Question {
  question: string;
  type: string;
  choices: Choice[];
  correctAnswer: number; 
  score: number;
}

@Component({
  selector: 'app-admin-add-quize',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-add-quize.component.html',
  styleUrls: ['./admin-add-quize.component.css']
})
export class AdminAddQuizeComponent implements OnInit {
  quizName: string = '';
  courseId!: number; 
  msgSuccess = '';
  msgErrors: string[] = [];
  isLoading: boolean = false;

  // Pre-fill with 10 empty questions
  questions: Question[] = Array.from({ length: 10 }, () => ({
    question: '',
    type: 'multiple_choice',
    choices: [{ choice: '', iscorrect: false }, { choice: '', iscorrect: false }], // Initialize iscorrect
    correctAnswer: -1,
    score: 1
  }));
  validationErrors: any = {};
  
  constructor(private coursesService: CoursesService, private route: ActivatedRoute) {}
  
  ngOnInit(): void {
    const course = this.coursesService.getCourse();
    if (course) {
      this.courseId = course.id; 
    } else {
      console.error('Course data not found!');
    }
  }
  
  addQuestion() {
    this.questions.push({
      question: '',
      type: 'multiple_choice',
      choices: [{ choice: '', is_correct: false }, { choice: '', is_correct: false }], // Initialize is_correct
      correctAnswer: -1,
      score: 1
    });
  }
  
  removeQuestion(index: number) {
    this.questions.splice(index, 1);
  }
  
  addChoice(questionIndex: number) {
    this.questions[questionIndex].choices.push({ choice: '', is_correct: false }); // Initialize is_correct
  }
  
  toggleChoices(questionIndex: number) {
    if (this.questions[questionIndex].type === 'true_false') {
      // Resetting choices for True/False questions
      this.questions[questionIndex].choices = [{ choice: 'True', is_correct: true }, { choice: 'False', is_correct: false }];
      this.questions[questionIndex].correctAnswer = -1; // Reset correct answer
    } else {
      this.questions[questionIndex].choices = [{ choice: '', is_correct: false }, { choice: '', is_correct: false }];
    }
  }
  setTrueFalseCorrectAnswer(questionIndex: number, correctAnswer: number) {
    // Mark the correct answer as true/false
    this.questions[questionIndex].correctAnswer = correctAnswer;
  
    // Set the correct choice in the 'choices' array
    this.questions[questionIndex].choices = [
      { choice: 'True', is_correct: correctAnswer === 1 },
      { choice: 'False', is_correct: correctAnswer === 0 }
    ];
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
        console.log(response);
        this.questions.forEach((question, index) => {
          const questionPayload = {
            question: question.question,
            type: question.type,
            score_question: question.score,
            quiz_id: response.data.id,
          };
  
          this.coursesService.addQuestion(questionPayload, response.data.id).subscribe((questionResponse) => {
            console.log(questionResponse);
            if (question.type === 'multiple_choice' || question.type === 'true_false') {
              question.choices.forEach((choice, i) => {
                const choicePayload = {
                  choice: choice.choice,
                  is_correct: choice.is_correct ? 1 : 0,
                  question_id: questionResponse.data.id
                };
  
                this.coursesService.addChoice(choicePayload, response.data.id, questionResponse.data.id).subscribe((choiceresponse) => {
                  console.log(choiceresponse);
                });
              });
            }
          });
        });
      },
      error: (errorResponse) => {
        console.log(errorResponse);
        if (errorResponse.error && errorResponse.error.errors) {
          this.validationErrors = errorResponse.error.errors;
        }
      }
    });
  }
  
}