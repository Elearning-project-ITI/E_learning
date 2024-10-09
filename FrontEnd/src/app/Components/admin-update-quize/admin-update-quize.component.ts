// import { CommonModule } from '@angular/common';
// import { Component, OnInit } from '@angular/core';
// import { ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { CoursesService } from '../../shared/services/courses.service';
// import { ActivatedRoute, Router } from '@angular/router';
// import { ToastrService } from 'ngx-toastr';

// interface Choice {
//   id?: number;
//   choice: string;
//   is_correct?: boolean;
// }

// interface Question {
//   id?: number;
//   question: string;
//   type: string;
//   choices: Choice[];
//   correctAnswer: number | null;
//   score: number;
// }

// @Component({
//   selector: 'app-admin-update-quize',
//   standalone: true,
//   imports: [CommonModule, ReactiveFormsModule, FormsModule],
//   templateUrl: './admin-update-quize.component.html',
//   styleUrls: ['./admin-update-quize.component.css']
// })
// export class AdminUpdateQuizeComponent implements OnInit {
//   quizId!: number;
//   quizName: string = '';
//   courseId!: number;
//   questions: Question[] = [];

//   constructor(
//     private coursesService: CoursesService,
//     private route: ActivatedRoute,
//     private toastr: ToastrService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.route.paramMap.subscribe(params => {
//       this.quizId = +params.get('quizid')!;
//       this.courseId = +params.get('courseId')!;
//       this.getQuizDetails(this.quizId);
//     });
//   }

//   getQuizDetails(quizId: number) {
//     this.coursesService.getQuestionsByQuiz(quizId).subscribe(
//       (response: any) => {
//         if (response.data && response.data.length) {
//           this.quizName = response.data[0].quiz_name || ''; 
//           this.questions = response.data.map((item: any) => ({
//             id: item.id,
//             question: item.question,
//             type: item.type,
//             score: item.score_question,
//             choices: [], 
//             correctAnswer: item.correctAnswer || null,
//           }));

//           this.questions.forEach(question => {
//             this.loadChoices(question.id);
//           });
//         } else {
//           console.error('No quiz data found in response:', response);
//         }
//       },
//       (error: any) => {
//         console.error('Error fetching quiz details:', error);
//       }
//     );
//   }

//   toggleChoices(questionIndex: number) {
//     const question = this.questions[questionIndex];
//     if (question.type === 'true_false') {
//       question.choices = [
//         { choice: 'True', is_correct: true }, 
//         { choice: 'False', is_correct: false }
//       ];
//       question.correctAnswer = -1; 
//     } else {
//       question.choices = [{ choice: '', is_correct: false }, { choice: '', is_correct: false }];
//     }
//   }

//   loadChoices(questionId: number | undefined) {
//     if (questionId) {
//       this.coursesService.getChoicesByQuestion(questionId).subscribe(
//         (response: any) => {
//           const question = this.questions.find(q => q.id === questionId);
//           if (question) {
//             question.choices = response.data; 
//           }
//         },
//         (error: any) => {
//           console.error('Error fetching choices:', error);
//         }
//       );
//     }
//   }

//   setTrueFalseCorrectAnswer(questionIndex: number, correctAnswer: number) {
//     this.questions[questionIndex].correctAnswer = correctAnswer;
//     this.questions[questionIndex].choices = [
//       { choice: 'True', is_correct: correctAnswer === 1 },
//       { choice: 'False', is_correct: correctAnswer === 0 }
//     ];
//   }

//   updateQuiz() {
//     const quizPayload = new FormData();
//     quizPayload.append('quiz_id', String(this.quizId)); 
//     quizPayload.append('name', this.quizName);
//     quizPayload.append('course_id', String(this.courseId)); 

//     this.questions.forEach(question => {
//       const questionPayload = {
//         question: question.question,
//         type: question.type,
//         score_question: question.score,

//         correctAnswer: question.correctAnswer !== null 
//           ? (question.type === 'true_false' 
//             ? (question.correctAnswer ? 1 : 0) 
//             : question.correctAnswer) 
//           : null,
//       };

//       quizPayload.append('questions[]', JSON.stringify(questionPayload)); 
//     });

//     this.coursesService.updateQuiz(this.quizId, quizPayload).subscribe({
//       next: (response) => {
//         this.toastr.success("Quiz updated successfully");
//         this.router.navigate(['/adminCourses', this.courseId, 'addquizes']);
//       },
//       error: (errorResponse) => {
//         console.log(errorResponse);
//         if (errorResponse.error && errorResponse.error.errors) {
//           this.toastr.error("Validation errors occurred!");
//         }
//       }
//     });
//   }

