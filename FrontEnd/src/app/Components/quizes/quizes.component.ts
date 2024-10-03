import { Component, OnInit } from '@angular/core';
import { CoursesService } from '../../shared/services/courses.service';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-quizes',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './quizes.component.html',
  styleUrl: './quizes.component.css'
})
export class QuizesComponent implements OnInit {
  quizzes: any[] = [];
  questions: { [quizId: number]: any[] } = {};
  choices: { [questionId: number]: any[] } = {};
  courseId: number | null = null;
  submittedAnswers: { [questionId: number]: number } = {}; 
  finalResults: { [quizId: number]: number } = {};
  quizSubmitted: { [quizId: number]: boolean } = {};  // Track if the quiz is submitted

  constructor(private coursesService: CoursesService) {}

  ngOnInit(): void {
    const course = this.coursesService.getCourse();
    if (course) {
      this.courseId = course.id;
      this.getQuizzes(this.courseId);
    } else {
      this.coursesService.GetCoursetByID(1).subscribe(
        (response: any) => {
          console.log(response);
          this.courseId = response.data.id;
          this.getQuizzes(this.courseId as number);
        },
        (error: any) => {
          console.error('Error fetching course:', error);
        }
      );
    }
  }

  getQuizzes(courseId: number) {
    this.coursesService.getQuizzesByCourse(courseId).subscribe(
      (response: any) => {
        console.log(response);
        this.quizzes = response.data;
        this.quizzes.forEach(quiz => {
          this.loadQuestions(quiz.id);
          this.quizSubmitted[quiz.id] = false;  // Initialize submission flag
        });
      },
      (error: any) => {
        console.error('Error fetching quizzes:', error);
      }
    );
  }

  loadQuestions(quizId: number) {
    if (this.questions[quizId]) return;

    this.coursesService.getQuestionsByQuiz(quizId).subscribe(
      (response: any) => {
        console.log('Questions for quiz', quizId, response);
        this.questions[quizId] = response.data;
        this.questions[quizId].forEach(question => this.loadChoices(question.id));
      },
      (error: any) => {
        console.error('Error fetching questions:', error);
      }
    );
  }

  loadChoices(questionId: number) {
    if (this.choices[questionId]) return;

    this.coursesService.getChoicesByQuestion(questionId).subscribe(
      (response: any) => {
        console.log('Choices for question', questionId, response);
        this.choices[questionId] = response.data;
      },
      (error: any) => {
        console.error('Error fetching choices:', error);
      }
    );
  }

  submitQuiz(quizId: number) {
    if (this.quizSubmitted[quizId]) return; // Prevent resubmission

    const submission = { answers: this.submittedAnswers };
    this.coursesService.submitQuiz(quizId, submission).subscribe(
      (response: any) => {
        console.log('Quiz submitted', response);
        this.finalResults[quizId] = response.final_result;
        this.quizSubmitted[quizId] = true; // Set submission flag to true
      },
      (error: any) => {
        console.error('Error submitting quiz:', error);
      }
    );
  }
}
// import { Component, OnInit } from '@angular/core';
// import { CoursesService } from '../../shared/services/courses.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// interface Answer {
//   questionId: number;
//   selectedChoice: string;
// }

// @Component({
//   selector: 'app-quizes',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './quizes.component.html',
//   styleUrls: ['./quizes.component.css'] // Fix 'styleUrl' to 'styleUrls'
// })
// export class QuizesComponent implements OnInit {
//   quizzes: any[] = [];
//   questions: { [quizId: number]: any[] } = {};
//   choices: { [questionId: number]: any[] } = {};
//   userAnswers: { [questionId: number]: string } = {};  // Store user answers
//   courseId: number | null = null;

//   constructor(private coursesService: CoursesService) {}

//   ngOnInit(): void {
//     const course = this.coursesService.getCourse();
//     if (course) {
//       this.courseId = course.id;
//       this.getQuizzes(this.courseId);
//     } else {
//       this.coursesService.GetCoursetByID(1).subscribe(
//         (response: any) => {
//           console.log(response);
//           this.courseId = response.data.id;
//           this.getQuizzes(this.courseId as number);
//         },
//         (error: any) => {
//           console.error('Error fetching course:', error);
//         }
//       );
//     }
//   }

//   getQuizzes(courseId: number) {
//     this.coursesService.getQuizzesByCourse(courseId).subscribe(
//       (response: any) => {
//         console.log(response);
//         this.quizzes = response.data;

//         // Load questions for each quiz after fetching quizzes
//         this.quizzes.forEach(quiz => {
//           this.loadQuestions(quiz.id);
//         });
//       },
//       (error: any) => {
//         console.error('Error fetching quizzes:', error);
//       }
//     );
//   }

//   loadQuestions(quizId: number) {
//     if (this.questions[quizId]) return; // If questions are already loaded, skip fetching

//     this.coursesService.getQuestionsByQuiz(quizId).subscribe(
//       (response: any) => {
//         console.log("Questions for quiz", quizId, response);
//         this.questions[quizId] = response.data;

//         // Load choices for each question after loading questions
//         this.questions[quizId].forEach(question => {
//           this.loadChoices(question.id);
//         });
//       },
//       (error: any) => {
//         console.error('Error fetching questions:', error);
//       }
//     );
//   }

//   loadChoices(questionId: number) {
//     if (this.choices[questionId]) return; // If choices are already loaded, skip fetching

