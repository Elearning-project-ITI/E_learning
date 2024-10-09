import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CoursesService } from '../../shared/services/courses.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

interface Choice {
  choice: string;
  is_correct?: boolean;
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
  quizzes: any[] = [];
  questions: Question[] = Array.from({ length: 1 }, () => ({
    question: '',
    type: 'multiple_choice',
    choices: [{ choice: '', is_correct: false }, { choice: '', is_correct: false }],
    correctAnswer: -1,
    score: 1
  }));

  constructor(private coursesService: CoursesService, private route: ActivatedRoute, private toastr: ToastrService, private router: Router) {}

  ngOnInit(): void {
    const course = this.coursesService.getCourse();
    if (course) {
      this.courseId = course.id;
      this.getQuizzes(this.courseId);
    } else {
      console.error('Course data not found!');
    }
  }

  getQuizzes(courseId: number) {
    this.coursesService.getQuizzesByCourse(courseId).subscribe(
      (response: any) => {
        this.quizzes = response.data;
      },
      (error: any) => {
        console.error('Error fetching quizzes:', error);
      }
    );
  }

  addQuestion() {
    this.questions.push({
      question: '',
      type: 'multiple_choice',
      choices: [{ choice: '', is_correct: false }, { choice: '', is_correct: false }],
      correctAnswer: -1,
      score: 1
    });
  }

  removeQuestion(index: number) {
    this.questions.splice(index, 1);
  }

  addChoice(questionIndex: number) {
    this.questions[questionIndex].choices.push({ choice: '', is_correct: false });
  }

  toggleChoices(questionIndex: number) {
    if (this.questions[questionIndex].type === 'true_false') {
      this.questions[questionIndex].choices = [{ choice: 'True', is_correct: true }, { choice: 'False', is_correct: false }];
      this.questions[questionIndex].correctAnswer = -1;
    } else {
      this.questions[questionIndex].choices = [{ choice: '', is_correct: false }, { choice: '', is_correct: false }];
    }
  }

  setTrueFalseCorrectAnswer(questionIndex: number, correctAnswer: number) {
    this.questions[questionIndex].correctAnswer = correctAnswer;
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
        this.quizzes.push(response.data);
        this.questions.forEach((question, index) => {
          const questionPayload = {
            question: question.question,
            type: question.type,
            score_question: question.score,
            quiz_id: response.data.id,
          };

          this.coursesService.addQuestion(questionPayload, response.data.id).subscribe((questionResponse) => {
            if (question.type === 'multiple_choice' || question.type === 'true_false') {
              question.choices.forEach((choice, i) => {
                const choicePayload = {
                  choice: choice.choice,
                  is_correct: choice.is_correct ? 1 : 0,
                  question_id: questionResponse.data.id
                };

                this.coursesService.addChoice(choicePayload, response.data.id, questionResponse.data.id).subscribe();
              });
            }
          });
        });
        this.toastr.success("Quiz created successfully");
      },
      error: (errorResponse) => {
        console.log(errorResponse);
        this.toastr.error("Please Fill the data !");
        if (errorResponse.error && errorResponse.error.errors) {
          this.toastr.error("Please Fill the data !");
        }
      }
    });
  }

  editQuiz(quizId: number) {
   
    this.router.navigate(['/adminCourses', this.courseId, 'addquizes', 'update', quizId]);
  }

  deleteQuiz(quizId: number) {
    if (confirm('Are you sure you want to delete this quiz?')) {
      this.coursesService.deleteQuiz(quizId).subscribe({
        next: (response) => {
          if (response.success) {
            // Filter out the deleted quiz from the quizzes array
            this.quizzes = this.quizzes.filter(quiz => quiz.id !== quizId);
            this.toastr.success('Quiz deleted successfully!');
          }
        },
        error: (errorResponse) => {
          console.error('Error deleting quiz:', errorResponse);
          this.toastr.error('Failed to delete quiz.');
        }
      });
    }
  }
}