//   onQuestionTypeChange(question: Question) {
//     if (question.type === 'true_false') {
//       question.choices = []; 
//     }
//   }

//   updateQuestion(question: Question) {
//     if (!question.id) return; 

//     const questionPayload = new FormData();
//     questionPayload.append('quiz_id', String(this.quizId)); 
//     questionPayload.append('question', question.question);
//     questionPayload.append('type', question.type);
//     questionPayload.append('score_question', String(question.score));

//     this.coursesService.updateQuestion(question.id, questionPayload).subscribe({
//       next: (response) => {
//         // Handle the response after updating the question
//       },
//       error: (errorResponse) => {
//         console.log(errorResponse);
//       }
//     });
//   }

//   addChoice(questionIndex: number) {
//     this.questions[questionIndex].choices.push({ choice: '', is_correct: false });
//   }

//   saveChanges() {
//     const updatePromises = this.questions.map(question => {
//       // Ensure the latest choices are set before updating
//       this.updateQuestion(question);
//       return Promise.all(question.choices.map((choice) => {
//         // This should correctly capture the latest choice data
//         return this.updateChoice(choice, question.id!);
//       }));
//     });
  
//     Promise.all(updatePromises).then(() => {
//       this.updateQuiz();
//     }).catch((error) => {
//       console.error("Error updating questions or choices:", error);
//     });
//   }

//   updateChoice(choice: Choice, questionId: number) {
//     if (!choice.id) {
//       this.addChoiceToServer(choice, questionId);
//     } else {
//       const choicePayload = new FormData();
//       choicePayload.append('quiz_id', String(this.quizId)); 
//       choicePayload.append('question_id', String(questionId)); // Ensure question_id is included
//       choicePayload.append('choice', choice.choice);
//       choicePayload.append('is_correct', choice.is_correct ? '1' : '0'); 
  
//       // Log the choicePayload before sending
//       console.log('Updating choice payload:', choicePayload);
  
//       this.coursesService.updateChoice(choice.id, choicePayload, questionId).subscribe({
//         next: (response) => {
//           console.log('Choice updated successfully:', response);
//         },
//         error: (errorResponse) => {
//           console.log('Error updating choice:', errorResponse);
//         }
//       });
//     }
//   }

//   addChoiceToServer(choice: Choice, questionId: number) {
//     const choicePayload = new FormData();
//     choicePayload.append('choice', choice.choice);
//     choicePayload.append('is_correct', choice.is_correct ? '1' : '0');
//     choicePayload.append('question_id', String(questionId)); // Ensure question_id is included

//     this.coursesService.addChoice(choicePayload, this.quizId, questionId).subscribe({
//       next: (response) => {
//         // Handle the response after adding the choice
//       },
//       error: (errorResponse) => {
//         console.log(errorResponse);
//       }
//     });
//   }
// }
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { CoursesService } from '../../shared/services/courses.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

interface Choice {
  id?: number;
  choice: string;
  is_correct?: boolean;
}

interface Question {
  id?: number;
  question: string;
  type: string;
  choices: Choice[];
  correctAnswer: number | null;
  score: number;
}

@Component({
  selector: 'app-admin-update-quize',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-update-quize.component.html',
  styleUrls: ['./admin-update-quize.component.css']
})
export class AdminUpdateQuizeComponent implements OnInit {
  quizId!: number;
  quizName: string = '';
  courseId!: number;
  questions: Question[] = [];