//     this.coursesService.getChoicesByQuestion(questionId).subscribe(
//       (response: any) => {
//         console.log("Choices for question", questionId, response);
//         this.choices[questionId] = response.data;
//       },
//       (error: any) => {
//         console.error('Error fetching choices:', error);
//       }
//     );
//   }

//   submitQuiz(quizId: number) {
//     const answers = this.collectAnswers(quizId); // Collect answers based on selected choices
//     if (answers.length > 0) {
//       // Ensure that you are matching the expected structure
//       this.coursesService.submitQuizAnswers(quizId, { answers: answers }).subscribe(
//         response => {
//           console.log('Quiz submitted successfully:', response);
//         },
//         error => {
//           console.error('Error submitting quiz:', error);
//         }
//       );
//     } else {
//       console.error('No answers selected for quiz:', quizId);
//     }
// }
  
//   // Function to collect the answers based on user selections
//   collectAnswers(quizId: number): Answer[] {
//     const answers: Answer[] = []; // Explicitly type the answers array
    
//     // Loop through the questions of the specific quiz
//     this.questions[quizId].forEach(question => {
//       const selectedChoice = document.querySelector(`input[name="q${question.id}"]:checked`) as HTMLInputElement;
//       if (selectedChoice) {
//         answers.push({
//           questionId: question.id,
//           selectedChoice: selectedChoice.value // Now this works as selectedChoice is of type HTMLInputElement
//         });
//       }
//     });
    
//     return answers;
//   }
// }
// import { Component, OnInit } from '@angular/core';
// import { CoursesService } from '../../shared/services/courses.service';
// import { CommonModule } from '@angular/common';
// import { FormsModule } from '@angular/forms';

// interface Answer {
//   questionId: number;
//   selectedChoice: string;
// }

// @Component({
//   selector: 'app-quizes',
//   standalone: true,
//   imports: [CommonModule, FormsModule],
//   templateUrl: './quizes.component.html',
//   styleUrls: ['./quizes.component.css'] // Corrected from 'styleUrl' to 'styleUrls'
// })
// export class QuizesComponent implements OnInit {
//   quizzes: any[] = [];
//   questions: { [quizId: number]: any[] } = {};
//   choices: { [questionId: number]: any[] } = {};
//   userAnswers: { [questionId: number]: string } = {};  // Store user answers
//   courseId: number | null = null;

//   constructor(private coursesService: CoursesService) {}

//   ngOnInit(): void {
//     const course = this.coursesService.getCourse();
//     if (course) {
//       this.courseId = course.id;
//       this.getQuizzes(this.courseId);
//     } else {
//       this.coursesService.GetCoursetByID(1).subscribe(
//         (response: any) => {
//           console.log(response);
//           this.courseId = response.data.id;
//           this.getQuizzes(this.courseId as number);
//         },
//         (error: any) => {
//           console.error('Error fetching course:', error);
//         }
//       );
//     }
//   }

//   getQuizzes(courseId: number) {
//     this.coursesService.getQuizzesByCourse(courseId).subscribe(
//       (response: any) => {
//         console.log(response);
//         this.quizzes = response.data;

//         // Load questions for each quiz after fetching quizzes
//         this.quizzes.forEach(quiz => {
//           this.loadQuestions(quiz.id);
//         });
//       },
//       (error: any) => {
//         console.error('Error fetching quizzes:', error);
//       }
//     );
//   }

//   loadQuestions(quizId: number) {
//     if (this.questions[quizId]) return; // If questions are already loaded, skip fetching

//     this.coursesService.getQuestionsByQuiz(quizId).subscribe(
//       (response: any) => {
//         console.log("Questions for quiz", quizId, response);
//         this.questions[quizId] = response.data;

//         // Load choices for each question after loading questions
//         this.questions[quizId].forEach(question => {
//           this.loadChoices(question.id);
//         });
//       },
//       (error: any) => {
//         console.error('Error fetching questions:', error);
//       }
//     );
//   }

//   loadChoices(questionId: number) {
//     if (this.choices[questionId]) return; // If choices are already loaded, skip fetching

//     this.coursesService.getChoicesByQuestion(questionId).subscribe(
//       (response: any) => {
//         console.log("Choices for question", questionId, response);
//         this.choices[questionId] = response.data;
//       },
//       (error: any) => {
//         console.error('Error fetching choices:', error);
//       }
//     );
//   }

//   submitQuiz(quizId: number) {
//     const answers = this.collectAnswers(quizId); // Collect answers based on selected choices
//     if (answers.length > 0) {
//       // Ensure that you are matching the expected structure
//       this.coursesService.submitQuizAnswers(quizId, { answers }).subscribe(
//         response => {
//           console.log('Quiz submitted successfully:', response);
//         },
//         error => {
//           console.error('Error submitting quiz:', error);
//         }
//       );
//     } else {
//       console.error('No answers selected for quiz:', quizId);
//     }
//   }
  
//   // Function to collect the answers based on user selections
//   collectAnswers(quizId: number): Answer[] {
//     const answers: Answer[] = []; // Explicitly type the answers array
    
//     // Loop through the questions of the specific quiz
//     this.questions[quizId].forEach(question => {
//       const selectedChoice = this.userAnswers[question.id]; // Get the answer from userAnswers
//       if (selectedChoice) {
//         answers.push({
//           questionId: question.id,
//           selectedChoice: selectedChoice // Use the value from userAnswers
//         });
//       }
//     });
    
//     return answers;
//   }
// }
