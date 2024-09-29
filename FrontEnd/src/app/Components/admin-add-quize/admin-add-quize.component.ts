import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormArray, FormBuilder, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-add-quize',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,FormsModule],
  templateUrl: './admin-add-quize.component.html',
  styleUrl: './admin-add-quize.component.css'
})
export class AdminAddQuizeComponent implements OnInit {
  quizForm: FormGroup;

  constructor(private fb: FormBuilder) {
      this.quizForm = this.fb.group({
          questions: this.fb.array([]) // Initialize the questions array
      });
  }

  ngOnInit(): void {
      this.addQuestion(); // Start with one question
  }

  get questions(): FormArray {
      return this.quizForm.get('questions') as FormArray;
  }

  addQuestion() {
      const questionGroup = this.fb.group({
          questionText: ['', Validators.required],
          questionType: ['true_false', Validators.required],
          choices: this.fb.array(['', '']), // Default two choices
          correctAnswer: ['', Validators.required],
          score: [1, [Validators.required, Validators.min(1)]]
      });
      this.questions.push(questionGroup);
  }

  addChoice(questionIndex: number) {
      const choices = this.questions.at(questionIndex).get('choices') as FormArray;
      choices.push(this.fb.control(''));
  }

  toggleChoices(questionIndex: number) {
      const questionType = this.questions.at(questionIndex).get('questionType')?.value;
      const choices = this.questions.at(questionIndex).get('choices') as FormArray;
      if (questionType === 'true_false') {
          // Reset choices for true/false
          while (choices.length > 2) {
              choices.removeAt(choices.length - 1);
          }
      }
  }

  onSubmit() {
      if (this.quizForm.valid) {
          console.log(this.quizForm.value);
          // Handle form submission, e.g., send to API
      } else {
          console.log('Form is invalid');
      }
  }
}