  constructor(
    private coursesService: CoursesService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.quizId = +params.get('quizid')!;
      this.courseId = +params.get('courseId')!;
      this.getQuizDetails(this.quizId);
    });
  }

  getQuizDetails(quizId: number) {
    this.coursesService.getQuestionsByQuiz(quizId).subscribe(
      (response: any) => {
        if (response.data && response.data.length) {
          this.quizName = response.data[0].quiz_name || ''; 
          this.questions = response.data.map((item: any) => ({
            id: item.id,
            question: item.question,
            type: item.type,
            score: item.score_question,
            choices: [], 
            correctAnswer: item.correctAnswer || null,
          }));

          this.questions.forEach(question => {
            this.loadChoices(question.id);
          });
        } else {
          console.error('No quiz data found in response:', response);
        }
      },
      (error: any) => {
        console.error('Error fetching quiz details:', error);
      }
    );
  }

  toggleChoices(questionIndex: number) {
    const question = this.questions[questionIndex];
    if (question.type === 'true_false') {
      question.choices = [
        { choice: 'True', is_correct: true }, 
        { choice: 'False', is_correct: false }
      ];
      question.correctAnswer = -1; 
    } else {
      question.choices = [{ choice: '', is_correct: false }, { choice: '', is_correct: false }];
    }
  }

  loadChoices(questionId: number | undefined) {
    if (questionId) {
      this.coursesService.getChoicesByQuestion(questionId).subscribe(
        (response: any) => {
          const question = this.questions.find(q => q.id === questionId);
          if (question) {
            question.choices = response.data; 
          }
        },
        (error: any) => {
          console.error('Error fetching choices:', error);
        }
      );
    }
  }

  setTrueFalseCorrectAnswer(questionIndex: number, correctAnswer: number) {
    this.questions[questionIndex].correctAnswer = correctAnswer;
    this.questions[questionIndex].choices = [
      { choice: 'True', is_correct: correctAnswer === 1 },
      { choice: 'False', is_correct: correctAnswer === 0 }
    ];
  }

  updateQuiz() {
    const quizPayload = new FormData();
    quizPayload.append('quiz_id', String(this.quizId)); 
    quizPayload.append('name', this.quizName);
    quizPayload.append('course_id', String(this.courseId)); 

    this.questions.forEach(question => {
      const questionPayload = {
        question: question.question,
        type: question.type,
        score_question: question.score,
        correctAnswer: question.correctAnswer !== null 
          ? (question.type === 'true_false' 
            ? (question.correctAnswer ? 1 : 0) 
            : question.correctAnswer) 
          : null,
      };

      quizPayload.append('questions[]', JSON.stringify(questionPayload)); 
    });

    this.coursesService.updateQuiz(this.quizId, quizPayload).subscribe({
      next: (response) => {
        this.toastr.success("Quiz updated successfully");
        this.router.navigate(['/adminCourses', this.courseId, 'addquizes']);
      },
      error: (errorResponse) => {
        console.log(errorResponse);
        this.toastr.error("please fill all data!");
        if (errorResponse.error && errorResponse.error.errors) {
          this.toastr.error("please fill all data!");
        }
      }
    });
  }

  onQuestionTypeChange(question: Question) {
    if (question.type === 'true_false') {
      question.choices = []; 
    }
  }

  updateQuestion(question: Question) {
    if (!question.id) return; 

    const questionPayload = new FormData();
    questionPayload.append('quiz_id', String(this.quizId)); 
    questionPayload.append('question', question.question);
    questionPayload.append('type', question.type);
    questionPayload.append('score_question', String(question.score));

    this.coursesService.updateQuestion(question.id, questionPayload).subscribe({
      next: (response) => {
        // Handle the response after updating the question
      },
      error: (errorResponse) => {
        console.log(errorResponse);
      }
    });
  }

  addChoice(questionIndex: number) {
    this.questions[questionIndex].choices.push({ choice: '', is_correct: false });
  }

  saveChanges() {
    const updatePromises = this.questions.map(question => {
      // Ensure the latest choices are set before updating
      this.updateQuestion(question);
      return Promise.all(question.choices.map((choice) => {
        // This should correctly capture the latest choice data
        return this.updateChoice(choice, question.id!);
      }));
    });

    Promise.all(updatePromises).then(() => {
      this.updateQuiz();
    }).catch((error) => {
      console.error("Error updating questions or choices:", error);
    });
  }

  updateChoice(choice: Choice, questionId: number) {
    if (!choice.id) {
      this.addChoiceToServer(choice, questionId);
    } else {
      const choicePayload = new FormData();
      choicePayload.append('quiz_id', String(this.quizId)); 
      choicePayload.append('question_id', String(questionId)); // Ensure question_id is included
      choicePayload.append('choice', choice.choice);
      choicePayload.append('is_correct', choice.is_correct ? '1' : '0'); 
  
      // Log the choicePayload before sending
      console.log('Updating choice payload:', choicePayload);
  
      this.coursesService.updateChoice(choice.id, choicePayload, questionId).subscribe({
        next: (response) => {
          console.log('Choice updated successfully:', response);
        },
        error: (errorResponse) => {
          console.log('Error updating choice:', errorResponse);
        }
      });
    }
  }

  addChoiceToServer(choice: Choice, questionId: number) {
    const choicePayload = new FormData();
    choicePayload.append('choice', choice.choice);
    choicePayload.append('is_correct', choice.is_correct ? '1' : '0');
    choicePayload.append('question_id', String(questionId)); // Ensure question_id is included

    this.coursesService.addChoice(choicePayload, this.quizId, questionId).subscribe({
      next: (response) => {
        // Handle the response after adding the choice
      },
      error: (errorResponse) => {
        console.log(errorResponse);
      }
    });
  }
}
